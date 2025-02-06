import { IMatch } from '@/common/interfaces/bracket'

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

export interface IBEBracket {
  created_at?: string
  name: string
  number_of_teams: number
  published?: boolean
  subdivision: string[]
  updated_at?: string
  matches: IBEMatch[]
  id: number
}

export interface IBESubdivision {
  id?: string
  name: string
  description: string
  standings_format: number | string
  tiebreakers_format: number | string
  changed: boolean
}

export interface IFEMatch {
  id?: string
  bottomTeam: string
  topTeam: string
  bracket?: number
  createdAt?: string
  updatedAt?: string
  gameNumber: number | string | null
  matchIntegerId: number
  isNotFirstRound: boolean
  stage?: string | null
  state?: null
  startTime?: string | null
  tournamentRoundText: string
  nextMatchId: number | null
  matchParticipants: IBEMatchParticipant[]
}

export interface IFEBracket {
  createdAt: string
  name: string
  numberOfTeams: number
  published: boolean
  subDivision: string[]
  updatedAt: string
  matches: IMatch[]
  id?: number
}

export interface IFESubdivision {
  id?: string
  name: string
  description: string
  standingsFormat: number | string
  tiebreakersFormat: number | string
  changed: boolean
}

export interface IBEDivision {
  id?: string
  name: string
  description: string
  playoff_format: number | string
  brackets: IBEBracket[]
  sub_division: IBESubdivision[]
  created_at?: string
  updated_at?: string
}

export interface IFEDivision {
  id?: string
  name: string
  description: string
  playoffFormat: number | string
  brackets: IFEBracket[]
  subDivision: IFESubdivision[]
  createdAt?: string
  updatedAt?: string
}

export interface IImportedSubdivision {
  id?: string
  name: string
  description: string
  standings_format: number | string
  tiebreakers_format: number | string
  changed: boolean
}

export interface IUpdateDivision {
  name: string
  description: string
  sub_division: IImportedSubdivision[]
  brackets: IBEBracket[]
  playoff_format: number | string
}
