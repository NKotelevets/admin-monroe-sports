import { TablePage } from '@/layouts/TablePage.tsx'
import { PATH_TO_CREATE_EVENT, PATH_TO_DELETE_INFO_EVENTS } from '@/common/constants/paths.ts'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '@/hooks/useNotification.ts'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { useBulkDeleteLeagueTeamsMutation } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { useEffect } from 'react'
import { EventTableControls } from '@/pages/Protected/Events/components/EventTableControls.tsx'
import { EventsTable } from '@/pages/Protected/Events/components/EventsTable.tsx'

const DEFAULT_DELETE_ERROR_MESSAGE = 'Something went wrong. Please, try again!'

const DELETE_TERMS = {
  singular: 'event',
  plural: 'events'
}

const Events = () => {
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
   * Handles deletion of one or multiple events.
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

      info('More info...', message, PATH_TO_DELETE_INFO_EVENTS)
      return false
    } catch (error) {
      return false
    }
  }

  return (
    <TableProvider>
      <TablePage
        title="Event"
        onCreate={() => navigation(PATH_TO_CREATE_EVENT)}
        onDelete={onDelete}
        deleteTerm={DELETE_TERMS}
        isDeleting={isLoading}
        controls={() => <EventTableControls />}
        maxSelection={total}
      >
        <EventsTable />
      </TablePage>
    </TableProvider>
  )
}

export default Events

