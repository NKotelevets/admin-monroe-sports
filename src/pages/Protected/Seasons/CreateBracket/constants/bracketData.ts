import { IMatch, IParticipant } from '@/common/interfaces/bracket'
import { TBracketKeys } from '@/common/types/bracket'

const TWO_TEAMS: IParticipant[] = [
  {
    id: '1',
    isEmpty: false,
    subpoolName: '',
    seed: null,
  },
  {
    id: '2',
    isEmpty: false,
    subpoolName: '',
    seed: null,
  },
]

const ONE_TEAM: IParticipant[] = [
  {
    id: '1',
    isEmpty: false,
    subpoolName: '',
    seed: null,
  },
  {
    id: '2',
    isEmpty: true,
    subpoolName: '',
    seed: null,
  },
]

const twoTeamsBracket: IMatch[] = [
  {
    id: 1,
    nextMatchId: null,
    participants: TWO_TEAMS,
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    state: 'SCHEDULED',
  },
]

const threeTeamsBracket: IMatch[] = [
  {
    id: 3,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    gameNumber: 2,
    startTime: '-',
    state: 'SCHEDULED',
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
  },
  {
    id: 2,
    nextMatchId: 3,
    isNotFirstRound: false,
    gameNumber: '',
    participants: ONE_TEAM,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 1,
    nextMatchId: 3,
    isNotFirstRound: false,
    gameNumber: 1,
    participants: TWO_TEAMS,
    startTime: '-',
    state: 'SCHEDULED',
  },
]

const fourTeamsBracket: IMatch[] = [
  {
    id: 3,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    gameNumber: 3,
    startTime: '-',
    state: 'SCHEDULED',
    topTeam: 'Game 1 Winner',
    bottomTeam: 'Game 2 Winner',
  },
  {
    id: 2,
    nextMatchId: 3,
    isNotFirstRound: false,
    gameNumber: 2,
    participants: TWO_TEAMS,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 1,
    nextMatchId: 3,
    isNotFirstRound: false,
    gameNumber: 1,
    participants: TWO_TEAMS,
    startTime: '-',
    state: 'SCHEDULED',
  },
]

