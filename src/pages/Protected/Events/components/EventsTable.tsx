import { useNotification } from '@/hooks/useNotification.ts'
import { useLazyListEventsQuery } from '@/redux/events/events.api.ts'
import { useEffect, useMemo } from 'react'
import { MonroeTable } from '@/components/Table/MonroeTable'
import { IEvent } from '@/common/interfaces/event.ts'
import type { FilterValue } from 'antd/es/table/interface'
import type { TableProps } from 'antd'
import { TEventFilter, TListEventRequestParams } from '@/common/types/games'
import { useEventsTable } from '../hooks/useEventsTable'
import { useEventsSlice } from '@/redux/hooks/useEventsSlice'
import { useTableContext } from '@/hooks/useTableContext.ts'
import { showTotal } from '@/components/Table/utils.tsx'
import { getTableSortField } from '@/utils'

const ERROR_LOADING_EVENTS_MESSAGE = `Could not load events. Please, try again!`


export const EventsTable = () => {
  const [listEvents] = useLazyListEventsQuery()

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
      leagueName: 'league_name',
      subResource: 'sub_resource',
      team1Name: 'team1_name',
      team2Name: 'team2_ame'
    }

    const leagueTeamsRequestParams: TListEventRequestParams = {
      offset: newOffset,
      limit: newLimit,
      ordering: getTableSortField<IEvent>(sorter, fieldMap),
      leagueName: (filters?.['leagueName']?.[0] as string) ?? undefined,
      subResource: (filters?.['subResource']?.[0] as string) ?? undefined,
      team1Name: (filters?.['team1Name']?.[0] as string) ?? undefined,
      team2Name: (filters?.['team2Name']?.[0] as string) ?? undefined,
    }

    listEvents(leagueTeamsRequestParams)

    setPaginationParams({
      offset: leagueTeamsRequestParams.offset || 0,
      limit: leagueTeamsRequestParams.limit || 10,
      ordering: leagueTeamsRequestParams.ordering || null
    })
  }

  return (
    <MonroeTable<IEvent>
      columns={columns}
      dataSource={events}
      onChange={handleTableChange}
      pagination={pagination}
      showCreated={showCreatedRecords}
      createdIds={createdIds || []}
    />
  )
}
