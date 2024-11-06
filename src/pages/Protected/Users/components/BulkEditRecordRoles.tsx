import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'
import { useCallback } from 'react'
import { IBulkEditFEUser } from '@/common/interfaces/user.ts'
import { DefaultOptionType } from 'antd/es/select'
import { ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES, ROLES } from '@/pages/Protected/Users/constants/roles.ts'
import {
  CHILD_ROLE,
  HEAD_COACH_ROLE,
  MASTER_ADMIN_ROLE,
  OPERATOR_ROLE,
  PARENT_ROLE,
  TEAM_ADMIN_ROLE
} from '@/common/constants'
import { TRole } from '@/common/types'
import { IFERole } from '@/common/interfaces/role.ts'
import Flex from 'antd/es/flex'
import MonroeSelect from '@/components/MonroeSelect.tsx'
import { DeleteIconWrapper, EmptySpace } from '@/pages/Protected/Users/components/Elements.tsx'
import { ReactSVG } from 'react-svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import MasterTeamsMultipleSelectWithSearch from '@/components/MasterTeamsMultipleSelectWithSearch.tsx'
import OperatorsInput from '@/pages/Protected/Users/components/OperatorsInput.tsx'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import { AddRoleButton } from '@/pages/Protected/Seasons/components/Elements.tsx'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'

const MAX_CREATED_ROLES_BY_ADMIN = 6
const MAX_CREATED_ROLES_BY_OPERATOR = 4

interface IProps {
  record: IBulkEditFEUser
}

/**
 * Component used to edit roles from a table record
 * @param {IBulkEditFEUser} record
 * @constructor
 */
