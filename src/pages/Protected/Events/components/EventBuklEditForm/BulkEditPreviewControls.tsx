import { TBulkEditTableControlsProps } from './BulkEditTableControls'
import { Button } from 'antd'
import { ReactElement } from 'react'

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

  return (
    <>
      <Button onClick={resetForm}>Undo Changes</Button>
      <Button onClick={() => setShowPreviewUpdate(false)}>Back to bulk edit</Button>
      <SaveBulkEditButton forceUpdate={forceUpdate} disabled={false} values={values} selectedIds={selectedIds} />
    </>
  )
}
