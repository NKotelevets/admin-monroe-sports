import styled from '@emotion/styled'
import { ColumnType } from 'antd/es/table/interface'
import { Field, FieldProps, Form, Formik, useFormikContext } from 'formik'
import { ReactElement, useEffect, useMemo } from 'react'

import { BulkEditPreviewUpdate } from '@/pages/Protected/Events/components/EventBuklEditForm/BulkEditPreviewUpdate.tsx'
import { BulkEditTableControls } from '@/pages/Protected/Events/components/EventBuklEditForm/BulkEditTableControls.tsx'
import { eventBulkEditFormSchema, validDurations } from '@/pages/Protected/Events/components/EventForm/validation.ts'
import { useDeleteEvent } from '@/pages/Protected/Events/hooks/useDeleteEvent.ts'
import { useEventBulkEdit } from '@/pages/Protected/Events/hooks/useEventBulkEdit.ts'
import { useEventsBulkEditTable } from '@/pages/Protected/Events/hooks/useEventsBulkEditTable.tsx'

import { MonroeTable } from '@/components/Table/MonroeTable'

import { usePageContext } from '@/layouts/Page/context.ts'

import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'

import { useTableContext } from '@/hooks/useTableContext.ts'

import { colors } from '@/utils/colors.tsx'

import { eventType } from '@/common/constants/events.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { TBulkEditEvent, TBulkEditEventForm } from '@/common/types/events.ts'

/**
 * BulkEditTable is a functional component designed for batch editing events.
 * It uses `Formik` for handling form state and validation and leverages Redux for event and selection data.
 * The component prepares an initialValues object for the form, based on the currently selected events and their details.
 *
 * @function BulkEditTable
 * @returns {ReactElement} A React component that renders a form for batch editing events.
 *
 * @description
 * - Filters `events` based on selected record IDs from the Redux state.
 * - Initializes a data structure for a form with the relevant event details, including fields like location, teams, and type.
 * - Renders a `TableForm` component wrapped within a `Formik` form handler, allowing users to edit selected events.
 */
export const BulkEditTable = (): ReactElement => {
  useDeleteEvent()
  const { bulkEditRecords: selectedEvents } = useEventsSlice()
  const { setInitialValues } = useEventBulkEdit()

  /**
   * Initializes the bulk edit event data by transforming and reducing the selected events.
   *
   * The function processes an array of selected events and maps their properties into a specific structure,
   * while also extracting and normalizing information such as location IDs, team IDs, and team names based on event types.
   *
   * @function
   * @returns {{ events: TBulkEditEvent }} The transformed bulk edit event object.
   */
  const initialValues = useMemo(() => {
    const iniVal = {
      events: selectedEvents.reduce((acc, event) => {
        acc[event.id] = {
          ...event,
          eventDescription: event.eventDescription || '',
          courtOrField: event.courtOrField || '',
          subResource: event.subResource || '',
          duration: validDurations.includes(event.duration)
            ? event.duration
            : event?.type === eventType.PLAYOFF
              ? 60
              : 0,
          locationId: event?.location?.id,
          team1Id:
            event.type === eventType.PRACTICE || event.type === eventType.OTHER
              ? event?.homeTeam?.id
              : event?.homeLeagueTeam?.id,
          team1IdName:
            event.type === eventType.PRACTICE || event.type === eventType.OTHER
              ? event?.homeTeam?.name
              : event?.homeLeagueTeam?.name,
          team2Id:
            event.type === eventType.PRACTICE || event.type === eventType.OTHER
              ? event?.awayTeam?.id
              : event?.awayLeagueTeam?.id,
          team2IdName:
            event.type === eventType.PRACTICE || event.type === eventType.OTHER
              ? event?.awayTeam?.name
              : event?.awayLeagueTeam?.name,
        }
        return acc
      }, {} as TBulkEditEvent),
    } as { events: TBulkEditEvent }

    setInitialValues(iniVal)
    return iniVal
  }, [selectedEvents])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={eventBulkEditFormSchema}
      validateOnChange
      validateOnBlur
      validateOnMount
      onSubmit={() => undefined}
    >
      {() => <TableForm />}
    </Formik>
  )
}

