import { FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'

import { LocationForm } from '@/pages/Protected/Locations/components/LocationForm'

import { MonroeBlueText } from '@/components/Elements'

import { Page } from '@/layouts/Page'

import { useCreateLocationMutation } from '@/redux/locations/locations.api.ts'

import { useFieldErrors } from '@/hooks/useFieldErrors.ts'
import { useNotification } from '@/hooks/useNotification.ts'

import { DEFAULT_ERROR_MESSAGE } from '@/common/constants'
import { PATH_TO_LOCATIONS } from '@/common/constants/paths.ts'
import { TScreenProps } from '@/common/types'
import { TLocationForm } from '@/common/types/location.ts'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_LOCATIONS}>Locations</a> },
  { title: <MonroeBlueText>Create location</MonroeBlueText> },
]

/**
 * LocationCreate is a functional component used for creating a new location entity.
 * It supports both embedded and standalone usage depending on the provided props.
 * Handles location creation via form submission and manages errors and notifications.
 *
 * @param {TScreenProps} props - The properties passed down to the component.
 * @returns {JSX.Element} The rendered component.
 */
const LocationCreate = (props: TScreenProps) => {
  const { embedded, goBack: goBackParent } = props
  const { notify } = useNotification()
  const { handleErrors } = useFieldErrors<TLocationForm>()

  const navigate = useNavigate()
  const [createLocation] = useCreateLocationMutation()

  /**
   * Navigates back to a previous location or to a default location.
   *
   * If `goBackParent` is defined, it calls `goBackParent` with an optional response.
   * Otherwise, it navigates to a predefined default path.
   *
   * @param {string} [response] - Optional response data to pass to `goBackParent`.
   * @returns {void}
   */
  const goBack = (response?: string) => {
    if (goBackParent) {
      return goBackParent(response)
    }

    navigate(PATH_TO_LOCATIONS)
  }

  /**
   * Handles the submission of the location form.
   *
   * @param {TLocationForm} body - The form data submitted by the user.
   * @param {FormikHelpers<TLocationForm>} helpers - Formik helper functions, including error handling utilities.
   */
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
    return <LocationForm onSubmit={onSubmit} goBack={goBack} />
  }

  return (
    <Page title="Create Location" breadcrumbs={BREAD_CRUMB_ITEMS}>
      <LocationForm onSubmit={onSubmit} goBack={goBack} />
    </Page>
  )
}

export default LocationCreate
