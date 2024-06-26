/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'
import ContinentSelector from '../../components/ContinentSelector'
import MasterSearchBar from '../../components/MasterSearchBar'

const CONTINENTS = {
  AF: 'Africa',
  AN: 'Antarctica',
  AS: 'Asia',
  EU: 'Europe',
  NA: 'North America',
  OC: 'Oceania',
  SA: 'South America'
}

const AIRPORT_TYPES = {
  large_airport: ['text-yellow-500', 'uil:plane'],
  medium_airport: ['text-sky-500', 'uil:plane'],
  small_airport: ['text-pink-500', 'uil:plane'],
  heliport: ['text-blue-500', 'tabler:helicopter-landing'],
  seaplane_base: ['text-orange-500', 'tabler:anchor'],
  balloonport: ['text-green-500', 'tabler:air-balloon'],
  closed: ['text-red-500', 'tabler:ban']
}

function AirportsList(): React.ReactElement {
  const { countryID, continentID, regionID } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [airportsData] = useFetch<{
    data: Array<{
      id: string
      location: string
      type: string
      name: string
    }>
    breadcrumbs: string[]
  }>(`airports/airports/${regionID}`)
  const [filteredData, setFilteredData] = useState<
    | Array<{
        id: string
        location: string
        type: string
        name: string
      }>
    | 'loading'
    | 'error'
  >('loading')

  useEffect(() => {
    if (typeof airportsData !== 'string') {
      setFilteredData(
        airportsData.data.filter(({ name }) =>
          name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredData(airportsData)
    }
  }, [debouncedSearchQuery, airportsData])

  return (
    <ModuleWrapper>
      <ModuleHeader title="Airports" desc="..." />
      <MasterSearchBar />
      <APIComponentWithFallback data={airportsData} showLoading={false}>
        {continentsData => (
          <div className="mt-8 flex items-center gap-2">
            <Link to="/aviation/airports" className="text-bg-500">
              All Continents
            </Link>
            <Icon icon="tabler:chevron-right" className="size-5 text-bg-500" />
            <Link
              to={`/aviation/airports/${continentID}`}
              className="text-bg-500"
            >
              {CONTINENTS[continentID as keyof typeof CONTINENTS]}
            </Link>
            <Icon icon="tabler:chevron-right" className="size-5 text-bg-500" />
            <Link
              to={`/aviation/airports/${continentID}/${countryID}`}
              className="text-bg-500"
            >
              {continentsData.breadcrumbs[0]}
            </Link>
            <Icon icon="tabler:chevron-right" className="size-5 text-bg-500" />
            <Link
              to={`/aviation/airports/${continentID}/${countryID}/${regionID}`}
              className="font-medium text-custom-500"
            >
              {continentsData.breadcrumbs[1]}
            </Link>
          </div>
        )}
      </APIComponentWithFallback>
      <div className="flex items-center gap-2">
        <ContinentSelector />
        <SearchInput
          stuffToSearch="airports"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <APIComponentWithFallback data={filteredData}>
        {data => (
          <Scrollbar className="mt-6">
            <div className="mb-8 flex-1 space-y-4 px-4">
              {data.length > 0 ? (
                data
                  .sort((a, b) => {
                    const order = Object.keys(AIRPORT_TYPES)
                    return (
                      order.indexOf(a.type) - order.indexOf(b.type) ||
                      a.name.localeCompare(b.name)
                    )
                  })
                  .map(({ name, location, type, id }) => (
                    <Link
                      to={`/aviation/airports/${continentID}/${countryID}/${regionID}/${id}`}
                      key={name}
                      className="flex w-full items-center justify-between rounded-lg bg-bg-200 p-4 px-6 transition-all hover:bg-bg-200/30 dark:bg-bg-900 dark:hover:bg-bg-800"
                    >
                      <div className="flex items-center gap-4">
                        <Icon
                          icon={
                            AIRPORT_TYPES[
                              type as keyof typeof AIRPORT_TYPES
                            ]?.[1]
                          }
                          className={`size-7 ${
                            AIRPORT_TYPES[
                              type as keyof typeof AIRPORT_TYPES
                            ]?.[0]
                          }`}
                        />
                        <div>
                          <p className="text-left text-xl font-medium">
                            {name}
                          </p>
                          <p className="text-left text-bg-500">{location}</p>
                        </div>
                      </div>
                      <Icon
                        icon="tabler:chevron-right"
                        className="size-5 text-bg-500"
                      />
                    </Link>
                  ))
              ) : (
                <EmptyStateScreen
                  title="Oops! No airports found"
                  description="Try searching for something else"
                  icon="tabler:plane-off"
                />
              )}
            </div>
          </Scrollbar>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default AirportsList
