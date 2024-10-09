import { IFERole } from '@/common/interfaces/role'
import { IExtendedFEUser } from '@/common/interfaces/user'

export const calculateUserRoles = (data: IExtendedFEUser) => {
  const roles: IFERole[] = []

  if (data.isSuperuser)
    roles.push({
      name: 'Master Admin',
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

  if (data.asTeamAdmin?.length)
    roles.push({
      name: 'Team Admin',
      linkedEntities: data.asTeamAdmin.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asHeadCoach?.length)
    roles.push({
      name: 'Head Coach',
      linkedEntities: data.asHeadCoach.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asCoach?.teams.length)
    roles.push({
      name: 'Coach',
      linkedEntities: data.asCoach.teams.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asPlayer?.teams.length)
    roles.push({
      name: 'Player',
      linkedEntities: data.asPlayer.teams.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  return roles
}

export const calculateAllUserRoles = (data: IExtendedFEUser) => {
  const roles: IFERole[] = []

  const changedRoles = calculateUserRoles(data)

  if (data.isChild)
    roles.push({
      name: 'Child',
    })

  if (data.asParent)
    roles.push({
      name: 'Parent',
    })

  return [...changedRoles, ...roles]
}

