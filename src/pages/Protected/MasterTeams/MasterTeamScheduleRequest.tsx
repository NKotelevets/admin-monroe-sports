import { Page } from '@/layouts/Page/index.tsx'
import { ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST, PATH_TO_MASTER_TEAMS } from '@/common/constants/paths.ts'
import { MasterTeamScheduleRequestTable } from './components/MasterTeamScheduleRequestTable'
import { MonroeBlueText } from '@/components/Elements'
import { ScheduleRequestControls } from '@/components/ScheduleRequest/ScheduleRequestControls.tsx'
import { ScheduleProvider } from '@/components/ScheduleRequest/ScheduleProvider.tsx'
import { useExportScheduleCSV } from '@/hooks/useExportScheduleCSV.ts'
import { decompressData } from '@/utils'
import { TScheduleAdditionalData } from '@/common/types'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
  { title: <MonroeBlueText>Schedule Request</MonroeBlueText> }
]

/**
 * MasterTeamScheduleRequest component.
 *
 * Handles the scheduling page for master team requests.
 * It processes URL parameters, manages state, and renders the schedule table with configurable options.
 *
 * Key functionalities include:
 * - Validating and processing URL parameters for date range and selected IDs.
 * - Exporting schedule data as a CSV file.
 * - Returning to a default page if parameters are missing or invalid.
 * - Rendering table and controls for interacting with the schedules.
 *
 * Utilizes multiple components and hooks including:
 * - ScheduleRequestControls for export actions and loading status.
 * - ScheduleProvider for initializing and managing schedule-related data.
 * - A data decompression function for processing IDs and additional schedule-related data.
 */
const MasterTeamScheduleRequest = () => {
  const params = useParams<{ range: string, selectedIds: string }>()
  const navigate = useNavigate()

  const { onExport, status, isLoading } = useExportScheduleCSV()

  // cant continue without params
  if (!params || !params.range || !params.selectedIds) {
    navigate(PATH_TO_MASTER_TEAMS)
    return
  }

  const data = decompressData(params.selectedIds)
  const ids: string[] = []
  let additionalData = undefined

  if (data) {
    const dt = data as TScheduleAdditionalData[]
    ids.push(...dt.map(d => d.id))
    additionalData = dt
  }

  /**
   * Renders the control components for schedule requests.
   *
   * @function
   * @name renderControls
   * @returns {ReactElement} The rendered ScheduleRequestControls component.
   */
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
      pathToNavigate={PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST}
      pathToExport='availability/export'
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

export default MasterTeamScheduleRequest
