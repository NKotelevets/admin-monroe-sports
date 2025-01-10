import { TLeagueTeamDuplicate } from '@/common/types/leagueTeams.ts'
import { IImportLeagueTeamCSVError, ILeagueTeamImportTable } from '@/common/interfaces/leagueTeams.ts'


export function duplicatesMap(duplicate: TLeagueTeamDuplicate, idx: number) {
  const keyMapping: { [key: string]: string } = {
    'League Team Name': 'leagueTeamName',
    'League/Tourn Name': 'leagueName',
    'Linked Master Team Name': 'masterTeamName',
    'MT Team Admin Email': 'mtAdminEmail',
    'MT Team Admin First and Last Name': 'mtAdminName',
    'Subdiv/Pool Name': 'mtAdminName',
    'Division/Pool Name': 'divisionName',
  }

  return ({
    ...duplicate,
    differences: Object.keys(duplicate.differences || {}).reduce((acc, key) => {
      const newKey = keyMapping[key] || key
      acc[newKey] = duplicate.differences ? duplicate.differences[key as keyof TLeagueTeamDuplicate['differences']] : ''
      return acc
    }, {} as { [key: string]: string }),
    idx
  })
}


export function duplicatesTableMap(duplicate: TLeagueTeamDuplicate, index: number): ILeagueTeamImportTable {
  return ({
    message: 'A record with this data already exists',
    idx: index,
    index,
    teamName: duplicate.new.masterTeamName,
    status: 'Duplicate'
  })
}

export function duplicatesErrorMap(error: IImportLeagueTeamCSVError): ILeagueTeamImportTable {
  return ({
    idx: -1,
    teamName: error.leagueName,
    message: error.error,
    status: 'Error'
  }) as ILeagueTeamImportTable
}
