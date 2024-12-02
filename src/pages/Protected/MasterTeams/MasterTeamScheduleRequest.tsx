import { Page } from '@/layouts/Page/index.tsx'
import { ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST, PATH_TO_MASTER_TEAMS } from '@/common/constants/paths.ts'
import { MasterTeamScheduleRequestTable } from './components/MasterTeamScheduleRequestTable'
import { MonroeBlueText } from '@/components/Elements'
import { ScheduleRequestControls } from '@/components/ScheduleRequest/ScheduleRequestControls.tsx'
import { ScheduleProvider } from '@/components/ScheduleRequest/ScheduleProvider.tsx'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
  { title: <MonroeBlueText>Schedule Request</MonroeBlueText> }
]

export const MasterTeamScheduleRequest = () => {
  const params = useParams<{ range: string, selectedIds: string }>()
  const navigate = useNavigate()

  // cant continue without params
  if (!params) {
    navigate(PATH_TO_MASTER_TEAMS)
    return
  }

  const renderControls = (): ReactElement => {
    return (
      <ScheduleRequestControls
        pathToNavigate={PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST}
      />
    )
  }

  return (
    <ScheduleProvider
      initialDates={params.range?.split(',') || null}
      initialSelectedIds={params.selectedIds?.split(',') || null}
    >
      <Page
        title="Schedule Request"
        breadcrumbs={BREAD_CRUMB_ITEMS}
        controls={renderControls}
      >
        <MasterTeamScheduleRequestTable />
      </Page>
    </ScheduleProvider>
  )
}
