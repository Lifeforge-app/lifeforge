import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'

export interface ILocationAutoComplete {
  predictions: Prediction[]
  status: string
}

export interface Prediction {
  description: string
  matched_substrings: Array<{
    length: number
    offset: number
  }>
  place_id: string
  reference: string
  structured_formatting: {
    main_text: string
    main_text_matched_substrings: Array<{
      length: number
      offset: number
    }>
    secondary_text: string
  }
  terms: Array<{
    offset: number
    value: string
  }>
  types: string[]
}

function LocationInput({
  location,
  setLocation,
  namespace,
  label
}: {
  location: string | null
  setLocation: (value: string | null) => void
  namespace: string
  label?: string
}): React.ReactElement {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [data, , setData] = useFetch<any>(
    `/locations?q=${debouncedQuery}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
    debouncedQuery.trim() !== ''
  )

  useEffect(() => {
    if (query.trim() === '') {
      setData('loading')
    }
  }, [query])

  return (
    <ListboxOrComboboxInput
      customActive={Boolean(location)}
      displayValue={(value: string) => value}
      icon="tabler:map-pin"
      name={label || 'Location'}
      namespace={namespace}
      setQuery={setQuery}
      setValue={setLocation}
      type="combobox"
      value={location}
    >
      {query.trim() !== '' && (
        <APIFallbackComponent data={data}>
          {data => (
            <>
              {data.predictions.map((prediction: Prediction) => (
                <ListboxOrComboboxOption
                  key={prediction.place_id}
                  matchedSubstrings={prediction.matched_substrings}
                  text={prediction.description}
                  type="combobox"
                  value={prediction.description}
                />
              ))}
            </>
          )}
        </APIFallbackComponent>
      )}
    </ListboxOrComboboxInput>
  )
}

export default LocationInput
