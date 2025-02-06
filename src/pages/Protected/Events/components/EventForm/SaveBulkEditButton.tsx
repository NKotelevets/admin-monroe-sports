import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useEventBulkEditContext } from '@/pages/Protected/Events/hooks/useEventBulkEditContext.ts'

import { useBulkEditEventsMutation } from '@/redux/events/events.api.ts'

import { useNotification } from '@/hooks/useNotification.ts'

import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { TBulkEditEventForm, TEventBulkEditPayload } from '@/common/types/events.ts'

type TSaveBulkEditButtonProps = {
  values: TBulkEditEventForm
  disabled?: boolean
  forceUpdate?: boolean
  selectedIds: string[]
}

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please, try again'

/**
 * SaveBulkEditButton is a React functional component that renders a button for saving changes in bulk editing operations.
 *
 * This component handles the process of collecting modified event data, formatting it into the expected payload,
 * and making an API call to save these changes. It also manages UI feedback such as notifications and redirection
 * based on the response.
 *
 * Props:
 * - disabled {boolean}: Indicates if the button should be disabled.
 * - values {Object}: Contains the current form field values for the events.
 * - forceUpdate {boolean}: Determines whether to bypass conflict checks during the bulk update.
 * - selectedIds {Array<string>}: List of selected event IDs for bulk editing.
 *
 * Dependencies:
 * - useNotification: Provides notify functionality for displaying messages.
 * - useNavigate: Facilitates navigation to different routes.
 * - useBulkEditEventsMutation: Hook for interacting with the bulk edit events API.
 * - useEventBulkEdit: Custom hook for event bulk edit states and actions.
 *
 * Returns:
 * - A React component that renders a button.
 */
export const SaveBulkEditButton = (props: TSaveBulkEditButtonProps) => {
  const { disabled, values, forceUpdate, selectedIds } = props
  const { notify } = useNotification()

  const navigate = useNavigate()
  const [bulkEditEvents, { isLoading }] = useBulkEditEventsMutation()
  const { setShowPreviewUpdate } = useEventBulkEditContext()

  /**
   * Handles the save operation for bulk editing events.
   *
   * Filters the selected events based on provided IDs, maps them into a specific payload structure,
   * and invokes the `bulkEditEvents` API to update the events. Provides appropriate notifications
   * and navigation based on the response status.
   *
   * @return {void} Does not return a value.
   */
  const onSave = (): void => {
    const selectedFormValues = selectedIds.length ? Object.fromEntries(
      Object.entries(values.events).filter(([key]) => selectedIds.includes(key)),
    ) : values.events

    const payload = Object.values(selectedFormValues).map((event) => ({
      id: event.id,
      day: event.day,
      date: event.date,
      time: event.time,
      duration: event.duration,
      location_id: event.locationId,
      court_or_field: event.courtOrField,
      sub_resource: event.subResource,
      description: event.eventDescription,
      team_1_id: event.team1Id,
      team_2_id: event.team2Id || '',
    })) as TEventBulkEditPayload[]

    bulkEditEvents({ events: payload, ignoreConflicts: !!forceUpdate })
      .unwrap()
      .then((response) => {
        const total = response.total
        const success = response.success

        if (response.status === 'yellow' || response.status === 'red') {
          setShowPreviewUpdate(true)
          return
        }

        let message = `Events were successfully updated`

        if (success < total) {
          if (success === 1) {
            message = `(${success}/${total}) Event was successfully updated`
          } else {
            message = `(${success}/${total}) ${message}`
          }

          // This might change if we have a screen for
          // dealing with update errors
          notify(message, 'success')
          navigate(PATH_TO_EVENTS)
          return
        }

        // This will change because we will navigate to
        // review screen before actually saving the values
        notify(message, 'success')
        navigate(PATH_TO_EVENTS)
      })
      .catch((response) => {
        notify(response?.data?.detail || response?.data?.details || DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  return (
    <Button type="primary" disabled={disabled} onClick={onSave} loading={isLoading}>
      Save changes
    </Button>
  )
}
