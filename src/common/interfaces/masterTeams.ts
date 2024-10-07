import { IBEOperator } from './operator'

import { IBEDivision } from '@/common/interfaces/division'

interface IHeadCoachTeamAdminTableData {
  id: string
  fullName: string
  email: string
}

interface IAdditionalEmail {
  email: string
  is_verified: boolean
}

interface IAdditionalPhone {
  phone_number: string
  is_verified: boolean
}

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
  team_admin: IHeadCoachTeamAdmin | null
}

export interface IFEMasterTeam {
  id: string
  name: string
  headCoach: IHeadCoachTeamAdminTableData | null
  teamAdmin: IHeadCoachTeamAdminTableData | null
}

export interface IGetMasterTeamsRequest {
  limit: number
  offset: number
  order_by?: string | null
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
