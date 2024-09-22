import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'

const AIRPORT_TYPES = {
  large_airport: ['text-yellow-500', 'uil:plane'],
  medium_airport: ['text-sky-500', 'uil:plane'],
  small_airport: ['text-pink-500', 'uil:plane'],
  heliport: ['text-blue-500', 'tabler:helicopter-landing'],
  seaplane_base: ['text-orange-500', 'tabler:anchor'],
  balloonport: ['text-green-500', 'tabler:air-balloon'],
  closed: ['text-red-500', 'tabler:ban']
}

function MasterSearchBar(): React.ReactElement {
  const [masterSearchQuery, setMasterSearchQuery] = useState('')
  const debouncedMasterSearchQuery = useDebounce(masterSearchQuery, 500)
  const [searchResults, , setSearchResults] = useFetch<
    Array<{
      id: string
      name: string
      continentCode: string
      country: {
        code: string
        name: string
      }
      region: {
        code: string
        name: string
      }
      locationName: string
      iata: string
      icao: string
      type: keyof typeof AIRPORT_TYPES
      match: string
    }>
  >(
    `airports/search?query=${encodeURIComponent(debouncedMasterSearchQuery)}`,
    debouncedMasterSearchQuery.length >= 3
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (debouncedMasterSearchQuery.length < 3) {
      setSearchResults('loading')
    }
  }, [debouncedMasterSearchQuery, setSearchResults])

  return (
    <div className="relative z-50">
      <SearchInput
        stuffToSearch="all airports"
        searchQuery={masterSearchQuery}
        setSearchQuery={setMasterSearchQuery}
        onKeyUp={e => {
          if (e.key === 'Enter' && typeof searchResults !== 'string') {
            if (searchResults.length > 0) {
              navigate(
                `/airports/${searchResults[0].continentCode}/${searchResults[0].country.code}/${searchResults[0].region.code}/${searchResults[0].id}`
              )
            }
          }
        }}
      />
      {debouncedMasterSearchQuery.length >= 3 && (
        <div
          className={`absolute z-50 mt-4 flex w-full flex-col rounded-md border-bg-800 bg-bg-50 shadow-custom dark:border-2 dark:bg-bg-900 ${
            typeof searchResults === 'string' && 'pt-6'
          }`}
        >
          <APIComponentWithFallback data={searchResults}>
            {searchResults => (
              <Scrollbar className="flex-1" autoHeight autoHeightMax={384}>
                <div className="flex-1 divide-y divide-bg-200 dark:divide-bg-800">
                  {searchResults.length > 0 ? (
                    searchResults.map(airport => (
                      <Link
                        key={airport.id}
                        to={`/airports/${airport.continentCode}/${airport.country.code}/${airport.region.code}/${airport.id}`}
                        className="flex-between flex w-full p-4 px-6 transition-all hover:bg-bg-100 dark:hover:bg-bg-800/50"
                      >
                        <div className="flex items-center gap-4">
                          <Icon
                            icon={AIRPORT_TYPES[airport.type][1]}
                            className={`size-7 ${
                              AIRPORT_TYPES[airport.type][0]
                            }`}
                          />
                          <div>
                            <p className="text-left text-xl font-medium">
                              {airport.name}
                            </p>
                            <p className="text-left text-bg-500">
                              {airport.locationName}, {airport.region.name},{' '}
                              {airport.country.name}
                            </p>
                          </div>
                        </div>
                        <p className="text-bg-500">
                          {[airport.iata, airport.icao]
                            .filter(Boolean)
                            .join(' / ')}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="py-6">
                      <EmptyStateScreen
                        title="No results found"
                        description="Try searching for something else"
                        icon="tabler:search-off"
                      />
                    </div>
                  )}
                </div>
              </Scrollbar>
            )}
          </APIComponentWithFallback>
        </div>
      )}
    </div>
  )
}

export default MasterSearchBar
