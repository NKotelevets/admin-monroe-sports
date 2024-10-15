import { Breadcrumb, GetProp, Table, TableProps } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { useUsersBulkEditErrorsTableParams } from '@/pages/Protected/Users/hooks/useUsersBulkEditErrorsTableParams'

import { MonroeBlueText, PageContainer } from '@/components/Elements'
import { Description, Title } from '@/components/Elements/deletingBlockingInfoElements'

import BaseLayout from '@/layouts/BaseLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { PATH_TO_USERS, PATH_TO_USERS_BULK_EDIT } from '@/common/constants/paths'
import { IBulkEditError } from '@/common/interfaces/user'

const BREAD_CRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_USERS}>Users</a>,
  },
  {
    title: <a href={PATH_TO_USERS_BULK_EDIT}>Bulk edit</a>,
  },
  {
    title: <MonroeBlueText>Bulk edit error info</MonroeBlueText>,
  },
]

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>
interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IBulkEditError>['field']
  sortOrder?: SorterResult<IBulkEditError>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const BulkEditErrors = () => {
  const { editUsersErrors } = useUserSlice()
  const navigation = useNavigate()
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
    },
  })
  const { columns } = useUsersBulkEditErrorsTableParams({
    tableParams,
  })

  const handleTableChange: TableProps<IBulkEditError>['onChange'] = (pagination, filters, sorter) =>
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

  useEffect(() => {
    if (!editUsersErrors.length) navigation(PATH_TO_USERS)
  }, [])

  return (
    <>
      <Helmet>
        <title>Users | Bulk Edit</title>
      </Helmet>

      <BaseLayout>
        <PageContainer>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />

          <Title>Bulk edit error info</Title>

          <Description>
            This panel provides a summary of bulk edit errors, listing the rows with errors. All changes that are not
            marked with an error have been changed.
          </Description>

          <Table
            columns={columns}
            rowKey={(record) => `${record.id}/${Math.random()}`}
            dataSource={editUsersErrors}
            onChange={handleTableChange}
            scroll={{
              x: 1000,
            }}
          />
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default BulkEditErrors

