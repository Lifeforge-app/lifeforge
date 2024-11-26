import { Icon } from '@iconify/react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import useThemeColors from '@hooks/useThemeColor'

const AIRPORT_TYPES = {
  large_airport: ['text-yellow-500', 'uil:plane'],
  medium_airport: ['text-sky-500', 'uil:plane'],
  small_airport: ['text-pink-500', 'uil:plane'],
  heliport: ['text-blue-500', 'tabler:helicopter-landing'],
  seaplane_base: ['text-orange-500', 'tabler:anchor'],
  balloonport: ['text-green-500', 'tabler:air-balloon'],
  closed: ['text-red-500', 'tabler:ban']
}

function EntryItem({
  id,
  name,
  location,
  type
}: {
  id: string
  name: string
  location: string
  type: string
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()

  const { continentID, countryID, regionID } = useParams<{
    continentID?: string
    countryID?: string
    regionID?: string
  }>()

  return (
    <Link
      to={`/airports/${continentID}/${countryID}/${regionID}/${id}`}
      className={`flex-between flex w-full rounded-lg p-4 px-6 shadow-custom transition-all ${componentBgWithHover}`}
    >
      <div className="flex items-center gap-4">
        <Icon
          icon={AIRPORT_TYPES[type as keyof typeof AIRPORT_TYPES]?.[1]}
          className={`size-7 ${
            AIRPORT_TYPES[type as keyof typeof AIRPORT_TYPES]?.[0]
          }`}
        />
        <div>
          <p className="text-left text-xl font-medium">{name}</p>
          <p className="text-left text-bg-500">{location}</p>
        </div>
      </div>
      <Icon icon="tabler:chevron-right" className="size-5 text-bg-500" />
    </Link>
  )
}

export default EntryItem
