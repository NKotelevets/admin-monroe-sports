import { useNavigate } from 'react-router-dom'
import { useTableContext } from '@/hooks/useTableContext.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { useLazyListEventsQuery } from '@/redux/events/events.api.ts'
import { useTableSearch } from '@/hooks/useTableSearch.tsx'
import { useCallback, useEffect } from 'react'
import { TColumns } from '@/common/types'
import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'
import Flex from 'antd/es/flex'
import { ReactSVG } from 'react-svg'
import EditIcon from '@/assets/icons/edit.svg'
import { PATH_TO_EDIT_EVENT, PATH_TO_LOCATION } from '@/common/constants/paths.ts'
import { DeleteWrapper } from '@/pages/Protected/LeagueTeams/components/DeleteWrapper.ts'
import DeleteIcon from '@/assets/icons/delete.svg'
import dayjs from 'dayjs'
import { EventTypeTag } from '@/pages/Protected/Events/components/EventTypeTag.tsx'
// import { RSVPStatus } from '../components/RSVPStatus'
import { Typography } from 'antd'
import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import { getIconColor } from '@/utils'
import { DateFilterDropdown } from '@/components/Table/DateFilterDropdown.tsx'
import { eventType } from '@/common/constants/events.ts'

export const useEventsTable = () => {
  const navigate = useNavigate()
  const {
    setSelectedIds,
    setSingleDeleting
  } = useTableContext<IEvent>()

  const [listEvents] = useLazyListEventsQuery()
  const { getColumnSearchProps } = useTableSearch(handleReset)
  const { limit, offset, ordering } = useEventsSlice()

  useEffect(() => {
    setSelectedIds([])
  }, [])

  function handleReset() {
    listEvents({
      limit,
      offset,
      ordering: ordering || undefined
    })
  }

  const navigateToLocation = useCallback((id: string) => {
    return () => navigate(`${PATH_TO_LOCATION}/${id}`)
  }, [])

  const filterIcon = useCallback((filtered: boolean) => (
    <FilterFilled style={{ color: getIconColor(filtered) }} />
  ), [])

  const onFilterDate = useCallback( (value: unknown, record: IEvent) => {
    if (!record['date']) return false

    return (record['date'] as string)
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase())
  }, [])

  const columns: TColumns<IEvent> = [
    {
      title: 'Day',
      dataIndex: 'day',
      width: '88px',
      fixed: 'left',
      filters: [
        { text: 'Mon', value: 'monday' },
        { text: 'Tue', value: 'tuesday' },
        { text: 'Wed', value: 'wednesday' },
        { text: 'Thu', value: 'thursday' },
        { text: 'Fri', value: 'friday' },
        { text: 'Sat', value: 'saturday' },
        { text: 'Sun', value: 'sunday' }
      ],
      filterIcon,
      render: (_, record) => record.day ? record.day.substring(0, 3) : '-'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: true,
      width: '144px',
      fixed: 'left',
      filterIcon,
      filterDropdown: (props) => <DateFilterDropdown {...props} />,
      onFilter: onFilterDate,
      render: (_, record) => dayjs(record.date, 'YYYY-MM-DD').format('MM/DD/YYYY')
    },
    {
      title: 'Start time',
      dataIndex: 'time',
      sorter: true,
      width: '130px',
      render: (_, record) => dayjs(record.time, 'HH:mm:ss').format('hh:mm A')
    },
    {
      title: 'End time',
      dataIndex: 'time',
      sorter: true,
      width: '130px',
      render: (_, record) => dayjs(record.time, 'HH:mm:ss').add(record.duration, 'hour').format('hh:mm A')
    },
    {
      title: 'Event type',
      dataIndex: 'type',
      width: '140px',
      filters: [
        { text: 'Game', value: '0' },
        { text: 'Practice', value: '2' },
        { text: 'Playoff', value: '3' },
        { text: 'Other event', value: '5' },
      ],
      filterIcon,
      render: (_, record) => <EventTypeTag type={record.type} />
    },
    {
      title: 'Team 1 Name',
      dataIndex: 'homeTeam',
      sorter: true,
      width: '188px',
      render: (_, record) => {
        if (record.type === eventType.PLAYOFF && !record.homeLeagueTeam?.division?.brackets.length) {
          return record.homeLeagueTeam?.subdivision?.name
        }

        if (record.type === eventType.GAME || record.type === eventType.PLAYOFF) {
          return record.homeLeagueTeam?.name
        }

        // if event is OTHER or PRACTICE, master team name is displayed
        return record.homeTeam?.name
      }
    },
    {
      title: 'Team 2 Name',
      dataIndex: 'awayTeam',
      sorter: true,
      width: '188px',
      render: (_, record) => {
        if (record.type === eventType.PLAYOFF && !record.awayLeagueTeam?.division?.brackets.length) {
          return record.awayLeagueTeam?.subdivision?.name
        }

        if (record.type === eventType.GAME || record.type === eventType.PLAYOFF) {
          return record.awayLeagueTeam?.name
        }

        // if event is OTHER or PRACTICE, master team name is displayed
        return record.awayTeam?.name
      }
    },
    {
      title: 'Team 1 League',
      dataIndex: 'homeTeam',
      sorter: true,
      width: '188px',
      render: (_, record) => {
        if (record.type === eventType.PLAYOFF && !record.awayLeagueTeam?.division?.brackets.length) {
          return record.awayLeagueTeam?.subdivision?.name
        }

        if (record.type === eventType.GAME || record.type === eventType.PLAYOFF) {
          return record.awayLeagueTeam?.name
        }

        // if event is OTHER or PRACTICE, master team name is displayed
        return record.awayTeam?.name
      }
    },
    {
      title: 'Team 2 League',
      dataIndex: 'awayTeam',
      sorter: true,
      width: '188px',
      render: (_, record) => {
        if (record.type === eventType.PLAYOFF && !record.awayLeagueTeam?.division?.brackets.length) {
          return record.awayLeagueTeam?.subdivision?.name
        }

        return record.awayLeagueTeam?.name
      }
    },
    // {
    //   title: 'RSVP',
    //   dataIndex: 'rsvpAnswers',
    //   width: '144px',
    //   render: (_, record) => <RSVPStatus rsvp={record.rsvpAnswers} />
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   sorter: true,
    //   width: '115px'
    // },
    {
      title: 'League/Tourn',
      dataIndex: 'league',
      sorter: true,
      width: '188px'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: true,
      width: '240px',
      ...getColumnSearchProps('location'),
      render: (_, record) => (
        <Typography.Link onClick={navigateToLocation(record.location.id)}>
          {record.location.address}
        </Typography.Link>
      )
    },
    {
      title: 'Court',
      dataIndex: 'courtNumber',
      width: '96px',
      render: (_, record) => record.courtNumber ? record.courtNumber : '##'
    },
    {
      title: 'Sub Resource',
      dataIndex: 'subResource',
      width: '152px',
      render: (_, record) => record.subResource ? record.subResource : '##'
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (value, record) => (
        <Flex className="c-p" justify="center" align="center">
          <ReactSVG
            src={EditIcon}
            onClick={() => {
              navigate(PATH_TO_EDIT_EVENT + `/${record.id}`)
            }}
          />

          <div className="mg-l8">
            <DeleteWrapper onClick={() => {
              setSingleDeleting(true)
              setSelectedIds([value.id])
            }}>
              <ReactSVG
                src={DeleteIcon}
              />
            </DeleteWrapper>
          </div>
        </Flex>
      )
    }
  ]

  return {
    columns
  }
}
