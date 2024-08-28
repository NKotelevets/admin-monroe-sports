import { IBEDivision, IFEDivision } from '@/common/interfaces/division'
import { IBELeague } from '@/common/interfaces/league'
import { TDeletionStatus, TErrorDuplicate } from '@/common/types'

interface ISeasonCommonFields {
  id: string
  name: string
  league: IBELeague
  divisions: IBEDivision[]
}

export interface IBESeason extends ISeasonCommonFields {
  updated_at?: string
  created_at?: string
  start_date: string
  expected_end_date: string
}

export interface ICreateBESeason {
  name: string
  league_id: string
  divisions: IBEDivision[]
  start_date: string
  expected_end_date: string
}

export interface IFECreateSeason {
  name: string
  startDate: string
  expectedEndDate: string
  league: string
  divisions: IFEDivision[]
}

export interface IUpdateSeasonBody {
  name: string
  league: string
  divisions: IBEDivision[]
  start_date: string
  expected_end_date: string
}

export interface IFESeason extends ISeasonCommonFields {
  updatedAt: string
  createdAt: string
  startDate: string
  expectedEndDate: string
}

export interface IGetSeasonsRequestParams {
  limit: number
  offset: number
  league_name?: string | undefined
  name?: string
  ordering?: string | null
  search?: string
}

export interface IGetSeasonsResponse {
  count: number
  seasons: IFESeason[]
}

interface IImportSeasonSuccess {
  id: string
  name: string
  description: string
  divisions: {
    id: string
    name: string
    description: string
    sub_division: {
      name: string
      description: string
      playoff_format: number
      standings_format: number
      tiebreakers_format: number
      brackets: []
      changed: boolean
    }[]
  }[]
}

interface IImportSeasonError {
  index: number
  error: string
  league?: IBELeague
  season_name: string
}

interface IImportSeasonDuplicate {
  index: number
  existing: IBESeason
  new: INewSeasonCSVFormat
}

export interface IImportSeasonsResponse {
  status: TDeletionStatus
  success?: IImportSeasonSuccess[]
  errors?: IImportSeasonError[]
  duplicates?: IImportSeasonDuplicate[]
}

export interface IDeletionSeasonItemError {
  id: string
  error: string
  name: string
  league: IBELeague
}

export interface IDeleteSeasonsResponse {
  status: TDeletionStatus
  total: number
  success: number
  items: IDeletionSeasonItemError[]
}

export interface INewSeasonCSVFormat {
  'Div/Pool Description': string
  'Division/Pool Name': string
  'Expected End Date': string
  'Linked League / Tournament': string
  'Number of Teams to Qualify for Playoff': number
  'Playoff Format': string
  'Season Name': string
  'Standings Format': string
  'Start Date': string
  'Subdiv/Pool Description': string
  'Subdiv/Pool Name': string
  'Tiebreakers Format': string
}

export interface IImportedSeasonInfo {
  id: string
  divisionPollDescription: string
  divisionPollName: string
  expectedEndDate: string
  linkedLeagueTournament: string
  playoffsTeams: number | null | string
  name: string
  playoffFormat: string
  standingsFormat: string
  startDate: string
  subdivisionPollDescription: string
  subdivisionPollName: string
  tiebreakersFormat: string
}

export interface ISeasonDuplicate {
  existing: IBESeason
  new: IImportedSeasonInfo
  index: number
}

export interface IImportSeasonTableRecord {
  name: string
  leagueName: string
  id: string
  leagueId: string
  message: string
  type: TErrorDuplicate
  idx: number
}

export interface ISeasonReviewUpdateData {
  name: string
  linkedLeagueName: string
  startDate: string
  expectedEndDate: string
  divisions: IBEDivision[]
}

interface ICreateSeasonDivision {
  name: string
  description: string | null
  sub_division: {
    name: string
    description: string | null
    playoff_format: number
    standings_format: number
    tiebreakers_format: number
  }[]
}

export interface IBECreateSeasonBody {
  name: string
  start_date: string
  expected_end_date: string
  league_id: string
  divisions: ICreateSeasonDivision[]
}

export interface ICreateSeasonError {
  code: string
  details: {
    name?: string
    divisions?: {
      name?: string
      sub_division?: {
        name: string
      }[]
    }[]
  }
}
