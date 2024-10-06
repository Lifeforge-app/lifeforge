import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
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

function Continents(): React.ReactElement {
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
          stuffToSearch="continents"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          hasTopMargin={false}
        />
      </div>
      <APIComponentWithFallback data={continentsData}>
        {data => (
          <Scrollbar className="mt-6">
            <div className="mb-8 space-y-4 px-4">
              {Object.entries(data).map(([id, amount]) => (
                <Link
                  key={id}
                  to={`/airports/${id}`}
                  className="flex-between flex w-full rounded-lg bg-bg-50 p-4 px-6 shadow-custom transition-all hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800"
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
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default Continents
