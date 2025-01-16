import { ScheduleRequestButton } from '@/components/ScheduleRequest/ScheduleRequestButton.tsx'
import { PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST, PATH_TO_MASTER_TEAMS_IMPORT_INFO } from '@/common/constants/paths.ts'
import { ExportAvailability } from '@/components/ExportAvailability.tsx'
import { useNavigate } from 'react-router-dom'
import { useExportScheduleCSV } from '@/hooks/useExportScheduleCSV.ts'
import { compressData } from '@/utils'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import { ImportButton } from '@/components/ImportButton.tsx'
import { TDeleteStatus } from '@/common/types'
import { useMasterTeamsImportCSVMutation } from '@/redux/masterTeams/masterTeams.api.ts'

export const MasterTeamTableControls = () => {
  const navigate = useNavigate()

  const [importMasterTeamCSV] = useMasterTeamsImportCSVMutation()

  const { onExport, isLoading, status } = useExportScheduleCSV()
  const { masterTeams } = useMasterTeamsSlice()

  const onShowSchedule = (ids: string[], start: string, end: string) => {
    const data = masterTeams.map(lt => ({
      id: lt.id,
      name: lt.name,
      masterTeamId: undefined,
      masterTeamName: undefined,
      leagueName: undefined
    }))
      .filter(obj => ids.includes(obj.id))

    // convert data to be used on next screen
    const b64 = compressData(data)
    navigate(`${PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST}/${start},${end}/${b64}`)
  }

  /**
   * Handles importing a CSV
   * @param body
   */
  const onImport = async (body: FormData) => {
    return importMasterTeamCSV(body).unwrap()
      .then(response => ({
        status: response.status as TDeleteStatus,
        message: ''
      }))
      .catch(response => {
        return ({
          status: 'red' as TDeleteStatus,
          message: (response?.data as {
            code: string;
            error: string
          })?.error || response.data?.detail || 'Something went wrong. Please, try again'
        })
      })
  }

  return (
    <>
      <ScheduleRequestButton
        pathToExport="availability/export"
        exportFileName="master-teams-availability"
        pathToSchedule={PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST}
        onShowSchedule={onShowSchedule}
        onExport={{
          call: onExport,
          status,
          isLoading
        }}
      />
      <ExportAvailability pathToExport="availability/export" />
      <ImportButton
        infoPath={PATH_TO_MASTER_TEAMS_IMPORT_INFO}
        onChange={onImport}
      />
    </>
  )
}
