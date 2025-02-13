import { Cell } from '../components/EventBuklEditForm/Cell.ts'
import { DatePicker, TimePicker } from 'antd'
import Flex from 'antd/es/flex'
import dayjs, { Dayjs } from 'dayjs'
import { useFormikContext } from 'formik'
import { ReactSVG } from 'react-svg'

import { LeagueTeamSelect } from '@/pages/Protected/Events/components/EventBuklEditForm/LeagueTeamSelect.tsx'
import { MasterTeamSelect } from '@/pages/Protected/Events/components/EventBuklEditForm/MasterTeamSelect.tsx'
import { LocationDropdown } from '@/pages/Protected/Events/components/EventForm/LocationDropdown.tsx'
import { EventTypeTag } from '@/pages/Protected/Events/components/EventTypeTag.tsx'
import { DeleteWrapper } from '@/pages/Protected/LeagueTeams/components/DeleteWrapper.ts'

import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import Select from '@/components/Inputs/Select.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'

import { useTableContext } from '@/hooks/useTableContext.ts'

import { eventDurationOptions, eventType } from '@/common/constants/events.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { TBulkEditTableColumns } from '@/common/types'
import { TBulkEditEventForm } from '@/common/types/events.ts'

import DeleteIcon from '@/assets/icons/delete.svg'

/**
 * Custom hook to provide configuration for the bulk edit table of events.
 *
 * This hook defines the columns and their behaviors for the events bulk edit table, including rendering logic,
 * data manipulation, and interaction handling. Each column configuration supports features like editing,
 * rendering with custom components, and handling field values using form context.
 *
 * @return Configuration object containing the columns for the events bulk edit table.
 */
export const useEventsBulkEditTable = () => {
  const { setSelectedIds, setSingleDeleting } = useTableContext<IEvent>()
  const { setFieldValue } = useFormikContext<TBulkEditEventForm>()

  const columns: TBulkEditTableColumns<IEvent> = [
    {
      title: 'Day',
      fixed: 'left',
      dataIndex: 'date',
      width: '88px',
      editable: true,
      renderField: (field) => (
        <>
          {field.value
            ? dayjs(field.value, 'YYYY-MM-DD').format('dddd').substring(0, 3)
            : dayjs(field.value, 'YYYY-MM-DD').format('dddd')}
        </>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: '198px',
      editable: true,
      renderField: (field, meta) => (
        <InputWrapper noMargin errorPosition="bottom" error={meta.error} style={{ width: 198 }}>
          <DatePicker
            format="MMMM D, YYYY"
            placeholder="Select date"
            value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
            onChange={(date) => {
              setFieldValue(field.name.replace('date', 'day'), date ? date.format('dddd') : null)
              return field.onChange({ target: { name: field.name, value: date ? date.format('YYYY-MM-DD') : null } })
            }}
            status={meta.error ? 'error' : undefined}
          />
        </InputWrapper>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: 'time',
      width: '198px',
      editable: true,
      renderField: (field, meta) => (
        <InputWrapper noMargin errorPosition="bottom" error={meta.error} style={{ width: 198 }}>
          <TimePicker
            format="hh:mm A"
            placeholder="Select time"
            value={field.value ? dayjs(field.value, 'HH:mm:ss') : null}
            onChange={(value) =>
              field.onChange({ target: { name: field.name, value: value ? value.format('HH:mm:00') : value } })
            }
            onOk={(value: Dayjs) => {
              field.onChange({ target: { name: field.name, value: value ? value.format('HH:mm:00') : value } })
            }}
            status={meta.error ? 'error' : undefined}
          />
        </InputWrapper>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      width: '240px',
      editable: true,
      renderField: (field, meta, record) => (
        <Cell width={168}>
          <Select
            label=""
            noMargin
            placeholder="Select duration"
            disabled={record?.type === eventType.PLAYOFF}
            value={field.value}
            options={eventDurationOptions}
            onChange={(value) => field.onChange({ target: { name: field.name, value: value } })}
            onBlur={field.onBlur}
            error={meta.error}
          />
        </Cell>
      ),
    },
    {
      title: 'Event Type',
      dataIndex: 'type',
      width: '140px',
      render: (_, record) => (
        <Cell width={110}>
          <EventTypeTag type={record.type} />
        </Cell>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'locationId',
      width: '240px',
      editable: true,
      renderField: (field) => (
        <Cell width={210}>
          <LocationDropdown
            noMargin
            hideLabel
            validateOnMount
            showAddButton={false}
            fieldName={field.name}
          />
        </Cell>
      ),
    },
    {
      title: 'Team 1',
      dataIndex: 'team1Id',
      width: '240px',
      editable: true,
      renderField: (field, form, record) => (
        <Cell width={210}>
          {record?.type === eventType.GAME || record?.type === eventType.PLAYOFF ? (
            <LeagueTeamSelect
              noMargin
              disabled={record?.type === eventType.PLAYOFF}
              fieldName={field.name}
              isTeam1={true}
              touched={true}
              error={form.error}
            />
          ) : (
            <MasterTeamSelect
              noMargin
              fieldName={field.name}
              isTeam1={true}
              touched={true}
              error={form.error}
            />
          )}
        </Cell>
      ),
    },
    {
      title: 'Team 2',
      dataIndex: 'team2Id',
      width: '240px',
      editable: true,
      renderField: (field, form, record) => (
        <Cell width={210}>
          {record?.type === eventType.GAME || record?.type === eventType.PLAYOFF ? (
            <LeagueTeamSelect
              noMargin
              disabled={record?.type === eventType.PLAYOFF}
              fieldName={field.name}
              isTeam1={false}
              touched={true}
              error={form.error}
            />
          ) : (
            <MasterTeamSelect
              noMargin
              fieldName={field.name}
              isTeam1={false}
              touched={form.touched}
              error={form.error}
            />
          )}
        </Cell>
      ),
    },
    {
      title: 'Court / Field',
      dataIndex: 'courtOrField',
      width: '240px',
      editable: true,
      renderField: (field, meta) => (
        <TextInput
          {...field}
          noMargin
          style={{ width: 198 }}
          placeholder="Enter court / field"
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={meta.touched ? meta.error : undefined}
        />
      ),
    },
    {
      title: 'Sub Resources',
      width: '240px',
      dataIndex: 'subResource',
      editable: true,
      renderField: (field, meta) => (
        <TextInput
          {...field}
          noMargin
          style={{ width: 198 }}
          placeholder="Enter sub resources"
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={meta.touched ? meta.error : undefined}
        />
      ),
    },
    {
      title: '',
      dataIndex: '',
      width: '48px',
      fixed: 'right',
      render: (value) => (
        <Flex justify="center" align="center">
          <DeleteWrapper
            onClick={() => {
              setSingleDeleting(true)
              setSelectedIds([value.id])
            }}
          >
            <ReactSVG src={DeleteIcon} />
          </DeleteWrapper>
        </Flex>
      ),
    },
  ]

  return {
    columns,
  }
}
