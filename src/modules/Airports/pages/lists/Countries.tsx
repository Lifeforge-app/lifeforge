import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
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
import Breadcrumbs from './Breadcrumb'

const CONTINENTS = {
  AF: 'Africa',
  AN: 'Antarctica',
  AS: 'Asia',
  EU: 'Europe',
  NA: 'North America',
  OC: 'Oceania',
  SA: 'South America'
}

function Countries() {
  const { componentBgWithHover } = useComponentBg()
  const { continentID } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [countriesData] = useFetch<Record<string, [string, number]>>(
    `airports/countries/${continentID}`
  )
  const [filteredData, setFilteredData] = useState<
    Record<string, [string, number]> | 'loading' | 'error'
  >('loading')

  useEffect(() => {
    if (typeof countriesData !== 'string') {
      setFilteredData(
        Object.fromEntries(
          Object.entries(countriesData).filter(([, [name]]) =>
            name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
          )
        )
      )
    } else {
      setFilteredData(countriesData)
    }
  }, [debouncedSearchQuery, countriesData])

  return (
    <ModuleWrapper>
      <ModuleHeader title="Airports" />
      <MasterSearchBar />
      <Breadcrumbs
        breadcrumbs={[CONTINENTS[continentID as keyof typeof CONTINENTS]]}
      />
      <div className="mt-4 flex items-center gap-2">
        <ContinentSelector />
        <SearchInput
          hasTopMargin={false}
          namespace="modules.airports"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="country"
        />
      </div>
      <APIFallbackComponent data={filteredData}>
        {filteredData => (
          <Scrollbar className="mt-6">
            <div className="mb-8 flex-1 space-y-4 px-4">
              {Object.keys(filteredData).length > 0 ? (
                Object.entries(filteredData)
                  .sort(([, [a]], [, [b]]) => {
                    return a.localeCompare(b)
                  })
                  .map(([key, [name, amount]]) => (
                    <Link
                      key={name}
                      className={clsx(
                        'flex-between shadow-custom flex w-full rounded-lg p-4 px-6 transition-all',
                        componentBgWithHover
                      )}
                      to={`/airports/${continentID}/${key}`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon
                          className="size-8"
                          icon={`circle-flags:${key.toLowerCase()}`}
                        />
                        <div>
                          <p className="text-left text-xl font-medium">
                            {name}
                          </p>
                          <p className="text-bg-500 text-left">
                            {amount.toLocaleString()} airports
                          </p>
                        </div>
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
                  name="countries"
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

export default Countries
