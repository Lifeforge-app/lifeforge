import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions
} from '@components/inputs'
import useThemeColors from '@hooks/useThemeColor'

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
  const { componentBg } = useThemeColors()
  const continentID = useParams().continentID ?? 'all'
  const navigate = useNavigate()

  return (
    <Listbox
      as="div"
      className="relative"
      value={continentID}
      onChange={value => {
        if (value !== 'all') {
          navigate(`/airports/${value}`)
        } else {
          navigate('/airports')
        }
      }}
    >
      <ListboxButton
        className={clsx(
          'flex-between shadow-custom flex w-48 gap-2 rounded-lg p-4',
          componentBg
        )}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium whitespace-nowrap">
            {continentID === 'all'
              ? 'All Continents'
              : CONTINENTS[continentID as keyof typeof CONTINENTS]}
          </span>
        </div>
        <Icon className="text-bg-500 size-5" icon="tabler:chevron-down" />
      </ListboxButton>
      <ListboxOrComboboxOptions lighter>
        <ListboxOrComboboxOption text="All Continents" value="all" />
        {Object.keys(CONTINENTS).map(continent => (
          <ListboxOrComboboxOption
            key={continent}
            text={CONTINENTS[continent as keyof typeof CONTINENTS]}
            value={continent}
          />
        ))}
      </ListboxOrComboboxOptions>
    </Listbox>
  )
}

export default ContinentSelector
