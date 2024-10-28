import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import React, { FC, ReactElement } from 'react'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { IAsEntity, IChildren, IExtendedFEUser, IFENew, IOperator } from '@/common/interfaces/user'
import { TGender, TRole } from '@/common/types'
import { IIdName } from '@/common/interfaces'
import { formatPhoneNumber } from '@/utils'
import { TLinkedRole } from '@/pages/Protected/Users/hooks/useLinkedRoles.ts'

interface IUsersDetailsColumnProps extends IFENew {
  title: string
  isNew: boolean
  // Since we have to show current roles at the same column
  // as imported data, we need to pass current user data to use when isNew is true
  current?: IExtendedFEUser
  differences: Record<keyof IFENew, boolean>
}

type TUsersDetailsColumnProps = Omit<IUsersDetailsColumnProps, 'roles'> & {
  asCoach?: IAsEntity | null
  asPlayer?: IAsEntity | null
  operator?: IOperator | null
  asHeadCoach?: IIdName[] | null
  asTeamAdmin?: IIdName[] | null
  birthDateFormatted?: string
  isChild?: boolean
  asParent?: null | IChildren[]
  newRoles?: TLinkedRole[]
  roles: TLinkedRole[]
}

/**
 * `UsersDetailsColumn` is a React component that displays detailed user information
 * in a single column. This component is typically used by a parent component to show
 * the current and imported user data side by side, enabling users to compare the data visually.
 *
 * `UsersDetailsColumn` supports showing either current data or new (to-be-imported) data,
 * and it highlights specific fields where differences exist between the two.
 *
 * @component
 *
 * @param {TUsersDetailsColumnProps} props - The properties for the `UsersDetailsColumn` component.
 * @param {string} props.title - The title for the column, used to identify it as "Current" or "New."
 * @param {boolean} props.isNew - Indicates if the column data is new (to-be-imported) or current.
 * @param {IExtendedFEUser} [props.newRoles] - Imported roles for the user.
 * This allows the component to compare current data in the same column when showing imported data.
 * @param {Record<keyof IFENew, boolean>} props.differences - A record of differences between the
 * current and new data, where each key represents a field and `true` indicates a difference.
 *
 * @returns {ReactElement} A column layout showing user information, which can be used within a parent
 * component for comparison purposes.
 *
 * @example
 * // Example usage within a parent component that renders side-by-side comparison
 * <div style={{ display: 'flex' }}>
 *   <UsersDetailsColumn
 *     title="Current Data"
 *     isNew={false}
 *     differences={{ birthdate: false, firstName: true, lastName: false }}
 *     current={currentUserData}
 *   />
 *   <UsersDetailsColumn
 *     title="Imported Data"
 *     isNew={true}
 *     differences={{ birthdate: true, firstName: false, lastName: true }}
 *     {...importedUserData}
 *   />
 * </div>
 *
 * // Expected render:
 * // ┌─────────────────────┐   ┌──────────────────────┐
 * // │   Current Data      │   │   Imported Data      │
 * // ├─────────────────────┤   ├──────────────────────┤
 * // │ Birth Date: 01/01/90│   │ Birth Date: 01/01/92 │
 * // │ Coach: Team A       │   │ Coach: Team B        │
 * // │ ...                 │   │ ...                  │
 * // └─────────────────────┘   └──────────────────────┘
 *
 * Notes:
 * - This component only renders the data as a column and does not handle any
 *   comparison logic beyond highlighting differences via the `differences` prop.
 * - Suitable for review and import flows where a clear side-by-side data review is needed.
 */
const UsersDetailsColumn: FC<TUsersDetailsColumnProps> = ({
  isNew,
  title,
  birthDateFormatted,
  firstName,
  gender= 2,
  lastName,
  phoneNumber,
  zipCode,
  email = '',
  roles,
  newRoles,
  differences
}: TUsersDetailsColumnProps) : ReactElement => {

  return (
    <Container is_new={`${isNew}`}>
      <Title>{title}</Title>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Name:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{firstName} {lastName}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Gender:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{gender ? FULL_GENDER_NAMES[gender as TGender] : '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Email:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{email || '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Birth Date:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{birthDateFormatted}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Phone:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{phoneNumber ? formatPhoneNumber(phoneNumber) : '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Zip Code:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{zipCode || '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Current Roles:</ItemTitle>
        {!roles?.length && (
          <ItemValueStyle is_changed={`false`}>-</ItemValueStyle>
        )}
        <RoleList roles={roles} />
      </Flex>

      {isNew && differences.roles && !!newRoles?.length && (
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${isNew}`}>New Roles:</ItemTitle>
          {!!newRoles?.length && <RoleList roles={newRoles} isNew={true} />}
        </Flex>
      )}
    </Container>
  )
}

interface ICurrentRoleListProps {
  roles: TLinkedRole[]
  isNew?: boolean
}

type TMappedRoles = {
  [key in TRole]: { role: TRole,teamNames: string[] }
}

/**
 * RoleList is a memoized React functional component that displays a list of roles and
 * associated team names. It groups roles by type, ensuring each role displays a unique
 * list of team names.
 *
 * @interface ICurrentRoleListProps
 * @property {TLinkedRole[]} roles - An array of roles to be listed, each containing
 *                                   a role type and an optional team name.
 * @property {boolean} [isNew=false] - Indicates if the role list is new. This flag
 *                                     is used to apply conditional styling.
 *
 * @returns {ReactElement[]} A list of JSX elements, where each item represents a
 *                          role and its associated team names, displayed in the
 *                          format "role: teamName1, teamName2, ...".
 *
 * @example
 * <RoleList roles={rolesArray} isNew={true} />
 */
const RoleList = React.memo((props: ICurrentRoleListProps) => {
  const { roles, isNew = false} = props

  const groupedByRole = Object.values(
    roles.reduce((acc, { role, teamName }) => {
      if (!acc[role]) acc[role] = { role, teamNames: [] }
      if (teamName) acc[role].teamNames.push(teamName)
      return acc
    }, {} as TMappedRoles)
  )

  return Object.values(groupedByRole).map(role => {
    return (
      <ItemValueStyle key={`${role}-key`} is_changed={`${isNew}`}>
        {role.role}: {role.teamNames.join(', ')};
      </ItemValueStyle>
    )
  })
})

const Container = styled(Flex)<{ is_new: string }>`
  flex: 1 1 50%;
  flex-direction: column;
  border-right: ${(props) => (props.is_new === 'true' ? '0' : '2px solid #F4F4F5')};
  padding-left: ${(props) => (props.is_new !== 'true' ? '0' : '16px')};
  padding-right: ${(props) => (props.is_new !== 'true' ? '16px' : '0')};
`

const Title = styled(Typography)`
  color: #888791;
  font-size: 14px;
  margin-bottom: 8px;
`

const ItemTitle = styled(Typography)<{ is_changed: string }>`
  margin-bottom: 4px;
  margin-right: 20px;
  color: ${({ is_changed }) => (is_changed === 'true' ? 'rgba(26, 22, 87, 0.85)' : '#888791')};
  font-weight: 500;
`

const ItemValueStyle = styled(Typography)<{ is_changed: string }>`
  color: ${({ is_changed }) => (is_changed === 'true' ? '#333' : '#888791')};
`

export default UsersDetailsColumn
