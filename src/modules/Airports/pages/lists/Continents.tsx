import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
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

function Continents(): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
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
          stuffToSearch="continent"
          namespace="modules.airports"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          hasTopMargin={false}
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
                    to={`/airports/${id}`}
                    className={`flex-between flex w-full rounded-lg p-4 px-6 shadow-custom transition-all ${componentBgWithHover}`}
                  >
                    <div>
                      <p className="text-left text-xl font-medium">
                        {CONTINENTS[id as keyof typeof CONTINENTS]}
                      </p>
                      <p className="text-left text-bg-500">
                        {amount.toLocaleString()} airports
                      </p>
                    </div>
                    <Icon
                      icon="tabler:chevron-right"
                      className="size-5 text-bg-500"
                    />
                  </Link>
                ))}
              </div>
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              name="continents"
              namespace="modules.airports"
              icon="tabler:search-off"
            />
          )
        }
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default Continents
