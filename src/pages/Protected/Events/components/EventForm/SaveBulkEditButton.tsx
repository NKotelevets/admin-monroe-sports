import { Button } from 'antd'

import { useBulkEditEventsMutation } from '@/redux/events/events.api.ts'

import { useNotification } from '@/hooks/useNotification.ts'

import { TBulkEditEventForm, TEventBulkEditPayload } from '@/common/types/events.ts'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'

type TSaveBulkEditButtonProps = {
  values: TBulkEditEventForm
  disabled?: boolean
}

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please, try again'

export const SaveBulkEditButton = (props: TSaveBulkEditButtonProps) => {
  const { disabled, values } = props
  const { notify } = useNotification()

  const navigate = useNavigate()
  const [bulkEditEvents, { isLoading }] = useBulkEditEventsMutation()

  const onSave = () => {
    const payload = Object.values(values.events).map((event) => ({
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

    bulkEditEvents(payload)
      .unwrap()
      .then(response => {
        const total = response.total
        const success = response.success
        // const errorItems = response.items

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
