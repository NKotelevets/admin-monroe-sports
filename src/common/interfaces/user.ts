import { IFERole } from '@/common/interfaces/role'
import { TGender, TRole } from '@/common/types'

interface IInvite {
  created_at: string
  id: string
  invite_type: number
  is_admin_invite: boolean
  visible: boolean
}

export interface IBEUser {
  id: string
  email: string
  gender: number
  city: string
  state: string
  phone_number: string
  phone_number_verified: boolean
  email_verified: boolean
  invite_accepted: boolean
  invite_date: string
  updated_at: string
  created_at: string
  photo_s3_url: string
  first_name: string
  last_name: string
  birth_date: string
  zip_code: string
  emergency_contact_name: string
  emergency_contact_phone: string
  is_active: boolean
  is_superuser: boolean
  roles: string[]
  teams: string[]
  invitations: IInvite[]
}

export interface IFEUser {
  id: string
  email: string
  gender: number
  city: string
  state: string
  phoneNumber: string
  phoneNumberVerified: boolean
  emailVerified: boolean
  inviteAccepted: boolean
  inviteDate: string
  updatedAt: string
  createdAt: string
  photoS3Url: string
  firstName: string
  lastName: string
  birthDate: string
  zipCode: string
  emergencyContactName: string
  emergencyContactPhone: string
  isActive: boolean
  isSuperuser: boolean
  roles: string[]
  teams: string[]
  invitations: IInvite[]
}

export interface IGetUsersRequestParams {
  ordering?: string
  first_name?: string
  last_name?: string
  gender?: string
  limit: number
  offset: number
  role?: string
  team?: string
}

export interface IRole {
  role: TRole
  team_id?: string
  operator_id?: string
}
export interface ICreateUserAsAdminRequestBody {
  first_name: string
  last_name: string
  birth_date?: string
  gender: TGender
  email: string
  phone_number?: string
  zip_code?: string
  roles: IRole[]
  team?: string
}

export interface IBlockedUserError {
  email: string
  id: string
  warning: string
  first_name: string
  last_name: string
  gender: number
}

interface ITeam {
  id: string
  name: string
}

interface IAsEntity {
  teams: ITeam[]
}

interface IOperator {
  id: string
  updated_at: string
  created_at: string
  name: string
  email: string
  phone_number: string
  zip_code: string
  state: string
  city: string
  street: string
  first_name: string
  last_name: string
  phone_number_contact: string
  email_contact: string
}

export interface IExtendedBEUser extends IBEUser {
  as_coach: IAsEntity | null
  as_player: IAsEntity | null
  operator: IOperator | null
  as_head_coach: { id: string; name: string }[] | null
  as_team_admin: { id: string; name: string }[] | null
  is_child: boolean
  as_supervisor: {
    relation_type: number
    supervised: {
      id: string
      first_name: string
      last_name: string
      // TODO: add rest fields
    }[]
  } | null
}

interface IChildren {
  id: string
  firstName: string
  lastName: string
}

export interface IExtendedFEUser extends IFEUser {
  asCoach: IAsEntity | null
  asPlayer: IAsEntity | null
  operator: IOperator | null
  asHeadCoach: { id: string; name: string }[] | null
  asTeamAdmin: { id: string; name: string }[] | null
  isChild: boolean
  asParent: null | IChildren[]
}

export interface IBulkEditFEUser extends IExtendedFEUser {
  userRoles: IFERole[]
}
