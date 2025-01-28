import { Autocomplete, Libraries, LoadScript } from '@react-google-maps/api'
import Input from 'antd/es/input/Input'
import { useRef, useState } from 'react'
import InputWrapper, { IInputWrapper } from '@/components/Inputs/InputWrapper.tsx'

type TResultValueProps = {
  address: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  lat: number
  lng: number
}

type TGoogleAutocompleteInputProps = {
  onChange: (value: TResultValueProps) => void
  initialValue?: string
} & Omit<IInputWrapper, 'onChange' | 'value' | 'children'>

const RESULT_FIELDS = ['geometry.location', 'address_components']
const LIBS = ['places'] as Libraries
const OPTIONS = {
  componentRestrictions: { country: 'us' }, // Restrict to USA
  types: ['address'], // Restrict to street addresses
}

export const GoogleAutocompleteInput = (props: TGoogleAutocompleteInputProps) => {
  const { onChange, placeholder, initialValue, ...rest } = props

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [localField, setLocalField] = useState(initialValue || '')
  const [previousValue, setPreviousValue] = useState(initialValue || '')

  // Helper function to extract specific component
  const getAddressComponent = (place: google.maps.places.PlaceResult, type: string, useShortName = false) => {
    const component = place?.address_components?.find((c) => c.types.includes(type))
    return component ? (useShortName ? component.short_name : component.long_name) : null
  }

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()

      const streetName = getAddressComponent(place, 'route') || ''
      const streetNumber = getAddressComponent(place, 'street_number') || ''
      const neighborhood = getAddressComponent(place, 'sublocality_level_1') || ''
      const city = getAddressComponent(place, 'administrative_area_level_2') || ''
      const state = getAddressComponent(place, 'administrative_area_level_1', true) || ''
      const country = getAddressComponent(place, 'country') || ''
      const postalCode = getAddressComponent(place, 'postal_code') || ''

      // Extract relevant information from the selected place
      const formattedAddress = `${streetName}${neighborhood ? `, ${neighborhood}` : ''}${streetNumber ? ` – ${streetNumber}` : ''}`
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
    <InputWrapper {...rest}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_LOCATION_API_KEY || ''} libraries={LIBS}>
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete
          }}
          onPlaceChanged={handlePlaceChanged}
          fields={RESULT_FIELDS}
          options={OPTIONS}
        >
          <Input
            name="new-password"
            placeholder={placeholder || 'Enter your address'}
            value={localField}
            onChange={(event) => {
              setLocalField(event.target.value)
            }}
            onBlur={() => setLocalField(previousValue)}
            autoComplete="new-password"
          />
        </Autocomplete>
      </LoadScript>
    </InputWrapper>
  )
}
