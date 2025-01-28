import type { TableProps } from 'antd'
import type { FilterValue } from 'antd/es/table/interface'
import { useEffect, useMemo } from 'react'

import { useLocationsTable } from '@/pages/Protected/Locations/useLocationsTable.tsx'

import { MonroeTable } from '@/components/Table/MonroeTable'
import { showTotal } from '@/components/Table/utils.tsx'

import { useLocationsSlice } from '@/redux/hooks/useLocationsSlice.ts'
import { useLazyListLocationQuery } from '@/redux/locations/locations.api.ts'

import { useNotification } from '@/hooks/useNotification.ts'
import { useTableContext } from '@/hooks/useTableContext.ts'

import { getTableSortField } from '@/utils'

import { ILocation } from '@/common/interfaces/location.ts'
import { TListLocationRequestParams, TLocationFilter } from '@/common/types/location.ts'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'

const ERROR_LOADING_LOCATIONS_MESSAGE = `Could not load locations. Please, try again!`

export const LocationsTable = () => {
  const { notify } = useNotification()
  const { columns } = useLocationsTable()
  const { locations, offset, limit, ordering, total, setPaginationParams, createdIds, resetCreatedIds } =
    useLocationsSlice()

  const [listLocations, { isLoading, isFetching }] = useLazyListLocationQuery()
  const { isAllSelected, setTableParams, showCreatedRecords, setIsLoading, setSelectedIds, setShowAdditionalHeader } =
    useTableContext<ILocation>()

  const pagination = useMemo(() => ({ offset, ordering, limit, total }), [offset, ordering, limit, total])

  useEffect(() => {
    setIsLoading(true)
    setPaginationParams({ offset, limit, ordering })

    listLocations({ limit, offset, ordering: ordering || undefined })
      .catch(() => notify(ERROR_LOADING_LOCATIONS_MESSAGE, 'error'))
      .finally(() => setIsLoading(false))

    return () => {
      resetCreatedIds()
    }
  }, [])

  type TFilter = Record<TLocationFilter, FilterValue | null>

  const handleTableChange: TableProps<ILocation>['onChange'] = (pagination, filters: TFilter, sorter) => {
    const newOffset = (pagination?.current && (pagination?.current - 1) * (pagination?.pageSize || 10)) || 0
    const newLimit = pagination?.pageSize || 10

    setTableParams({
      pagination: {
        ...pagination,
        showTotal,
      },
    })

    if (!isAllSelected) {
      setSelectedIds([])
      setShowAdditionalHeader(false)
    }

    const fieldMap = {
      name: 'name',
      city: 'city',
      state: 'state',
      zipCode: 'zip_code',
      address: 'address',
    }

    const requestParams: TListLocationRequestParams = {
      offset: newOffset,
      limit: newLimit,
      ordering: getTableSortField<ILocation>(sorter, fieldMap),
      name: (filters?.['name']?.[0] as string) ?? undefined,
      city: (filters?.['city']?.[0] as string) ?? undefined,
      state: filters?.['state'] ? filters?.['state'] : undefined,
      zipCode: (filters?.['zipCode']?.[0] as string) ?? undefined,
      address: (filters?.['address']?.[0] as string) ?? undefined,
    }

    listLocations(requestParams)

    setPaginationParams({
      offset: requestParams.offset || 0,
      limit: requestParams.limit || 10,
      ordering: requestParams.ordering || undefined,
    })
  }

  return (
    <TableStyled
      objTerm="locations"
      columns={columns}
      dataSource={locations}
      onChange={handleTableChange}
      loading={isFetching || isLoading}
      pagination={pagination}
      showCreated={showCreatedRecords}
      createdIds={createdIds || []}
    />
  )
}

const TableStyled = styled(MonroeTable<ILocation>)`
  & tbody .ant-table-column-sort {
      background-color: ${colors.secondaryLight} !important;
  }
`
