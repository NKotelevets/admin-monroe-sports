import { useUsersBulkEditTableParams } from './hooks/useUsersBulkEditTableParams'
import { Flex, Table } from 'antd'
import { Helmet } from 'react-helmet'

import { CreateNewEntityButton, MonroeSecondaryButton, PageContainer, ProtectedPageTitle } from '@/components/Elements'

import BaseLayout from '@/layouts/BaseLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

const UsersBulkEdit = () => {
  const { columns } = useUsersBulkEditTableParams()
  const { selectedRecords } = useUserSlice()

  return (
    <>
      <Helmet>
        <title>Users | Bulk Edit</title>
      </Helmet>

      <BaseLayout>
        <PageContainer>
          <Flex justify="space-between" align="center" vertical={false}>
            <ProtectedPageTitle>Bulk edit</ProtectedPageTitle>

            <Flex>
              <MonroeSecondaryButton type="default" iconPosition="start" onClick={() => {}}>
                Cancel
              </MonroeSecondaryButton>

              <CreateNewEntityButton iconPosition="start" type="primary" onClick={() => {}}>
                Save
              </CreateNewEntityButton>
            </Flex>
          </Flex>

          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={selectedRecords}
            scroll={{
              x: 1000,
            }}
          />
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default UsersBulkEdit

