import { IRole } from '@/common/interfaces/user.ts'
import { TRole } from '@/common/types'
import React from 'react'
import styled from '@emotion/styled'
import { Typography } from 'antd'

interface ICurrentRoleListProps {
  roles: (IRole & { teamName: string })[]
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
export const RoleList = React.memo((props: ICurrentRoleListProps) => {
  const { roles, isNew = false} = props

  const groupedByRole = Object.values(
    roles.reduce((acc, { role, team_id, teamName }) => {
      if (!acc[role]) acc[role] = { role, teamNames: [] }
      if (team_id) acc[role].teamNames.push(teamName)
      return acc
    }, {} as TMappedRoles)
  )

  return Object.values(groupedByRole).map((role, index) => {
    return (
      <ItemValueStyle key={`role-${index}-key`} is_changed={`${isNew}`}>
        {role.role}: {role.teamNames.join(', ')};
      </ItemValueStyle>
    )
  })
}, (prev, next) => {
  return prev.isNew === next.isNew && prev.roles === next.roles
})

const ItemValueStyle = styled(Typography)<{ is_changed: string }>`
    color: ${({ is_changed }) => (is_changed === 'true' ? '#333' : '#888791')};
`
