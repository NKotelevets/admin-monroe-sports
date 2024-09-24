import { IBEDivision } from '@/common/interfaces/division'

export interface IMasterTeam {
  id: string
  head_coach: string
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
}

