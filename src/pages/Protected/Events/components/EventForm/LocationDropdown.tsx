import React, { useCallback, useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import Select from '@/components/Inputs/Select.tsx'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useLocationPaginated } from '@/pages/Protected/Events/hooks/useLocationPaginated.tsx'
import { useLazyGetLocationQuery } from '@/redux/locations/locations.api.ts'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'
import { ILocation } from '@/common/interfaces/location.ts'


/**
 * LocationDropdown is a functional component that renders a dropdown menu
 * to select a "Location" and associated details, with additional actions and controls
 * for handling locations.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onAddLocation - Callback function triggered when the "Add Location" button is clicked.
 * @param {Function} props.setAddingLocation - Callback to toggle the state of adding a new location.
 *
 * This component integrates with Formik's form context (`useFormikContext`) and interacts
 * with a custom hook (`useLocationsSlice`) for managing locations state and pagination.
 *
 * Features:
 * - Fetches and displays a paginated list of locations.
 * - Allows selection of a location and automatically updates related form fields.
 * - Handles dynamic loading of more locations when the dropdown reaches the end.
 * - Supports adding new locations and updating the list with newly created teams.
 * - Displays associated information, such as administrator name and email, in disabled fields.
 *
 * @returns {React.Element} Rendered dropdown UI for location selection and related fields.
 */
export const LocationDropdown = React.memo(() => {
  const { setAddingLocation } = useEventFormContext()

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur
  } = useFormikContext<IEventForm>()

  const { locations, addItem, isFetching, isLoading, loadMore, endReached } = useLocationPaginated()

  const [locationGet, { data: locationAdded, isLoading: isLoadingSingle }] = useLazyGetLocationQuery()
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null)

  /**
   * Updates selected location
   */
  useEffect(() => {
    if (values.locationId) {
      const locationIndex = locations.findIndex(location => location.id === values.locationId)
      setSelectedLocation(locations[locationIndex])
    }
  }, [values.locationId, locations])

  /**
   * Fetches location by id (when editing) and created location
   * inside this flow (by hitting "add location" button)
   */
  useEffect(() => {
    const checkLocation = selectedLocation !== null && selectedLocation?.id === values.locationId

    if (!values.locationId || selectedLocation || checkLocation || isLoadingSingle) return
    const mt = locations.findIndex(mt => mt.id === values.locationId)

    if (mt < 0 && locationAdded === undefined) {
      locationGet({ id: values.locationId })
      return
    }

    if (mt < 0 && locationAdded) {
      addItem(locationAdded as ILocation)
    }
  }, [values.locationId, locations, selectedLocation, locationAdded, isLoadingSingle])

  /**
   * Triggers loadMore from hook if end is not reached yet
   */
  const onLoadMore = useCallback(() => {
    !endReached && loadMore()
  }, [endReached])

  return (
    <>
      <Select
        showSearch
        loading={isLoading || isFetching}
        label="Location *"
        placeholder="Select location"
        optionFilterProp="label"
        value={values.locationId}
        onChange={handleChange('locationId')}
        onLoadMore={!endReached ? onLoadMore : undefined}
        options={locations.map(mt => ({ label: mt.name, value: mt.id }))}
        buttonAction={() => setAddingLocation(true)}
        buttonText="Add location"
        error={touched.locationId ? errors.locationId as string : ''}
        onBlur={handleBlur('locationId')}
      />
    </>
  )
}, () => false)
