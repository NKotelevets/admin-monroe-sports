import { IExtendedFEUser, IRole } from '@/common/interfaces/user.ts'
import { calculateUserRoles } from '@/utils/user.ts'
import { MASTER_ADMIN_ROLE, ROLES_WITH_TEAMS } from '@/common/constants'
import { useEffect, useState } from 'react'
import { TRole } from '@/common/types'

export type TLinkedRole = IRole & { teamName: string, teamNames?: string[]}

export const useLinkedRoles = () => {
  const [linkedRoles, setLinkedRoles] = useState<TLinkedRole[]>([])
  const [user, setLinkedRolesUser] = useState<IExtendedFEUser>()

  useEffect(() => {
    if (!user) return

    const userRoles = calculateUserRoles(user)

    // Maps role with team_id
    const linkedRoles  = userRoles?.flatMap((role) => {
      if (ROLES_WITH_TEAMS.includes(role.name as TRole)) {
        return role!.linkedEntities!.map(
          (linkedEntity) =>
            ({
              role: role.name,
              teamName: linkedEntity.name,
              team_id: linkedEntity.id,
            }) as TLinkedRole,
        )
      }

      if (role.name === MASTER_ADMIN_ROLE) {
        return {
          role: 'Swift Schedule Master Admin',
        } as unknown as TLinkedRole
      }

      return {
        role: role.name,
      } as TLinkedRole
    })

    setLinkedRoles(linkedRoles)
  }, [user])


  return {
    linkedRoles,
    setLinkedRolesUser
  }
}
