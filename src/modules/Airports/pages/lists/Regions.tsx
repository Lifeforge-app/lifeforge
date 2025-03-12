import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import {
  APIFallbackComponent,
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper,
  Scrollbar,
  SearchInput
} from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'
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
  const { componentBgWithHover } = useComponentBg()
  const { countryID, continentID } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
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
      <APIFallbackComponent data={regionsData} showLoading={false}>
        {continentsData => (
          <div className="mt-6 flex items-center gap-2">
            <Link className="text-bg-500" to="/airports">
              All Continents
            </Link>
            <Icon className="text-bg-500 size-5" icon="tabler:chevron-right" />
            <Link className="text-bg-500" to={`/airports/${continentID}`}>
              {CONTINENTS[continentID as keyof typeof CONTINENTS]}
            </Link>
            <Icon className="text-bg-500 size-5" icon="tabler:chevron-right" />
            <Link
              className="text-custom-500 font-medium"
              to={`/airports/${continentID}/${countryID}`}
            >
              {continentsData.breadcrumbs[0]}
            </Link>
          </div>
        )}
      </APIFallbackComponent>
      <div className="mt-4 flex items-center gap-2">
        <ContinentSelector />
        <SearchInput
          hasTopMargin={false}
          namespace="modules.airports"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="region"
        />
      </div>
      <APIFallbackComponent data={filteredData}>
        {data => (
          <Scrollbar className="mt-6">
            <div className="mb-8 flex-1 space-y-4 px-4">
              {Object.keys(data).length > 0 ? (
                Object.entries(data)
                  .sort(([, [a]], [, [b]]) => {
                    return a.localeCompare(b)
                  })
                  .map(([id, [name, amount]]) => (
                    <Link
                      key={name}
                      className={clsx(
                        'flex-between shadow-custom flex w-full rounded-lg p-4 px-6 transition-all',
                        componentBgWithHover
                      )}
                      to={`/airports/${continentID}/${countryID}/${id}`}
                    >
                      <div>
                        <p className="text-left text-xl font-medium">{name}</p>
                        <p className="text-bg-500 text-left">
                          {amount.toLocaleString()} airports
                        </p>
                      </div>
                      <Icon
                        className="text-bg-500 size-5"
                        icon="tabler:chevron-right"
                      />
                    </Link>
                  ))
              ) : (
                <EmptyStateScreen
                  icon="tabler:globe-off"
                  name="regions"
                  namespace="modules.airports"
                />
              )}
            </div>
          </Scrollbar>
        )}
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default Regions
