import { IMatch } from './bracket'

interface IBEMatchParticipant {
  created_at?: string
  updated_at?: string
  sub_division: string | null
  seed: number | null
  id?: string
  is_empty: boolean
  match?: string
}

interface IBEMatch {
  id?: string
  bottom_team: string
  top_team: string
  bracket?: number
  created_at?: string
  updated_at?: string
  game_number: number | string | null
  match_integer_id: number
  is_not_first_round: boolean
  stage?: string | null
  state?: null
  start_time?: string | null
  tournament_round_text: string
  next_match_id: number | null
  match_participants: IBEMatchParticipant[]
}

interface IBEBracket {
  created_at?: string
  name: string
  number_of_teams: number
  published?: boolean
  subdivision: string[]
  updated_at?: string
  matches: IBEMatch[]
  id: number
}

interface IBESubdivision {
  id?: string
  name: string
  description: string
  playoff_format: number | string
  standings_format: number | string
  tiebreakers_format: number | string
  brackets?: IBEBracket[]
}

interface IFEBracket {
  createdAt: string
  name: string
  numberOfTeams: number
  published: boolean
  subdivision: string[]
  updatedAt: string
  matches: IMatch[]
  id?: number
}

export interface IFESubdivision {
  name: string
  description: string
  playoffFormat: string
  standingsFormat: string
  tiebreakersFormat: string
  brackets: IFEBracket[]
}

export interface IBEDivision {
  id?: string
  name: string
  description: string
  sub_division: IBESubdivision[]
  created_at?: string
  updated_at?: string
}

export interface IFEDivision {
  name: string
  description: string
  subdivisions: IFESubdivision[]
}

export interface IImportedSubdivision {
  id?: string
  name: string
  description: string
  playoff_format: number | string
  standings_format: number | string
  tiebreakers_format: number | string
}

export interface IUpdateDivision {
  name: string
  description: string
  sub_division: IImportedSubdivision[]
}
