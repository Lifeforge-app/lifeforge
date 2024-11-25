import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import ListboxOrComboboxInput from '@components/ButtonsAndInputs/ListboxOrComboboxInput'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
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

function LocationSelector({
  location,
  setLocation
}: {
  location: string | null
  setLocation: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [data, , setData] = useFetch<any>(
    `wallet/locations?q=${debouncedQuery}&key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }`,
    debouncedQuery.trim() !== ''
  )

  useEffect(() => {
    if (query.trim() === '') {
      setData('loading')
    }
  }, [query])

  return (
    <ListboxOrComboboxInput
      type="combobox"
      icon="tabler:map-pin"
      name="Location"
      value={location}
      setValue={setLocation}
      setQuery={setQuery}
      displayValue={(value: string) => value}
      customActive={Boolean(location)}
    >
      {query.trim() !== '' && (
        <APIComponentWithFallback data={data}>
          {data => (
            <>
              {data.predictions.map((prediction: Prediction) => (
                <ListboxOrComboboxOption
                  type="combobox"
                  key={prediction.place_id}
                  value={prediction.description}
                  text={prediction.description}
                  matchedSubstrings={prediction.matched_substrings}
                />
              ))}
            </>
          )}
        </APIComponentWithFallback>
      )}
    </ListboxOrComboboxInput>
  )
}

export default LocationSelector
