import styled from '@emotion/styled'
import { Flex, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { useFormikContext } from 'formik'
import { ReactElement, useCallback, useEffect, useMemo } from 'react'

import { BulkEditPreviewControls } from '@/pages/Protected/Events/components/EventBuklEditForm/BulkEditPreviewControls.tsx'
import { EventTypeTag } from '@/pages/Protected/Events/components/EventTypeTag.tsx'
import { useEventBulkEditContext } from '@/pages/Protected/Events/hooks/useEventBulkEditContext.ts'

import { MonroeTable } from '@/components/Table/MonroeTable'

import { usePageContext } from '@/layouts/Page/context.ts'

import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'

import { useTableContext } from '@/hooks/useTableContext.ts'

import { colors } from '@/utils/colors.tsx'
import { deepCompare } from '@/utils/compareObjects.ts'
import { getEventSeasonName } from '@/utils/getEventSeasonName.ts'
import { getEventTeamName } from '@/utils/getTeamName.tsx'

import { IEvent } from '@/common/interfaces/event.ts'
import { TColumns } from '@/common/types'
import { TBulkEditEventForm, TEventWithStatus } from '@/common/types/events.ts'

/**
 * Provides functionality for handling and rendering the bulk edit preview screen.
 *
 * This function includes setting up bulk edit preview controls, managing field changes,
 * validating form states, styling table cells, and rendering table column cells based on
 * event changes. It integrates with the form and page context, computes differences, and
 * tracks selected table item changes.
 */
export const BulkEditPreviewUpdate = () => {
  const { bulkEditResults, bulkEditRecords } = useEventsSlice()
  const { selectedIds: selectedTableIds } = useTableContext()
  const { values, setFieldValue, isValid, dirty, validateForm } = useFormikContext<TBulkEditEventForm>()
  const { setControls, setPageTitle } = usePageContext()
  const { setShowPreviewUpdate, initialValues } = useEventBulkEditContext()

  /**
   * Sets up the preview controls for bulk edit and updates the page title.
   *
   * Invokes the `setControls` function to configure the `BulkEditPreviewControls` component
   * with necessary properties like `resetForm`, `validateForm`, `selectedIds`, `values`,
   * `setFieldValue`, and the `isValid` check. Updates the page title to "Preview Bulk Edit".
   */
  useEffect(() => {
    setControls(
      <BulkEditPreviewControls
        forceUpdate={true}
        resetForm={resetForm}
        validateForm={validateForm}
        selectedIds={selectedTableIds}
        values={values}
        setFieldValue={setFieldValue}
        isValid={isValid && dirty}
      />,
    )
    setPageTitle('Review update')
  }, [selectedTableIds, values, setFieldValue, isValid, dirty])

  /**
   * Resets the form by updating field values based on the records
   * with matching identifiers in the bulkEditRecords collection.
   *
   * @return {void} Does not return a value.
   */
  function resetForm() {
    let ids = selectedTableIds
    if (ids.length === 0) ids = bulkEditRecords.map((event) => event.id)

    ids.forEach((id) => {
      if (id in initialValues.events) {
        setFieldValue(`events.${id}`, initialValues.events[id])
      }
    })
    setShowPreviewUpdate(false)
  }

  const diffs = Object.fromEntries(
    Object.values(initialValues.events).map((result) => [result.id, deepCompare(result, values.events[result.id])]),
  )

  /**
   * Determines if a specific field has changed within the provided index of the `diffs` array.
   *
   * @function
   * @param {string} fieldName - The name of the field to check for changes.
   * @param {number} [index] - The index in the `diffs` array to evaluate.
   * @returns {boolean} Returns true if the field exists within the given index; otherwise, false.
   */
  const wasChanged = useCallback(
    (fieldName: string, index?: string) => {
      if (index !== undefined) return Object.hasOwnProperty.call(diffs[index], fieldName)
      return false
    },
    [diffs],
  )

  /**
   * A function that generates a function to determine the CSS class for a cell based on field changes and record status.
   */
  const onCell = (fieldName: string) => (record: IEvent, rowIndex: number | undefined) => {
    const hasChanged = rowIndex !== undefined ? Object.hasOwnProperty.call(diffs[record.id], fieldName) : false
    return {
      className: hasChanged ? (record.status !== 'success' ? 'errorCell' : 'successCell') : 'unchangedCell',
    }
  }

  /**
   * Renders a custom table cell with optional old and new values and displays errors in a tooltip.
   *
   * @param {string} oldValue - The original value to display in the cell.
   * @param {string=} newValue - The optional new value to display, preceded by an arrow symbol.
   * @param {Array<string>=} errors - Optional list of error messages to display as a tooltip.
   * @returns {ReactElement} A custom cell component with displayed values and error tooltip.
   */
  const renderCustomCell = (oldValue: string, newValue?: string, errors?: string[]): ReactElement => {
    return (
      <Tooltip title={errors?.join(`\n`)} overlayStyle={{ maxWidth: 198 }}>
        <CustomCell vertical>
          <div className="oldValue">{oldValue}</div>
          {newValue && <div className="newValue">→ {newValue}</div>}
        </CustomCell>
      </Tooltip>
    )
  }

  const columns: TColumns<TEventWithStatus> = useMemo(
    () => [
      {
        title: 'Day',
        dataIndex: 'date',
        width: '88px',
        onCell: onCell('date'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          let newValue = newRecord.day
          let oldValue = oldRecord!.day

          if (record.day) {
            newValue = newRecord.day.substring(0, 3)
            oldValue = oldRecord.day.substring(0, 3)
          }

          if (record.date) {
            newValue = dayjs(newRecord.date, 'YYYY-MM-DD').format('ddd')
            oldValue = dayjs(oldRecord.date, 'YYYY-MM-DD').format('ddd')
          }

          return renderCustomCell(oldValue, newValue, wasChanged('date', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'Date',
        dataIndex: 'date',
        width: '198px',
        onCell: onCell('date'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue = newRecord.date ? dayjs(newRecord.date, 'YYYY-MM-DD').format('MM/DD/YYYY') : 'Pending date'
          const oldValue = oldRecord.date ? dayjs(oldRecord.date, 'YYYY-MM-DD').format('MM/DD/YYYY') : 'Pending date'

          return renderCustomCell(oldValue, newValue, wasChanged('date', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'Start Time',
        dataIndex: 'time',
        width: '198px',
        onCell: onCell('time'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue = newRecord.time ? dayjs(newRecord.time, 'HH:mm:ss').format('hh:mm A') : 'Pending date'
          const oldValue = oldRecord.time ? dayjs(oldRecord.time, 'HH:mm:ss').format('hh:mm A') : 'Pending date'

          return renderCustomCell(oldValue, newValue, wasChanged('time', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'End Time',
        dataIndex: 'duration',
        width: '198px',
        onCell: onCell('time'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue = newRecord.time
            ? dayjs(newRecord.time, 'HH:mm:ss').add(newRecord.duration, 'minute').format('hh:mm A')
            : 'Pending date'
          const oldValue = oldRecord.time
            ? dayjs(oldRecord.time, 'HH:mm:ss').add(oldRecord.duration, 'minute').format('hh:mm A')
            : 'Pending date'

          return renderCustomCell(oldValue, newValue, wasChanged('time', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'Event Type',
        dataIndex: 'type',
        width: '140px',
        render: (_, record) => <EventTypeTag type={record.type} />,
      },
      {
        title: 'Location',
        dataIndex: 'locationId',
        width: '240px',
        onCell: onCell('locationId'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue = newRecord.locationIdName
          const oldValue = oldRecord.location?.name || '---'
          return renderCustomCell(
            oldValue,
            newValue,
            wasChanged('locationIdName', record.id) ? record?.errors : undefined,
          )
        },
      },
      {
        title: 'Court',
        dataIndex: 'courtOrField',
        width: '96px',
        onCell: onCell('courtOrField'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue = newRecord.courtOrField
          const oldValue = oldRecord.courtOrField || '---'
          return renderCustomCell(
            oldValue,
            newValue,
            wasChanged('courtOrField', record.id) ? record?.errors : undefined,
          )
        },
      },
      {
        title: 'Sub Resource',
        width: '132px',
        dataIndex: 'subResource',
        onCell: onCell('subResource'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue = newRecord.subResource
          const oldValue = oldRecord.subResource || '---'
          return renderCustomCell(oldValue, newValue, wasChanged('subResource', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'Team 1',
        dataIndex: 'team1Id',
        width: '188px',
        onCell: onCell('team1Id'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue = newRecord.team1IdName
          const oldValue =
            getEventTeamName({
              event: oldRecord,
              masterTeam: oldRecord.homeTeam,
              leagueTeam: oldRecord.homeLeagueTeam,
              league: oldRecord.season,
            }).name || ''
          return renderCustomCell(oldValue, newValue, wasChanged('team1Id', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'Season/League 1',
        dataIndex: 'team1Season',
        width: '188px',
        onCell: onCell('team1Season'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue =
            getEventSeasonName({
              event: newRecord,
              leagueTeam: newRecord.homeLeagueTeam,
            }).name || ''
          const oldValue =
            getEventSeasonName({
              event: oldRecord,
              leagueTeam: oldRecord.homeLeagueTeam,
            }).name || ''
          return renderCustomCell(oldValue, newValue, wasChanged('team1Season', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'Team 2',
        dataIndex: 'team2Id',
        width: '188px',
        onCell: onCell('team2Id'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue = newRecord.team2IdName
          const oldValue =
            getEventTeamName({
              event: oldRecord,
              masterTeam: oldRecord.awayTeam,
              leagueTeam: oldRecord.awayLeagueTeam,
              league: oldRecord.season,
            }).name || ''
          return renderCustomCell(oldValue, newValue, wasChanged('team2Id', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'Season/League 2',
        dataIndex: 'team2Season',
        width: '188px',
        onCell: onCell('team2Season'),
        render: (_, record) => {
          const oldRecord = bulkEditRecords.find((old) => old.id === record.id)!
          const newRecord = values.events[record.id]

          const newValue =
            getEventSeasonName({
              event: newRecord,
              leagueTeam: newRecord.awayLeagueTeam,
            }).name || ''

          const oldValue =
            getEventSeasonName({
              event: oldRecord,
              leagueTeam: oldRecord.awayLeagueTeam,
            }).name || ''
          return renderCustomCell(oldValue, newValue, wasChanged('team2Season', record.id) ? record?.errors : undefined)
        },
      },
      {
        title: 'Conflict',
        dataIndex: 'errors',
        width: '440px',
        render: (_, record) => record.errors?.join(`\n`),
      },
    ],
    [values.events, bulkEditRecords, wasChanged],
  )

  return (
    <TableStyled
      objTerm="events"
      pagination={undefined}
      columns={columns || []}
      dataSource={bulkEditResults}
      onChange={() => undefined}
      createdIds={[]}
      showCreated={false}
      scroll={{
        x: 'max-content',
      }}
      rowSelection={undefined}
    />
  )
}

// Styled Table component
const TableStyled = styled(MonroeTable<TEventWithStatus>)`
  & tbody .ant-table-column-sort {
    background-color: ${colors.secondaryLight} !important;
  }

  & .ant-table-cell.ant-table-cell-fix-right {
    padding: 0 !important;
  }

  & .ant-table-row .ant-table-cell {
    align-items: center !important;
    justify-content: center !important;
  }

  & .ant-pagination.ant-table-pagination {
    display: none !important;
  }

  &.ant-table-wrapper .ant-table-tbody .ant-table-row.ant-table-row > .ant-table-cell.successCell {
    background-color: #e3f6df !important;

    & .oldValue {
      text-decoration: line-through;
    }

    & .newValue {
      color: #135708;
      font-weight: 500;
      font-size: 14px;
    }
  }

  &.ant-table-wrapper .ant-table-tbody .ant-table-row.ant-table-row > .ant-table-cell.errorCell {
    background-color: #ffd9d6 !important;

    & .oldValue {
      text-decoration: line-through;
    }

    & .newValue {
      color: #bc261b;
      font-weight: 500;
      font-size: 14px;
    }
  }

  & .ant-table-cell.errorCell .newValue,
  .ant-table-cell.successCell .newValue {
    display: inline-block !important;
  }
`
const CustomCell = styled(Flex)`
  .newValue {
    display: none;
  }
`
