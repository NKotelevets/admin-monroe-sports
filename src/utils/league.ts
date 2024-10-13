import { BEST_RECORD_WINS, LEAGUE, WINNING } from '@/common/constants/league'
import { IImportedLeague, INewLeague } from '@/common/interfaces/league'

export const getNormalizedNewVersionOfLeagueTourn = (id: string, record: IImportedLeague): INewLeague => ({
  id,
  description: record.Description,
  name: record['League/Tournament Name'],
  playoff_format: record['Default Playoff Format'] === BEST_RECORD_WINS ? 0 : 1,
  playoffs_teams: record['Number of Teams to Qualify for Playoff'],
  standings_format: record['Default Standings Format'] === WINNING ? 0 : 1,
  tiebreakers_format: record['Default Tiebreakers Format'] === WINNING ? 0 : 1,
  type: record.Type === LEAGUE ? 0 : 1,
  welcome_note: record['Welcome Note'],
})
