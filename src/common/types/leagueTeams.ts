import { IDuplicate } from '@/common/interfaces'
import { ILeagueTeamImportExisting, ILeagueTeamImportNew } from '@/common/interfaces/leagueTeams.ts'

export type TLeagueTeamDuplicate = IDuplicate<ILeagueTeamImportNew, ILeagueTeamImportExisting>
