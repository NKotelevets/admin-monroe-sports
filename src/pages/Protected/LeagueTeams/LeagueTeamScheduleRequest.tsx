import { useNavigate, useParams } from 'react-router-dom'
import { useExportScheduleCSV } from '@/hooks/useExportScheduleCSV.ts'
import { PATH_TO_LEAGUE_TEAM_SCHEDULE_REQUEST, PATH_TO_LEAGUE_TEAMS } from '@/common/constants/paths.ts'
import { ReactElement } from 'react'
import { ScheduleRequestControls } from '@/components/ScheduleRequest/ScheduleRequestControls.tsx'
import { ScheduleProvider } from '@/components/ScheduleRequest/ScheduleProvider.tsx'
import { Page } from '@/layouts/Page'
import { MonroeBlueText } from '@/components/Elements'
import {
  LeagueTeamScheduleRequestTable
} from '@/pages/Protected/LeagueTeams/components/LeagueTeamScheduleRequestTable.tsx'
import { TScheduleAdditionalData } from '@/common/types'
import { decompressData } from '@/utils'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_LEAGUE_TEAMS}>League Teams</a> },
  { title: <MonroeBlueText>Schedule Request</MonroeBlueText> }
]

const LeagueTeamScheduleRequest = () => {
  const params = useParams<{ range: string, selectedIds: string }>()
  const navigate = useNavigate()

  const { onExport, status, isLoading } = useExportScheduleCSV()

  // cant continue without params
  if (!params || !params.range || !params.selectedIds) {
    navigate(PATH_TO_LEAGUE_TEAMS)
    return
  }

  const data = decompressData(params.selectedIds)
  const ids: string[] = []
  let additionalData = undefined

  if (data) {
    const dt = data as TScheduleAdditionalData[]
    ids.push(...dt.filter(d => d.masterTeamId).map(d => d.masterTeamId!))
    additionalData = dt
  }

  const renderControls = (): ReactElement => (
    <ScheduleRequestControls
      onExport={onExport}
      status={status}
      isLoading={isLoading}
    />
  )

  return (
    <ScheduleProvider
      initialDates={params.range.split(',')}
      initialSelectedIds={ids}
      additionalData={additionalData}
      pathToNavigate={PATH_TO_LEAGUE_TEAM_SCHEDULE_REQUEST}
      pathToExport="availability/export-availability-for-league-team"
    >
      <Page
        title="Schedule Request"
        breadcrumbs={BREAD_CRUMB_ITEMS}
        controls={renderControls}
      >
        <LeagueTeamScheduleRequestTable />
      </Page>
    </ScheduleProvider>
  )
}

export default LeagueTeamScheduleRequest
