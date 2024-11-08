import { MonroeTable } from '@/components/Table/MonroeTable'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { useLazyGetLeagueTeamsQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { useEffect, useMemo } from 'react'
import { useLeagueTeamTable } from '../hooks/useLeagueTeamTable'
import { IFELeagueTeam, IGetLeagueTeamsRequest } from '@/common/interfaces/leagueTeams.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { useTableContext } from '@/hooks/useTableContext.ts'
import type { FilterValue } from 'antd/es/table/interface'
import type { TableProps } from 'antd'
import { getTableSortField } from '@/utils'
import { showTotal } from '@/components/Table/utils'

const ERROR_LOADING_LEAGUE_TEAMS_MESSAGE = `Could not load league teams. Please, try again!`

type TFilterValueKey = 'name' | 'division' | 'subdivision' | 'league'


export const LeagueTeamsTable = () => {
  const [listLeagueTeam] = useLazyGetLeagueTeamsQuery()

  const { columns } = useLeagueTeamTable()
  const { notify } = useNotification()

  const {
    setIsLoading,
    isAllSelected,
    setSelectedIds,
    setShowAdditionalHeader,
    setTableParams
  } = useTableContext<IFELeagueTeam>()

  const {
    leagueTeams, offset,
    limit,
    ordering,
    total,
    setPaginationParams
  } = useLeagueTeamsSlice()

  const pagination = useMemo(() => ({
    offset, ordering, limit, total
  }), [offset, ordering, limit, total])

  /**
   * Fetches League Teams on mount
   */
  useEffect(() => {
    setIsLoading(true)
    setPaginationParams({ offset, limit, ordering })
    listLeagueTeam({
      limit,
      offset,
      ordering: ordering || undefined
    })
      .catch(() => notify(ERROR_LOADING_LEAGUE_TEAMS_MESSAGE, 'error'))
      .finally(() => setIsLoading(false))
  }, [])


  /**
   * Handles table changes like pagination, filtering and sorting
   */
  type TFilter = Record<TFilterValueKey, FilterValue | null>
  const handleTableChange: TableProps<IFELeagueTeam>['onChange'] = (pagination, filters: TFilter, sorter) => {
    const newOffset = (pagination?.current && (pagination?.current - 1) * (pagination?.pageSize || 10)) || 0
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
      league: 'league_name',
      division: 'division_name',
      subdivision: 'subdivision_name'
    }

    const leagueTeamsRequestParams: IGetLeagueTeamsRequest = {
      offset: newOffset,
      limit: newLimit,
      ordering: getTableSortField<IFELeagueTeam>(sorter, fieldMap),
      name: (filters?.['name']?.[0] as string) ?? undefined,
      division_name: (filters?.['division']?.[0] as string) ?? undefined,
      subdivision_name: (filters?.['subdivision']?.[0] as string) ?? undefined,
      league_name: (filters?.['league']?.[0] as string) ?? undefined
    }

    listLeagueTeam(leagueTeamsRequestParams)

    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      ordering: leagueTeamsRequestParams.ordering || null
    })
  }

  return (
    <MonroeTable<IFELeagueTeam>
      columns={columns}
      dataSource={leagueTeams}
      onChange={handleTableChange}
      pagination={pagination}
      showCreated={false}
      createdIds={[]}
    />
  )
}
