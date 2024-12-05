import {
  IFEDuplicate,
  IImportMasterTeamCSVError,
  IImportMasterTeamCSVTableData
} from '@/common/interfaces/masterTeams.ts'

export function duplicatesMap(duplicate: IFEDuplicate, idx: number) {
  const keyMapping: { [key: string]: string } = {
    'Head Coach First and Last Name': 'headCoachName',
    'Head Coach Email': 'headCoachEmail',
    'Master Team Name': 'masterTeamName',
    'Team Admin Email': 'teamAdminEmail',
    'Team Admin First and Last Name': 'teamAdminName'
  }

  return ({
    ...duplicate,
    differences: Object.keys(duplicate.differences).reduce((acc, key) => {
      const newKey = keyMapping[key] || key
      acc[newKey] = duplicate.differences[key] as string
      return acc
    }, {} as { [key: string]: string }),
    idx
  })
}

export function duplicatesTableMap(duplicate: IFEDuplicate, index: number): IImportMasterTeamCSVTableData {
  return ({
    message: 'A record with this data already exists',
    type: 'Duplicate',
    idx: index,
    index,
    headCoachName: duplicate.new.headCoachName,
    headCoachEmail: duplicate.new.headCoachEmail,
    masterTeamName: duplicate.new.masterTeamName,
    teamAdminEmail: duplicate.new.teamAdminEmail,
    teamAdminName: duplicate.new.teamAdminName,
    status: 'Duplicate'
  })
}

export function duplicatesErrorMap(error: IImportMasterTeamCSVError): IImportMasterTeamCSVTableData {
  return ({
    idx: -1,
    masterTeamName: error.master_team_name,
    message: error.error,
    status: 'Error'
  }) as IImportMasterTeamCSVTableData
}
