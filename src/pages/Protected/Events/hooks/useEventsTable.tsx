import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import { Typography } from 'antd'
import Flex from 'antd/es/flex'
import dayjs from 'dayjs'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { EventTypeTag } from '@/pages/Protected/Events/components/EventTypeTag.tsx'
import { StatusTag } from '@/pages/Protected/Events/components/StatusTag.tsx'
import { DeleteWrapper } from '@/pages/Protected/LeagueTeams/components/DeleteWrapper.ts'

import { DateRangeFilterDropdown } from '@/components/Table/DateRangeFilterDropdown.tsx'
import MonroeFilter from '@/components/Table/MonroeFilter.tsx'

import { useLazyListEventsQuery } from '@/redux/events/events.api.ts'
import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'

import { useTableContext } from '@/hooks/useTableContext.ts'
import { useTableSearch } from '@/hooks/useTableSearch.tsx'

import { getIconColor } from '@/utils'

import { eventRepeatName, eventRepeatOptions, eventType, repeatType } from '@/common/constants/events.ts'
import { PATH_TO_EDIT_EVENT, PATH_TO_EVENTS, PATH_TO_LOCATIONS } from '@/common/constants/paths.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { IFESeason } from '@/common/interfaces/season.ts'
import { TColumns } from '@/common/types'

import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

const EMPTY_VALUE = `---`

type TGetTeamDisplayNameProps = {
  event: IEvent
  masterTeam?: IFEMasterTeam
  leagueTeam?: IFELeagueTeam
  league?: IFESeason
}

