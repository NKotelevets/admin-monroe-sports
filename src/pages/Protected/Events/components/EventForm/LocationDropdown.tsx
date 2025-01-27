import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getIn, useFormikContext } from 'formik'
import Select from '@/components/Inputs/Select.tsx'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useLocationPaginated } from '@/pages/Protected/Events/hooks/useLocationPaginated.tsx'
import { useLazyGetLocationQuery } from '@/redux/locations/locations.api.ts'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'
import { ILocation } from '@/common/interfaces/location.ts'

type TLocationDropdownProps = {
  fieldName?: string
  hideLabel?: boolean
  noMargin?: boolean
}

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
export const LocationDropdown = React.memo((props: TLocationDropdownProps) => {
  const { fieldName, hideLabel, noMargin } = props
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

  const field = fieldName || 'locationId'

  const locationValue = useMemo(() => getIn(values, field), [values, field])
  const locationError = useMemo(() => getIn(errors, field), [values, field])
  const locationTouched = useMemo(() => getIn(touched, field), [values, field])


  /**
   * Updates selected location
   */
  useEffect(() => {
    if (locationValue) {
      const locationIndex = locations.findIndex(location => location.id === locationValue)
      setSelectedLocation(locations[locationIndex])
    }
  }, [locationValue, locations])

  /**
   * Fetches location by id (when editing) and created location
   * inside this flow (by hitting "add location" button)
   */
  useEffect(() => {
    const checkLocation = selectedLocation !== null && selectedLocation?.id === locationValue

    if (!locationValue || selectedLocation || checkLocation || isLoadingSingle) return
    const mt = locations.findIndex(mt => mt.id === locationValue)

    if (mt < 0 && locationAdded === undefined) {
      locationGet({ id: locationValue })
      return
    }

    if (mt < 0 && locationAdded) {
      addItem(locationAdded as ILocation)
    }
  }, [locationValue, locations, selectedLocation, locationAdded, isLoadingSingle])

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
        noMargin={noMargin}
        loading={isLoading || isFetching}
        label={hideLabel ? '' : 'Location *'}
        placeholder="Select location"
        optionFilterProp="label"
        value={locationValue}
        onChange={handleChange('locationId')}
        onLoadMore={!endReached ? onLoadMore : undefined}
        options={locations.map(mt => ({ label: mt.name, value: mt.id }))}
        buttonAction={() => setAddingLocation(true)}
        buttonText="Add location"
        error={locationTouched ? locationError as string : ''}
        onBlur={handleBlur('locationId')}
      />
    </>
  )
}, () => false)
