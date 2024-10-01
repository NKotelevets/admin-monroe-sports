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
import CellText from '@/components/Table/CellText'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { PATH_TO_USERS } from '@/constants/paths'

import { SHORT_GENDER_NAMES } from '@/common/constants'
import { IFERole } from '@/common/interfaces/role'
import { IBulkEditFEUser } from '@/common/interfaces/user'
import { TGender, TRole } from '@/common/types'

import DeleteIcon from '@/assets/icons/delete.svg'

type TColumns<T> = TableProps<T>['columns']

export const useUsersBulkEditTableParams = () => {
  const navigate = useNavigate()
  const { setRecords, selectedRecords } = useUserSlice()

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
      title: '',
      dataIndex: 'gender',
      width: '50px',
      render: (_, record) => <CellText> {SHORT_GENDER_NAMES[record.gender as TGender]}</CellText>,
    },
    {
      title: 'Roles',
      dataIndex: 'userRoles',
      width: '240px',
      render: (_, record) => {
        const existingRoles = record.userRoles.map((role) => role.name)
        const options: DefaultOptionType[] = ROLES.filter((initialRole) => !existingRoles.includes(initialRole)).map(
          (role) => ({
            label: role,
            value: role,
          }),
        )

        const isDisabledAddRoleButton = !!record.userRoles
          .filter((role) => {
            if (
              (ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole) &&
                !role?.linkedEntities?.length) ||
              !role.name
            )
              return true

            return false
          })
          .filter((i) => !!i)?.length

        const handleChangeData = (oldRole: string, newRole: string) => {
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

        return (
          <Flex
            vertical
            justify="flex-start"
            style={{
              height: '100%',
            }}
          >
            {record.userRoles.length
              ? record.userRoles.map((role) => (
                  <Flex
                    key={role.name}
                    style={{
                      marginBottom: '20px',
                    }}
                    align="center"
                  >
                    <MonroeSelect
                      options={options}
                      onChange={(newRole) => handleChangeData(role.name, newRole)}
                      styles={{ width: '100%' }}
                      value={role.name}
                    />

                    <div style={{ marginLeft: '8px' }} onClick={() => handleDeleteRole(role.name)}>
                      <ReactSVG src={DeleteIcon} />
                    </div>
                  </Flex>
                ))
              : '-'}

            <MonroeTooltip
              text={isDisabledAddRoleButton ? "You can't create role when you have errors in other roles" : ''}
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
    {
      title: 'Teams',
      dataIndex: '',
      width: '240px',
      render: (_, record) => {
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
          <Flex vertical>
            {record.userRoles.map((role) => (
              <Flex
                key={role.name}
                style={{
                  marginBottom: '20px',
                }}
              >
                {ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole) ? (
                  <div
                    style={{
                      width: '100%',
                    }}
                  >
                    <MasterTeamsMultipleSelectWithSearch
                      onChange={(newRole) => handleChangeData(role.name, newRole)}
                      isError={!role?.linkedEntities?.length}
                      onBlur={() => {}}
                      selectedTeams={role?.linkedEntities || []}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      opacity: 0,
                      visibility: 'hidden',
                      width: '100%',
                      height: '32px',
                    }}
                  ></div>
                )}
              </Flex>
            ))}

            <button
              style={{
                opacity: 0,
                visibility: 'hidden',
                height: '32px',
              }}
            >
              Add role
            </button>
          </Flex>
        )
      },
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      width: '128px',
      render: (value) => <CellText>{value || '-'}</CellText>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '192px',
      render: (value) => <TextWithTooltip maxLength={18} text={value} />,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      width: '192px',
      render: (value) => <CellText>{value || '-'}</CellText>,
    },
  ]

  return {
    columns,
  }
}

