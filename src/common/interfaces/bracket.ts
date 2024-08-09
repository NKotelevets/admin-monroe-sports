export interface IParticipant {
  id: string
  isEmpty: boolean
  subpoolName: string
  seed: number | null
}

export interface IMatch {
  id: number
  nextMatchId: number | null
  tournamentRoundText?: string
  state: string
  isNotFirstRound?: boolean
  gameNumber: number | string
  startTime: string
  topTeam?: string
  bottomTeam?: string
  participants: IParticipant[]
}

