import type { GetProp, TableProps } from 'antd'
import { Table, Typography } from 'antd'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useLeagueAndTournamentTableParams } from '@/pages/Protected/LeaguesAndTournaments/hooks/useLeagueAndTournamentTableParams'

import MonroeModal from '@/components/MonroeModal'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useDeleteLeagueMutation, useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api'

import { IFELeague } from '@/common/interfaces/league'

import '../styles.css'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IFELeague>['field']
  sortOrder?: SorterResult<IFELeague>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TFilterValueKey = 'name' | 'playoffFormat' | 'standingsFormat' | 'tiebreakersFormat' | 'type'

interface ILeagueAndTournamentsTableProps {
  setSelectedRecordsIds: Dispatch<SetStateAction<string[]>>
  selectedRecordIds: string[]
  showAdditionalHeader: boolean
  setShowAdditionalHeader: Dispatch<SetStateAction<boolean>>
  isDeleteAllRecords: boolean
  setIsDeleteAllRecords: Dispatch<SetStateAction<boolean>>
  showCreatedRecords: boolean
}

const showTotal = (total: number) => (
  <Typography.Text
    style={{
      color: 'rgba(26, 22, 87) !important',
    }}
  >
    Total {total} items
  </Typography.Text>
)

const LeagueAndTournamentsTable: FC<ILeagueAndTournamentsTableProps> = ({
  setSelectedRecordsIds,
  selectedRecordIds,
  setShowAdditionalHeader,
  showAdditionalHeader,
  setIsDeleteAllRecords,
  isDeleteAllRecords,
  showCreatedRecords,
}) => {
  const {
    setPaginationParams,
    limit,
    offset,
    total,
    leagues,
    order_by,
    createdRecordsNames,
    removeCreatedRecordsNames,
  } = useLeagueSlice()
  const [getLeagues, { isLoading, isFetching, data }] = useLazyGetLeaguesQuery()
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: offset / limit + 1,
      pageSize: limit,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: data?.count,
      showTotal,
    },
  })
  const [showDeleteSingleRecordModal, setShowDeleteSingleRecordModal] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState('')
  const [deleteRecord] = useDeleteLeagueMutation()
  const { columns } = useLeagueAndTournamentTableParams({
    setSelectedRecordId,
    setShowDeleteSingleRecordModal,
  })

  const handleDelete = () =>
    deleteRecord({
      id: selectedRecordId,
    })
      .unwrap()
      .then(() => {
        setShowDeleteSingleRecordModal(false)
        setSelectedRecordId('')
      })
      .catch(() => setShowDeleteSingleRecordModal(false))

  useEffect(() => {
    setPaginationParams({
      offset,
      limit,
      order_by: null,
    })

    getLeagues({
      limit,
      offset,
      order_by: order_by || undefined,
    })

    return () => {
      if (createdRecordsNames.length && showCreatedRecords) {
        removeCreatedRecordsNames()
      }
    }
  }, [])

  useEffect(() => {
    if (data?.count) {
      setTableParams((params) => ({
        pagination: {
          ...params.pagination,
          total: data.count,
          showTotal,
        },
      }))
    }

    if (isDeleteAllRecords && data?.leagues.length) {
      const recordIds = data?.leagues.map((league) => league.id)
      setSelectedRecordsIds((prev) => [...prev, ...recordIds])
    }
  }, [data, isDeleteAllRecords])

  type TFilters = Record<TFilterValueKey, FilterValue | null>

  const handleTableChange: TableProps['onChange'] = (pagination, filters: TFilters, sorter) => {
    const newOffset = (pagination?.current && (pagination?.current - 1) * (pagination?.pageSize || 10)) || 0
    const newLimit = pagination?.pageSize || 10
    setTableParams({
      pagination: {
        ...pagination,
        showTotal,
      },
    })

    if (!isDeleteAllRecords) {
      setSelectedRecordsIds([])
      setShowAdditionalHeader(false)
    }

    const getLeaguesParams = {
      offset: newOffset,
      limit: newLimit,
      league_name: (filters?.['name']?.[0] as string) ?? undefined,
      playoff_format:
        filters?.['playoffFormat']?.length === 2 ? undefined : (filters?.['playoffFormat']?.[0] as string) ?? undefined,
      standings_format:
        filters?.['standingsFormat']?.length === 2
          ? undefined
          : (filters?.['standingsFormat']?.[0] as string) ?? undefined,
      tiebreakers_format:
        filters?.['tiebreakersFormat']?.length === 2
          ? undefined
          : (filters?.['tiebreakersFormat']?.[0] as string) ?? undefined,
      type: filters?.['type']?.length === 2 ? undefined : (filters?.['type']?.[0] as string) ?? undefined,
      order_by: !Array.isArray(sorter) && sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : undefined,
    }

    getLeagues(getLeaguesParams)

    setPaginationParams({
      offset: newOffset,
      limit: newLimit,
      order_by: !Array.isArray(sorter) && sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : null,
    })
  }

  return (
    <>
      {showDeleteSingleRecordModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteSingleRecordModal(false)}
          onOk={handleDelete}
          title="Delete league/tournament?"
          type="warn"
          content={
            <>
              <p>Are you sure you want to delete this league/tournament?</p>
            </>
          }
        />
      )}

      {showAdditionalHeader && (
        <div className="leagues-table-header">
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.85)',
              marginRight: '10px',
            }}
          >
            {isDeleteAllRecords
              ? `All ${total} records are selected.`
              : `All ${limit} records on this page are selected.`}
          </p>

          {!isDeleteAllRecords ? (
            <p
              style={{
                color: '#3E34CA',
                fontSize: '14px',
              }}
              onClick={() => setIsDeleteAllRecords(true)}
            >
              Select all {total} records in Leagues/Tournaments instead.
            </p>
          ) : (
            <p
              style={{
                color: '#3E34CA',
                fontSize: '14px',
              }}
              onClick={() => {
                setIsDeleteAllRecords(false)
                setSelectedRecordsIds([])
                setShowAdditionalHeader(false)
              }}
            >
              Unselect all records
            </p>
          )}
        </div>
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={leagues}
        pagination={tableParams.pagination}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        rowClassName={(record) =>
          showCreatedRecords && createdRecordsNames.includes(record.name) ? 'highlighted-row' : ''
        }
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRecordIds,
          onChange: (selected) => {
            if (isDeleteAllRecords) return
            if (selected.length === limit) setShowAdditionalHeader(true)
            if (selected.length < limit) setShowAdditionalHeader(false)
            setSelectedRecordsIds(selected as string[])
            if (!selected.length && showAdditionalHeader && isDeleteAllRecords) setIsDeleteAllRecords(false)
          },
        }}
        scroll={{
          x: 1000,
        }}
      />
    </>
  )
}

export default LeagueAndTournamentsTable
