import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ListboxTransition from '@components/Listbox/ListboxTransition'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'

const CONTINENTS = {
  AF: 'Africa',
  AN: 'Antarctica',
  AS: 'Asia',
  EU: 'Europe',
  NA: 'North America',
  OC: 'Oceania',
  SA: 'South America'
}

function Countries(): React.ReactElement {
  const { continentID } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [continentsData] = useFetch<Record<string, [string, number]>>(
    `airports/countries/${continentID}`
  )
  const navigate = useNavigate()

  return (
    <ModuleWrapper>
      <ModuleHeader title="Airports" desc="..." />
      <div className="mt-8 flex items-center gap-2">
        <Link to="/aviation/airports" className="text-bg-500">
          All Continents
        </Link>
        <Icon icon="tabler:chevron-right" className="size-5 text-bg-500" />
        <Link
          to={`/aviation/airports/${continentID}`}
          className="font-medium text-custom-500"
        >
          {CONTINENTS[continentID as keyof typeof CONTINENTS]}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Listbox
          as="div"
          className="relative mt-2 sm:mt-6"
          value={continentID}
          onChange={value => {
            if (value !== 'all') {
              navigate(`/aviation/airports/${value}`)
            } else {
              navigate('/aviation/airports')
            }
          }}
        >
          <Listbox.Button className="flex w-48 items-center justify-between gap-2 rounded-lg bg-bg-200/50 p-4 dark:bg-bg-800/50">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap font-medium">
                {continentID === 'all'
                  ? 'All Continents'
                  : CONTINENTS[continentID as keyof typeof CONTINENTS]}
              </span>
            </div>
            <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
          </Listbox.Button>
          <ListboxTransition>
            <Listbox.Options className="absolute top-[120%] z-50 mt-1 max-h-56 w-48 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
              <Listbox.Option
                className={({ active }) =>
                  `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                    active
                      ? 'bg-bg-500/30 dark:bg-bg-700/50'
                      : '!bg-transparent'
                  }`
                }
                value="all"
              >
                {({ selected }) => (
                  <>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span>All Continents</span>
                    </div>
                    {selected && (
                      <Icon
                        icon="tabler:check"
                        className="block text-lg text-custom-500"
                      />
                    )}
                  </>
                )}
              </Listbox.Option>
              {Object.keys(CONTINENTS).map(continent => (
                <Listbox.Option
                  key={continent}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active
                        ? 'bg-bg-500/30 dark:bg-bg-700/50'
                        : '!bg-transparent'
                    }`
                  }
                  value={continent}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span>
                          {CONTINENTS[continent as keyof typeof CONTINENTS]}
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </ListboxTransition>
        </Listbox>
        <SearchInput
          stuffToSearch="airports"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <APIComponentWithFallback data={continentsData}>
        {data => (
          <Scrollbar className="mt-6">
            <div className="mb-8 space-y-4 px-4">
              {Object.entries(data).map(([name, [key, amount]]) => (
                <Link
                  to={`/aviation/airports/${continentID}/${key}`}
                  key={name}
                  className="flex w-full items-center justify-between rounded-lg bg-bg-200 p-4 px-6 transition-all hover:bg-bg-200/30 dark:bg-bg-900 dark:hover:bg-bg-800"
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      icon={`circle-flags:${key.toLowerCase()}`}
                      className="size-8"
                    />
                    <div>
                      <p className="text-left text-xl font-medium">{name}</p>
                      <p className="text-left text-bg-500">
                        {amount.toLocaleString()} airports
                      </p>
                    </div>
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

export default Countries
