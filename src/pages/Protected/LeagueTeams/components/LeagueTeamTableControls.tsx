import { ScheduleRequestButton } from '@/components/ScheduleRequest/ScheduleRequestButton.tsx'
import { PATH_TO_LEAGUE_TEAM_SCHEDULE_REQUEST } from '@/common/constants/paths.ts'
import { ExportAvailability } from '@/components/ExportAvailability.tsx'
import { useExportScheduleCSV } from '@/hooks/useExportScheduleCSV.ts'
import { ImportLeagueTeamButton } from '@/pages/Protected/LeagueTeams/components/ImportLeagueTeamButton.tsx'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { useNavigate } from 'react-router-dom'
import { compressData } from '@/utils'

export const LeagueTeamTableControls = () => {
  const navigate = useNavigate()
  const { onExport, isLoading, status } = useExportScheduleCSV()
  const {  leagueTeams } = useLeagueTeamsSlice()

  const onShowSchedule = (ids: string[], start: string, end: string) => {
    const data = leagueTeams.map(lt => ({
      id: lt.id,
      name: lt.name,
      masterTeamId: lt.masterTeam?.id,
      masterTeamName: lt.masterTeam?.name,
      leagueName: lt.league.name,
    }))
      .filter(obj => !!obj.masterTeamId && ids.includes(obj.id) )

    // convert data to be used on next screen
    const b64 = compressData(data)
    navigate(`${PATH_TO_LEAGUE_TEAM_SCHEDULE_REQUEST}/${start},${end}/${b64}`)
  }

  return (
    <>
      <ScheduleRequestButton
        pathToSchedule={PATH_TO_LEAGUE_TEAM_SCHEDULE_REQUEST}
        pathToExport="availability/export-availability-for-league-team"
        exportFileName='league-teams-availability'
        onShowSchedule={onShowSchedule}
        onExport={{
          call: onExport,
          status,
          isLoading
        }}
      />
      <ExportAvailability pathToExport='availability/export-availability-for-league-team' />
      <ImportLeagueTeamButton/>
    </>
  )
}
