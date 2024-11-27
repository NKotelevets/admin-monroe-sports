import { IAdditionalEmail, IAdditionalPhone } from '@/common/interfaces'
import { IBEDivision, IBESubdivision, IFEDivision, IFESubdivision } from '@/common/interfaces/division'
import { IBELeague, IFELeague } from '@/common/interfaces/league'
import { IBEOperator } from '@/common/interfaces/operator'

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
  team_name?: string | null
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

export interface IExportInfoProps {
  selectedMasterTeamIds: string[]
}

// Schedule Request

export interface IGetScheduleRequestParams {
  start_date: string
  end_date: string
  team_ids: string
}

export interface IScheduleRequestWeekdays {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export interface IScheduleRequestResponse {
  id: string
  is_group: boolean
  user_id: string
  weekdays: IScheduleRequestWeekdays
  time_before: string
  time_after: string
  time_ranges: string[][]
  typed_time_ranges: { time_range: string[], availability_type: number }[]
  is_one_day: boolean,
  updated_at: string
  created_at: string
  availability_type: number
  schedule_type: number
  time_range_type: number
  start_date: string
  end_date: string
}

export interface IScheduleRequest {
  id: string
  isGroup: boolean
  userId: string
  weekdays: IScheduleRequestWeekdays
  timeBefore: string
  timeAfter: string
  timeRanges: string[][]
  typedTimeRanges: { timeRange: string[], availabilityType: number }[]
  isOneDay: boolean,
  updatedAt: string
  createdAt: string
  availabilityType: number
  scheduleType: number
  timeRangeType: number
  startDate: string
  endDate: string
}
