import { BEST_RECORD_WINS, SINGLE_ELIMINATION_BRACKET } from '@/common/constants/league'
import { IBESeason, IImportedSeasonInfo, INewSeasonCSVFormat } from '@/common/interfaces/season'

export const getNormalizedVersionOfSeason = (existing: IBESeason, season: INewSeasonCSVFormat): IImportedSeasonInfo => {
  const existedDivision = existing.divisions.find((division) => division.name === season['Division/Pool Name'])
  const existedSubdivision = existedDivision
    ? existedDivision.sub_division.find((subdivision) => subdivision.name === season['Subdiv/Pool Name'])
        ?.playoff_format
    : ''

  return {
    id: existing.id,
    expectedEndDate: season['Expected End Date'],
    linkedLeagueTournament: season['Linked League / Tournament'],
    name: season['Season Name'],
    startDate: season['Start Date'],
    divisionPollDescription: season['Div/Pool Description'],
    divisionPollName: season['Division/Pool Name'],
    playoffFormat:
      season['Playoff Format'] === SINGLE_ELIMINATION_BRACKET && existedSubdivision === 1
        ? SINGLE_ELIMINATION_BRACKET
        : BEST_RECORD_WINS,
    playoffsTeams: season['Number of Teams to Qualify for Playoff'],
    standingsFormat: season['Standings Format'],
    subdivisionPollDescription: season['Subdiv/Pool Description'],
    subdivisionPollName: season['Subdiv/Pool Name'],
    tiebreakersFormat: season['Tiebreakers Format'],
  }
}
