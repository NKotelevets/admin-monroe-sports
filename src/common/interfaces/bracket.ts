export interface IParticipant {
  id: string
  isEmpty: boolean
  subpoolName: string | null
  seed: number | null
}

export interface IMatch {
  id: number
  nextMatchId: number | null
  tournamentRoundText?: string
  state: string
  isNotFirstRound?: boolean
  gameNumber: number | string | null
  startTime: string
  topTeam?: string
  bottomTeam?: string
  participants: IParticipant[]
  primaryId?: string
}

