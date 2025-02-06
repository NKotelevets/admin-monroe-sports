import { IFEDivision, IFESubdivision } from '@/common/interfaces/division.ts'
import { IFELeague } from '@/common/interfaces/league.ts'
import { IFELeagueTeam, IFESimpleEntity } from '@/common/interfaces/leagueTeams.ts'
import { ILocation } from '@/common/interfaces/location.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { IFESeason } from '@/common/interfaces/season.ts'

export interface IRsvpAnswers {
  going: number
  notGoing: number
  maybe: number
  noReply: number
}

export interface IPlayoffInfo {
  id: string
  league: IFELeague
  season: IFESeason
  division: IFEDivision | null
  subdivision: string | null
  subdivisionOrPool1: IFESubdivision | null
  subdivisionOrPool2: IFESubdivision | null
  updatedAt: string
  createdAt: string
  playoffStep: string
  gameNumber: number
  seed1: number
  seed2: number
  possible: boolean
  bracket: number
  game: string
  match: string
}

export interface IEvent {
  status?: string
  id: string
  homeTeam?: IFEMasterTeam
  awayTeam?: IFEMasterTeam
  location: ILocation
  coachHomeTeam?: IFESimpleEntity
  coachAwayTeam?: IFESimpleEntity
  homeTeamRsvpAnswers: IRsvpAnswers
  awayTeamRsvpAnswers: IRsvpAnswers
  season?: IFESeason
  division?: IFEDivision
  subDivision?: IFESubdivision
  playoffInfo?: IPlayoffInfo
  homeLeagueTeam?: IFELeagueTeam
  awayLeagueTeam?: IFELeagueTeam
  updatedAt: string
  createdAt: string
  type: number
  date: string
  time: string
  day: string
  courtNumber: number
  courtOrField?: string
  referee?: string
  homeTeamScore?: number
  awayTeamScore?: number
  notes?: string
  duration: number
  repeats?: string
  eventDescription: string
  eventSubscribers?: string
  subResource: string
  minAttendance: number
  whoCreated?: string
  league?: string | IFELeague
}

export interface IEventForm {
  eventType: number | null
  eventDescription: string
  eventSubscribers?: string[]
  date: string
  day: string
  time: string
  duration: number | null
  locationId?: string
  courtOrField: string
  subResources: string
  ignoreConflicts: boolean
  repeats?: string
  endRepeat?: string
  team1Id?: string
  team2Id?: string
  league?: string
  season?: string
  team1Name?: string
  team2Name?: string
  coach1Name?: string
  coach2Name?: string
  season1Name?: string
  season2Name?: string
  league1Name?: string
  league2Name?: string
  division?: string
  bracket?: number
  game?: string
}
