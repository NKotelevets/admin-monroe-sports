import { IExtendedFEUser } from '@/common/interfaces/user.ts'
import { calculateUserRoles } from '@/utils/user.ts'
import { MASTER_ADMIN_ROLE, ROLES_WITH_TEAMS } from '@/common/constants'
import { TRole } from '@/common/types'
import { TLinkedRole, TNewUser } from '@/common/types/users.ts'

/**
 * Retrieves the current role(s) of a user, including linked team information when applicable.
 *
 * @param {IExtendedFEUser} user - The user object for which roles are being calculated.
 * @returns {TLinkedRole[]} An array of role objects, which may include associated team information:
 * - If the user's role is in `ROLES_WITH_TEAMS`, returns detailed roles with linked team names and IDs.
 * - If the user's role is `MASTER_ADMIN_ROLE`, returns a predefined Master Admin role object.
 * - Otherwise, returns the role name as a simple role object.
 */
export const getCurrentRole = (user: IExtendedFEUser): TLinkedRole[] => {
  const userRoles = calculateUserRoles(user)
  return userRoles?.flatMap((role) => {
    if (ROLES_WITH_TEAMS.includes(role.name as TRole)) {
      return role!.linkedEntities!.map(
        (linkedEntity) =>
          ({
            role: role.name,
            teamName: linkedEntity.name,
            team_id: linkedEntity.id
          }) as TLinkedRole
      )
    }

    if (role.name === MASTER_ADMIN_ROLE) {
      return {
        role: 'Swift Schedule Master Admin'
      } as unknown as TLinkedRole
    }

    return {
      role: role.name
    } as TLinkedRole
  })
}

/**
 * Filters and maps user roles to match roles with their associated team names.
 *
 * @param {TNewUser['roles']} roles - An array of user roles, each potentially containing role and team information.
 * @returns {TLinkedRole[]} An array of objects containing:
 * - `role`: The name of the role (excluding 'Master Admin' roles).
 * - `teamName`: The name of the associated team.
 */
export const matchedRolesTeams = (roles: TNewUser['roles']): TLinkedRole[] => (
  roles
    .filter(role => role.role.toLowerCase() !== 'master admin')
    .map((role) => ({ role: role.role, teamName: role.team }))
)
