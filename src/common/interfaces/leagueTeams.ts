import { IAdditionalEmail, IAdditionalPhone } from '@/common/interfaces'
import { IBEDivision, IBESubdivision, IFEDivision, IFESubdivision } from '@/common/interfaces/division'
import { IBELeague, IFELeague } from '@/common/interfaces/league'
import { IBEOperator, IFEOperator } from '@/common/interfaces/operator'
import { IBEMasterTeam, IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'

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
  headCoach:  IFEHeadCoachTeamAdmin | null
  league: IBELeague
  division: IFEDivision | null
  subdivision: IFESubdivision | null
  masterTeam: IFEMasterTeam | null
  operator: IFESimpleEntity | null
  logoS3Url: string
}

export interface IGetLeagueTeamsRequest {
  limit: number
  offset: number
  ordering?: string | null
  name?: string | null
  division_name?: string | null
  subdivision_name?: string | null
  league_name?: string | null
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

export interface IFELeagueTeamDetails {
  name: string
  headCoach: IFESimpleEntity
  teamsAdmins: IFESimpleEntity[]
  players: IFESimpleEntity[]
  coaches: IFESimpleEntity[]
  leagues: IFELeague[]
  divisions: IFEDivision[]
  subdivisions: IFESubdivision[]
}

export interface ILeagueTeamError {
  id: string
  name: string
  error: string
}

