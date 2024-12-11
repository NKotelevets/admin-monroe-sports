import { IAdditionalEmail, IAdditionalPhone } from '@/common/interfaces'
import { IBEDivision, IBESubdivision, IFEDivision, IFESubdivision } from '@/common/interfaces/division'
import { IBELeague, IFELeague } from '@/common/interfaces/league'
import { IBEOperator } from '@/common/interfaces/operator'
import { TDeleteStatus, TErrorDuplicate } from '@/common/types'

interface IBETeamAdmin {
  additional_emails: IAdditionalEmail[]
  additional_phone: IAdditionalPhone[]
  birth_date: string | null
  city: string | null
  created_at: string
  email: string
  email_verified: false
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  first_name: string
  gender: number
  id: string
  is_active: boolean
  is_staff: boolean
  last_name: string
  operator: null | IBEOperator
  phone_number: null | string
  phone_number_verified: false
  photo_s3_url: null | string
  state: null | string
  system_role: number
  updated_at: string
  zip_code: null | string
}

export interface ITeamAdmin {
  additionalEmails: IAdditionalEmail[]
  additionalPhone: IAdditionalPhone[]
  birthDate: string | null
  city: string | null
  createdAt: string
  email: string
  emailVerified: false
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  firstName: string
  gender: number
  id: string
  isActive: boolean
  isStaff: boolean
  lastName: string
  operator: null | IBEOperator
  phoneNumber: null | string
  phoneNumberVerified: false
  photoS3Url: null | string
  state: null | string
  systemRole: number
  updatedAt: string
  zipCode: null | string
}

export interface IBEMasterTeam {
  id: string
  division: IBEDivision[]
  updated_at: string
  created_at: string
  name: string
  logo_s3_url: string
  home_uniform: string
  away_uniform: string
  arrive_early_for_practice: number
  arrive_early_for_games: number
  who_can_join_this_team: number
  team_administrator_email: string
  head_coach_email: string
  team_administrator: string
  head_coach: IBETeamAdmin | null
  team_admins: IBETeamAdmin[] | null
  leagues: IBELeague[]
}

export interface IFEMasterTeam {
  id: string
  name: string
  headCoachId: string | null
  headCoachFullName: string | null
  headCoachEmail: string | null
  teamAdmin: ITeamAdmin | null
  teamAdmins: ITeamAdmin[] | null
  teamAdminId: string | null
  teamAdminFullName: string | null
  teamAdminEmail: string | null
  leagues: IBELeague[]
}

export interface IGetMasterTeamsRequest {
  limit: number
  offset: number
  ordering?: string | null
  name?: string | null
  head_coach?: string | null
  league_name?: string | null
  league_teams?: string | null
  team_admins?: string | null
}

export interface IGetMasterTeamsResponse {
  count: number
  results: IFEMasterTeam[]
}

export interface IPopulateMTRequest {
  name: string
  head_coach: string
  coaches: string[]
  players: string[]
  team_admins: string[]
}

export interface IBESimpleEntity {
  id: string
  first_name: string
  last_name: string
  phone_number: string | null
  email: string
}

export interface IBEMasterTeamDetails {
  name: string
  head_coach: IBESimpleEntity
  team_admins: IBESimpleEntity[]
  players: IBESimpleEntity[]
  coaches: IBESimpleEntity[]
  leagues: IBELeague[]
  divisions: IBEDivision[]
  subdivisions: IBESubdivision[]
}

export interface IFESimpleEntity {
  id: string
  fullName: string
  phone: string | null
  email: string
}

export interface IFEMasterTeamDetails {
  name: string
  headCoach: IFESimpleEntity
  teamsAdmins: IFESimpleEntity[]
  players: IFESimpleEntity[]
  coaches: IFESimpleEntity[]
  leagues: IFELeague[]
  divisions: IFEDivision[]
  subdivisions: IFESubdivision[]
}

export interface IMasterTeamError {
  id: string
  name: string
  error: string
}

export interface IImportMasterTeamCSVTableData {
  idx: number
  index: number
  type: string
  headCoachName: string
  headCoachEmail: string
  masterTeamName: string
  teamAdminEmail: string
  teamAdminName: string
  status: TErrorDuplicate
  message: string
}

interface IBEDuplicateExtraData {
  id: string
  full_name: string
  email: string
}

export interface IBENewMasterTeamDuplicate {
  'Head Coach Email': string
  'Head Coach First and Last Name': string
  'Master Team Name': string
  'Team Admin Email': string
  'Team Admin First and Last Name': string
  head_coach_data?: IBEDuplicateExtraData
  admin_data?: IBEDuplicateExtraData[]
}

export interface IBEExistingMasterTeamDuplicate {
  head_coach: string
  head_coach_email: string
  name: string
  team_admins: string[]
  team_admins_emails: string[]
  head_coach_data: IBEDuplicateExtraData
  admin_data: IBEDuplicateExtraData[]
}

interface IBEDuplicate {
  id: string
  index: number
  new: IBENewMasterTeamDuplicate
  existing: IBEExistingMasterTeamDuplicate
  differences: { [key: string]: unknown }
}

export interface IDuplicateExtraData {
  id: string
  fullName: string
  email: string
}

export interface IFENewMasterTeamDuplicate {
  headCoachName: string
  headCoachEmail: string
  headCoachData?: IDuplicateExtraData
  teamAdminEmail: string
  teamAdminName: string
  adminData?: IDuplicateExtraData[]
  masterTeamName: string
}

export interface IImportMasterTeamCSVError {
  idx: string
  error: string
  master_team_name: string
}

export interface IBEImportMasterTeamCSVResponse {
  status: TDeleteStatus
  errors: IImportMasterTeamCSVError[]
  success: string[]
  duplicates: IBEDuplicate[]
}

export interface IFEExistingMasterTeamDuplicate {
  id: string
  headCoach: string
  headCoachEmail: string
  name: string
  teamAdmins: string[]
  teamAdminsEmails: string[]

  headCoachData: IDuplicateExtraData
  adminData: IDuplicateExtraData[]
}

export interface IFEDuplicate {
  idx: number
  new: IFENewMasterTeamDuplicate
  existing: IFEExistingMasterTeamDuplicate
  differences: { [key: string]: unknown }
}

export interface IFEImportMasterTeamCSVResponse {
  status: TDeleteStatus
  errors?: IImportMasterTeamCSVError[]
  success: string[]
  duplicates?: IFEDuplicate[]
}

// Schedule Request

