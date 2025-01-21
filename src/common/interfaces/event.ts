import { IFELeagueTeam, IFESimpleEntity } from '@/common/interfaces/leagueTeams.ts'
import { IFEDivision, IFESubdivision } from '@/common/interfaces/division.ts'
import { IFESeason } from '@/common/interfaces/season.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { ILocation } from '@/common/interfaces/location.ts'

export interface IRsvpAnswers {
  going: number
  notGoing: number
  maybe: number
  noReply: number
}

export interface IEvent {
  id: string
  homeTeam?: IFEMasterTeam
  awayTeam?: IFEMasterTeam
  location: ILocation
  coachHomeTeam?: IFESimpleEntity
  coachAwayTeam?: IFESimpleEntity
  rsvpAnswers: IRsvpAnswers
  season?: IFESeason
  division?: IFEDivision
  subDivision?: IFESubdivision
  playoffInfo?: string
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
  league?: string
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
}
