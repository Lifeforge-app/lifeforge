import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { Link, useParams } from 'react-router'

import useComponentBg from '@hooks/useComponentBg'

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
  const { componentBgWithHover } = useComponentBg()

  const { continentID, countryID, regionID } = useParams<{
    continentID?: string
    countryID?: string
    regionID?: string
  }>()

  return (
    <Link
      className={clsx(
        'flex-between shadow-custom flex w-full rounded-lg p-4 px-6 transition-all',
        componentBgWithHover
      )}
      to={`/airports/${continentID}/${countryID}/${regionID}/${id}`}
    >
      <div className="flex items-center gap-4">
        <Icon
          className={clsx(
            'size-7',
            AIRPORT_TYPES[type as keyof typeof AIRPORT_TYPES]?.[0]
          )}
          icon={AIRPORT_TYPES[type as keyof typeof AIRPORT_TYPES]?.[1]}
        />
        <div>
          <p className="text-left text-xl font-medium">{name}</p>
          <p className="text-bg-500 text-left">{location}</p>
        </div>
      </div>
      <Icon className="text-bg-500 size-5" icon="tabler:chevron-right" />
    </Link>
  )
}

export default EntryItem
