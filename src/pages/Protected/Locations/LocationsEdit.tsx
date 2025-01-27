import { FormikHelpers } from 'formik'
import { ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { LocationForm } from '@/pages/Protected/Locations/components/LocationForm'

import { MonroeBlueText } from '@/components/Elements'
import Loader from '@/components/Loader.tsx'

import { Page } from '@/layouts/Page'

import { useEditLocationMutation, useGetLocationQuery } from '@/redux/locations/locations.api.ts'

import { useFieldErrors } from '@/hooks/useFieldErrors.ts'
import { useNotification } from '@/hooks/useNotification.ts'

import { DEFAULT_ERROR_MESSAGE } from '@/common/constants'
import { PATH_TO_LOCATIONS } from '@/common/constants/paths.ts'
import { TLocationForm } from '@/common/types/location.ts'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_LOCATIONS}>Locations</a> },
  { title: <MonroeBlueText>Edit location</MonroeBlueText> },
]

/**
 * LocationEdit is a functional component used for creating a new location entity.
 * It supports both embedded and standalone usage depending on the provided props.
 * Handles location creation via form submission and manages errors and notifications.
 *
 * @returns {ReactElement} The rendered component.
 */
const LocationsEdit = (): ReactElement => {
  const { notify } = useNotification()
  const { handleErrors } = useFieldErrors<TLocationForm>()

  const params = useParams<{ id: string }>()
  const { data, isLoading, isError } = useGetLocationQuery({ id: params?.id || '' }, { skip: !params?.id })

  const navigate = useNavigate()
  const [editLocation] = useEditLocationMutation()

  const goBack = () => navigate(PATH_TO_LOCATIONS)

  const onSubmit = (body: TLocationForm, { setErrors }: FormikHelpers<TLocationForm>) => {
    editLocation({ id: params.id!, body })
      .unwrap()
      .then(() => {
        notify('Location team was successfully edited', 'success')
        goBack()
      })
      .catch(handleErrors(setErrors))
      .catch(() => {
        notify(DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  if (!data || isLoading || isError) return <Loader />

  const initialValues: TLocationForm = {
    name: data.name,
    address: data.address || '',
    zipCode: data.zipCode || '',
    state: data.state || '',
    city: data.city || '',
    latitude: data.latitude || '',
    longitude: data.longitude || '',
  }

  return (
    <Page title="Edit Location" breadcrumbs={BREAD_CRUMB_ITEMS}>
      <LocationForm initialValues={initialValues} onSubmit={onSubmit} goBack={goBack} />
    </Page>
  )
}

export default LocationsEdit
