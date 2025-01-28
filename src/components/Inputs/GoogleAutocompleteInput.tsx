import React, { useState, useRef, useEffect } from 'react';
import { AutoComplete, Input } from 'antd';
import { useJsApiLoader } from '@react-google-maps/api';

interface GoogleAutocompleteProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onBlur?: () => void;
}

const GoogleAutocomplete: React.FC<GoogleAutocompleteProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  onBlur,
}) => {
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  // Load Google Maps JS API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
    libraries: ['places'],
  });

  // Initialize the AutocompleteService once the API is loaded
  useEffect(() => {
    if (isLoaded && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleSearch = (searchText: string) => {
    if (autocompleteServiceRef.current && searchText) {
      autocompleteServiceRef.current.getPlacePredictions(
        { input: searchText },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setOptions(
              predictions.map((prediction) => ({
                value: prediction.description,
              }))
            );
          }
        }
      );
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <div>
      <label htmlFor={name} style={{ display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      <AutoComplete
        value={value}
        onSearch={handleSearch}
        placeholder="Start typing an address..."
        onSelect={handleSelect}
        onChange={onChange}
        options={options}
        style={{ width: '100%' }}
      >
        <Input
          id={name}
          onBlur={onBlur}
          status={error ? 'error' : ''}
        />
      </AutoComplete>
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
    </div>
  );
};

export default GoogleAutocomplete;