const fiveTeamsBracket: IMatch[] = [
  {
    id: 7,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 2 Winner',
    bottomTeam: 'Game 3 Winner',
    gameNumber: 4,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 6,
    nextMatchId: 7,
    isNotFirstRound: true,
    gameNumber: 2,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 5,
    nextMatchId: 7,
    isNotFirstRound: true,
    gameNumber: 3,
    participants: [],
    topTeam: '-',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
  },

  {
    id: 4,
    nextMatchId: 6,
    tournamentRoundText: 'Quarter-finals',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 3,
    nextMatchId: 6,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 2,
    nextMatchId: 5,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 1,
    nextMatchId: 5,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
]

const sixTeamsBracket: IMatch[] = [
  {
    id: 7,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 3 Winner',
    bottomTeam: 'Game 4 Winner',
    gameNumber: 5,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 5,
    nextMatchId: 7,
    isNotFirstRound: true,
    gameNumber: 3,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 6,
    nextMatchId: 7,
    isNotFirstRound: true,
    gameNumber: 4,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 3,
    nextMatchId: 6,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 6,
    tournamentRoundText: 'Quarter-finals',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 1,
    nextMatchId: 5,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 5,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
]

const sevenTeamsBracket: IMatch[] = [
  {
    id: 7,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 4 Winner',
    bottomTeam: 'Game 5 Winner',
    gameNumber: 6,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 5,
    nextMatchId: 7,
    isNotFirstRound: true,
    gameNumber: 4,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 6,
    nextMatchId: 7,
    isNotFirstRound: true,
    gameNumber: 5,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: 'Game 3 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 1,
    nextMatchId: 5,
    tournamentRoundText: 'Quarter-finals',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 5,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 6,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 6,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 3,
    startTime: '-',
    participants: TWO_TEAMS,
  },
]

const eightTeamsBracket: IMatch[] = [
  {
    id: 7,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 5 Winner',
    bottomTeam: 'Game 6 Winner',
    gameNumber: 7,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 5,
    nextMatchId: 7,
    isNotFirstRound: true,
    gameNumber: 5,
    participants: [],
    topTeam: 'Game 1 Winner',
    bottomTeam: 'Game 2 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 6,
    nextMatchId: 7,
    isNotFirstRound: true,
    gameNumber: 6,
    participants: [],
    topTeam: 'Game 3 Winner',
    bottomTeam: 'Game 4 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 3,
    nextMatchId: 6,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 3,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 6,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 4,
    startTime: '-',
    participants: TWO_TEAMS,
  },

  {
    id: 2,
    nextMatchId: 5,
    tournamentRoundText: 'Quarter-finals',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    state: 'SCHEDULED',
    participants: TWO_TEAMS,
  },
  {
    id: 1,
    nextMatchId: 5,
    tournamentRoundText: 'Quarter-finals',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
]

const nineTeamsBracket: IMatch[] = [
  {
    id: 15,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 6 Winner',
    bottomTeam: 'Game 7 Winner',
    gameNumber: 8,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 13,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 6,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: 'Game 3 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 14,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 7,
    participants: [],
    topTeam: 'Game 4 Winner',
    bottomTeam: 'Game 5 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 9,
    nextMatchId: 13,
    isNotFirstRound: true,
    tournamentRoundText: 'Quarter-finals',
    gameNumber: 2,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 10,
    nextMatchId: 13,
    isNotFirstRound: true,
    tournamentRoundText: 'Quarter-finals',
    gameNumber: 3,
    participants: [],
    topTeam: '-',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 11,
    nextMatchId: 14,
    isNotFirstRound: true,
    tournamentRoundText: 'Quarter-finals',
    gameNumber: 4,
    participants: [],
    topTeam: '-',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 12,
    nextMatchId: 14,
    isNotFirstRound: true,
    tournamentRoundText: 'Quarter-finals',
    gameNumber: 5,
    participants: [],
    topTeam: '-',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 1,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 4,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 5,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 6,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 7,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 8,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
]

const tenTeamsBracket: IMatch[] = [
  {
    id: 15,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 6 Winner',
    bottomTeam: 'Game 7 Winner',
    gameNumber: 9,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 13,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 7,
    participants: [],
    topTeam: 'Game 3 Winner',
    bottomTeam: 'Game 4 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 14,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 8,
    participants: [],
    topTeam: 'Game 5 Winner',
    bottomTeam: 'Game 6 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 9,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 3,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 10,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 4,
    participants: [],
    topTeam: '-',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 11,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 5,
    participants: [],
    topTeam: '-',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 12,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 6,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 1,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 4,
    nextMatchId: 10,
    tournamentRoundText: ' of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 5,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 6,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 7,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 8,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
]

const elevenTeamsBracket: IMatch[] = [
  {
    id: 15,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 6 Winner',
    bottomTeam: 'Game 7 Winner',
    gameNumber: 10,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 13,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 8,
    participants: [],
    topTeam: 'Game 4 Winner',
    bottomTeam: 'Game 5 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 14,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 9,
    participants: [],
    topTeam: 'Game 6 Winner',
    bottomTeam: 'Game 7 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 9,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 4,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 10,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 5,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 11,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 6,
    participants: [],
    topTeam: '-',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 12,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 7,
    participants: [],
    topTeam: 'Game 3 Winner',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 1,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 5,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 6,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 7,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 3,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 8,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
]

const twelveTeamsBracket: IMatch[] = [
  {
    id: 15,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 9 Winner',
    bottomTeam: 'Game 10 Winner',
    gameNumber: 11,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 13,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 9,
    participants: [],
    topTeam: 'Game 5 Winner',
    bottomTeam: 'Game 6 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 14,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 10,
    participants: [],
    topTeam: 'Game 7 Winner',
    bottomTeam: 'Game 8 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 9,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 5,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 10,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 6,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 11,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 7,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 3 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 12,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 8,
    participants: [],
    topTeam: 'Game 4 Winner',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 1,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 5,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 6,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 3,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 7,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 4,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 8,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
]

const thirteenTeamsBracket: IMatch[] = [
  {
    id: 15,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 10 Winner',
    bottomTeam: 'Game 11 Winner',
    gameNumber: 12,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 13,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 10,
    participants: [],
    topTeam: 'Game 6 Winner',
    bottomTeam: 'Game 7 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 14,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 11,
    participants: [],
    topTeam: 'Game 8 Winner',
    bottomTeam: 'Game 9 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 9,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 6,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 10,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 7,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: 'Game 3 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 11,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 8,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 4 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 12,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 9,
    participants: [],
    topTeam: 'Game 5 Winner',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 1,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 3,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 5,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
  {
    id: 6,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 4,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 7,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 5,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 8,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
]

const fourteenTeamsBracket: IMatch[] = [
  {
    id: 15,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 11 Winner',
    bottomTeam: 'Game 12 Winner',
    gameNumber: 13,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 13,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 11,
    participants: [],
    topTeam: 'Game 7 Winner',
    bottomTeam: 'Game 8 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 14,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 12,
    participants: [],
    topTeam: 'Game 9 Winner',
    bottomTeam: 'Game 10 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 9,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 7,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 10,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 8,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: 'Game 3 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 11,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 9,
    participants: [],
    topTeam: 'Game 4 Winner',
    bottomTeam: 'Game 5 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 12,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 10,
    participants: [],
    topTeam: 'Game 6 Winner',
    bottomTeam: '-',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 1,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 3,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 5,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 4,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 6,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 5,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 7,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 6,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 8,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    participants: ONE_TEAM,
  },
]

const fifteenTeamsBracket: IMatch[] = [
  {
    id: 15,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 12 Winner',
    bottomTeam: 'Game 13 Winner',
    gameNumber: 14,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 13,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 12,
    participants: [],
    topTeam: 'Game 8 Winner',
    bottomTeam: 'Game 9 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 14,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 13,
    participants: [],
    topTeam: 'Game 10 Winner',
    bottomTeam: 'Game 11 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 9,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 8,
    participants: [],
    topTeam: '-',
    bottomTeam: 'Game 1 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 10,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 9,
    participants: [],
    topTeam: 'Game 2 Winner',
    bottomTeam: 'Game 3 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 11,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 10,
    participants: [],
    topTeam: 'Game 4 Winner',
    bottomTeam: 'Game 5 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 12,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 11,
    participants: [],
    topTeam: 'Game 6 Winner',
    bottomTeam: 'Game 7 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },

  {
    id: 1,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    isNotFirstRound: false,
    gameNumber: '',
    startTime: '-',
    state: 'SCHEDULED',
    participants: ONE_TEAM,
  },
  {
    id: 2,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 3,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 5,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 4,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 6,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 5,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 7,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 6,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 8,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 7,
    startTime: '-',
    participants: TWO_TEAMS,
  },
]

const sixteenTeamsBracket: IMatch[] = [
  {
    id: 15,
    nextMatchId: null,
    participants: [],
    isNotFirstRound: true,
    topTeam: 'Game 13 Winner',
    bottomTeam: 'Game 14 Winner',
    gameNumber: 15,
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 13,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 13,
    participants: [],
    topTeam: 'Game 9 Winner',
    bottomTeam: 'Game 10 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 14,
    nextMatchId: 15,
    isNotFirstRound: true,
    gameNumber: 14,
    participants: [],
    topTeam: 'Game 11 Winner',
    bottomTeam: 'Game 12 Winner',
    startTime: '-',
    state: 'SCHEDULED',
  },
  {
    id: 9,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 9,
    participants: [],
    topTeam: 'Game 1 Winner',
    bottomTeam: 'Game 2 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 10,
    nextMatchId: 13,
    isNotFirstRound: true,
    gameNumber: 10,
    participants: [],
    topTeam: 'Game 3 Winner',
    bottomTeam: 'Game 4 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 11,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 11,
    participants: [],
    topTeam: 'Game 5 Winner',
    bottomTeam: 'Game 6 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 12,
    nextMatchId: 14,
    isNotFirstRound: true,
    gameNumber: 12,
    participants: [],
    topTeam: 'Game 7 Winner',
    bottomTeam: 'Game 8 Winner',
    startTime: '-',
    state: 'SCHEDULED',
    tournamentRoundText: 'Quarter-finals',
  },
  {
    id: 1,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    isNotFirstRound: false,
    gameNumber: 1,
    startTime: '-',
    state: 'SCHEDULED',
    participants: TWO_TEAMS,
  },
  {
    id: 2,
    nextMatchId: 9,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 2,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 3,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 3,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 4,
    nextMatchId: 10,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 4,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 5,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 5,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 6,
    nextMatchId: 11,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 6,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 7,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 7,
    startTime: '-',
    participants: TWO_TEAMS,
  },
  {
    id: 8,
    nextMatchId: 12,
    tournamentRoundText: 'of 16',
    state: 'SCHEDULED',
    isNotFirstRound: false,
    gameNumber: 8,
    startTime: '-',
    participants: TWO_TEAMS,
  },
]

export const BRACKETS_OPTIONS: Record<TBracketKeys, IMatch[]> = {
  2: twoTeamsBracket,
  3: threeTeamsBracket,
  4: fourTeamsBracket,
  5: fiveTeamsBracket,
  6: sixTeamsBracket,
  7: sevenTeamsBracket,
  8: eightTeamsBracket,
  9: nineTeamsBracket,
  10: tenTeamsBracket,
  11: elevenTeamsBracket,
  12: twelveTeamsBracket,
  13: thirteenTeamsBracket,
  14: fourteenTeamsBracket,
  15: fifteenTeamsBracket,
  16: sixteenTeamsBracket,
}

export const BRACKET_STYLES = {
  connectorColor: '#D9D9D9',
  boxHeight: 85,
  roundHeader: {
    fontColor: 'rgba(26, 22, 87, 1)',
    height: 46,
    fontFamily: 'Inter',
    fontSize: 14,
  },
}