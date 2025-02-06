import { Button } from 'antd'
import { FormikHelpers } from 'formik'
import { ReactElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SwapButton } from '@/pages/Protected/Events/components/EventBuklEditForm/SwapButton.tsx'
import { SaveBulkEditButton } from '@/pages/Protected/Events/components/EventForm/SaveBulkEditButton.tsx'
import { eventBulkEditFormSchema } from '@/pages/Protected/Events/components/EventForm/validation.ts'

import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { TBulkEditEventForm } from '@/common/types/events.ts'

export type TBulkEditTableControlsProps = {
  selectedIds: string[]
  values: TBulkEditEventForm
  setFieldValue: FormikHelpers<TBulkEditEventForm>['setFieldValue']
  validateForm: FormikHelpers<TBulkEditEventForm>['validateForm']
  resetForm?: () => void
  isValid?: boolean
  forceUpdate?: boolean
}

/**
 * Component that provides controls for bulk editing a table of events.
 *
 * This component includes actions such as cancel, save changes, and swapping values for selected events.
 * It also performs form validation based on selected IDs and event values to manage the save button's state.
 *
 * @param {TBulkEditTableControlsProps} props - The properties required by the bulk edit controls.
 * @param {string[]} props.selectedIds - Array of selected event IDs that are being edited.
 * @param {Object} props.values - The current form values for the events.
 * @param {function(string, any): void} props.setFieldValue - Function to modify specific form field values.
 * @param {function(): Promise<Object>} props.validateForm - Function to trigger form validation.
 * @return {ReactElement} The rendered bulk edit table controls component.
 */
export const BulkEditTableControls = (props: TBulkEditTableControlsProps): ReactElement => {
  const { selectedIds, values, setFieldValue, validateForm } = props
  const navigate = useNavigate()
  const [isValid, setIsValid] = useState(false)

  /**
   * Memoized object representing a filtered subset of form values.
   * The subset is created based on selected IDs, mapping only the entries
   * from `values.events` whose keys match an ID in `selectedIds`.
   * Dependencies: `values.events`, `selectedIds`.
   *
   * @constant {Object} selectedFormValues
   */
  const selectedFormValues = Object.fromEntries(
    Object.entries(values.events).filter(([key]) => selectedIds.includes(key)),
  )

  /**
   * Validates the form data against the event bulk edit schema asynchronously
   * and updates the form's validity state.
   */
  useEffect(() => {
    const validation = eventBulkEditFormSchema.isValidSync(
      { events: Object.entries(selectedFormValues).length ? selectedFormValues : values.events },
      { abortEarly: false },
    )
    setIsValid(validation)
  }, [selectedFormValues, values.events, selectedIds])

  return (
    <>
      <Button onClick={() => navigate(PATH_TO_EVENTS)}>Cancel</Button>
      <SwapButton selectedIds={selectedIds} values={values} setFieldValue={setFieldValue} validateForm={validateForm} />
      <SaveBulkEditButton disabled={!isValid} values={values} selectedIds={selectedIds} />
    </>
  )
}