/**
 * TableForm is a React memoized functional component that renders an editable table for bulk editing events.
 * Utilizes Redux state and context hooks to manage table data and selected records.
 *
 * The component integrates form fields into the table columns by dynamically enhancing column definitions
 * based on their `editable` property. It filters and displays the selected events based on user interactions.
 *
 * Features:
 * - Displays a table with editable cells, using a `Field` component for form management.
 * - Fetches base column definitions and selected events data from hooks.
 * - Utilizes memoized logic to optimize rendering performance.
 * - Renders a submit button to save changes made in the table.
 * - Configured for customizable column rendering and scroll behavior.
 *
 * Intended to handle functionalities like batch editing and updating event-related data efficiently while maintaining performance.
 */
const TableForm = () => {
  const { columns: baseColumns } = useEventsBulkEditTable()
  const { events, selectedRecordIds: selectedIds } = useEventsSlice()
  const { setSelectedIds, setDisableAllCheckBoxes, selectedIds: selectedTableIds } = useTableContext()
  const { values, setFieldValue, isValid, dirty, validateForm } = useFormikContext<TBulkEditEventForm>()
  const { setControls, setPageTitle } = usePageContext()
  const { showPreviewUpdate } = useEventBulkEdit()

  const selectedEvents = useMemo(() => events.filter((event) => selectedIds.includes(event.id)), [events, selectedIds])

  /**
   * Memoized columns configuration for rendering table columns.
   *
   * This variable is used to configure and map base columns for a table.
   * It adds additional properties like `render` if the column is editable.
   * The render function integrates with a form field for editable columns.
   *
   * @constant {Array<Object>} columns
   * @memberof Table
   */
  const columns = useMemo(
    () =>
      baseColumns?.map((col) => ({
        ...col,
        ...(col.editable && {
          render: (_value: unknown, record: IEvent) => (
            <Field name={`events[${record.id}][${(col as ColumnType<IEvent>).dataIndex}]`}>
              {({ field, meta }: FieldProps) => !!col.renderField && col.renderField(field, meta, record)}
            </Field>
          ),
        }),
      })),
    [baseColumns],
  )

  /**
   * Handles the selection logic when events are chosen.
   * If two events are selected, updates the selected IDs
   * and disables all checkboxes.
   */
  useEffect(() => {
    if (selectedEvents.length === 2) {
      setSelectedIds(selectedEvents.map((event) => event.id))
      setDisableAllCheckBoxes(true)
    }
  }, [selectedEvents])

  /**
   * Renders and sets the bulk edit controls and updates the page title
   * if the preview update is not shown.
   * Ensures controls are updated with current form validation state,
   * selected table IDs, form values, and validity status.
   */
  useEffect(() => {
    if (showPreviewUpdate) return

    setControls(
      <BulkEditTableControls
        validateForm={validateForm}
        selectedIds={selectedTableIds}
        values={values}
        setFieldValue={setFieldValue}
        isValid={isValid && dirty}
      />,
    )
    setPageTitle('Bulk Edit')
  }, [selectedTableIds, values, setFieldValue, isValid, dirty, showPreviewUpdate])

  if (showPreviewUpdate) {
    return <BulkEditPreviewUpdate />
  }

  return (
    <Form>
      <TableStyled
        objTerm="events"
        pagination={undefined}
        columns={columns || []}
        dataSource={selectedEvents}
        onChange={() => undefined}
        createdIds={[]}
        showCreated={false}
        scroll={{
          x: 'max-content',
        }}
      />
    </Form>
  )
}

// Styled Table component
const TableStyled = styled(MonroeTable<IEvent>)`
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
`
