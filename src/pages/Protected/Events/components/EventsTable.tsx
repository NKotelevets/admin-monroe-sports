import { useNotification } from '@/hooks/useNotification.ts'
import { useLazyListEventsQuery } from '@/redux/events/events.api.ts'
import { useEffect, useMemo } from 'react'
import { MonroeTable } from '@/components/Table/MonroeTable'
import { IEvent } from '@/common/interfaces/event.ts'
import type { FilterValue } from 'antd/es/table/interface'
import type { TableProps } from 'antd'
import { TEventFilter, TListEventRequestParams } from '@/common/types/events.ts'
import { useEventsTable } from '../hooks/useEventsTable'
import { useEventsSlice } from '@/redux/hooks/useEventsSlice'
import { useTableContext } from '@/hooks/useTableContext.ts'
import { showTotal } from '@/components/Table/utils.tsx'
import { getTableSortField } from '@/utils'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'

const ERROR_LOADING_EVENTS_MESSAGE = `Could not load events. Please, try again!`


export const EventsTable = () => {
  const [listEvents, { isLoading, isFetching }] = useLazyListEventsQuery()

  const { notify } = useNotification()
  const { columns } = useEventsTable()
  const {
    events,
    offset,
    limit,
    ordering,
    total,
    setPaginationParams,
    createdIds,
    resetCreatedIds
  } = useEventsSlice()

  const {
    isAllSelected,
    setTableParams,
    showCreatedRecords,
    setIsLoading,
    setSelectedIds,
    setShowAdditionalHeader
  } = useTableContext<IEvent>()

  const pagination = useMemo(
    () => ({ offset, ordering, limit, total }),
    [offset, ordering, limit, total]
  )

  /**
   * Fetches events when the component mounts.
   * It sets the loading state, initializes pagination parameters, and
   * handles errors by showing a notification if the fetch fails.
   *
   * Removes created records from state on unmount.
   */
  useEffect(() => {
    setIsLoading(true)
    setPaginationParams({ offset, limit, ordering })

    listEvents({ limit, offset, ordering: ordering || undefined })
      .catch(() => notify(ERROR_LOADING_EVENTS_MESSAGE, 'error'))
      .finally(() => setIsLoading(false))

    return () => {
      resetCreatedIds()
    }
  }, [])

  type TFilter = Record<TEventFilter, FilterValue | null>

  /**
   * Handles changes in the table, including pagination, filtering, and sorting.
   * Updates the table parameters and fetches the events based on the new configuration.
   *
   * @param pagination - The pagination object with current page and page size.
   * @param {TFilter} filters - The filters applied to the table, mapped by filter keys.
   * @param sorter - The sorter configuration for sorting table data.
   */
  const handleTableChange: TableProps<IEvent>['onChange'] = (
    pagination,
    filters: TFilter,
    sorter
  ) => {
    const newOffset =
      (pagination?.current && (pagination?.current - 1) * (pagination?.pageSize || 10)) || 0
    const newLimit = pagination?.pageSize || 10

    setTableParams({
      pagination: {
        ...pagination,
        showTotal
      }
    })

    if (!isAllSelected) {
      setSelectedIds([])
      setShowAdditionalHeader(false)
    }

    const fieldMap = {
      subResource: 'sub_resource',
      team1Name: 'team_1_name',
      team2Name: 'team_2_name',
      location: 'location_name',
      courtNumber: 'court_number',
      homeTeam: 'team_1_name',
      awayTeam: 'team_2_name',
      league: 'league_name'
    }

    const leagueTeamsRequestParams: TListEventRequestParams = {
      offset: newOffset,
      limit: newLimit,
      ordering: getTableSortField<IEvent>(sorter, fieldMap),
      date: filters?.['date'] ? filters?.['date'] :  undefined,
      day: filters?.['day'] ? filters?.['day'] as FilterValue : undefined,
      status: filters?.['status'] ? filters?.['status'] as FilterValue : undefined,
      leagueName: (filters?.['leagueName']?.[0] as string) ?? undefined,
      subResource: (filters?.['subResource']?.[0] as string) ?? undefined,
      team1name: (filters?.['homeTeam']?.[0] as string) ?? undefined,
      team1Season: (filters?.['team1Season']?.[0] as string) ?? undefined,
      team1HeadCoach: (filters?.['team1HeadCoach']?.[0] as string) ?? undefined,
      team2Name: (filters?.['awayTeam']?.[0] as string) ?? undefined,
      team2Season: (filters?.['team2Season']?.[0] as string) ?? undefined,
      team2HeadCoach: (filters?.['team2HeadCoach']?.[0] as string) ?? undefined,
      court: (filters?.['courtOrField']?.[0] as string) ?? undefined,
      type: filters?.['type'] ? filters?.['type'] : undefined,
      repeats: filters?.['repeats'] ? filters?.['repeats'] : undefined,
      location: (filters?.['location']?.[0] as string) ?? undefined,
    }

    listEvents(leagueTeamsRequestParams)

    setPaginationParams({
      offset: leagueTeamsRequestParams.offset || 0,
      limit: leagueTeamsRequestParams.limit || 10,
      ordering: leagueTeamsRequestParams.ordering || null
    })
  }

  return (
    <TableStyled
      objTerm='events'
      columns={columns}
      dataSource={events}
      onChange={handleTableChange}
      loading={isFetching || isLoading}
      pagination={pagination}
      showCreated={showCreatedRecords}
      createdIds={createdIds || []}
    />
  )
}

const TableStyled = styled(MonroeTable<IEvent>)`
  & tbody .ant-table-column-sort {
      background-color: ${colors.secondaryLight} !important;
  }
`
