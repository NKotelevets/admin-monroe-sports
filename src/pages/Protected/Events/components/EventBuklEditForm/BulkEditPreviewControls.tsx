import { TBulkEditTableControlsProps } from './BulkEditTableControls'
import { Button } from 'antd'
import { ReactElement, useState } from 'react'

import { SaveBulkEditButton } from '@/pages/Protected/Events/components/EventForm/SaveBulkEditButton.tsx'
import { useEventBulkEditContext } from '@/pages/Protected/Events/hooks/useEventBulkEditContext.ts'

/**
 * Component representing the controls for the bulk edit preview mode.
 *
 * @function
 * @param {TBulkEditTableControlsProps} props - The properties required for bulk edit table controls.
 * @returns {ReactElement} A set of buttons for managing bulk edit actions such as undoing changes,
 * navigating back to bulk edit, and saving updates.
 */
export const BulkEditPreviewControls = (props: TBulkEditTableControlsProps): ReactElement => {
  const { values, forceUpdate, selectedIds, resetForm } = props
  const { setShowPreviewUpdate } = useEventBulkEditContext()

  const [resettingForm, setResettingForm] = useState(false)

  /**
   * Resets the form state and manages the resetting process.
   *
   * @return {void} Does not return any value.
   */
  const onReset = () => {
    setResettingForm(true)
    !!resetForm && resetForm()
    setResettingForm(false)
  }

  return (
    <>
      <Button disabled={resettingForm} onClick={onReset}>Undo changes</Button>
      <Button onClick={() => setShowPreviewUpdate(false)}>Back to bulk edit</Button>
      <SaveBulkEditButton forceUpdate={forceUpdate} disabled={false} values={values} selectedIds={selectedIds} />
    </>
  )
}
