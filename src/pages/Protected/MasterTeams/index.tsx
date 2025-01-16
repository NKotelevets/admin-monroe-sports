import MasterTeamsTable from './components/MasterTeamsTable'
import { useNavigate } from 'react-router-dom'
import { useBulkDeleteMasterTeamsMutation, useMasterTeamsImportCSVMutation } from '@/redux/masterTeams/masterTeams.api'

import {
  PATH_TO_CREATE_MASTER_TEAM,
  PATH_TO_DELETING_INFO_MASTER_TEAMS,
  PATH_TO_MASTER_TEAMS_IMPORT_INFO
} from '@/common/constants/paths'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { TablePage } from '@/layouts/TablePage.tsx'
import { useNotification } from '@/hooks/useNotification.ts'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import { ImportButton } from '@/components/ImportButton.tsx'
import { TDeleteStatus } from '@/common/types'
import { MasterTeamTableControls } from '@/pages/Protected/MasterTeams/components/MasterTeamTableControls.tsx'

const DELETE_TERMS = {
  singular: 'master team',
  plural: 'master teams'
}

const MasterTeams = () => {
  const navigate = useNavigate()

  const { notify, info } = useNotification()
  const { total } = useMasterTeamsSlice()

  const [importMasterTeamCSV] = useMasterTeamsImportCSVMutation()
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

  const renderControls = () => {
    return (
      <>
        <MasterTeamTableControls />
        <ImportButton
          infoPath={PATH_TO_MASTER_TEAMS_IMPORT_INFO}
          onChange={onImport}
        />
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

