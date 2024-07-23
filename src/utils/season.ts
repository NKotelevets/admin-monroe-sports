import { IImportedSeasonInfo, INewSeasonCSVFormat } from '@/common/interfaces/season'

export const getNormalizedVersionOfSeason = (id: string, season: INewSeasonCSVFormat): IImportedSeasonInfo => ({
  id,
  expectedEndDate: season['Expected End Date'],
  linkedLeagueTournament: season['Linked League / Tournament'],
  name: season['Season Name'],
  startDate: season['Start Date'],
  divisionPollDescription: season['Div/Pool Description'],
  divisionPollName: season['Division/Pool Name'],
  playoffFormat: season['Playoff Format'],
  playoffsTeams: season['Number of Teams to Qualify for Playoff'],
  standingsFormat: season['Standings Format'],
  subdivisionPollDescription: season['Subdiv/Pool Description'],
  subdivisionPollName: season['Subdiv/Pool Name'],
  tiebreakersFormat: season['Tiebreakers Format'],
})

