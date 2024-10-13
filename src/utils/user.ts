import {
  CHILD_ROLE,
  COACH_ROLE,
  HEAD_COACH_ROLE,
  MASTER_ADMIN_ROLE,
  OPERATOR_ROLE,
  PARENT_ROLE,
  PLAYER_ROLE,
  TEAM_ADMIN_ROLE,
} from '@/common/constants'
import { IFERole } from '@/common/interfaces/role'
import { IExtendedFEUser } from '@/common/interfaces/user'

export const calculateUserRoles = (data: IExtendedFEUser) => {
  const roles: IFERole[] = []

  if (data.isSuperuser)
    roles.push({
      name: MASTER_ADMIN_ROLE,
    })

  if (data.operator)
    roles.push({
      name: OPERATOR_ROLE,
      linkedEntities: [
        {
          id: data.operator.id,
          name: data.operator.name,
        },
      ],
    })

  if (data.asTeamAdmin?.length)
    roles.push({
      name: TEAM_ADMIN_ROLE,
      linkedEntities: data.asTeamAdmin.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asHeadCoach?.length)
    roles.push({
      name: HEAD_COACH_ROLE,
      linkedEntities: data.asHeadCoach.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asCoach?.teams.length)
    roles.push({
      name: COACH_ROLE,
      linkedEntities: data.asCoach.teams.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    })

  if (data.asPlayer?.teams.length)
    roles.push({
      name: PLAYER_ROLE,
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
      name: CHILD_ROLE,
    })

  if (data.asParent)
    roles.push({
      name: PARENT_ROLE,
    })

  return [...changedRoles, ...roles]
}

