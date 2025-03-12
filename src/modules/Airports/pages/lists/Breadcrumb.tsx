import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Link, useParams } from 'react-router'
import { Fragment } from 'react/jsx-runtime'

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
}) {
  return (
    <Link
      className={clsx(
        'transition-all',
        isHighlighted
          ? 'text-custom-500 hover:text-custom-600 font-bold'
          : 'text-bg-500',
        !isHighlighted &&
          to !== '' &&
          'hover:text-bg-600 dark:hover:text-bg-50',
        !isHighlighted && to === '' && 'pointer-events-none'
      )}
      to={to}
    >
      {children}
    </Link>
  )
}

function ChevronIcon() {
  return <Icon className="text-bg-500 size-5" icon="tabler:chevron-right" />
}

function Breadcrumbs({ breadcrumbs }: { breadcrumbs: string[] }) {
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
      className={clsx(
        'flex items-center gap-2',
        airportID !== undefined ? 'mb-4 mt-2' : 'mt-6'
      )}
    >
      {breadcrumbItems.map(
        (item, index) =>
          item.show && (
            <Fragment key={index}>
              {index > 0 && <ChevronIcon />}
              <LinkItem isHighlighted={item.isHighlighted} to={item.to}>
                {item.label}
              </LinkItem>
            </Fragment>
          )
      )}
    </div>
  )
}

export default Breadcrumbs
