import { Flex, Table } from 'antd'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES } from '@/pages/Protected/Users/constants/roles'
import { useUsersBulkEditTableParams } from '@/pages/Protected/Users/hooks/useUsersBulkEditTableParams'

import { CreateNewEntityButton, MonroeSecondaryButton, PageContainer, ProtectedPageTitle } from '@/components/Elements'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useBulkEditMutation } from '@/redux/user/user.api'

import { PATH_TO_BULK_EDIT_USER_ERRORS, PATH_TO_USERS } from '@/constants/paths'

import { IRole } from '@/common/interfaces/user'
import { TRole } from '@/common/types'

const ROLES_WITH_TEAMS: TRole[] = ['Head Coach', 'Coach', 'Player', 'Team Admin']

const UsersBulkEdit = () => {
  const { columns } = useUsersBulkEditTableParams()
  const { selectedRecords, setEditUsersErrors } = useUserSlice()
  const navigation = useNavigate()
  const [bulkEdit] = useBulkEditMutation()
  const { setAppNotification } = useAppSlice()

  const isDisabledSaveChangesBtn = !!selectedRecords
    .flatMap((record) =>
      record.userRoles.filter((role) => {
        if (
          (ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole) &&
            !role?.linkedEntities?.length) ||
          !role.name
        )
          return true

        return false
      }),
    )
    .filter((i) => !!i)?.length

  const handleSave = () => {
    const editRolesData = selectedRecords.map((record) => ({
      id: record.id,
      roles: record.userRoles
        .filter((role) => !['Child', 'Parent'].includes(role.name))
        .flatMap((role) => {
          if (ROLES_WITH_TEAMS.includes(role.name as TRole)) {
            return role!.linkedEntities!.map(
              (linkedEntity) =>
                ({
                  role: role.name,
                  team_id: linkedEntity?.id || '',
                }) as IRole,
            )
          }

          if (role.name === 'Operator') {
            return {
              role: role.name,
              operator_id: role.linkedEntities?.[0].id,
            } as IRole
          }

          if (role.name === 'Master Admin') {
            return {
              role: 'Swift Schedule Master Admin',
            } as unknown as IRole
          }

          return {
            role: role.name,
          } as IRole
        }),
    }))

    bulkEdit(editRolesData)
      .unwrap()
      .then((response) => {
        const { failed, status, total } = response

        if (status === 'green') {
          navigation(PATH_TO_USERS)
          setAppNotification({
            message: total > 1 ? 'Users successfully updated' : 'User successfully updated',
            type: 'success',
          })
        } else {
          setEditUsersErrors(failed)
          navigation(PATH_TO_BULK_EDIT_USER_ERRORS)
        }
      })
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

              <CreateNewEntityButton
                iconPosition="start"
                type="primary"
                onClick={handleSave}
                disabled={isDisabledSaveChangesBtn}
              >
                Save changes
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

