import { Icon } from '@iconify/react'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import {
  APIFallbackComponent,
  Button,
  EmptyStateScreen,
  GoBackButton,
  ModuleWrapper,
  Scrollbar
} from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'
import useFetch from '@hooks/useFetch'

import { type IAirportNOTAMEntry } from '../../interfaces/airports_interfaces'
import Breadcrumbs from '../lists/Breadcrumb'
import Flights from './sections/Flights'
import NOTAM from './sections/NOTAM'
import NOTAMDetailsModal from './sections/NOTAM/components/NOTAMDetailsModal'
import Radio from './sections/Radio'
import Runways from './sections/Runways'
import Weather from './sections/Weather'

function Airport(): React.ReactElement {
  const { componentBg } = useComponentBg()
  const [searchParams, setSearchParams] = useSearchParams()
  const section = searchParams.get('section')
  const { airportID, countryID, continentID, regionID } = useParams()
  const [airportData] = useFetch<{
    data: any
    breadcrumbs: string[]
  }>(`airports/airport/${airportID}`)
  const navigate = useNavigate()

  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false)
  const [selectedNOTAMData, setSelectedNOTAMData] =
    useState<IAirportNOTAMEntry | null>(null)

  useEffect(() => {
    if (typeof airportData !== 'string') {
      if (section === null) {
        setSearchParams({
          section: airportData.data.has_airline_service ? 'flights' : 'weather'
        })
      }
    }
  }, [section, setSearchParams, airportData])

  return (
    <>
      <ModuleWrapper>
        <APIFallbackComponent data={airportData}>
          {airportData => (
            <>
              <GoBackButton
                onClick={() => {
                  navigate(`/airports/${continentID}/${countryID}/${regionID}`)
                }}
              />
              <Breadcrumbs breadcrumbs={airportData.breadcrumbs} />
              <div className="mb-8 flex items-center gap-2">
                <div className="overflow-hidden rounded-md">
                  <Icon
                    className="size-12"
                    icon={`flag:${countryID?.toLowerCase()}-1x1`}
                  />
                </div>
                <h1 className="flex flex-col text-3xl font-semibold">
                  <span className="text-custom-500 text-sm">
                    {airportData.data.type
                      .split('_')
                      .map((word: string) => {
                        return word.charAt(0).toUpperCase() + word.slice(1)
                      })
                      .join(' ')}
                  </span>
                  {airportData.data.name}
                </h1>
              </div>
              <Scrollbar>
                <div className="flex gap-12">
                  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
                    <Map
                      className="h-96 w-full overflow-hidden rounded-lg shadow-lg"
                      defaultCenter={{
                        lat: parseFloat(airportData.data.latitude),
                        lng: parseFloat(airportData.data.longitude)
                      }}
                      defaultZoom={13}
                      disableDefaultUI={true}
                      gestureHandling={'greedy'}
                      mapTypeId="satellite"
                      style={{ width: '100%', height: '24rem' }}
                    >
                      <Marker
                        position={{
                          lat: parseFloat(airportData.data.latitude),
                          lng: parseFloat(airportData.data.longitude)
                        }}
                      />
                    </Map>
                  </APIProvider>
                  <div className="flex h-full flex-wrap items-start gap-x-12">
                    {airportData.data.iata && (
                      <div>
                        <h2 className="text-bg-500 mb-2 text-lg font-medium uppercase tracking-widest">
                          ICAO
                        </h2>
                        <p className="text-4xl tracking-widest">
                          {airportData.data.icao}
                        </p>
                      </div>
                    )}
                    {airportData.data.iata && (
                      <div>
                        <h2 className="text-bg-500 mb-2 text-lg font-medium uppercase tracking-widest">
                          IATA
                        </h2>
                        <p className="text-4xl tracking-widest">
                          {airportData.data.iata}
                        </p>
                      </div>
                    )}
                    {airportData.data.elevation && (
                      <div>
                        <h2 className="text-bg-500 mb-2 text-lg font-medium uppercase tracking-widest">
                          Elevation
                        </h2>
                        <p className="text-4xl tracking-wide">
                          {airportData.data.elevation} ft /{' '}
                          {Math.round(airportData.data.elevation * 0.3048)} m
                          MSL
                        </p>
                      </div>
                    )}
                    <div>
                      <h2 className="text-bg-500 mb-2 text-lg font-medium uppercase tracking-widest">
                        Coordinates
                      </h2>
                      <p className="text-4xl tracking-wide">
                        {(+airportData.data.latitude).toFixed(5)},{' '}
                        {(+airportData.data.longitude).toFixed(5)}
                      </p>
                    </div>
                    {(airportData.data.website ||
                      airportData.data.wikipedia) && (
                      <Button
                        iconAtEnd
                        className="mt-4 w-full"
                        icon="tabler:arrow-right"
                        variant="primary"
                        onClick={() => {
                          window.open(
                            airportData.data.website ||
                              airportData.data.wikipedia,
                            '_blank'
                          )
                        }}
                      >
                        Go to{' '}
                        {airportData.data.website ? 'Website' : 'Wikipedia'}
                      </Button>
                    )}
                  </div>
                </div>
                <div
                  className={clsx(
                    'sticky top-0 z-10 mt-6 flex items-center rounded-md',
                    componentBg
                  )}
                >
                  {[
                    ...(airportData.data.has_airline_service
                      ? [['Flights', 'tabler:plane']]
                      : []),
                    ['Weather', 'tabler:cloud-rain'],
                    ['NOTAM', 'tabler:alert-triangle'],
                    ['Radio', 'tabler:radio'],
                    ['Runways', 'tabler:road']
                  ].map(([name, icon], index) => (
                    <button
                      key={index}
                      className={clsx(
                        'flex w-full cursor-pointer items-center justify-center gap-2 border-b-2 p-4 uppercase tracking-widest transition-all',
                        section === name.toLowerCase()
                          ? 'border-custom-500 text-custom-500 font-medium'
                          : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
                      )}
                      onClick={() => {
                        setSearchParams({ section: name.toLowerCase() })
                      }}
                    >
                      <Icon className="size-5" icon={icon} />
                      {name}
                    </button>
                  ))}
                </div>
                {(() => {
                  switch (section) {
                    case 'flights':
                      if (airportData.data.has_airline_service) {
                        return <Flights IATA={airportData.data.iata} />
                      } else {
                        return (
                          <div className="mb-8 mt-6 w-full">
                            <EmptyStateScreen
                              icon="tabler:alert-triangle"
                              name="section"
                              namespace="modules.airports"
                            />
                          </div>
                        )
                      }
                    case 'weather':
                      return <Weather />
                    case 'notam':
                      return (
                        <NOTAM
                          setSelectedNOTAMId={setSelectedNOTAMData}
                          setViewDetailsModalOpen={setViewDetailsModalOpen}
                        />
                      )
                    case 'radio':
                      return <Radio />
                    case 'runways':
                      return (
                        <Runways
                          code={`${airportData.data.icao}-${airportData.data.iata}`}
                        />
                      )
                    default:
                      return (
                        <EmptyStateScreen
                          icon="tabler:alert-triangle"
                          name="section"
                          namespace="modules.airports"
                        />
                      )
                  }
                })()}
              </Scrollbar>
            </>
          )}
        </APIFallbackComponent>
      </ModuleWrapper>
      <NOTAMDetailsModal
        isOpen={viewDetailsModalOpen}
        selectedNOTAMData={selectedNOTAMData}
        onClose={() => {
          setViewDetailsModalOpen(false)
          setSelectedNOTAMData(null)
        }}
      />
    </>
  )
}

export default Airport
