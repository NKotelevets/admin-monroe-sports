import { Flex, Table } from 'antd'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { useUsersBulkEditTableParams } from '@/pages/Protected/Users/hooks/useUsersBulkEditTableParams'

import { CreateNewEntityButton, MonroeSecondaryButton, PageContainer, ProtectedPageTitle } from '@/components/Elements'

import BaseLayout from '@/layouts/BaseLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useBulkEditMutation } from '@/redux/user/user.api'

import { PATH_TO_USERS } from '@/constants/paths'

import { IRole } from '@/common/interfaces/user'
import { TRole } from '@/common/types'

const ROLES_WITH_TEAMS: TRole[] = ['Head Coach', 'Coach', 'Player', 'Team Admin']

const UsersBulkEdit = () => {
  const { columns } = useUsersBulkEditTableParams()
  const { selectedRecords } = useUserSlice()
  const defaultSelectedRecordsIds = selectedRecords.map((sR) => sR.id)
  const navigation = useNavigate()
  const [bulkEdit] = useBulkEditMutation()

  const handleSave = () => {
    const editRolesData = selectedRecords.map((record) => ({
      id: record.id,
      roles: record.userRoles.flatMap((role) => {
        if (ROLES_WITH_TEAMS.includes(role.name as TRole)) {
          return role!.linkedEntities!.map(
            (linkedEntity) =>
              ({
                role: role.name,
                team_id: linkedEntity.id,
              }) as IRole,
          )
        }

        if (role.name === 'Operator') {
          return {
            role: role.name,
            operator_id: role.linkedEntities?.[0].id,
          } as IRole
        }

        return {
          role: role.name,
        } as IRole
      }),
    }))

    bulkEdit(editRolesData)
      .unwrap()
      .then(() => {})
  }

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
              <MonroeSecondaryButton type="default" iconPosition="start" onClick={() => navigation(PATH_TO_USERS)}>
                Cancel
              </MonroeSecondaryButton>

              <CreateNewEntityButton iconPosition="start" type="primary" onClick={handleSave}>
                Save changes
              </CreateNewEntityButton>
            </Flex>
          </Flex>

          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={selectedRecords}
            rowSelection={{
              type: 'checkbox',
              defaultSelectedRowKeys: defaultSelectedRecordsIds,
              hideSelectAll: true,
              getCheckboxProps: () => ({
                disabled: true,
                className: 'checkbox-disable',
              }),
            }}
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

