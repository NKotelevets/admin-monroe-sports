import { IAdditionalEmail, IAdditionalPhone, IDuplicate, IDeletingError } from '@/common/interfaces'
import { IBEDivision, IBESubdivision, IFEDivision, IFESubdivision } from '@/common/interfaces/division'
import { IBELeague, IFELeague } from '@/common/interfaces/league'
import { IBEOperator, IFEOperator } from '@/common/interfaces/operator'
import { IBEMasterTeam, IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { TDeleteStatus, TErrorDuplicate } from '@/common/types'
import { IFESeason } from '@/common/interfaces/season.ts'
import { TLeagueTeamDuplicate } from '@/common/types/leagueTeams.ts'

interface IHeadCoachTeamAdmin {
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

interface IFEHeadCoachTeamAdmin {
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
  operator: null | IFEOperator
  phoneNumber: null | string
  phoneNumberVerified: false
  photoS3Url: null | string
  state: null | string
  systemRole: number
  updatedAt: string
  zipCode: null | string
}

export interface IBELeagueTeam {
  id: string
  division: IBEDivision
  updated_at: string
  created_at: string
  name: string
  logo_s3_url: string
  head_coach: IHeadCoachTeamAdmin | null
  master_team: IBEMasterTeam
  master_team_admin: IBESimpleEntity
  master_team_admins: IBESimpleEntity[]
  league: IBELeague
  subdivision: IBESubdivision
  operator: IBESimpleEntity
}

export interface IFELeagueTeam {
  id: string
  name: string
  canBeDeleted: boolean
  headCoach:  IFEHeadCoachTeamAdmin | null
  league: IBELeague
  division: IFEDivision | null
  subdivision: IFESubdivision | null
  masterTeam: IFEMasterTeam | null
  operator: IFESimpleEntity | null
  season: IFESeason | null
  logoS3Url: string
  type?: 'masterTeam' | 'teamAdmin'
  adminData?: {
    id: string
    name: string | null
    email: string | null
  }[]
}

export interface IGetLeagueTeamsRequest {
  limit: number
  offset: number
  ordering?: string | null
  name?: string | null
  division_name?: string | null
  subdivision_name?: string | null
  league_name?: string | null
  season_name?: string | null
}

export interface IGetLeagueTeamsResponse {
  count: number
  results: IFELeagueTeam[]
}

export interface ICreateLeagueTeamRequest {
  name: string
  masterTeam?: string
  masterTeamAdmin?: string
  league: string
  division: string
  subdivision: string
}

export interface IBESimpleEntity {
  id: string
  first_name: string
  last_name: string
  phone_number: string | null
  email: string
}

export interface IBELeagueTeamDetails {
  id: string
  name: string
  head_coach: IBESimpleEntity
  operator: IBESimpleEntity
  master_team: IFEMasterTeam
  master_team_admins: IBESimpleEntity[]
  master_team_admin: IBESimpleEntity
  logo_s3_url?: string
  league: IBELeague
  division?: IBEDivision
  subdivision?: IBESubdivision
  created_at: string
  update_at: string
}

export interface IFESimpleEntity {
  id: string
  fullName: string
  phone: string | null
  email: string
}

export interface IFELeagueTeamDetails {
  id: string
  name: string
  canBeDelete: boolean
  masterTeam: IFEMasterTeam
  masterTeamAdmins?: IFESimpleEntity[]
  masterTeamAdmin?: IFESimpleEntity
  headCoach?: IFESimpleEntity
  operator?: IFESimpleEntity
  league: IFELeague
  season?: IFESeason
  division?: IFEDivision
  subdivision?: IFESubdivision
  logoS3Url?: string
  createdAt: string
  updatedAt: string
  type?: 'masterTeam' | 'teamAdmin'
  adminData?: {
    id: string
    name: string | null
    email: string | null
  }[]
}

export interface IBulkDeleteResponse {
  items: IDeletingError[]
  status: TDeleteStatus
  total: number
  success: number
}

/**
 * Import League Team CSV
 */

// BE

export interface IBEImportLeagueTeamCSVError {
  idx: string
  error: string
  league_team_name: string
}

export interface IDELeagueTeamImportExisting {
  division_name: string
  league_name: string
  league_team_name: string
  master_team_name: string
  mt_admin_emails: string[]
  mt_admin_names: string[]
  subdivision_name: string
}

export interface IBELeagueTeamImportNew {
  id?: string
  'Division/Pool Name': string
  'League Team Name': string
  'League/Tourn Name': string
  'Linked Master Team Name': string
  'MT Team Admin Email': string
  'MT Team Admin First and Last Name': string
  'Subdiv/Pool Name': string
}

export interface IBEImportLeagueTeamCSVResponse {
  status: TDeleteStatus
  errors?: IBEImportLeagueTeamCSVError[]
  success: IBELeagueTeamImportNew[]
  duplicates?: IDuplicate<IBELeagueTeamImportNew, IDELeagueTeamImportExisting>[]
}

// FE

export interface ILeagueTeamImportTable {
  idx: number
  index: number
  teamName: string
  status: TErrorDuplicate
  message: string
}

export interface IImportLeagueTeamCSVError {
  idx: string
  error: string
  leagueName: string
}

export interface ILeagueTeamImportExisting {
  id: string

  leagueId?: string
  leagueName: string
  leagueTeamName: string

  masterTeamId?: string
  masterTeamName: string

  mtAdminId?: string[]
  mtAdminEmails: string[]
  mtAdminNames: string[]

  divisionId?: string
  divisionName: string

  subdivisionId?: string
  subdivisionName: string
}

export interface ILeagueTeamImportNew {
  leagueId?: string
  leagueName: string
  leagueTeamName: string

  masterTeamId?: string
  masterTeamName: string

  mtAdminId?: string
  mtAdminEmail: string
  mtAdminName: string

  divisionId?: string
  divisionName: string

  subdivisionId?: string
  subdivisionName: string
}

export interface IFEImportLeagueTeamCSVResponse {
  status: TDeleteStatus
  errors?: IImportLeagueTeamCSVError[]
  success: IBELeagueTeamImportNew[]
  duplicates?: TLeagueTeamDuplicate[]
}

export interface ILeagueTeamUpdateBody {
  id: string
  body: {
    name?: string
    master_team?: string
    master_team_admin?: string
    league?: string
    division?: string
    subdivision?: string
  }
}
