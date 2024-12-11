import { LeagueTeamsTable } from './components/LeagueTeamsTable.tsx'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { TablePage } from '@/layouts/TablePage'
import { ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_CREATE_LEAGUE_TEAM, PATH_TO_DELETE_INFO_LEAGUE_TEAM } from '@/common/constants/paths.ts'
import { useBulkDeleteLeagueTeamsMutation } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { LeagueTeamTableControls } from '@/pages/Protected/LeagueTeams/components/LeagueTeamTableControls.tsx'

const DEFAULT_DELETE_ERROR_MESSAGE = 'Something went wrong. Please, try again!'

const DELETE_TERMS = {
  singular: 'league team',
  plural: 'league teams'
}

/**
 * LeagueTeams Page
 *
 * This component sets up a page for managing "league teams" using a table layout.
 * It utilizes the `TableProvider` to supply context to the `TablePage` and `Index`,
 * providing features such as item selection, loading states, and handling table parameters.
 *
 * The `TablePage` handles the main layout, including create and delete actions,
 * and uses the `DELETE_TERMS` object to specify the singular and plural terms for deletion prompts.
 *
 * @constant {Object} DELETE_TERMS
 * - Defines the terms for the deletion modal:
 *   - `singular`: A string representing the singular form ("league team").
 *   - `plural`: A string representing the plural form ("league teams").
 *
 * @component
 * @returns {ReactElement} The LeagueTeams page component.
 */
const LeagueTeams = (): ReactElement => {
  const navigation = useNavigate()

  const { notify, info } = useNotification()
  const { total } = useLeagueTeamsSlice()

  const [bulkDelete, { isError, error, isLoading }] = useBulkDeleteLeagueTeamsMutation()

  /**
   * Shows a toast if deletion has errors.
   */
  useEffect(() => {
    isError && notify(DEFAULT_DELETE_ERROR_MESSAGE, 'error')
  }, [isError, error])

  /**
   * Handles deletion of one or multiple league teams.
   * @param ids
   */
  const onDelete = async (ids: string[]): Promise<boolean> => {
    try {
      const response = await bulkDelete(ids).unwrap()
      let message = `${response.success}/${response.total} league teams have been successfully removed.`

      if (response.success === 1 && response.total === 1) {
        message = `League team has been successfully removed.`
      }

      if (response.status === 'green') {
        notify(message, 'success')
        return true
      }

      info('More info...', message, PATH_TO_DELETE_INFO_LEAGUE_TEAM)
      return false
    } catch (error) {
      return false
    }
  }

  return (
    <TableProvider>
      <TablePage
        title="League Teams"
        onCreate={() => navigation(PATH_TO_CREATE_LEAGUE_TEAM)}
        onDelete={onDelete}
        deleteTerm={DELETE_TERMS}
        isDeleting={isLoading}
        controls={() => <LeagueTeamTableControls />}
        maxSelection={total}
      >
        <LeagueTeamsTable />
      </TablePage>
    </TableProvider>
  )
}

export default LeagueTeams
