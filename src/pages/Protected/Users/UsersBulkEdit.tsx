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

import {
  CHILD_ROLE,
  COACH_ROLE,
  HEAD_COACH_ROLE,
  MASTER_ADMIN_ROLE,
  OPERATOR_ROLE,
  PARENT_ROLE,
  PLAYER_ROLE,
  TEAM_ADMIN_ROLE
} from '@/common/constants'
import { PATH_TO_BULK_EDIT_USER_ERRORS, PATH_TO_USERS } from '@/common/constants/paths'
import { IBulkEditFEUser, IRole } from '@/common/interfaces/user'
import { TRole } from '@/common/types'
import { useNotification } from '@/hooks/useNotification.ts'
import styled from '@emotion/styled'

const ROLES_WITH_TEAMS: TRole[] = [HEAD_COACH_ROLE, COACH_ROLE, PLAYER_ROLE, TEAM_ADMIN_ROLE]
const DEFAULT_ERROR_MESSAGE = 'Unable to save changes. Please, try again!'

const UsersBulkEdit = () => {
  const navigation = useNavigate()
  const { columns } = useUsersBulkEditTableParams()
  const { selectedRecords, setEditUsersErrors } = useUserSlice()
  const { setAppNotification } = useAppSlice()
  const { notify, info } = useNotification()

  const [bulkEdit] = useBulkEditMutation()

  const isDisabledSaveChangesBtn = !!selectedRecords
    .flatMap((record) =>
      record.userRoles.filter((role) => {
        return (ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole) &&
            !role?.linkedEntities?.length) ||
          !role.name
      })
    )
    .filter((i) => !!i)?.length

  const handleSave = () => {
    const editRolesData = selectedRecords.map((record) => ({
      id: record.id,
      roles: record.userRoles
        .filter((role) => ![CHILD_ROLE, PARENT_ROLE].includes(role.name))
        .flatMap((role) => {
          if (ROLES_WITH_TEAMS.includes(role.name as TRole)) {
            return role!.linkedEntities!.map(
              (linkedEntity) =>
                ({
                  role: role.name,
                  team_id: linkedEntity?.id || ''
                }) as IRole
            )
          }

          if (role.name === OPERATOR_ROLE) {
            return {
              role: role.name,
              operator_id: role.linkedEntities?.[0].id
            } as IRole
          }

          if (role.name === MASTER_ADMIN_ROLE) {
            return {
              role: 'Swift Schedule Master Admin'
            } as unknown as IRole
          }

          return {
            role: role.name
          } as IRole
        })
    }))

    bulkEdit(editRolesData)
      .unwrap()
      .then((response) => {
        const { failed, status, total } = response

        if (status === 'green' && !failed.length) {
          navigation(PATH_TO_USERS)
          setAppNotification({
            message: total > 1 ? 'Users successfully updated' : 'User successfully updated',
            type: 'success'
          })
        } else {
          const errorData = failed.map((fail, index) => ({
            ...fail,
            first_name: selectedRecords[index].firstName,
            last_name: selectedRecords[index].lastName,
            gender: selectedRecords[index].gender,
          }))

          setEditUsersErrors(errorData)
          info(
            'Show Info',
            total > 1 ? 'One or more users could not be updated' : 'The user could not be updated',
            PATH_TO_BULK_EDIT_USER_ERRORS
          )
        }
      })
      .catch((error) => {
        notify(
          error?.data?.error || DEFAULT_ERROR_MESSAGE,
          'error'
        )
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

          <TableStyled
            columns={columns}
            pagination={false}
            rowKey={(record) => record.id}
            dataSource={selectedRecords}
            scroll={{
              x: 1000
            }}
          />
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default UsersBulkEdit

const TableStyled = styled(Table<IBulkEditFEUser>)`
    & .ant-table-content {
        overflow: unset !important;
    }
`
