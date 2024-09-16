// import type { GetProp, TableProps } from 'antd'
// import { Table } from 'antd'
// import type { SorterResult } from 'antd/es/table/interface'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useMasterTeamsTable } from '@/pages/Protected/MasterTeams/hooks/useMasterTeamsTable'

import {
  ExpandedHeaderLeftText,
  ExpandedTableHeader, //  MonroeBlueText,
  MonroeLightBlueText,
} from '@/components/Elements'
import MonroeModal from '@/components/MonroeModal'

import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import { useLazyGetMasterTeamsQuery, useMasterTeamsDeleteRecordMutation } from '@/redux/masterTeams/masterTeams.api'

// import { IFELeague } from '@/common/interfaces/league'

// type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

// interface ITableParams {
//   pagination?: TTablePaginationConfig
//   sortField?: SorterResult<IFELeague>['field']
//   sortOrder?: SorterResult<IFELeague>['order']
//   filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
// }

interface IMasterTeamsTableProps {
  setSelectedRecordsIds: Dispatch<SetStateAction<string[]>>
  selectedRecordIds: string[]
  showAdditionalHeader: boolean
  setShowAdditionalHeader: Dispatch<SetStateAction<boolean>>
  isDeleteAllRecords: boolean
  setIsDeleteAllRecords: Dispatch<SetStateAction<boolean>>
  showCreatedRecords: boolean
}

// const showTotal = (total: number) => <MonroeBlueText>Total {total} items</MonroeBlueText>

const MasterTeamsTable: FC<IMasterTeamsTableProps> = ({
  setSelectedRecordsIds,
  // selectedRecordIds,
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
    // masterTeams,
  } = useMasterTeamsSlice()

  const [getMasterTeams] = useLazyGetMasterTeamsQuery()
  // const [_, setTableParams] = useState<ITableParams>({
  //   pagination: {
  //     current: offset / limit + 1,
  //     pageSize: limit,
  //     pageSizeOptions: [5, 10, 30, 50],
  //     showQuickJumper: true,
  //     showSizeChanger: true,
  //     total: data?.count,
  //     showTotal,
  //   },
  // })
  const [showDeleteSingleRecordModal, setShowDeleteSingleRecordModal] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState('')
  const [deleteRecord] = useMasterTeamsDeleteRecordMutation()
  useMasterTeamsTable({
    setSelectedRecordId,
    setShowDeleteSingleRecordModal,
  })

  const handleDelete = () =>
    deleteRecord(selectedRecordId)
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

  // useEffect(() => {
  //   if (data?.count) {
  //     setTableParams((params) => ({
  //       pagination: {
  //         ...params.pagination,
  //         total: data.count,
  //         showTotal,
  //       },
  //     }))
  //   }

  //   if (isDeleteAllRecords && data?.leagues.length) {
  //     const recordIds = data?.leagues.map((league) => league.id)
  //     setSelectedRecordsIds((prev) => [...prev, ...recordIds])
  //   }
  // }, [data, isDeleteAllRecords])

  // const handleTableChange: TableProps['onChange'] = (pagination, _, sorter) => {
  //   const newOffset = (pagination?.current && (pagination?.current - 1) * (pagination?.pageSize || 10)) || 0
  //   const newLimit = pagination?.pageSize || 10
  //   setTableParams({
  //     pagination: {
  //       ...pagination,
  //       showTotal,
  //     },
  //   })

  //   if (!isDeleteAllRecords) {
  //     setSelectedRecordsIds([])
  //     setShowAdditionalHeader(false)
  //   }

  //   const getLeaguesParams = {
  //     offset: newOffset,
  //     limit: newLimit,
  //     order_by: !Array.isArray(sorter) && sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : undefined,
  //   }

  //   getMasterTeams(getLeaguesParams)

  //   setPaginationParams({
  //     offset: newOffset,
  //     limit: newLimit,
  //     ordering: !Array.isArray(sorter) && sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : null,
  //   })
  // }

  return (
    <>
      {showDeleteSingleRecordModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteSingleRecordModal(false)}
          onOk={handleDelete}
          title="Delete league/tournament?"
          type="warn"
          content={<p>Are you sure you want to delete this league/tournament?</p>}
        />
      )}

      {showAdditionalHeader && (
        <ExpandedTableHeader>
          <ExpandedHeaderLeftText>
            {isDeleteAllRecords
              ? `All ${total} records are selected.`
              : `All ${limit} records on this page are selected.`}
          </ExpandedHeaderLeftText>

          {!isDeleteAllRecords ? (
            <MonroeLightBlueText onClick={() => setIsDeleteAllRecords(true)}>
              Select all {total} records in Leagues/Tournaments instead.
            </MonroeLightBlueText>
          ) : (
            <MonroeLightBlueText
              onClick={() => {
                setIsDeleteAllRecords(false)
                setSelectedRecordsIds([])
                setShowAdditionalHeader(false)
              }}
            >
              Unselect all records
            </MonroeLightBlueText>
          )}
        </ExpandedTableHeader>
      )}

      {/* <Table
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
      /> */}
    </>
  )
}

export default MasterTeamsTable