export const useEventsTable = () => {
  const navigate = useNavigate()
  const { setSelectedIds, setSingleDeleting } = useTableContext<IEvent>()

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
      ordering: ordering || undefined,
    })
  }

  const navigateToLocation = useCallback((id: string) => {
    return () => navigate(`${PATH_TO_LOCATIONS}/${id}`)
  }, [])

  const filterIcon = useCallback((filtered: boolean) => <FilterFilled style={{ color: getIconColor(filtered) }} />, [])

  const onFilterDate = useCallback((value: unknown, record: IEvent) => {
    if (!record['date']) return false

    return (record['date'] as string)
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase())
  }, [])

  /**
   * Calculates the correct name for teams based on event type and brackets status
   */
  const getTeamName = useCallback((values: TGetTeamDisplayNameProps) => {
    const { event, masterTeam, leagueTeam } = values

    // if event is GAME, league team name is displayed
    if (event.type === eventType.GAME) {
      return leagueTeam?.name || '---'
    }

    // if event is PLAYOFF and brackets are populated, league team name is displayed
    if (event.type === eventType.PLAYOFF && event.playoffInfo) {
      return leagueTeam?.name || '---'
    }

    // if event is PLAYOFF and brackets aren't populated, subdivision name is displayed
    if (event.type === eventType.PLAYOFF && !event.playoffInfo) {
      return event.subDivision?.name || '---' // FIXME: this should be checked when working with playoffs
    }

    // if event is OTHER or PRACTICE, master team name is displayed
    return masterTeam?.name || '---'
  }, [])

  const getTeamHeadCoachName = (values: Omit<TGetTeamDisplayNameProps, 'league'>) => {
    const { event, masterTeam, leagueTeam } = values

    if (event.type === eventType.GAME || event.type === eventType.PLAYOFF) {
      if (!leagueTeam?.headCoach?.firstName) return EMPTY_VALUE
      return `${leagueTeam?.headCoach?.firstName} ${leagueTeam?.headCoach?.lastName}`
    }

    if (!masterTeam?.headCoach?.firstName) return EMPTY_VALUE
    return `${masterTeam?.headCoach?.firstName} ${masterTeam?.headCoach?.lastName}`
  }

  const getSeasonName = (values: Omit<TGetTeamDisplayNameProps, 'masterTeam' | 'league'>) => {
    const { event, leagueTeam } = values

    if (event.type === eventType.GAME || event.type === eventType.PLAYOFF) {
      if (!leagueTeam?.league.name) return EMPTY_VALUE
      return `${leagueTeam?.league.name} / ${leagueTeam?.season?.name}`
    }

    return EMPTY_VALUE
  }

  const columns: TColumns<IEvent> = [
    {
      title: 'Day',
      dataIndex: 'day',
      width: '88px',
      fixed: 'left',
      filters: [
        { text: 'Mon', value: 'Monday' },
        { text: 'Tue', value: 'Tuesday' },
        { text: 'Wed', value: 'Wednesday' },
        { text: 'Thu', value: 'Thursday' },
        { text: 'Fri', value: 'Friday' },
        { text: 'Sat', value: 'Saturday' },
        { text: 'Sun', value: 'Sunday' },
      ],
      filterDropdown: (props) => <MonroeFilter {...props} />,
      filterIcon,
      render: (_, record) => (record.day ? record.day.substring(0, 3) : dayjs(record.date, 'YYYY-MM-DD').format('ddd')),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: true,
      width: '144px',
      fixed: 'left',
      filterIcon,
      filterDropdown: (props) => <DateRangeFilterDropdown {...props} />,
      onFilter: onFilterDate,
      render: (_, record) => (
        <Typography.Link href={`${PATH_TO_EVENTS}/${record.id}`}>
          {dayjs(record.date, 'YYYY-MM-DD').format('MM/DD/YYYY')}
        </Typography.Link>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: 'time',
      fixed: 'left',
      sorter: true,
      width: '130px',
      render: (_, record) => (
        <Typography.Link href={`${PATH_TO_EVENTS}/${record.id}`}>
          {dayjs(record.time, 'HH:mm:ss').format('hh:mm A')}
        </Typography.Link>
      ),
    },
    {
      title: 'End Time',
      dataIndex: 'time',
      sorter: true,
      width: '130px',
      render: (_, record) => dayjs(record.time, 'HH:mm:ss').add(record.duration, 'minute').format('hh:mm A'),
    },
    {
      title: 'Event Type',
      dataIndex: 'type',
      width: '140px',
      filters: [
        { text: 'Game', value: eventType.GAME },
        { text: 'Practice', value: eventType.PRACTICE },
        { text: 'Playoff', value: eventType.PLAYOFF },
        { text: 'Other event', value: eventType.OTHER },
      ],
      filterDropdown: (props) => <MonroeFilter {...props} />,
      filterIcon,
      render: (_, record) => <EventTypeTag type={record.type} />,
    },
    {
      title: 'Repeats',
      dataIndex: 'repeats',
      width: '140px',
      filters: eventRepeatOptions.map((option) => ({ text: option.label, value: option.value })),
      filterDropdown: (props) => <MonroeFilter {...props} />,
      filterIcon,
      render: (_, record) => eventRepeatName[record.repeats || repeatType.NO_REPEAT],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      width: '115px',
      render: (_, record) =>
        record.status ? <StatusTag type={record.status as 'No' | 'Yes' | 'Maybe'} title={record.status} /> : '---',
    },
    {
      title: 'Team 1 Name',
      dataIndex: 'homeTeam',
      sorter: true,
      width: '188px',
      ...getColumnSearchProps('homeTeam', undefined, false),
      render: (_, record) =>
        getTeamName({
          event: record,
          masterTeam: record.homeTeam,
          leagueTeam: record.homeLeagueTeam,
        }),
    },
    {
      title: 'Head Coach Team 1',
      dataIndex: 'team1HeadCoach',
      sorter: true,
      width: '204px',
      ...getColumnSearchProps('team1HeadCoach' as keyof IEvent, () => true),
      render: (_, record) =>
        getTeamHeadCoachName({
          event: record,
          masterTeam: record.homeTeam,
          leagueTeam: record.homeLeagueTeam,
        }),
    },
    {
      title: 'Season',
      dataIndex: 'team1Season',
      sorter: true,
      width: '188px',
      ...getColumnSearchProps('team1Season' as keyof IEvent, () => true),
      render: (_, record) =>
        getSeasonName({
          event: record,
          leagueTeam: record.homeLeagueTeam,
        }),
    },
    {
      title: 'Team 2 Name',
      dataIndex: 'awayTeam',
      sorter: true,
      width: '188px',
      ...getColumnSearchProps('awayTeam', undefined, false),
      render: (_, record) =>
        getTeamName({
          event: record,
          masterTeam: record.awayTeam,
          leagueTeam: record.awayLeagueTeam,
        }),
    },
    {
      title: 'Head Coach Team 2',
      dataIndex: 'team2HeadCoach',
      sorter: true,
      width: '204px',
      ...getColumnSearchProps('team2HeadCoach' as keyof IEvent, () => true),
      render: (_, record) =>
        getTeamHeadCoachName({
          event: record,
          masterTeam: record.awayTeam,
          leagueTeam: record.awayLeagueTeam,
        }),
    },
    {
      title: 'Season',
      dataIndex: 'team2Season',
      sorter: true,
      width: '188px',
      ...getColumnSearchProps('team2Season' as keyof IEvent, () => true),
      render: (_, record) =>
        getSeasonName({
          event: record,
          leagueTeam: record.awayLeagueTeam,
        }),
    },
    // {
    //   title: 'RSVP',
    //   dataIndex: 'rsvpAnswers',
    //   width: '144px',
    //   render: (_, record) => <RSVPStatus rsvp={record.rsvpAnswers} />
    // },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: true,
      width: '240px',
      ...getColumnSearchProps('location', () => true),
      render: (_, record) =>
        record.location ? (
          <Typography.Link onClick={record.location?.id ? navigateToLocation(record.location?.id) : undefined}>
            {record.location?.name}
          </Typography.Link>
        ) : (
          EMPTY_VALUE
        ),
    },
    {
      title: 'Court',
      dataIndex: 'courtOrField',
      width: '96px',
      ...getColumnSearchProps('courtOrField', () => true),
      render: (_, record) => (record.courtOrField ? record.courtOrField : '##'),
    },
    {
      title: 'Sub Resource',
      dataIndex: 'subResource',
      width: '152px',
      ...getColumnSearchProps('subResource', () => true),
      render: (_, record) => (record.subResource ? record.subResource : '##'),
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
            <DeleteWrapper
              onClick={() => {
                setSingleDeleting(true)
                setSelectedIds([value.id])
              }}
            >
              <ReactSVG src={DeleteIcon} />
            </DeleteWrapper>
          </div>
        </Flex>
      ),
    },
  ]

  return {
    columns,
  }
}
