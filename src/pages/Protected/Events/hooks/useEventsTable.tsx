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
import { getEventSeasonName } from '@/utils/getEventSeasonName.ts'
import { TGetTeamDisplayNameProps, getEventTeamName } from '@/utils/getTeamName.tsx'

import { EMPTY_VALUE } from '@/common/constants'
import { eventRepeatName, eventRepeatOptions, eventType, repeatType } from '@/common/constants/events.ts'
import { PATH_TO_EDIT_EVENT, PATH_TO_EVENTS, PATH_TO_LOCATIONS } from '@/common/constants/paths.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { TColumns } from '@/common/types'

import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

/**
 * Defines a custom hook `useEventsTable` that configures and provides functionalities
 * for managing and displaying events in a tabular format.
 *
 * The hook sets up various table properties including column definitions,
 * search and filter functionalities, and event-specific data manipulations.
 * It primarily interacts with the context, navigation, and data-fetching
 * functions to dynamically render and manage events. It includes:
 *
 * - Initialization of table-level state like selected IDs and deleting controls.
 * - Custom rendering for columns such as date, time, location, and team details.
 * - Filtering and sorting data including event types, repetition, and statuses.
 * - Handling navigation to specific locations based on event IDs.
 * - Utility methods for data resets and conditional rendering of custom filters.
 *
 * Returns the column definitions and required handlers for table management.
 */
export const useEventsTable = () => {
  const navigate = useNavigate()
  const { setSelectedIds, setSingleDeleting } = useTableContext<IEvent>()

  const [listEvents] = useLazyListEventsQuery()
  const { getColumnSearchProps } = useTableSearch(handleReset)
  const { limit, offset, ordering } = useEventsSlice()

  useEffect(() => {
    setSelectedIds([])
  }, [])

  /**
   * Handles the reset functionality by listing events with specified parameters.
   *
   * @return {void} Does not return a value.
   */
  function handleReset() {
    listEvents({
      limit,
      offset,
      ordering: ordering || undefined,
    })
  }

  /**
   * A callback function that creates a navigation handler for a given location ID.
   *
   * @function
   * @param {string} id - The unique identifier of the location to navigate to.
   * @returns {Function} A function that triggers navigation to the specified location.
   */
  const navigateToLocation = useCallback((id: string) => {
    return () => navigate(`${PATH_TO_LOCATIONS}/${id}`)
  }, [])

  /**
   * A memoized callback function that renders a filter icon.
   * The icon's color dynamically changes based on the `filtered` state.
   *
   * @function
   * @param {boolean} filtered - Indicates whether the filter is active.
   * @returns {JSX.Element} The filter icon with a conditionally styled color.
   */
  const filterIcon = useCallback((filtered: boolean) => <FilterFilled style={{ color: getIconColor(filtered) }} />, [])

  /**
   * Callback function for filtering events based on their 'date' property.
   *
   * @function
   * @param {unknown} value - The value to filter against.
   * @param {IEvent} record - The event record that contains the 'date' property.
   * @returns {boolean} Returns true if the 'date' property matches the value, otherwise false.
   */
  const onFilterDate = useCallback((value: unknown, record: IEvent) => {
    if (!record['date']) return false

    return (record['date'] as string)
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase())
  }, [])

  /**
   * Retrieves the head coach's name for a given team based on the provided event type and team information.
   *
   * @function
   * @param {Omit<TGetTeamDisplayNameProps, 'league'>} values - The data object containing event and team details.
   * @param {Object} values.event - The event object associated with the team.
   * @param {Object} values.masterTeam - The master team object containing coach details.
   * @param {Object} values.leagueTeam - The league-specific team object containing coach details.
   * @returns {string} The full name of the head coach or a placeholder value if not found.
   */
  const getTeamHeadCoachName = (values: Omit<TGetTeamDisplayNameProps, 'league'>): string => {
    const { event, masterTeam, leagueTeam } = values

    if (event.type === eventType.GAME || event.type === eventType.PLAYOFF) {
      if (!leagueTeam?.headCoach?.firstName) return EMPTY_VALUE
      return `${leagueTeam?.headCoach?.firstName} ${leagueTeam?.headCoach?.lastName}`
    }

    if (!masterTeam?.headCoach?.firstName) return EMPTY_VALUE
    return `${masterTeam?.headCoach?.firstName} ${masterTeam?.headCoach?.lastName}`
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
      render: (_, record) => {
        if (record.day) return record.day.substring(0, 3)
        if (record.date) return dayjs(record.date, 'YYYY-MM-DD').format('ddd')
        return 'Pending date'
      },
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
          {record.date ? dayjs(record.date, 'YYYY-MM-DD').format('MM/DD/YYYY') : 'Pending date'}
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
          {record.time ? dayjs(record.time, 'HH:mm:ss').format('hh:mm A') : 'Pending date'}
        </Typography.Link>
      ),
    },
    {
      title: 'End Time',
      dataIndex: 'time',
      sorter: true,
      width: '130px',
      render: (_, record) =>
        record.time ? dayjs(record.time, 'HH:mm:ss').add(record.duration, 'minute').format('hh:mm A') : 'Pending date',
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
      width: '115px',
      filters: [
        { text: 'Yes', value: 'Yes' },
        { text: 'No', value: 'No' },
        { text: 'Pending', value: 'Maybe' },
      ],
      filterDropdown: (props) => <MonroeFilter {...props} />,
      filterIcon,
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
        getEventTeamName({
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
        getEventSeasonName({
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
        getEventTeamName({
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
        getEventSeasonName({
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
