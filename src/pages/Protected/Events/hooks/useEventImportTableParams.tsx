import { FilterFilled } from '@ant-design/icons'
import { TableProps } from 'antd'
import dayjs from 'dayjs'
import { useCallback } from 'react'

import { EventTypeTag } from '@/pages/Protected/Events/components/EventTypeTag.tsx'

import { DateFilterDropdown } from '@/components/Table/DateFilterDropdown.tsx'
import MonroeFilter from '@/components/Table/MonroeFilter.tsx'
import TagType from '@/components/Table/TagType.tsx'

import { useTableSearch } from '@/hooks/useTableSearch.tsx'

import { getIconColor } from '@/utils'

import { eventType } from '@/common/constants/events.ts'
import { TEventImportErrors } from '@/common/types/events.ts'

type TColumns<T> = TableProps<T>['columns']

const EMPTY_PLACEHOLDER = '---'

export const useEventImportInfoTableParams = () => {
  const { getColumnSearchProps } = useTableSearch()

  const filterIcon = useCallback((filtered: boolean) => <FilterFilled style={{ color: getIconColor(filtered) }} />, [])

  const onFilterDate = useCallback((value: unknown, record: TEventImportErrors) => {
    if (!record['date']) return false
    return (record['date'] as string)
      .toString()
      .toLowerCase()
      .includes(
        dayjs(value as string, 'YYYY-MM-DD')
          .format('MM/DD/YYYY')
          .toLowerCase(),
      )
  }, [])

  const columns: TColumns<TEventImportErrors> = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '140px',
      sorter: true,
      fixed: 'left',
      filterIcon,
      filterDropdown: (props) => <DateFilterDropdown {...props} />,
      onFilter: onFilterDate,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      width: '180px',
      fixed: 'left',
      onFilter: (value, record) => value === record.duration,
      render: (_: unknown, record) => {
        const start = dayjs(`${record.time}:00`, 'HH:mm:ss')
        const end = start.add(record.duration, 'minute').format('hh:mm A')
        return `${start.format('hh:mm A')} - ${end}`
      },
    },
    {
      title: 'Team 1 Name',
      dataIndex: 'team1Name',
      width: '188px',
      fixed: 'left',
      sorter: (s1, s2) => (s1.team1Name ? s1.team1Name.localeCompare(s2.team1Name || '') : 0),
      ...getColumnSearchProps<TEventImportErrors>('team1Name'),
    },
    {
      title: 'Team 2 Name',
      dataIndex: 'team2Name',
      width: '188px',
      fixed: 'left',
      sorter: (s1, s2) => (s1.team2Name ? s1.team2Name.localeCompare(s2.team2Name || '') : 0),
      ...getColumnSearchProps<TEventImportErrors>('team2Name'),
      render: (_: unknown, record) => (record?.team2Name ? record.team2Name : EMPTY_PLACEHOLDER),
    },
    {
      title: 'Event Type',
      dataIndex: 'type',
      width: '144px',
      fixed: 'left',
      filters: [
        { text: 'Game', value: eventType.GAME },
        { text: 'Practice', value: eventType.PRACTICE },
        { text: 'Playoff', value: eventType.PLAYOFF },
        { text: 'Other event', value: eventType.OTHER },
      ],
      filterDropdown: (props) => <MonroeFilter {...props} />,
      filterIcon,
      onFilter: (value, record) => value === record.type,
      render: (_: unknown, record) =>
        record?.type ? <EventTypeTag type={eventType[record.type.toUpperCase()]} /> : EMPTY_PLACEHOLDER,
    },
    {
      title: 'Status',
      dataIndex: 'type',
      width: '132px',
      filters: [
        { text: 'Conflict', value: 'Conflict' },
        { text: 'Error', value: 'Error' },
      ],
      onFilter: (value, record) => value === record.status,
      filterDropdown: (props) => <MonroeFilter {...props} />,
      filterIcon,
      render: (value) => <TagType text={value} />,
    },
    {
      title: 'Error info',
      dataIndex: 'error',
    },
  ]

  return {
    columns,
  }
}
