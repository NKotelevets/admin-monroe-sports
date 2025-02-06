import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { LocationTableControls } from '@/pages/Protected/Locations/components/LocationTableControls.tsx'
import { LocationsTable } from '@/pages/Protected/Locations/components/LocationsTable.tsx'

import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'

import { TablePage } from '@/layouts/TablePage.tsx'

import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { useBulkDeleteLocationsMutation, useDeleteLocationsMutation } from '@/redux/locations/locations.api.ts'

import { useNotification } from '@/hooks/useNotification.ts'

import { PATH_TO_LOCATIONS_CREATE, PATH_TO_LOCATIONS_DELETE_INFO } from '@/common/constants/paths.ts'

const DEFAULT_DELETE_ERROR_MESSAGE = 'Something went wrong. Please, try again!'

const DELETE_TERMS = {
  singular: 'location',
  plural: 'locations',
}

/**
 * The `Locations` variable represents a React functional component. It manages
 * the Locations module, including listing, managing deletion functionalities,
 * and rendering necessary UI components. The component leverages hooks to
 * manage internal state and side effects.
 *
 * Key Features:
 * - Utilizes a notification system to display information, success, and error messages.
 * - Integrates with API mutations for deleting locations individually or in bulk.
 * - Handles navigation to the "Create Location" route.
 * - Provides configurable table-based UI with support for deletion and custom controls.
 *
 * Hooks:
 * - `useNavigate`: Provides navigation capabilities within the application.
 * - `useNotification`: Manages toast notifications for success, info, and error messages.
 * - `useLeagueTeamsSlice`: Retrieves application state data on total league teams.
 * - `useBulkDeleteLocationsMutation` and `useDeleteLocationsMutation`: Manage API logic for deletion operations.
 *
 * Event Handlers:
 * - `onDelete(ids, isAllSelected)`: Handles the deletion logic for single or multiple locations based on the provided IDs and selection type.
 * - `deleteSingleLocation(id)`: Internal function for deleting a single location and notifying the outcome.
 *
 * UI Composition:
 * - Wraps the main table within a provider (`TableProvider`) to enhance functionality.
 * - Renders a `TablePage` component with configurations for creating and deleting locations, and injecting controls and data.
 */
const Locations = () => {
  const navigation = useNavigate()

  const { notify, info } = useNotification()
  const { total } = useLeagueTeamsSlice()

  const [bulkDelete, { isError, error, isLoading }] = useBulkDeleteLocationsMutation()
  const [deleteLocation] = useDeleteLocationsMutation()

  /**
   * Shows a toast if deletion has errors.
   */
  useEffect(() => {
    isError && notify(DEFAULT_DELETE_ERROR_MESSAGE, 'error')
  }, [isError, error])

  /**
   * Deletes a single location based on the provided ID.
   *
   * This function attempts to remove a location by calling the `deleteLocation` function with the given ID.
   * Upon successful deletion, a success notification is displayed and the function resolves to `true`.
   * If an error occurs during the deletion process, it handles the response, displays an appropriate error notification,
   * and resolves to `false`.
   *
   * @param {string} id - The unique identifier of the location to be deleted.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the location is successfully deleted,
   *                             or `false` if the operation fails.
   */
  const deleteSingleLocation = (id: string) => {
    return deleteLocation(id)
      .unwrap()
      .then(() => {
        notify('Location has been successfully removed.', 'success')
        return true
      })
      .catch((response) => {
        const isPlainText = typeof response.data === 'string'

        if (isPlainText) {
          notify(response.data || 'Something went wrong. Please, try again!', 'error')
        } else {
          notify(
            response?.data?.detail || response?.data?.details || 'Something went wrong. Please, try again!',
            'error',
          )
        }
        return false
      })
  }

  /**
   * Handles deletion of one or multiple locations.
   * @param ids
   * @param isAllSelected
   */
  const onDelete = async (ids: string[], isAllSelected: boolean): Promise<boolean> => {
    const isBulkEdit = ids.length > 1

    if (!isBulkEdit) {
      return deleteSingleLocation(ids[0])
    }

    const deleteHandler = isAllSelected ? bulkDelete([]) : bulkDelete(ids)

    try {
      const response = await deleteHandler.unwrap()
      let message = `${response.success}/${response.total} locations have been successfully removed.`

      if (response.success === 1 && response.total === 1) {
        message = `Location has been successfully removed.`
      }

      if (response.status === 'green') {
        notify(message, 'success')
        return true
      }

      info('More info...', message, PATH_TO_LOCATIONS_DELETE_INFO)
      return false
    } catch (error) {
      return false
    }
  }

  return (
    <TableProvider>
      <TablePage
        title="Locations"
        onCreate={() => navigation(PATH_TO_LOCATIONS_CREATE)}
        onDelete={onDelete}
        deleteTerm={DELETE_TERMS}
        isDeleting={isLoading}
        controls={() => <LocationTableControls />}
        maxSelection={total}
      >
        <LocationsTable />
      </TablePage>
    </TableProvider>
  )
}

export default Locations
