import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { ListboxOrComboboxOption , ListboxOrComboboxOptions } from '@components/inputs'
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
        className={`flex-between flex w-48 gap-2 rounded-lg p-4 shadow-custom ${componentBg}`}
      >
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap font-medium">
            {continentID === 'all'
              ? 'All Continents'
              : CONTINENTS[continentID as keyof typeof CONTINENTS]}
          </span>
        </div>
        <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
      </ListboxButton>
      <ListboxOrComboboxOptions lighter>
        <ListboxOrComboboxOption value="all" text="All Continents" />
        {Object.keys(CONTINENTS).map(continent => (
          <ListboxOrComboboxOption
            key={continent}
            value={continent}
            text={CONTINENTS[continent as keyof typeof CONTINENTS]}
          />
        ))}
      </ListboxOrComboboxOptions>
    </Listbox>
  )
}

export default ContinentSelector
