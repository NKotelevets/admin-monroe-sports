import { IImportedLeague, INewLeague } from '@/common/interfaces/league'

export const getNormalizedNewVersionOfLeagueTourn = (id: string, record: IImportedLeague): INewLeague => ({
  id,
  description: record.Description,
  name: record['League/Tournament Name'],
  playoff_format: record['Default Playoff Format'] === 'Best Record Wins' ? 0 : 1,
  playoffs_teams: record['Number of Teams to Qualify for Playoff'],
  standings_format: record['Default Standings Format'] === 'Winning %' ? 0 : 1,
  tiebreakers_format: record['Default Tiebreakers Format'] === 'Winning %' ? 0 : 1,
  type: record.Type === 'League' ? 0 : 1,
  welcome_note: record['Welcome Note'],
})

