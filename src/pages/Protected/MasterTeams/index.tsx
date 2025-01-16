import MasterTeamsTable from './components/MasterTeamsTable'
import { useNavigate } from 'react-router-dom'
import { useBulkDeleteMasterTeamsMutation } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_CREATE_MASTER_TEAM, PATH_TO_DELETING_INFO_MASTER_TEAMS } from '@/common/constants/paths'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { TablePage } from '@/layouts/TablePage.tsx'
import { useNotification } from '@/hooks/useNotification.ts'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import { MasterTeamTableControls } from '@/pages/Protected/MasterTeams/components/MasterTeamTableControls.tsx'

const DELETE_TERMS = {
  singular: 'master team',
  plural: 'master teams'
}

const MasterTeams = () => {
  const navigate = useNavigate()

  const { notify, info } = useNotification()
  const { total } = useMasterTeamsSlice()

  const [bulkDeleteMT, { isLoading }] = useBulkDeleteMasterTeamsMutation()

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
      <MasterTeamTableControls />
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

