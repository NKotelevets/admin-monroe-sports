import { GetProp } from 'antd'
import Table from 'antd/es/table'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useUsersTableParams } from '@/pages/Protected/Users/hooks/useUsersTableParams'

import { ExpandedHeaderLeftText, ExpandedTableHeader, MonroeBlueText, MonroeLightBlueText } from '@/components/Elements'
import MonroeModal from '@/components/MonroeModal'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useBulkBlockUsersMutation, useBulkEditMutation, useLazyGetUsersQuery } from '@/redux/user/user.api'

import { calculateAllUserRoles } from '@/utils/user'

import { IBulkEditFEUser, IExtendedFEUser } from '@/common/interfaces/user'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IExtendedFEUser>['field']
  sortOrder?: SorterResult<IExtendedFEUser>['order']
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
      current: offset / limit + 1,
      pageSize: limit,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: total,
      showTotal,
    },
  })
  const [showBlockSingleUserModal, setShowBlockSingleUserModal] = useState(false)
  const [showUnBlockSingleUserModal, setShowUnBlockSingleUserModal] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState('')
  const { columns } = useUsersTableParams({
    setSelectedRecordId,
    setShowBlockSingleUserModal,
    setShowUnBlockSingleUserModal,
  })
  const [blockUser] = useBulkBlockUsersMutation()
  const { setAppNotification } = useAppSlice()
  const [bulkEdit] = useBulkEditMutation()

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

  type TFilter = Record<'firstName' | 'lastName' | 'gender' | 'roles' | 'teams', FilterValue | null>

  const handleTableChange: TableProps<IExtendedFEUser>['onChange'] = (pagination, filters: TFilter, sorter) => {
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
        : undefined

    const firstName = (filters?.['firstName']?.[0] as string) ?? undefined
    const lastName = (filters?.['lastName']?.[0] as string) ?? undefined
    const gender = filters?.['gender']?.[0] as string
    const roles =
      filters?.['roles']?.length === 1 ? (filters?.['roles'][0] as string) : (filters?.['roles']?.join(',') as string)
    const team = filters?.['teams']?.[0] as string

    getUsers({
      offset: newOffset,
      limit: newLimit,
      ordering: orderingValue,
      first_name: firstName,
      last_name: lastName,
      gender,
      role: roles,
      team,
    })

    setPaginationParams({
      offset: newOffset,
      limit: newLimit,
      ordering: orderingValue,
    })
  }

  const handleBlockSingleUser = () => {
    blockUser([selectedRecordId])
      .unwrap()
      .then((response) => {
        setShowBlockSingleUserModal(false)

        if (response.status !== 'green') {
          setAppNotification({
            message: response.items[0].warning,
            timestamp: new Date().getTime(),
            type: 'error',
          })

          return
        }

        if (response.status === 'green') {
          setAppNotification({
            message: 'User have been successfully blocked.',
            timestamp: new Date().getTime(),
            type: 'success',
          })
        }
      })
  }

  const handleUnblockSingleUser = () => {
    bulkEdit([
      {
        id: selectedRecordId,
        is_active: true,
      },
    ])
      .unwrap()
      .then((response) => {
        if (response.status === 'green') {
          setAppNotification({
            message: 'User have been successfully unblocked.',
            timestamp: new Date().getTime(),
            type: 'success',
          })
        } else {
          setAppNotification({
            message: 'Something went wrong',
            timestamp: new Date().getTime(),
            type: 'error',
          })
        }
      })
      .catch(() => {
        setAppNotification({
          message: 'Something went wrong',
          timestamp: new Date().getTime(),
          type: 'error',
        })
      })
      .finally(() => {
        setShowUnBlockSingleUserModal(false)
      })
  }

  return (
    <>
      {showUnBlockSingleUserModal && (
        <MonroeModal
          okText="Unblock"
          onCancel={() => setShowUnBlockSingleUserModal(false)}
          onOk={handleUnblockSingleUser}
          title="Unblock user?"
          type="warn"
          content={<p>Are you sure you want to unblock this user?</p>}
        />
      )}

      {showBlockSingleUserModal && (
        <MonroeModal
          okText="Block"
          onCancel={() => setShowBlockSingleUserModal(false)}
          onOk={handleBlockSingleUser}
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

            const updatedSelectedRows: IBulkEditFEUser[] = selectedRows.map((row) => ({
              ...row,
              userRoles: calculateAllUserRoles(row),
            }))

            setRecords(updatedSelectedRows)
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

