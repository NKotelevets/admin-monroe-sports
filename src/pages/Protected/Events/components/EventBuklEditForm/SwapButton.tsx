import { Button, Tooltip } from 'antd'
import { ReactElement } from 'react'

import { TBulkEditTableControlsProps } from '@/pages/Protected/Events/components/EventBuklEditForm/BulkEditTableControls.tsx'

import { IEvent } from '@/common/interfaces/event.ts'

const SWAP_MESSAGE = `To swap the data, check only 2 events`

/**
 * A functional React component that renders a button to swap event information between two selected events.
 *
 * The `SwapButton` component facilitates the swapping of specific field values (such as date, time, duration, etc.)
 * between two selected events in a bulk edit context. When clicked, it performs the swap operation if exactly
 * two event IDs are selected.
 *
 * @param {TBulkEditTableControlsProps} props - The props object containing selected event IDs, event values, and a function
 * to update the event data.
 * @param {string[]} props.selectedIds - Array of currently selected event IDs. Swap is only enabled when exactly two IDs are selected.
 * @param {Object} props.values - Object containing the current event data where values are keyed by event IDs.
 * @param {function} props.setFieldValue - A function to update the event data in the parent state, called with updated event values.
 *
 * @returns {ReactElement} A button wrapped in a tooltip. The button is disabled unless exactly two event IDs are selected.
 */
export const SwapButton = (props: TBulkEditTableControlsProps): ReactElement => {
  const { selectedIds, values, setFieldValue, validateForm } = props

  /**
   * Handles the swapping of specific fields between two events in the event list.
   *
   * This function swaps predefined fields (e.g., date, time, duration, etc.)
   * between two events identified by their selection IDs and updates the
   * corresponding event values in the form. After swapping, it triggers form validation.
   */
  const onSwap = () => {
    if (selectedIds.length === 2) {
      let firstEvent = values.events[selectedIds[0] as string]
      let secondEvent = values.events[selectedIds[1] as string]

      const fieldsToSwap = ['date', 'time', 'duration', 'locationId', 'courtOrField', 'subResource'] as (keyof IEvent)[]

      fieldsToSwap.forEach((field) => {
        const temp = firstEvent[field]
        firstEvent = { ...firstEvent, [field]: secondEvent[field] }
        secondEvent = { ...secondEvent, [field]: temp }
      })

      setFieldValue(`events.${selectedIds[0]}`, firstEvent)
      setFieldValue(`events.${selectedIds[1]}`, secondEvent)
    }

    validateForm()
  }

  return (
    <Tooltip title={selectedIds.length !== 2 ? SWAP_MESSAGE : ''} placement="bottomRight">
      <Button disabled={selectedIds.length !== 2} onClick={onSwap}>
        Swap info
      </Button>
    </Tooltip>
  )
}
