import { IAdditionalEmail, IAdditionalPhone } from '@/common/interfaces'
import { IBEDivision } from '@/common/interfaces/division'
import { IBELeague } from '@/common/interfaces/league'
import { IBEOperator } from '@/common/interfaces/operator'

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
  head_coach: IHeadCoachTeamAdmin | null
  team_admins: IHeadCoachTeamAdmin[] | null
  leagues: IBELeague[]
}

export interface IFEMasterTeam {
  id: string
  name: string
  headCoachId: string | null
  headCoachFullName: string | null
  headCoachEmail: string | null
  teamAdminId: string | null
  teamAdminFullName: string | null
  teamAdminEmail: string | null
  leagues: IBELeague[]
}

export interface IGetMasterTeamsRequest {
  limit: number
  offset: number
  ordering?: string | null
  team_name?: string | null
  head_coach?: string | null
  league_name?: string | null
  team_admin?: string | null
}

export interface IGetMasterTeamsResponse {
  count: number
  results: IFEMasterTeam[]
}

export interface ICreateMTRequest {
  name: string
  head_coach: string
  coaches: string[]
  players: string[]
  team_admins: string[]
}

interface IBESimpleEntity {
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
}

interface IFESimpleEntity {
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
}

