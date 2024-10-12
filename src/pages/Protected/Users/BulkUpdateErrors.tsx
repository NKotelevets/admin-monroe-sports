import { Breadcrumb, Table } from 'antd'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { useUsersBulkEditErrorsTableParams } from '@/pages/Protected/Users/hooks/useUsersBulkEditErrorsTableParams'

import { MonroeBlueText, PageContainer } from '@/components/Elements'
import { Description, Title } from '@/components/Elements/deletingBlockingInfoElements'

import BaseLayout from '@/layouts/BaseLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { PATH_TO_USERS, PATH_TO_USERS_BULK_EDIT } from '@/common/constants/paths'

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

const BulkEditErrors = () => {
  const { columns } = useUsersBulkEditErrorsTableParams()
  const { editUsersErrors } = useUserSlice()
  const navigation = useNavigate()

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
            rowKey={(record) => record.id}
            dataSource={editUsersErrors}
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

