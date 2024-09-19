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

function Regions(): React.ReactElement {
  const { countryID, continentID } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [regionsData] = useFetch<{
    breadcrumbs: string[]
    data: Record<string, [string, number]>
  }>(`airports/regions/${countryID}`)
  const [filteredData, setFilteredData] = useState<
    Record<string, [string, number]> | 'loading' | 'error'
  >('loading')

  useEffect(() => {
    if (typeof regionsData !== 'string') {
      setFilteredData(
        Object.fromEntries(
          Object.entries(regionsData.data).filter(([, [name]]) =>
            name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
          )
        )
      )
    } else {
      setFilteredData(regionsData)
    }
  }, [debouncedSearchQuery, regionsData])

  return (
    <ModuleWrapper>
      <ModuleHeader title="Airports" />
      <MasterSearchBar />
      <APIComponentWithFallback data={regionsData} showLoading={false}>
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
              className="font-medium text-custom-500"
            >
              {continentsData.breadcrumbs[0]}
            </Link>
          </div>
        )}
      </APIComponentWithFallback>
      <div className="flex items-center gap-2">
        <ContinentSelector />
        <SearchInput
          stuffToSearch="regions"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <APIComponentWithFallback data={filteredData}>
        {data => (
          <Scrollbar className="mt-6">
            <div className="mb-8 flex-1 space-y-4 px-4">
              {Object.keys(data).length > 0 ? (
                Object.entries(data)
                  .sort(([, [a]], [, [b]]) => {
                    console.log(a, b)
                    return a.localeCompare(b)
                  })
                  .map(([id, [name, amount]]) => (
                    <Link
                      to={`/aviation/airports/${continentID}/${countryID}/${id}`}
                      key={name}
                      className="flex-between flex w-full rounded-lg bg-bg-50 p-4 px-6 shadow-custom transition-all hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800"
                    >
                      <div>
                        <p className="text-left text-xl font-medium">{name}</p>
                        <p className="text-left text-bg-500">
                          {amount.toLocaleString()} airports
                        </p>
                      </div>
                      <Icon
                        icon="tabler:chevron-right"
                        className="size-5 text-bg-500"
                      />
                    </Link>
                  ))
              ) : (
                <EmptyStateScreen
                  title="Oops! No regions found"
                  description="Try searching for something else"
                  icon="tabler:globe-off"
                />
              )}
            </div>
          </Scrollbar>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default Regions
