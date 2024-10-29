import { IFENew, IRole } from '@/common/interfaces/user.ts'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { useCallback, useEffect, useState } from 'react'
import { TRole } from '@/common/types'
import { TLinkedRole } from '@/pages/Protected/Users/hooks/useLinkedRoles.ts'

/**
 * Matches user roles with teams, fetches team IDs by team name,
 * and provides structured data for updating user roles.
 *
 * @returns An object containing:
 *  - `newRoles`: Array of roles with their associated team IDs.
 *
 * @example
 * const { newRoles } = useNewRoles(newUserData)
 * return (
 *   <div>
 *     {roles.map(({ role, team_id }) => (
 *       <div key={team_id}>
 *         Role: {role}, Team ID: {team_id}
 *       </div>
 *     ))}
 *   </div>
 * )
 */
export const useNewRoles = () => {
  const [newRoles, setNewRoles] = useState<TLinkedRole[]>([])
  const [newUserData, setNewRolesUser] = useState<IFENew>()
  const [getMasterTeams] = useLazyGetMasterTeamsQuery()
  const { roles, teams } = newUserData || { roles: [], teams: [] }

  const matchedRolesTeams = roles
    .filter(role => role.toLowerCase() !== 'master admin')
    .map((role, index) => ({ role, team: teams[index] }))

  const fetchRolesWithTeamIds = useCallback(async () => {
    const roles: IRole[] = await Promise.all(
      matchedRolesTeams.map(async ({ role, team }) => {
        const teams = await getMasterTeams({
          limit: 1,
          offset: 10,
          team_name: team
        }).unwrap()

        const team_id = teams.results.length > 0 ? teams.results[0].id : ''
        return { role: role as TRole, teamName: team, team_id }
      })
    )
    setNewRoles(roles as TLinkedRole[])
  }, [matchedRolesTeams])

  useEffect(() => {
    fetchRolesWithTeamIds()
  }, [newUserData])

  return {
    newRoles,
    setNewRolesUser
  }
}
