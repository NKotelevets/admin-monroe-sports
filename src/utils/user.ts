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
import { IBENew, IExtendedBEUser, IExtendedFEUser, IFENew } from '@/common/interfaces/user'

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

export const getFEUserRecord = (user: IExtendedBEUser): IExtendedFEUser => ({
  id: user.id,
  email: user.email,
  gender: user.gender,
  city: user.city,
  state: user.state,
  phoneNumber: user.phone_number,
  phoneNumberVerified: user.phone_number_verified,
  emailVerified: user.email_verified,
  inviteAccepted: user.invite_accepted,
  inviteDate: user.invite_date,
  updatedAt: user.updated_at,
  createdAt: user.created_at,
  photoS3Url: user.photo_s3_url,
  firstName: user.first_name,
  lastName: user.last_name,
  birthDate: user.birth_date,
  zipCode: user.zip_code,
  emergencyContactName: user.emergency_contact_name,
  emergencyContactPhone: user.emergency_contact_phone,
  isActive: user.is_active,
  isSuperuser: user.is_superuser,
  roles: user.roles,
  teams: user.teams,
  asCoach: user.as_coach,
  asPlayer: user.as_player,
  operator: user.operator,
  asHeadCoach: user.as_head_coach,
  asTeamAdmin: user.as_team_admin,
  isChild: user.is_child,
  asParent:
    user.as_supervisor?.supervised.map((s) => ({
      id: s.id,
      firstName: s.first_name,
      lastName: s.last_name,
    })) || null,
  invitations: user.invitations,
})

export const getFENewRecord = ({
  birth_date,
  first_name,
  last_name,
  phone_number,
  zip_code,
  ...rest
}: IBENew): IFENew => ({
  ...rest,
  birthDate: birth_date,
  firstName: first_name,
  lastName: last_name,
  phoneNumber: phone_number,
  zipCode: zip_code,
})

