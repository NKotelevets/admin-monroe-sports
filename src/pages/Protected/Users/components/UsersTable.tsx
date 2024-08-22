import { GetProp } from 'antd'
import Table from 'antd/es/table'
import { TableProps } from 'antd/es/table/InternalTable'
import { SorterResult } from 'antd/es/table/interface'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useUsersTableParams } from '@/pages/Protected/Users/hooks/useUsersTableParams'

import { ExpandedHeaderLeftText, ExpandedTableHeader, MonroeBlueText, MonroeLightBlueText } from '@/components/Elements'
import MonroeModal from '@/components/MonroeModal'

import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useLazyGetUsersQuery } from '@/redux/user/user.api'

import { IFEUser } from '@/common/interfaces/user'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IFEUser>['field']
  sortOrder?: SorterResult<IFEUser>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const showTotal = (total: number) => <MonroeBlueText>Total {total} items</MonroeBlueText>

interface ISeasonsTableTableProps {
  setSelectedRecordsIds: Dispatch<SetStateAction<string[]>>
  selectedRecordIds: string[]
  showAdditionalHeader: boolean
  setShowAdditionalHeader: Dispatch<SetStateAction<boolean>>
  isBlockAllUsers: boolean
  setIsDeleteAllRecords: Dispatch<SetStateAction<boolean>>
  showCreatedRecords: boolean
}

const UsersTable: FC<ISeasonsTableTableProps> = ({
  isBlockAllUsers,
  selectedRecordIds,
  setIsDeleteAllRecords,
  setSelectedRecordsIds,
  setShowAdditionalHeader,
  showAdditionalHeader,
  // showCreatedRecords,
}) => {
  const { limit, offset, setPaginationParams, total, users, setRecords } = useUserSlice()
  const [getUsers, { isLoading, isFetching, data }] = useLazyGetUsersQuery()
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: offset + 1,
      pageSize: limit,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: total,
      showTotal,
    },
  })
  const [showBlockSingleUserModal, setShowBlockSingleUserModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSelectedRecordId] = useState('')
  const { columns } = useUsersTableParams({
    setSelectedRecordId,
    setShowDeleteSingleRecordModal: setShowBlockSingleUserModal,
  })

  useEffect(() => {
    setPaginationParams({
      offset,
      limit,
      ordering: '',
    })

    getUsers({
      limit,
      offset,
    })
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

    if (isBlockAllUsers && data?.data.length) {
      const recordIds = data?.data.map((s) => s.id)
      setSelectedRecordsIds((prev) => [...prev, ...recordIds])
    }
  }, [data])

  const handleTableChange: TableProps['onChange'] = (pagination, _, sorter) => {
    const newOffset = (pagination?.current && (pagination?.current - 1) * (pagination?.pageSize || 10)) || 0
    const newLimit = pagination?.pageSize || 10
    setTableParams({
      pagination: {
        ...pagination,
        showTotal,
      },
    })

    if (!isBlockAllUsers) {
      setSelectedRecordsIds([])
      setShowAdditionalHeader(false)
    }

    const orderingValue = Array.isArray(sorter)
      ? ''
      : sorter.order
        ? sorter.order === 'ascend'
          ? 'birth_date'
          : '-birth_date'
        : ''

    getUsers({
      offset: newOffset,
      limit: newLimit,
      ordering: orderingValue,
    })

    setPaginationParams({
      offset: newOffset,
      limit: newLimit,
      ordering: `${orderingValue}`,
    })
  }

  const handleBlock = () => {}

  return (
    <>
      {showBlockSingleUserModal && (
        <MonroeModal
          okText="Block"
          onCancel={() => setShowBlockSingleUserModal(false)}
          onOk={handleBlock}
          title="Block user?"
          type="warn"
          content={<p>Are you sure you want to block this user?</p>}
        />
      )}

      {showAdditionalHeader && (
        <ExpandedTableHeader>
          <ExpandedHeaderLeftText>
            {isBlockAllUsers
              ? `All ${total} users are selected.`
              : `All ${tableParams.pagination?.pageSize} users on this page are selected.`}
          </ExpandedHeaderLeftText>

          {!isBlockAllUsers ? (
            <MonroeLightBlueText onClick={() => setIsDeleteAllRecords(true)}>
              Select all {total} users instead.
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

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={users}
        pagination={tableParams.pagination}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        // rowClassName={(record) =>
        //   showCreatedRecords && createdRecordsNames.find((cRN) => cRN.name === record.name) ? 'highlighted-row' : ''
        // }
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRecordIds,
          onChange: (selected, selectedRows) => {
            if (isBlockAllUsers) return
            if (selected.length === limit) setShowAdditionalHeader(true)
            if (selected.length < limit) setShowAdditionalHeader(false)
            setSelectedRecordsIds(selected as string[])
            if (!selected.length && showAdditionalHeader && isBlockAllUsers) setIsDeleteAllRecords(false)
            setRecords(selectedRows)
          },
        }}
        scroll={{
          x: 1000,
        }}
      />
    </>
  )
}

export default UsersTable

