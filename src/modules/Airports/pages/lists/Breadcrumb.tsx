import { Icon } from '@iconify/react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

const CONTINENTS = {
  AF: 'Africa',
  AN: 'Antarctica',
  AS: 'Asia',
  EU: 'Europe',
  NA: 'North America',
  OC: 'Oceania',
  SA: 'South America'
}

function LinkItem({
  to,
  isHighlighted,
  children
}: {
  to: string
  isHighlighted: boolean
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Link
      to={to}
      className={`transition-all ${
        isHighlighted
          ? 'font-bold text-custom-500 hover:text-custom-600'
          : `text-bg-500 ${
              to !== ''
                ? 'hover:text-bg-600 dark:hover:text-bg-50'
                : 'pointer-events-none'
            }`
      }`}
    >
      {children}
    </Link>
  )
}

function ChevronIcon(): React.ReactElement {
  return <Icon icon="tabler:chevron-right" className="size-5 text-bg-500" />
}

function Breadcrumbs({
  breadcrumbs
}: {
  breadcrumbs: string[]
}): React.ReactElement {
  const { continentID, countryID, regionID, airportID } = useParams<{
    continentID?: string
    countryID?: string
    regionID?: string
    airportID?: string
  }>()

  const breadcrumbItems = [
    {
      to: '/airports',
      isHighlighted: continentID === undefined,
      label: 'All Continents',
      show: true
    },
    {
      to: `/airports/${continentID}`,
      isHighlighted: countryID === undefined,
      label: CONTINENTS[continentID as keyof typeof CONTINENTS],
      show: continentID !== undefined
    },
    {
      to: `/airports/${continentID}/${countryID}`,
      isHighlighted: regionID === undefined,
      label: breadcrumbs[0],
      show: countryID !== undefined
    },
    {
      to: `/airports/${continentID}/${countryID}/${regionID}`,
      isHighlighted: airportID === undefined,
      label: breadcrumbs[1],
      show: regionID !== undefined
    },
    {
      to: '',
      isHighlighted: false,
      label: breadcrumbs[2],
      show: airportID !== undefined
    },
    {
      to: `/airports/${continentID}/${countryID}/${regionID}/${airportID}`,
      isHighlighted: true,
      label: breadcrumbs[3],
      show: airportID !== undefined
    }
  ]

  return (
    <div
      className={`${
        airportID !== undefined ? 'mb-4 mt-2' : 'mt-6'
      } flex items-center gap-2`}
    >
      {breadcrumbItems.map(
        (item, index) =>
          item.show && (
            <React.Fragment key={index}>
              {index > 0 && <ChevronIcon />}
              <LinkItem to={item.to} isHighlighted={item.isHighlighted}>
                {item.label}
              </LinkItem>
            </React.Fragment>
          )
      )}
    </div>
  )
}

export default Breadcrumbs
