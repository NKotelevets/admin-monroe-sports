import { Modal } from 'antd'
import { useEffect } from 'react'

import { useBulkDeleteEventsMutation } from '@/redux/events/events.api.ts'
import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'

import { useNotification } from '@/hooks/useNotification.ts'
import { useTableContext } from '@/hooks/useTableContext.ts'

/**
 * A custom hook responsible for managing the deletion flow of events. It integrates confirmation logic,
 * notification handling, and triggers the bulk deletion API call for selected event identifiers.
 *
 * The hook uses various state management tools, including context and slice hooks, to handle deletion
 * states and update relevant UI components or data stores.
 *
 * Key functionalities:
 * - Displays a confirmation modal to confirm the deletion of events.
 * - Handles deletion for single or multiple events based on selected IDs.
 * - Updates the state of the selected records and notifies the user upon successful or failed deletion attempts.
 * - Manages state flags for the deletion progress to ensure appropriate UI feedback.
 */
export const useDeleteEvent = () => {
  const { selectedRecordIds: selectedIds, setSelectedRecordIds } = useEventsSlice()
  const { notify } = useNotification()
  const {
    singleDeleting,
    setSingleDeleting,
    selectedIds: selectedIdsToDelete,
    setSelectedIds: setSelectedIdsToDelete,
  } = useTableContext()

  const [bulkDelete] = useBulkDeleteEventsMutation()

  /**
   * Trigger deletion based on singleDeleting and amount of selected items
   */
  useEffect(() => {
    if (!singleDeleting || !selectedIdsToDelete.length) {
      setSingleDeleting(false)
      return
    }

    handleDeletion()
  }, [singleDeleting, selectedIdsToDelete])

  /**
   * Displays a confirmation modal to the user when attempting to delete an event.
   *
   * The modal contains a warning message asking for confirmation to proceed with the deletion.
   * The user is presented with two options: "Delete" (confirmation) and "Cancel".
   *
   * @returns {Promise<boolean>} A promise that resolves to a boolean value:
   * - `true` if the user confirms the action (clicks "Delete").
   * - `false` if the user cancels the action (clicks "Cancel").
   */
  const showDeletionConfirmation = (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      Modal.confirm({
        title: 'Warning',
        content: 'Are you sure you want to delete this event?',
        okText: 'Delete',
        cancelText: 'Cancel',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      })
    })
  }

  /**
   * Asynchronous function to handle the deletion process for selected items.
   * This function prompts the user with a confirmation dialog before proceeding
   * with the deletion. If the user confirms, it deletes the selected items.
   * After completing the deletion or if the user cancels, it resets the deletion
   * state and clears the selected item IDs.
   *
   * @async
   * @function
   */
  const handleDeletion = async () => {
    const userWantsToDelete = await showDeletionConfirmation()

    if (userWantsToDelete) {
      await deleteEvent(selectedIdsToDelete)
    }

    setSingleDeleting(false)
    setSelectedIdsToDelete([])
  }

  /**
   * Asynchronously deletes a list of events by their IDs.
   *
   * This function handles the deletion of events in bulk by calling the `bulkDelete` method.
   * Based on the response received from the server, it generates a success or error message.
   * If the deletion is successful, it notifies the user with a success message, updates the
   * selected record IDs, and removes the deleted IDs from the selection.
   * If the deletion fails, it notifies the user with an error message.
   *
   * @param {string[]} ids - An array of event IDs to be deleted.
   * @returns {Promise<void>} A Promise that resolves when the deletion process is complete.
   */
  const deleteEvent = async (ids: string[]) => {
    const response = await bulkDelete(ids).unwrap()
    let message = `Event could not be removed.`

    if (response.success === 1 && response.total === 1) {
      message = `Event has been successfully removed.`
    }

    if (response.status === 'green') {
      notify(message, 'success')
      setSelectedRecordIds(selectedIds.filter((id) => !ids.includes(id)))
      return
    }

    notify(message, 'error')
  }

  return undefined
}
