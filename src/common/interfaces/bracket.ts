import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'

export interface IParticipant {
  id: string
  isEmpty: boolean
  subDivision: string | null
  seed: number | null
}

export interface IMatch {
  id: number
  matchIntegerId?: number
  bracket?: number
  nextMatchId: number | null
  tournamentRoundText?: string
  state: string
  isNotFirstRound?: boolean
  gameNumber: number | string | null
  startTime: string
  topTeam?: string | IFELeagueTeam
  bottomTeam?: string | IFELeagueTeam
  matchParticipants: IParticipant[]
  primaryId?: string
  stage?: string
  createdAt?: string
  updatedAt?: string
}

export interface IBracket {
  id?: number
  name: string
  subdivisionsNames: string[]
  playoffTeams: number
  matches: IMatch[]
}
