import { IIdName } from '@/common/interfaces'
import { IBESeason } from '@/common/interfaces/season'
import { TDeletionStatus, TErrorDuplicate } from '@/common/types'
import { TLeagueTourn, TPlayOffFormat, TWinningPoints } from '@/common/types/league'

interface ICommonLeagueFields {
  id: string
  name: string
  description: string
}

export interface IBELeague extends ICommonLeagueFields {
  type: number
  updated_at: string
  created_at: string
  playoff_format: number
  standings_format: number
  tiebreakers_format: number
  playoffs_teams: number
  welcome_note: string
  league_seasons: IBESeason[]
}

export interface IBECreateLeagueBody extends Omit<IBELeague, 'id' | 'updated_at' | 'created_at' | 'league_seasons'> {
  league_seasons?: string[]
}

export interface IBEUpdateLeagueBody extends Omit<IBELeague, 'updated_at' | 'created_at' | 'league_seasons'> {}

export interface IFELeague<T = TLeagueTourn> extends ICommonLeagueFields {
  updatedAt: string
  createdAt: string
  welcomeNote: string
  type: T
  playoffFormat: TPlayOffFormat
  standingsFormat: TWinningPoints
  tiebreakersFormat: TWinningPoints
  playoffsTeams: number
  seasons: IIdName[] | string[]
}

export interface IFECreateLeagueBody {
  welcomeNote: string
  type: number
  playoffFormat: number
  standingsFormat: number
  tiebreakersFormat: number
  name: string
  description: string
  playoffsTeams: number
}

interface IImportLeagueSuccess {
  name: string
}

interface IImportLeagueError {
  index: number
  error: string
  league_name: string
}

export interface IImportedLeague {
  'Default Playoff Format': string
  'Default Standings Format': string
  'Default Tiebreakers Format': string
  Description: string
  'League/Tournament Name': string
  'Linked Seasons': string
  Type: string
  'Welcome Note': string
  'Number of Teams to Qualify for Playoff': number
}

export interface INewLeague extends ICommonLeagueFields {
  type: number
  playoff_format: number
  standings_format: number
  tiebreakers_format: number
  playoffs_teams: number
  welcome_note: string
  league_seasons?: string[]
}

export interface IImportLeagueDuplicates {
  index: number
  existing: IBELeague
  new: IImportedLeague
}

export interface IImportLeagueResponse {
  status: TDeletionStatus
  success: IImportLeagueSuccess[]
  errors?: IImportLeagueError[]
  duplicates?: IImportLeagueDuplicates[]
}

export interface IGetLeaguesRequestParams {
  limit: number
  offset: number
  league_name?: string | undefined
  playoff_format?: string | undefined
  standings_format?: string | undefined
  tiebreakers_format?: string | undefined
  type?: string | undefined
  order_by?: string
}

export interface IGetLeaguesResponse {
  count: number
  leagues: IFELeague[]
}

export interface ILeagueDuplicate {
  index: number
  existing: IBELeague
  new: INewLeague
}

export interface ILeagueDeletionItemError {
  id: string
  error: string
  name: string
}

export interface ILeagueBulkDeleteResponse {
  status: TDeletionStatus
  total: number
  success: number
  items: ILeagueDeletionItemError[]
}

export interface ILeagueImportInfoTableRecord {
  name: string
  message: string
  type: TErrorDuplicate
  idx: number
}
