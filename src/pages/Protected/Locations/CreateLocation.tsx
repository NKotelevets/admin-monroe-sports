import { Page } from '@/layouts/Page'
import { PATH_TO_LOCATION } from '@/common/constants/paths.ts'
import { MonroeBlueText } from '@/components/Elements'
import { useNavigate } from 'react-router-dom'
import { useCreateLocationMutation } from '@/redux/locations/locations.api.ts'
import { TScreenProps } from '@/common/types'
import { LocationForm } from '@/pages/Protected/Locations/components/LocationForm'
import { TLocationForm } from '@/common/types/location.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { useFieldErrors } from '@/hooks/useFieldErrors.ts'
import { FormikHelpers } from 'formik'
import { DEFAULT_ERROR_MESSAGE } from '@/common/constants'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_LOCATION}>Locations</a> },
  { title: <MonroeBlueText>Create location</MonroeBlueText> }
]


const LocationCreate = (props: TScreenProps) => {
  const { embedded, goBack: goBackParent } = props
  const { notify } = useNotification()
  const { handleErrors } = useFieldErrors<TLocationForm>()

  const navigate = useNavigate()
  const [createLocation] = useCreateLocationMutation()

  const goBack = (response?: string) => {
    if (goBackParent) {
      return goBackParent(response)
    }

    navigate(PATH_TO_LOCATION)
  }

  const onSubmit = (body: TLocationForm, { setErrors }: FormikHelpers<TLocationForm>) => {
    createLocation(body)
      .unwrap()
      .then((response) => {
        notify('Location team was successfully created', 'success')
        goBack(response.id)
      })
      .catch(handleErrors(setErrors))
      .catch(() => {
        notify(DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  if (embedded) {
    return (
      <LocationForm
        onSubmit={onSubmit}
        goBack={goBack}
      />
    )
  }

  return (
    <Page
      title="Create Location"
      breadcrumbs={BREAD_CRUMB_ITEMS}
    >
      <LocationForm
        onSubmit={onSubmit}
        goBack={goBack}
      />
    </Page>
  )
}


export default LocationCreate
