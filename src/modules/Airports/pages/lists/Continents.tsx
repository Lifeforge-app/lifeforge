import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'

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

function Continents() {
  const { componentBgWithHover } = useComponentBg()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [continentsData] = useFetch<Record<string, number>>(
    'airports/continents'
  )
  const filteredData = useMemo(() => {
    if (!debouncedSearchQuery || typeof continentsData === 'string')
      return continentsData

    return Object.fromEntries(
      Object.entries(continentsData).filter(([key]) =>
        CONTINENTS[key as keyof typeof CONTINENTS]
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
      )
    )
  }, [continentsData, debouncedSearchQuery])

  return (
    <ModuleWrapper>
      <ModuleHeader title="Airports" />
      <MasterSearchBar />
      <div className="mt-4 flex items-center gap-2">
        <ContinentSelector />
        <SearchInput
          hasTopMargin={false}
          namespace="modules.airports"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="continent"
        />
      </div>
      <APIFallbackComponent data={filteredData}>
        {data =>
          Object.keys(data).length ? (
            <Scrollbar className="mt-6">
              <div className="mb-8 space-y-4 px-4">
                {Object.entries(data).map(([id, amount]) => (
                  <Link
                    key={id}
                    className={clsx(
                      'flex-between shadow-custom flex w-full rounded-lg p-4 px-6 transition-all',
                      componentBgWithHover
                    )}
                    to={`/airports/${id}`}
                  >
                    <div>
                      <p className="text-left text-xl font-medium">
                        {CONTINENTS[id as keyof typeof CONTINENTS]}
                      </p>
                      <p className="text-bg-500 text-left">
                        {amount.toLocaleString()} airports
                      </p>
                    </div>
                    <Icon
                      className="text-bg-500 size-5"
                      icon="tabler:chevron-right"
                    />
                  </Link>
                ))}
              </div>
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              icon="tabler:search-off"
              name="continents"
              namespace="modules.airports"
            />
          )
        }
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default Continents
