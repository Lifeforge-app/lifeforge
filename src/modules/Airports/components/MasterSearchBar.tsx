import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { SearchInput } from '@components/inputs'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
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
        namespace="modules.airports"
        searchQuery={masterSearchQuery}
        setSearchQuery={setMasterSearchQuery}
        stuffToSearch="All Airport"
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
          className={clsx(
            'border-bg-800 bg-bg-50 shadow-custom dark:bg-bg-900 absolute z-50 mt-4 flex w-full flex-col rounded-md dark:border-2',
            typeof searchResults === 'string' && 'pt-6'
          )}
        >
          <APIFallbackComponent data={searchResults}>
            {searchResults => (
              <Scrollbar autoHeight autoHeightMax={384} className="flex-1">
                <div className="divide-bg-200 dark:divide-bg-800 flex-1 divide-y">
                  {searchResults.length > 0 ? (
                    searchResults.map(airport => (
                      <Link
                        key={airport.id}
                        className="flex-between hover:bg-bg-100 dark:hover:bg-bg-800/50 flex w-full p-4 px-6 transition-all"
                        to={`/airports/${airport.continentCode}/${airport.country.code}/${airport.region.code}/${airport.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon
                            className={clsx(
                              'size-7',
                              AIRPORT_TYPES[airport.type][0]
                            )}
                            icon={AIRPORT_TYPES[airport.type][1]}
                          />
                          <div>
                            <p className="text-left text-xl font-medium">
                              {airport.name}
                            </p>
                            <p className="text-bg-500 text-left">
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
                        smaller
                        icon="tabler:search-off"
                        name="airports"
                        namespace="modules.airports"
                      />
                    </div>
                  )}
                </div>
              </Scrollbar>
            )}
          </APIFallbackComponent>
        </div>
      )}
    </div>
  )
}

export default MasterSearchBar
