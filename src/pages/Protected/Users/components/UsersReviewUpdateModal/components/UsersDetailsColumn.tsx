import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import React, { FC, ReactElement, useCallback } from 'react'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { IAsEntity, IChildren, IExtendedFEUser, IFENew, IOperator } from '@/common/interfaces/user'
import { TGender, TRole } from '@/common/types'
import { IIdName } from '@/common/interfaces'
import { formatPhoneNumber } from '@/utils'

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

interface IUsersDetailsColumnProps extends IFENew {
  title: string
  isNew: boolean
  // Since we have to show current roles at the same column
  // as imported data, we need to pass current user data to use when isNew is true
  current?: IExtendedFEUser
  differences: Record<keyof IFENew, boolean>
}

type TUsersDetailsColumnProps = {
  asCoach?: IAsEntity | null
  asPlayer?: IAsEntity | null
  operator?: IOperator | null
  asHeadCoach?: IIdName[] | null
  asTeamAdmin?: IIdName[] | null
  birthDateFormatted?: string
  isChild?: boolean
  asParent?: null | IChildren[]
} & IUsersDetailsColumnProps

type RoleTeamsMap = Record<TRole | 'Parent', IIdName[] | IOperator | IChildren[] | null>;

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
 * @param {IExtendedFEUser} [props.current] - The current user data to display when `isNew` is `true`.
 * This allows the component to compare current data in the same column when showing imported data.
 * @param {Record<keyof IFENew, boolean>} props.differences - A record of differences between the
 * current and new data, where each key represents a field and `true` indicates a difference.
 *
 * @param {IAsEntity|null} [props.asCoach] - Additional data for the user’s role as a coach, if applicable.
 * @param {IAsEntity|null} [props.asPlayer] - Additional data for the user’s role as a player, if applicable.
 * @param {IOperator|null} [props.operator] - The operator entity associated with the user, if applicable.
 * @param {IIdName[]|null} [props.asHeadCoach] - A list of teams or entities where the user serves as head coach.
 * @param {IIdName[]|null} [props.asTeamAdmin] - A list of teams or entities where the user serves as team admin.
 * @param {string} [props.birthDateFormatted] - The user’s birthdate formatted as a string.
 * @param {IChildren[]|null} [props.asParent] - A list of children associated with the user, if applicable.
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
 *     current={currentUserData}
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
  teams,
  current,
  differences,
  asPlayer = null,
  asCoach = null,
  asParent = null,
  asHeadCoach = null,
  operator = null,
  asTeamAdmin = null,
}: TUsersDetailsColumnProps) : ReactElement => {
  const currentRoles = isNew ? current?.roles : roles

  const teamsAsText = useCallback((role: TRole | 'Parent'): string | null => {
    const roleTeamsMap: RoleTeamsMap = {
      'Coach': current?.asCoach?.teams || asCoach?.teams || null,
      'Player': current?.asPlayer?.teams || asPlayer?.teams || null,
      'Head Coach': current?.asHeadCoach || asHeadCoach,
      'Team Admin': current?.asTeamAdmin || asTeamAdmin,
      'Master Admin': null,
      'Operator': current?.operator || operator ,
      'Parent': current?.asParent || asParent
    }

    const teamsOrOperator = roleTeamsMap[role]

    if (Array.isArray(teamsOrOperator)) {
      if (role === 'Parent') {
        const parents = teamsOrOperator as IChildren[]
        return parents.map((parent) => `${parent.firstName} ${parent.lastName}`).join(', ')
      }

      return (teamsOrOperator as IIdName[]).map((team) => team.name).join(', ')
    }

    if (teamsOrOperator && 'name' in teamsOrOperator) {
      return teamsOrOperator.name
    }

    // Return undefined if there are no teams or operator
    return null
  }, [asCoach, asPlayer, asHeadCoach, asTeamAdmin, operator, asParent, current])

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
        {!currentRoles?.length && (
          <ItemValueStyle is_changed={`false`}>-</ItemValueStyle>
        )}
        <CurrentRoleList roles={currentRoles} {...{ teamsAsText }} />
      </Flex>

      {isNew && current && differences.roles && (
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${isNew}`}>New Roles:</ItemTitle>
          {roles.length && <NewRoleList {...{ roles, teams, isNew }} />}
        </Flex>
      )}
    </Container>
  )
}

interface ICurrentRoleListProps {
  roles?: string[]
  teamsAsText(role: TRole): string | null
}

/**
 * CurrentRoleList renders the current user's roles along with their associated team text.
 *
 * This component receives a list of roles and a function to convert roles into
 * a text representation of teams.
 *
 * @param {ICurrentRoleListProps} props - The properties passed to the component.
 * @param {Array<TRole>} props.roles - An array of roles to display.
 * @param {function} props.teamsAsText - A function that takes a role and returns
 * a string representing the associated teams for that role.
 *
 * @returns {ReactElement|null} Returns a list of items representing roles
 * and their team associations, or null if roles are undefined.
 *
 * @example
 * // Example usage
 * const roles = ['Admin', 'Editor', 'Viewer'];
 * const teamsAsText = (role: TRole) => {
 *   switch (role) {
 *     case 'Admin':
 *       return 'Team A, Team B';
 *     case 'Editor':
 *       return 'Team C';
 *     case 'Viewer':
 *       return 'Team D, Team E';
 *     default:
 *       return 'No team assigned';
 *   }
 * };
 *
 * <CurrentRoleList roles={roles} teamsAsText={teamsAsText} />
 *
 * // Renders:
 * // Admin: Team A, Team B;
 * // Editor: Team C;
 * // Viewer: Team D, Team E;
 */
const CurrentRoleList = React.memo((props: ICurrentRoleListProps) => {
  const { roles, teamsAsText } = props

  return roles?.map(role => {
    return (
      <ItemValueStyle key={`${role}-key`} is_changed={`false`}>{role}: {teamsAsText(role as TRole)};</ItemValueStyle>
    )
  })
})

interface INewRoleListProps {
  roles: string[]
  teams: string[]
}

/**
 * `NewRoleList` is a component that renders a list of roles,
 * formatted based on the role type and associated teams.
 * It formats the text for each role, displaying "Master Admin" as is
 * or appending the team name for other roles.
 *
 * @component
 *
 * @param {INewRoleListProps} props - The properties object for this component.
 * @param {string[]} props.roles - An array of roles to be displayed in the list.
 * @param {string[]} props.teams - An array of team names, with each team corresponding
 * to the role at the same index in the `roles` array.
 *
 * @returns {ReactElement[]} An array of styled list items, each representing a role and
 * its corresponding team (if applicable).
 *
 * @example
 * // Example usage
 * <NewRoleList roles={['Admin', 'Editor', 'Master Admin']} teams={['Team A', 'Team B']} />
 *
 * Notes:
 * - Only "Master Admin" is displayed as a standalone role without a team association.
 */
const NewRoleList = React.memo((props: INewRoleListProps) => {
  const { roles, teams } = props

  return roles?.map((role, index) => {
    const text = role === 'Master Admin' ? role : `${role}: ${teams[index]};`
    return (
      <ItemValueStyle key={`new-${role}-key`} is_changed={`true`}>{text}</ItemValueStyle>
    )
  })
})

export default UsersDetailsColumn
