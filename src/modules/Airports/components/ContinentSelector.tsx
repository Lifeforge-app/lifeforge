import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import ListboxTransition from '@components/Listbox/ListboxTransition'

const CONTINENTS = {
  AF: 'Africa',
  AN: 'Antarctica',
  AS: 'Asia',
  EU: 'Europe',
  NA: 'North America',
  OC: 'Oceania',
  SA: 'South America'
}

function ContinentSelector(): React.ReactElement {
  const continentID = useParams().continentID ?? 'all'
  const navigate = useNavigate()

  return (
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
      <Listbox.Button className="flex-between flex w-48 gap-2 rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-800/50">
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
              `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
                active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
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
                `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
                  active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
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
  )
}

export default ContinentSelector
