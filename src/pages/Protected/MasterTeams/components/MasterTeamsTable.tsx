import type { TableProps } from 'antd'
import type { FilterValue } from 'antd/es/table/interface'
import { ReactElement, useEffect, useMemo } from 'react'

import { useMasterTeamsTable } from '@/pages/Protected/MasterTeams/hooks/useMasterTeamsTable'

import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api'

import { IFEMasterTeam, IGetMasterTeamsRequest } from '@/common/interfaces/masterTeams'
import { showTotal } from '@/components/Table/utils.tsx'
import { useTableContext } from '@/hooks/useTableContext.ts'
import { MonroeTable } from '@/components/Table/MonroeTable'
import { useNotification } from '@/hooks/useNotification.ts'

type TFilterValueKey = 'name' | 'headCoachFullName' | 'teamAdmins' | 'league_name'

const DEFAULT_MASTER_TEAM_LOAD_ERROR = 'Unable to load master teams. Please, try again!'

/**
 * MasterTeamsTable Component
 *
 * Renders a table of master teams with support for pagination, sorting, filtering,
 * and additional actions. Fetches data from the API and displays it in a structured format.
 *
 * Key Features:
 * - Handles server-side pagination, sorting, and filtering.
 * - Displays loading states during API requests.
 *
 * @returns {ReactElement} The MasterTeamsTable component.
 */
const MasterTeamsTable = (): ReactElement => {
  const [getMasterTeams, { isLoading, isFetching }] = useLazyGetMasterTeamsQuery()
  const { notify } = useNotification()
  const { columns } = useMasterTeamsTable()

  const {
    isAllSelected,
    setTableParams,
    showCreatedRecords,
    setIsLoading,
    setSelectedIds,
    setShowAdditionalHeader
  } = useTableContext()

  const {
    masterTeams,
    createdIds,
    resetCreatedIds,
    offset,
    limit,
    ordering,
    total,
    setPaginationParams
  } = useMasterTeamsSlice()

  // Memoized Pagination Object
  const pagination = useMemo(
    () => ({ offset, ordering, limit, total }),
    [offset, ordering, limit, total]
  )

  /**
   * Fetches master teams when the component mounts.
   * It sets the loading state, initializes pagination parameters, and
   * handles errors by showing a notification if the fetch fails.
   *
   * Resets createdRecordsNames on unmount
   */
  useEffect(() => {
    setIsLoading(true)
    setPaginationParams({
      offset,
      limit,
      ordering: null
    })

    getMasterTeams({ limit, offset, ordering: ordering || undefined })
      .catch(() => notify(DEFAULT_MASTER_TEAM_LOAD_ERROR, 'error'))
      .finally(() => setIsLoading(false))

    return () => {
      resetCreatedIds()
    }
  }, [])

  type TFilter = Record<TFilterValueKey, FilterValue | null>

  /**
   * Handles changes in the table, including pagination, filtering, and sorting.
   * Updates the table parameters and fetches the league teams based on the new configuration.
   *
   * @param pagination - The pagination object with current page and page size.
   * @param {TFilter} filters - The filters applied to the table, mapped by filter keys.
   * @param sorter - The sorter configuration for sorting table data.
   */
  const handleTableChange: TableProps<IFEMasterTeam>['onChange'] = (pagination, filters: TFilter, sorter) => {
    const newOffset =
      (pagination?.current && (pagination?.current - 1) * (pagination?.pageSize || 10)) || 0
    const newLimit = pagination?.pageSize || 10

    setTableParams({
      pagination: {
        ...pagination,
        showTotal
      }
    })

    // Clear selections if not all items are selected
    if (!isAllSelected) {
      setSelectedIds([])
      setShowAdditionalHeader(false)
    }

    // Maps frontend sorting fields to backend sorting fields
    const getBESortingField = (name: string) => {
      if (name === 'headCoachFullName') return 'head_coach'
      if (name === 'teamAdmins') return 'team_admins'
      if (name === 'leagues') return 'league_name'
      return name
    }

    // Prepare request parameters for the API call
    const getMasterTeamsParams: IGetMasterTeamsRequest = {
      offset: newOffset,
      limit: newLimit,
      ordering:
        !Array.isArray(sorter) && sorter.order
          ? sorter.order === 'descend'
            ? `-${getBESortingField(sorter.field as string)}`
            : getBESortingField(sorter.field as string)
          : undefined,
      name: (filters?.['name']?.[0] as string) ?? undefined,
      head_coach: (filters?.['headCoachFullName']?.[0] as string) ?? undefined,
      team_admins: (filters?.['teamAdmins']?.[0] as string) ?? undefined,
      league_name: (filters?.['league_name']?.[0] as string) ?? undefined
    }

    // Fetch data based on updated parameters
    getMasterTeams(getMasterTeamsParams)

    // Update pagination parameters in the state
    setPaginationParams({
      offset: getMasterTeamsParams.offset,
      limit: getMasterTeamsParams.limit,
      ordering: getMasterTeamsParams.ordering || null
    })
  }

  return (
    <MonroeTable<IFEMasterTeam>
      columns={columns}
      pagination={masterTeams.length > 0 ? pagination : undefined}
      loading={isLoading || isFetching}
      dataSource={masterTeams}
      onChange={handleTableChange}
      showCreated={showCreatedRecords}
      createdIds={createdIds || []}
    />
  )
}

export default MasterTeamsTable

