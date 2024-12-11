import MasterTeamsTable from './components/MasterTeamsTable'
import { useNavigate } from 'react-router-dom'
import { useBulkDeleteMasterTeamsMutation } from '@/redux/masterTeams/masterTeams.api'

import {
  PATH_TO_CREATE_MASTER_TEAM,
  PATH_TO_DELETING_INFO_MASTER_TEAMS,
  PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST
} from '@/common/constants/paths'
import { ExportAvailability } from '@/components/ExportAvailability.tsx'
import { ScheduleRequestButton } from '@/components/ScheduleRequest/ScheduleRequestButton.tsx'
import { useExportScheduleCSV } from '@/hooks/useExportScheduleCSV.ts'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { TablePage } from '@/layouts/TablePage.tsx'
import { useNotification } from '@/hooks/useNotification.ts'
import { ImportButton } from '@/pages/Protected/MasterTeams/components/ImportButton.tsx'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'

const DELETE_TERMS = {
  singular: 'master team',
  plural: 'master teams'
}

const MasterTeams = () => {
  const navigate = useNavigate()

  const { notify, info } = useNotification()
  const { onExport, isLoading, status } = useExportScheduleCSV()
  const { total } = useMasterTeamsSlice()

  const [bulkDeleteMT] = useBulkDeleteMasterTeamsMutation()

  /**
   * Handles deletion of one or multiple master teams.
   * @param selectedIds
   * @param isAllSelected
   */
  const onDelete = async (selectedIds: string[], isAllSelected: boolean): Promise<boolean> => {
    const deleteHandler = isAllSelected ? bulkDeleteMT([]) : bulkDeleteMT(selectedIds)

    try {
      const response = await deleteHandler.unwrap()
      let message = `${response.success}/${response.total} master teams have been successfully removed.`

      if (response.success === 1 && response.total === 1) {
        message = `Master team has been successfully removed.`
      }

      if (response.status === 'green') {
        notify(message, 'success')
        return true
      }

      info('More info...', message, PATH_TO_DELETING_INFO_MASTER_TEAMS)
      return false
    } catch (error) {
      return false
    }
  }

  const renderControls = () => {
    return (
      <>
        <ScheduleRequestButton
          pathToExport="availability/export"
          exportFileName='master-teams-availability'
          pathToSchedule={PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST}
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

  return (
    <TableProvider>
      <TablePage
        title="Master Teams"
        onCreate={() => navigate(PATH_TO_CREATE_MASTER_TEAM)}
        onDelete={onDelete}
        deleteTerm={DELETE_TERMS}
        isDeleting={isLoading}
        controls={renderControls}
        maxSelection={total}
      >
        <MasterTeamsTable />
      </TablePage>
    </TableProvider>
  )
}

export default MasterTeams

