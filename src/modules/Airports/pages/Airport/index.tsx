/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react/dist/iconify.js'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'
import { type IAirportNOTAMEntry } from '@interfaces/airports_interfaces'
import { toTitleCase } from '@utils/strings'
import Flights from './sections/Flights'
import NOTAM from './sections/NOTAM'
import NOTAMDetailsModal from './sections/NOTAM/components/NOTAMDetailsModal'
import Radio from './sections/Radio'
import Runways from './sections/Runways'
import Weather from './sections/Weather'
import Breadcrumbs from '../lists/Breadcrumb'

function Airport(): React.ReactElement {
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
        <APIComponentWithFallback data={airportData}>
          {airportData => (
            <>
              <GoBackButton
                onClick={() => {
                  navigate(
                    `/aviation/airports/${continentID}/${countryID}/${regionID}`
                  )
                }}
              />
              <Breadcrumbs breadcrumbs={airportData.breadcrumbs} />
              <div className="mb-8 flex items-center gap-2">
                <div className="overflow-hidden rounded-md">
                  <Icon
                    icon={`flag:${countryID?.toLowerCase()}-1x1`}
                    className="size-12"
                  />
                </div>
                <h1 className="flex flex-col text-3xl font-semibold">
                  <span className="text-sm text-custom-500">
                    {toTitleCase(airportData.data.type.split('_').join(' '))}
                  </span>
                  {airportData.data.name}
                </h1>
              </div>
              <Scrollbar>
                <div className="flex gap-12">
                  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
                    <Map
                      style={{ width: '100%', height: '24rem' }}
                      defaultCenter={{
                        lat: parseFloat(airportData.data.latitude),
                        lng: parseFloat(airportData.data.longitude)
                      }}
                      defaultZoom={13}
                      gestureHandling={'greedy'}
                      disableDefaultUI={true}
                      mapTypeId="satellite"
                      className="h-96 w-full overflow-hidden rounded-lg shadow-lg"
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
                        <h2 className="mb-2 text-lg font-medium uppercase tracking-widest text-bg-500">
                          ICAO
                        </h2>
                        <p className="text-4xl tracking-widest">
                          {airportData.data.icao}
                        </p>
                      </div>
                    )}
                    {airportData.data.iata && (
                      <div>
                        <h2 className="mb-2 text-lg font-medium uppercase tracking-widest text-bg-500">
                          IATA
                        </h2>
                        <p className="text-4xl tracking-widest">
                          {airportData.data.iata}
                        </p>
                      </div>
                    )}
                    {airportData.data.elevation && (
                      <div>
                        <h2 className="mb-2 text-lg font-medium uppercase tracking-widest text-bg-500">
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
                      <h2 className="mb-2 text-lg font-medium uppercase tracking-widest text-bg-500">
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
                        onClick={() => {
                          window.open(
                            airportData.data.website ||
                              airportData.data.wikipedia,
                            '_blank'
                          )
                        }}
                        className="mt-4 w-full"
                        variant="primary"
                        iconAtEnd
                        icon="tabler:arrow-right"
                      >
                        Go to{' '}
                        {airportData.data.website ? 'Website' : 'Wikipedia'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="sticky top-0 z-10 mt-8 flex items-center rounded-md bg-bg-50 dark:bg-bg-950">
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
                      onClick={() => {
                        setSearchParams({ section: name.toLowerCase() })
                      }}
                      className={`flex w-full cursor-pointer items-center justify-center gap-2 border-b-2 p-4 uppercase tracking-widest transition-all ${
                        section === name.toLowerCase()
                          ? 'border-custom-500 font-medium text-custom-500'
                          : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
                      }`}
                    >
                      <Icon icon={icon} className="size-5" />
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
                              title="Section not found"
                              description="The section you are looking for does not exist."
                              icon="tabler:alert-triangle"
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
                          title="Section not found"
                          description="The section you are looking for does not exist."
                          icon="tabler:alert-triangle"
                        />
                      )
                  }
                })()}
              </Scrollbar>
            </>
          )}
        </APIComponentWithFallback>
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
