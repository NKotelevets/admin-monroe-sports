export interface IUser {
  id: string
  email: string
  phone_number: string
  as_coach: IAsRole
  as_player: IAsRole
  additional_emails: IAdditionalEmail[]
  additional_phones: IAdditionalPhone[]
  phone_number_verified: boolean
  email_verified: boolean
  invite_accepted: string
  invite_date: string
  as_supervisor: IAsSupervisor
  updated_at: string
  created_at: string
  photo_s3_url: string
  first_name: string
  last_name: string
  birth_date: string
  gender: number
  zip_code: string
  city: string
  state: string
  emergency_contact_name: string
  emergency_contact_phone: string
}

export interface IAsRole {
  teams: ITeam[]
}

export interface ITeam {
  id: string
  head_coach: string
  division: IDivision
  sub_division: ISubDivision
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
}

export interface IDivision {
  id: string
  updated_at: string
  created_at: string
  name: string
  description: string
  sub_division: string
}

export interface ISubDivision {
  id: string
  updated_at: string
  created_at: string
  name: string
  description: string
}

export interface IAdditionalEmail {
  email: string
  is_verified: boolean
}

export interface IAdditionalPhone {
  phone_number: string
  is_verified: boolean
}

export interface IAsSupervisor {
  relation_type: number
  supervised: ISupervised[]
  teams: ITeam[]
}

export interface ISupervised {
  id: string
  email: string
  phone_number: string
  as_coach: IAsRole
  as_player: IAsRole
  additional_emails: IAdditionalEmail[]
  additional_phones: IAdditionalPhone[]
  phone_number_verified: boolean
  email_verified: boolean
  invite_accepted: string
  invite_date: string
  updated_at: string
  created_at: string
  photo_s3_url: string
  first_name: string
  last_name: string
  birth_date: string
  gender: number
  zip_code: string
  city: string
  state: string
  emergency_contact_name: string
  emergency_contact_phone: string
}
