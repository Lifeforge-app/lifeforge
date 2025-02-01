import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
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
  const [continentsData] = useFetch<Record<string, number>>(
    'airports/continents'
  )

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
      <APIFallbackComponent data={continentsData}>
        {data => (
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
        )}
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default Continents
