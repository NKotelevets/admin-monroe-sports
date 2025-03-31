import type { GetProp, TableProps } from 'antd'
import { Table } from 'antd'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useMasterTeamsTable } from '@/pages/Protected/MasterTeams/hooks/useMasterTeamsTable'

import { ExpandedHeaderLeftText, ExpandedTableHeader, MonroeLightBlueText } from '@/components/Elements'
import MonroeModal from '@/components/MonroeModal'

import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import { useDeleteMasterTeamMutation, useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api'

import { IFEMasterTeam, IGetMasterTeamsRequest } from '@/common/interfaces/masterTeams'
import { showTotal } from '@/components/Table/utils.tsx'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>
type TFilterValueKey = 'name' | 'headCoachFullName' | 'teamAdminFullName' | 'league_name'

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IFEMasterTeam>['field']
  sortOrder?: SorterResult<IFEMasterTeam>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

interface IMasterTeamsTableProps {
  setSelectedRecordsIds: Dispatch<SetStateAction<string[]>>
  selectedRecordIds: string[]
  showAdditionalHeader: boolean
  setShowAdditionalHeader: Dispatch<SetStateAction<boolean>>
  isDeleteAllRecords: boolean
  setIsDeleteAllRecords: Dispatch<SetStateAction<boolean>>
  showCreatedRecords: boolean
}

const MasterTeamsTable: FC<IMasterTeamsTableProps> = ({
  setSelectedRecordsIds,
  selectedRecordIds,
  setShowAdditionalHeader,
  showAdditionalHeader,
  setIsDeleteAllRecords,
  isDeleteAllRecords,
  showCreatedRecords,
}) => {
  const {
    createdRecordsNames,
    limit,
    offset,
    total,
    ordering,
    removeCreatedRecordsNames,
    setPaginationParams,
    masterTeams,
  } = useMasterTeamsSlice()

  const [getMasterTeams, { isLoading, isFetching, data }] = useLazyGetMasterTeamsQuery()
  const [showDeleteSingleRecordModal, setShowDeleteSingleRecordModal] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState('')
  const [deleteMT] = useDeleteMasterTeamMutation()
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: offset / limit + 1,
      pageSize: limit,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total,
      showTotal,
    },
  })

  const { columns } = useMasterTeamsTable({
    setSelectedRecordId,
    setShowDeleteSingleRecordModal,
  })

  useEffect(() => {
    setPaginationParams({
      offset,
      limit,
      ordering: null,
    })

    getMasterTeams({
      limit,
      offset,
      ordering: ordering || undefined,
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
          total,
          showTotal,
        },
      }))
    }

    if (isDeleteAllRecords && data?.results.length) {
      const recordIds = data?.results.map((mT) => mT.id)
      setSelectedRecordsIds((prev) => [...prev, ...recordIds])
    }
  }, [data, isDeleteAllRecords])

  const handleDelete = () =>
    deleteMT(selectedRecordId)
      .unwrap()
      .then(() => {
        setShowDeleteSingleRecordModal(false)
        setSelectedRecordId('')
      })
      .catch(() => setShowDeleteSingleRecordModal(false))


  type TFilter = Record<TFilterValueKey, FilterValue | null>
  const handleTableChange: TableProps<IFEMasterTeam>['onChange'] = (pagination, filters: TFilter, sorter) => {
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

    const getBESortingField = (name: string) => {
      if (name === 'headCoachFullName') return 'head_coach'
      if (name === 'teamAdmins') return 'team_admins'
      if (name === 'leagues') return 'league_name'
      return name
    }

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
      team_admins: (filters?.['teamAdminFullName']?.[0] as string) ?? undefined,
      league_name: (filters?.['league_name']?.[0] as string) ?? undefined,
    }

    getMasterTeams(getMasterTeamsParams)

    setPaginationParams({
      offset: getMasterTeamsParams.offset,
      limit: getMasterTeamsParams.limit,
      ordering: getMasterTeamsParams.ordering || null,
    })
  }

  return (
    <>
      {showDeleteSingleRecordModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteSingleRecordModal(false)}
          onOk={handleDelete}
          title="Delete master team?"
          type="warn"
          content={<p>Are you sure you want to delete this master team?</p>}
        />
      )}

      {showAdditionalHeader && (
        <ExpandedTableHeader>
          <ExpandedHeaderLeftText>
            {isDeleteAllRecords
              ? `All ${total} master teams are selected.`
              : `All ${limit} master teams on this page are selected.`}
          </ExpandedHeaderLeftText>

          {!isDeleteAllRecords ? (
            <MonroeLightBlueText onClick={() => setIsDeleteAllRecords(true)}>
              Select all {total} master teams instead.
            </MonroeLightBlueText>
          ) : (
            <MonroeLightBlueText
              onClick={() => {
                setIsDeleteAllRecords(false)
                setSelectedRecordsIds([])
                setShowAdditionalHeader(false)
              }}
            >
              Unselect all master teams
            </MonroeLightBlueText>
          )}
        </ExpandedTableHeader>
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={masterTeams}
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

export default MasterTeamsTable

