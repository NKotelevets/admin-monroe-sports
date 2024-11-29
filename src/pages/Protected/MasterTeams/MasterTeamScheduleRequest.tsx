import { Page } from '@/layouts/Page/index.tsx'
import { ReactElement, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST, PATH_TO_MASTER_TEAMS } from '@/common/constants/paths.ts'
import Loader from '@/components/Loader.tsx'
import { MasterTeamScheduleRequestTable } from './components/MasterTeamScheduleRequestTable'
import { MonroeBlueText } from '@/components/Elements'
import { ScheduleRequestControls } from '@/components/ScheduleRequest/ScheduleRequestControls.tsx'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
  { title: <MonroeBlueText>Schedule Request</MonroeBlueText> }
]

export const MasterTeamScheduleRequest = () => {
  const params = useParams<{ range: string, selectedIds: string }>()
  const navigate = useNavigate()

  const [dates, setDates] = useState<{ start: string, end: string } | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null)

  // Sets selected ids and dates based on url params
  useEffect(() => {
    if (!params) return

    setSelectedIds(params.selectedIds?.split(',') || null)

    const range = params.range?.split(',')
    if (range && range.length > 1) {
      setDates({ start: range[0], end: range[1] } || null)
    }
  }, [params])

  // cant continue without params
  if (!params) {
    navigate(PATH_TO_MASTER_TEAMS)
    return
  }

  if (!selectedIds || !dates) return <Loader />

  const renderControls = (): ReactElement => {
    return (
      <ScheduleRequestControls
        dates={dates}
        selectedIds={selectedIds.join(',')}
        pathToNavigate={PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST}
      />
    )
  }

  return (
    <Page
      title="Schedule Request"
      breadcrumbs={BREAD_CRUMB_ITEMS}
      controls={renderControls}
    >
      <MasterTeamScheduleRequestTable
        dates={dates}
        selectedIds={selectedIds}
      />
    </Page>
  )
}