export const BulkEditRecordRoles = ({ record }: IProps) => {
  const { setRecords, selectedRecords } = useUserSlice()
  const { user } = useUserSlice()
  const isOperatorWithoutAdmin = !!user?.operator && !user.isSuperuser

  /**
   * Checks if row user is same as logged-in user
   * @param {IBulkEditFEUser} record
   *
   * @returns boolean
   */
  const isCurrentUser = useCallback((record: IBulkEditFEUser): boolean => {
    return user?.id === record.id
  }, [user])

  /**
   * Returns validation to a record based on user
   * @param record
   *
   * @return object
   */
  const userRoles = (record: IBulkEditFEUser) => {
    const existingRoles = record.userRoles.map((role) => role.name)

    // return object with user's available roles
    // to use as select values
    const roleOptions: DefaultOptionType[] = ROLES.filter((initialRole) => {
      if (isOperatorWithoutAdmin && [MASTER_ADMIN_ROLE, OPERATOR_ROLE].includes(initialRole)) return false
      return !existingRoles.includes(initialRole)
    }).map((role) => ({
      label: role,
      value: role
    }))

    // if user has any admin roles
    const userAdminRoles = record?.roles.filter((role) => (
      [OPERATOR_ROLE, MASTER_ADMIN_ROLE].includes(role)
    )).length

    // max allowed role creation base on user roles
    const maximumRoles = (() => {
      if (user?.isSuperuser) return MAX_CREATED_ROLES_BY_ADMIN
      return MAX_CREATED_ROLES_BY_OPERATOR + (userAdminRoles || 0)
    })()

    // checks if user can add a new role or not
    const isAddRoleEnabled =
      !record.userRoles.filter((role) => (
        (ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole) && !role?.linkedEntities?.length) || !role.name
      ))
        .filter((i) => !!i)?.length || maximumRoles === record.userRoles.length

    return {
      existingRoles,
      roleOptions,
      userAdminRoles,
      isAddRoleEnabled,
      maximumRoles
    }
  }

  /**
   * Adds a role to a given record
   * @param {IBulkEditFEUser} record
   */
  const addRecordRole = (record: IBulkEditFEUser) => {
    const newRole = { name: '', linkedEntities: [] }

    const updatedRecords = selectedRecords.map((selectedRecord) =>
      selectedRecord.id === record.id
        ? {
          ...selectedRecord,
          userRoles: [...selectedRecord.userRoles, newRole]
        }
        : selectedRecord
    )

    setRecords(updatedRecords)
  }

  /**
   * Updates record roles
   * @param record
   * @param oldRole
   * @param newRole
   */
  const updateRecordRoles = (record: IBulkEditFEUser, oldRole: string, newRole: string) => {
    const updatedUserRoles = record.userRoles.map((role) =>
      role.name === oldRole ? { ...role, name: newRole } : role
    )

    // Early return if no changes were made
    if (updatedUserRoles === record.userRoles) return

    // Create the updated record with new user roles
    const updatedRecord: IBulkEditFEUser = {
      ...record,
      userRoles: updatedUserRoles
    }

    // Update the records array with the modified record
    const updatedRecords = selectedRecords.map((selectedRecord) =>
      selectedRecord.id === record.id ? updatedRecord : selectedRecord
    )

    // update state
    setRecords(updatedRecords)
  }

  /**
   * Deletes a role from a given record
   * @param {IBulkEditFEUser} record
   * @param {string} roleName
   */
  const deleteRecordRole = (record: IBulkEditFEUser, roleName: string) => {
    const updatedUserRoles = record.userRoles.filter((role) => role.name !== roleName)

    // Early return if no roles were removed
    if (updatedUserRoles.length === record.userRoles.length) {
      return
    }

    const updatedRecord: IBulkEditFEUser = {
      ...record,
      userRoles: updatedUserRoles
    }

    // Update the records array with the modified record
    const updatedRecords = selectedRecords.map((selectedRecord) =>
      selectedRecord.id === record.id ? updatedRecord : selectedRecord
    )

    // update state
    setRecords(updatedRecords)
  }

  /**
   * Updates the teams linked to a specific role in a record.
   * @param {IBulkEditFEUser} record - The record to update.
   * @param {string} roleName - The name of the role to update.
   * @param {Array<{ id: string; name: string }>} teams - The teams to link to the role.
   */
  const updateRecordRoleTeams = (
    record: IBulkEditFEUser,
    roleName: string,
    teams: Array<{ id: string; name: string }>
  ) => {
    const updatedUserRoles = record.userRoles.map((role) => {
      if (role.name === roleName) {
        return { ...role, linkedEntities: teams }
      }
      return role
    })

    const updatedRecord: IBulkEditFEUser = {
      ...record,
      userRoles: updatedUserRoles
    }

    const updatedRecords = selectedRecords.map((selectedRecord) =>
      selectedRecord.id === record.id ? updatedRecord : selectedRecord
    )

    setRecords(updatedRecords)
  }

  /**
   * Returns validation to a record based on given role
   * @param record
   * @param role
   *
   * @return object
   */
  const roleHelper = (record: IBulkEditFEUser, role: IFERole) => {
    const isSameUser = isCurrentUser(record)

    const isOperator = role.name === OPERATOR_ROLE
    const hasTeams = ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole)

    const cannotDeleteTeamAdmin = [TEAM_ADMIN_ROLE].includes(role.name) && (role.linkedEntities?.some(entity => entity?.canDelete === false) || false)
    const canEdit = (!([PARENT_ROLE, CHILD_ROLE, HEAD_COACH_ROLE].includes(role.name) || (isOperatorWithoutAdmin && role.name === OPERATOR_ROLE) || (isSameUser && role.name === MASTER_ADMIN_ROLE) ||
      (isOperatorWithoutAdmin && role.name === MASTER_ADMIN_ROLE))) && !cannotDeleteTeamAdmin

    const operatorObject = {
      id: role.linkedEntities?.[0]?.id || '',
      name: role.linkedEntities?.[0]?.name || ''
    }

    const cannotDeleteTeamAdmin = record.userRoles.some(role => {
      return [TEAM_ADMIN_ROLE].includes(role.name) && (role?.linkedEntities?.some(entity => entity.canDelete === false) || false)
    })

    const canDelete = !(
      cannotDeleteTeamAdmin
      || [PARENT_ROLE, CHILD_ROLE, HEAD_COACH_ROLE].includes(role.name)
      || (isOperatorWithoutAdmin && role.name === OPERATOR_ROLE)
      || (isOperatorWithoutAdmin && role.name === MASTER_ADMIN_ROLE)
    )

    return {
      isSameUser,
      isOperator,
      operatorObject,
      hasTeams,
      canDelete,
      canEdit
    }
  }

  const {
    isAddRoleEnabled,
    roleOptions,
    maximumRoles
  } = userRoles(record)

  return (
    <Flex vertical justify="flex-start" className="h-full">
      {record.userRoles.map((role) => {
        const {
          isOperator,
          operatorObject,
          hasTeams,
          canDelete,
          canEdit,
          isSameUser
        } = roleHelper(record, role)

        return (
          <Flex className="mg-b8" align="start" key={role.name}>
            <Flex className="mg-r32" align="center">
              <MonroeSelect
                options={roleOptions}
                onChange={(newRole) => updateRecordRoles(record, role.name, newRole)}
                className="w-170 c-p"
                value={role.name}
                disabled={!canEdit || !canDelete}
              />

              <DeleteIconWrapper
                is_hide={`${!canDelete || (isSameUser && role.name === MASTER_ADMIN_ROLE) || (isOperatorWithoutAdmin && role.name === MASTER_ADMIN_ROLE)}`}
                onClick={() => canDelete && deleteRecordRole(record, role.name)}
              >
                <ReactSVG src={DeleteIcon} />
              </DeleteIconWrapper>
            </Flex>

            {hasTeams && (
              <div className="w-full">
                <MasterTeamsMultipleSelectWithSearch
                  onChange={(newRole) => updateRecordRoleTeams(record, role.name, newRole)}
                  isError={!role?.linkedEntities?.length}
                  selectedTeams={role?.linkedEntities || []}
                  canRemoveTeam={role.name === HEAD_COACH_ROLE}
                />
              </div>
            )}

            {!hasTeams && !isOperator && <EmptySpace />}

            {isOperator && (
              <OperatorsInput
                isError={!operatorObject.id}
                setOperator={(value) => {
                  updateRecordRoleTeams(record, OPERATOR_ROLE, value)
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
          !isAddRoleEnabled
            ? (record.userRoles.length === maximumRoles
              ? `Maximum roles is ${maximumRoles}`
              : `You can't create a role when there are errors in other roles`)
            : ''
        }
        width="220px"
        containerWidth="113px"
      >
        <AddRoleButton
          disabled={!isAddRoleEnabled}
          onClick={() => addRecordRole(record)}
          icon={<PlusOutlined />}
          className="w-100"
        >
          Add role
        </AddRoleButton>
      </MonroeTooltip>
    </Flex>
  )
}
