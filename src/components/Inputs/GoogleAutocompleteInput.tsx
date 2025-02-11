import styled from '@emotion/styled'
import { Autocomplete, Libraries, LoadScript } from '@react-google-maps/api'
import Input from 'antd/es/input/Input'
import { useRef, useState } from 'react'

import InputWrapper, { IInputWrapper } from '@/components/Inputs/InputWrapper.tsx'

import { colors } from '@/utils/colors.tsx'

export type TResultValueProps =
  | {
      address: string
      city?: string
      state?: string
      country?: string
      postalCode?: string
      lat: number
      lng: number
    }
  | undefined

type TGoogleAutocompleteInputProps = {
  onChange: (value: TResultValueProps) => void
  initialValue?: string
} & Omit<IInputWrapper, 'onChange' | 'value' | 'children'>

const G_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_LOCATION_API_KEY as string) || ''
const RESULT_FIELDS = ['geometry.location', 'address_components']
const LIBS = ['places'] as Libraries
const OPTIONS = {
  componentRestrictions: { country: 'us' }, // Restrict to USA
  types: ['geocode', 'establishment'], // Restrict to street addresses
}

/**
 * GoogleAutocompleteInput is a React functional component that provides
 * an input field with Google Places Autocomplete functionality.
 * It allows users to easily search and select place addresses and returns
 * address details along with geolocation coordinates.
 *
 * @param {Object} props - Properties passed to the component.
 * @param {Function} props.onChange - Callback function invoked when a place is selected.
 * Receives an object containing address, latitude, longitude, city, state, country, and postal code.
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {string} [props.initialValue] - Initial value of the input field.
 * @param {...Object} rest - Additional properties spread into the input wrapper.
 */
export const GoogleAutocompleteInput = (props: TGoogleAutocompleteInputProps) => {
  const { onChange, placeholder, initialValue, ...rest } = props

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [localField, setLocalField] = useState(initialValue || '')
  const [fieldError, setFieldError] = useState(false)
  const [previousValue, setPreviousValue] = useState(initialValue || '')

  /**
   * Extracts a specific address component from a PlaceResult object based on the given type.
   *
   * @param {google.maps.places.PlaceResult} place The PlaceResult object containing address components.
   * @param {string} type The type of address component to retrieve (e.g., 'locality', 'country').
   * @param {boolean} [useShortName=false] Whether to return the short name of the address component. Defaults to false.
   * @return {?string} The requested address component (short or long name) or null if not found.
   */
  const getAddressComponent = (place: google.maps.places.PlaceResult, type: string, useShortName = false) => {
    const component = place?.address_components?.find((c) => c.types.includes(type))
    return component ? (useShortName ? component.short_name : component.long_name) : null
  }

  /**
   * Function to handle the change event when a place is selected from the autocomplete input.
   * Extracts and structures various components of the selected place, such as address, city, state, and more.
   * Updates local fields and triggers a callback with structured place data, including geographical coordinates.
   *
   * @function
   */
  const handlePlaceChanged = () => {
    setFieldError(false) // reset errors
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()

      const streetName = getAddressComponent(place, 'route') || ''
      const streetNumber = getAddressComponent(place, 'street_number') || ''
      const neighborhood = getAddressComponent(place, 'sublocality_level_1') || ''
      const city = getAddressComponent(place, 'administrative_area_level_2') || ''
      const state = getAddressComponent(place, 'administrative_area_level_1', true) || ''
      const country = getAddressComponent(place, 'country') || ''
      const postalCode = getAddressComponent(place, 'postal_code') || ''

      if (!postalCode || !city || !state || !streetNumber || !streetName || !country) {
        setFieldError(true)
        setLocalField('')
        onChange(undefined)
        return
      }

      // Extract relevant information from the selected place
      const formattedAddress = `${streetNumber ? `${streetNumber} – ` : ''}${streetName}${neighborhood ? `, ${neighborhood}` : ''}`
      const location = place.geometry?.location

      // updates local field with selected address
      setLocalField(formattedAddress || '')

      if (formattedAddress && location) {
        onChange({
          address: formattedAddress,
          lat: location.lat(),
          lng: location.lng(),
          city,
          state,
          country,
          postalCode,
        })
        setPreviousValue(formattedAddress || '')
      }
    }
  }

  return (
    <>
      <InputWrapper {...rest}>
        <LoadScript googleMapsApiKey={G_MAPS_API_KEY} libraries={LIBS}>
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete
            }}
            onPlaceChanged={handlePlaceChanged}
            fields={RESULT_FIELDS}
            options={OPTIONS}
          >
            <>
              <Input
                status={fieldError ? 'error' : undefined}
                name="new-password"
                placeholder={placeholder || 'Enter your address'}
                value={localField}
                onChange={(event) => {
                  setLocalField(event.target.value)
                }}
                onBlur={() => setLocalField(previousValue)}
                autoComplete="new-password"
              />
              {fieldError && <ErrorMessage>Please select a complete and valid address</ErrorMessage>}
            </>
          </Autocomplete>
        </LoadScript>
      </InputWrapper>
    </>
  )
}

const ErrorMessage = styled.div`
  color: ${colors.primary};
  font-size: 12px;
  margin-top: 4px;
`
