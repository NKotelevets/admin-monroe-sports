import { AddBracketButton } from '../../Seasons/components/Elements'
import { ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES, MOCKED_TEAMS, ROLES } from '../constants/roles'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import { TableProps } from 'antd/es/table/InternalTable'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import MonroeMultipleSelect from '@/components/MonroeMultipleSelect'
import MonroeSelect from '@/components/MonroeSelect'
import MonroeTooltip from '@/components/MonroeTooltip'
import CellText from '@/components/Table/CellText'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { PATH_TO_USERS } from '@/constants/paths'

import { SHORT_GENDER_NAMES } from '@/common/constants'
import { IFEUser } from '@/common/interfaces/user'
import { TGender, TRole } from '@/common/types'

import DeleteIcon from '@/assets/icons/delete.svg'

type TColumns<T> = TableProps<T>['columns']

export const useUsersBulkEditTableParams = () => {
  const navigate = useNavigate()
  const { setRecords, selectedRecords } = useUserSlice()

  const columns: TColumns<IFEUser> = [
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
      render: (value) => <CellText> {SHORT_GENDER_NAMES[value as TGender]}</CellText>,
    },
    {
      title: 'Roles',
      dataIndex: '',
      width: '240px',
      render: (_, record) => {
        const existingRoles = record.roles.map((role) => role.name)
        const options: DefaultOptionType[] = ROLES.filter((initialRole) => !existingRoles.includes(initialRole)).map(
          (role) => ({
            label: role,
            value: role,
          }),
        )
        const isDisabledAddRoleButton = !!record.roles
          .filter((role) => {
            if (
              (ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole) &&
                !role.linkedEntities.length) ||
              !role.name
            )
              return true

            return false
          })
          .filter((i) => !!i).length

        const handleChangeData = (oldRole: string, newRole: string) => {
          const updatedRecord = {
            ...record,
            roles: record.roles.map((role) => {
              if (role.name === oldRole) {
                return {
                  ...role,
                  name: newRole,
                }
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
          const updatedRecord = {
            ...record,
            roles: record.roles.filter((role) => role.name !== roleName),
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
                roles: [...selectedRecord.roles, { name: '', linkedEntities: [] }],
              }
            }

            return selectedRecord
          })

          setRecords(updatedRecords)
        }

        return (
          <Flex vertical>
            {record.roles.map((role) => (
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
                  value={role.name.length > 21 ? role.name.substring(0, 18) + '...' : role.name}
                />

                <div style={{ marginLeft: '8px' }} onClick={() => handleDeleteRole(role.name)}>
                  <ReactSVG src={DeleteIcon} />
                </div>
              </Flex>
            ))}

            <MonroeTooltip
              text={isDisabledAddRoleButton ? "You can't create role when you have errors in other roles" : ''}
              width="220px"
              containerWidth="113px"
            >
              <AddBracketButton
                disabled={isDisabledAddRoleButton}
                onClick={handleAddRole}
                icon={<PlusOutlined />}
                style={{
                  width: '80px',
                }}
              >
                Add role
              </AddBracketButton>
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
        const options: DefaultOptionType[] = MOCKED_TEAMS.map((team) => ({
          label: team,
          value: team,
        }))

        const handleChangeData = (roleName: string, teams: string[]) => {
          const updatedRecord = {
            ...record,
            roles: record.roles.map((role) => {
              if (role.name === roleName) {
                return {
                  ...role,
                  linkedEntities: teams,
                }
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
            {record.roles.map((role) => (
              <Flex
                key={role.name}
                style={{
                  marginBottom: '20px',
                }}
              >
                {ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole) ? (
                  <MonroeMultipleSelect
                    options={options}
                    onChange={(newRole) => handleChangeData(role.name, newRole as unknown as string[])}
                    styles={{ width: '100%' }}
                    value={role.linkedEntities}
                  />
                ) : (
                  <>
                    <MonroeMultipleSelect
                      options={options}
                      onChange={(newRole) => handleChangeData(role.name, newRole as unknown as string[])}
                      value={role.linkedEntities}
                      styles={{
                        opacity: 0,
                        visibility: 'hidden',
                        width: '100%',
                      }}
                    />
                  </>
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

