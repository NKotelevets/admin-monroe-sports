import { ScheduleRequestButton } from '@/components/ScheduleRequest/ScheduleRequestButton.tsx'
import { PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST } from '@/common/constants/paths.ts'
import { ExportAvailability } from '@/components/ExportAvailability.tsx'
import { ImportButton } from '@/pages/Protected/MasterTeams/components/ImportButton.tsx'
import { useNavigate } from 'react-router-dom'
import { useExportScheduleCSV } from '@/hooks/useExportScheduleCSV.ts'
import { compressData } from '@/utils'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'

export const MasterTeamTableControls = () => {
  const navigate = useNavigate()
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
      <ImportButton />
    </>
  )
}
