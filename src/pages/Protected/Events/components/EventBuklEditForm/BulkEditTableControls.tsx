import { Button } from 'antd'
import { FormikHelpers } from 'formik'

import { SwapButton } from '@/pages/Protected/Events/components/EventBuklEditForm/SwapButton.tsx'

import { TBulkEditEventForm } from '@/common/types/events.ts'
import { SaveBulkEditButton } from '@/pages/Protected/Events/components/EventForm/SaveBulkEditButton.tsx'
import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { useNavigate } from 'react-router-dom'

export type TBulkEditTableControlsProps = {
  selectedIds: string[]
  values: TBulkEditEventForm
  setFieldValue: FormikHelpers<TBulkEditEventForm>['setFieldValue']
  validateForm: FormikHelpers<TBulkEditEventForm>['validateForm']
  isValid?: boolean
}

export const BulkEditTableControls = (props: TBulkEditTableControlsProps) => {
  const { selectedIds, values, setFieldValue, isValid, validateForm } = props
  const navigate = useNavigate()

  return (
    <>
      <Button onClick={() => navigate(PATH_TO_EVENTS)}>Cancel</Button>
      <SwapButton selectedIds={selectedIds} values={values} setFieldValue={setFieldValue} validateForm={validateForm} />
      <SaveBulkEditButton disabled={!isValid} values={values} />
    </>
  )
}
