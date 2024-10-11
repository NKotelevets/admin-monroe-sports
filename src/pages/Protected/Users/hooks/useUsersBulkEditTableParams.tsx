import OperatorsInput from '../components/OperatorsInput'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import { TableProps } from 'antd/es/table/InternalTable'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { AddRoleButton } from '@/pages/Protected/Seasons/components/Elements'
import { ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES, ROLES } from '@/pages/Protected/Users/constants/roles'

import MasterTeamsMultipleSelectWithSearch from '@/components/MasterTeamsMultipleSelectWithSearch'
import MonroeSelect from '@/components/MonroeSelect'
import MonroeTooltip from '@/components/MonroeTooltip'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { PATH_TO_USERS } from '@/constants/paths'

import { IFERole } from '@/common/interfaces/role'
import { IBulkEditFEUser } from '@/common/interfaces/user'
import { TRole } from '@/common/types'

import DeleteIcon from '@/assets/icons/delete.svg'

type TColumns<T> = TableProps<T>['columns']

export const useUsersBulkEditTableParams = () => {
  const navigate = useNavigate()
  const { setRecords, selectedRecords } = useUserSlice()
  const { user } = useUserSlice()
  const isOperatorWithoutAdmin = !!user?.operator && !user.isSuperuser

  const columns: TColumns<IBulkEditFEUser> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      fixed: 'left',
      width: '240px',
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      fixed: 'left',
      width: '240px',
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'userRoles',
      width: '540px',
      render: (_, record) => {
        const existingRoles = record.userRoles.map((role) => role.name)
        const options: DefaultOptionType[] = ROLES.filter((initialRole) => !existingRoles.includes(initialRole)).map(
          (role) => ({
            label: role,
            value: role,
          }),
        )
        const isSameUser = user?.id === record.id
        const MAX_CREATED_ROLES_BY_ADMIN = 6
        const MAX_CREATED_ROLES_BY_OPERATOR = 4
        const userAdminRoles = user?.roles.filter((role) => ['Operator', 'Master Admin'].includes(role)).length
        const maximumRoles = user?.isSuperuser
          ? MAX_CREATED_ROLES_BY_ADMIN
          : userAdminRoles
            ? MAX_CREATED_ROLES_BY_OPERATOR + userAdminRoles
            : MAX_CREATED_ROLES_BY_OPERATOR
        const isDisabledAddRoleButton =
          !!record.userRoles
            .filter((role) => {
              if (
                (ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole) &&
                  !role?.linkedEntities?.length) ||
                !role.name
              )
                return true

              return false
            })
            .filter((i) => !!i)?.length || maximumRoles === record.userRoles.length

        const handleChangeRole = (oldRole: string, newRole: string) => {
          const updatedRecord: IBulkEditFEUser = {
            ...record,
            userRoles: record.userRoles.map((role) => {
              if (role.name === oldRole) {
                return {
                  ...role,
                  name: newRole,
                } as IFERole
              }

              return role
            }),
          }

          const updatedRecords = selectedRecords.map((selectedRecord) => {
            if (selectedRecord.id === record.id) {
              return updatedRecord
            }

            return selectedRecord
          })

          setRecords(updatedRecords)
        }

        const handleDeleteRole = (roleName: string) => {
          const updatedRecord: IBulkEditFEUser = {
            ...record,
            userRoles: record.userRoles.filter((role) => role.name !== roleName),
          }

          const updatedRecords = selectedRecords.map((selectedRecord) => {
            if (selectedRecord.id === record.id) {
              return updatedRecord
            }

            return selectedRecord
          })

          setRecords(updatedRecords)
        }

        const handleAddRole = () => {
          const updatedRecords = selectedRecords.map((selectedRecord) => {
            if (selectedRecord.id === record.id) {
              return {
                ...selectedRecord,
                userRoles: [...selectedRecord.userRoles, { name: '', linkedEntities: [] }],
              }
            }

            return selectedRecord
          })

          setRecords(updatedRecords)
        }

        const handleChangeData = (
          roleName: string,
          teams: {
            id: string
            name: string
          }[],
        ) => {
          const updatedRecord: IBulkEditFEUser = {
            ...record,
            userRoles: record.userRoles.map((role) => {
              if (role.name === roleName) {
                return {
                  ...role,
                  linkedEntities: teams,
                } as IFERole
              }

              return role
            }),
          }

          const updatedRecords = selectedRecords.map((selectedRecord) => {
            if (selectedRecord.id === record.id) {
              return updatedRecord
            }

            return selectedRecord
          })

          setRecords(updatedRecords)
        }

        return (
          <Flex
            vertical
            justify="flex-start"
            style={{
              height: '100%',
            }}
          >
            {record.userRoles.map((role) => {
              const isOperator = role.name === 'Operator'
              const operatorObject = {
                id: role.linkedEntities?.[0]?.id || '',
                name: role.linkedEntities?.[0]?.name || '',
              }
              const isRoleWithTeams = ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole)
              const isHideDeleteBtn =
                ['Parent', 'Child'].includes(role.name) ||
                !!(isOperatorWithoutAdmin && role.name === 'Operator') ||
                (role.name === 'Head Coach' && record.asHeadCoach?.length)

              return (
                <Flex
                  style={{
                    marginBottom: '20px',
                  }}
                  align="start"
                  key={role.name}
                >
                  <Flex
                    style={{
                      marginRight: '16px',
                    }}
                    align="center"
                  >
                    <MonroeSelect
                      options={options}
                      onChange={(newRole) => handleChangeRole(role.name, newRole)}
                      styles={{ width: '170px' }}
                      value={role.name}
                      disabled={
                        ['Parent', 'Child'].includes(role.name) ||
                        !!(isOperatorWithoutAdmin && role.name === 'Operator') ||
                        (isSameUser && role.name === 'Master Admin')
                      }
                    />

                    <div
                      style={{
                        marginLeft: '8px',
                        overflow: isHideDeleteBtn ? 'hidden' : 'visible',
                        opacity: isHideDeleteBtn ? 0 : 1,
                        cursor: isHideDeleteBtn ? 'default' : 'pointer',
                      }}
                      onClick={() => {
                        if (!isHideDeleteBtn) {
                          handleDeleteRole(role.name)
                        }
                      }}
                    >
                      <ReactSVG src={DeleteIcon} />
                    </div>
                  </Flex>

                  {isRoleWithTeams && (
                    <div
                      style={{
                        width: '100%',
                      }}
                    >
                      <MasterTeamsMultipleSelectWithSearch
                        onChange={(newRole) => handleChangeData(role.name, newRole)}
                        isError={!role?.linkedEntities?.length}
                        selectedTeams={role?.linkedEntities || []}
                        canRemoveTeam={role.name === 'Head Coach'}
                      />
                    </div>
                  )}

                  {!isRoleWithTeams && !isOperator && (
                    <div
                      style={{
                        opacity: 0,
                        visibility: 'hidden',
                        width: '100%',
                        height: '32px',
                      }}
                    />
                  )}

                  {isOperator && (
                    <OperatorsInput
                      isError={!operatorObject.id}
                      setOperator={(value) => {
                        handleChangeData('Operator', value)
                      }}
                      selectedOperator={operatorObject}
                      isHideAddOperatorBtn
                      isDisabled={isOperatorWithoutAdmin}
                    />
                  )}
                </Flex>
              )
            })}

            <MonroeTooltip
              text={
                isDisabledAddRoleButton
                  ? record.userRoles.length === maximumRoles
                    ? `Maximum roles is ${maximumRoles}`
                    : "You can't create role when you have errors in other roles"
                  : ''
              }
              width="220px"
              containerWidth="113px"
            >
              <AddRoleButton
                disabled={isDisabledAddRoleButton}
                onClick={handleAddRole}
                icon={<PlusOutlined />}
                style={{
                  width: '100px',
                }}
              >
                Add role
              </AddRoleButton>
            </MonroeTooltip>
          </Flex>
        )
      },
    },
  ]

  return {
    columns,
  }
}

