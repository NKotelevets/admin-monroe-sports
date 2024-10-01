import { IFERole } from '@/common/interfaces/role'
import { IExtendedFEUser } from '@/common/interfaces/user'

export const calculateUserRoles = (data: IExtendedFEUser) => {
  const roles: IFERole[] = []

  if (data.isSuperuser)
    roles.push({
      name: 'Swift Schedule Master Admin',
    })

  if (data.operator)
    roles.push({
      name: 'Operator',
      linkedEntities: [
        {
          id: data.operator.id,
          name: data.operator.name,
        },
      ],
    })

  if (data.asTeamAdmin)
    roles.push({
      name: 'Team Admin',
      linkedEntities: data.asTeamAdmin.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asHeadCoach)
    roles.push({
      name: 'Head Coach',
      linkedEntities: data.asHeadCoach.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asCoach)
    roles.push({
      name: 'Coach',
      linkedEntities: data.asCoach.teams.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asPlayer)
    roles.push({
      name: 'Player',
      linkedEntities: data.asPlayer.teams.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  return roles
}

