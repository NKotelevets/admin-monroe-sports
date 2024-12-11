import { ScheduleRequestButton } from '@/components/ScheduleRequest/ScheduleRequestButton.tsx'
import { PATH_TO_LEAGUE_TEAM_SCHEDULE_REQUEST } from '@/common/constants/paths.ts'
import { ExportAvailability } from '@/components/ExportAvailability.tsx'
import { useExportScheduleCSV } from '@/hooks/useExportScheduleCSV.ts'

export const LeagueTeamTableControls = () => {
  const { onExport, isLoading, status } = useExportScheduleCSV()

  return (
    <>
      <ScheduleRequestButton
        pathToSchedule={PATH_TO_LEAGUE_TEAM_SCHEDULE_REQUEST}
        pathToExport="availability/export-availability-for-league-team"
        exportFileName='league-teams-availability'
        onExport={{
          call: onExport,
          status,
          isLoading
        }}
      />
      <ExportAvailability pathToExport='availability/export-availability-for-league-team' />
    </>
  )
}
