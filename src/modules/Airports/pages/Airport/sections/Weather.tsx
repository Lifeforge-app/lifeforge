import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { useParams } from 'react-router'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'

export interface IAirportMETARData {
  raw_text: string
  raw_parts: string[]
  icao: string
  observed: Date
  wind?: Wind
  visibility: Visibility
  clouds?: Cloud[]
  temperature: Dewpoint
  dewpoint: Dewpoint
  humidity_percent: number
  barometer: Barometer
  ceiling?: Ceiling
  flight_category: string
  conditions?: Array<{ code: string }>
}

export interface Barometer {
  hg: number
  kpa: number
  mb: number
}

export interface Ceiling {
  code: string
  feet_agl: number
  meters_agl: number
}

export interface Cloud {
  code: string
  base_feet_agl: number
  base_meters_agl: number
}

export interface Dewpoint {
  celsius: number
  fahrenheit: number
}

export interface Visibility {
  miles: string
  miles_float: number
  meters: string
  meters_float: number
}

export interface Wind {
  degrees: number
  speed_kts: number
  speed_mps: number
  gust_kts: number
  gust_mps: number
}

const metarCodes = {
  '+': 'Heavy',
  '-': 'Light',
  SKC: 'Sky clear',
  CLR: 'No significant cloud',
  FEW: 'Few clouds',
  SCT: 'Scattered clouds',
  BKN: 'Broken clouds',
  OVC: 'Overcast',
  NSC: 'No significant cloud',
  CAVOK: 'Ceiling and visibility okay',
  VV: 'Vertical visibility',
  BR: 'Mist',
  FG: 'Fog',
  FU: 'Smoke',
  HZ: 'Haze',
  DU: 'Widespread dust',
  SA: 'Sand',
  VA: 'Volcanic ash',
  RA: 'Rain',
  DZ: 'Drizzle',
  SN: 'Snow',
  SG: 'Snow grains',
  IC: 'Ice crystals',
  PL: 'Ice pellets',
  GR: 'Hail',
  GS: 'Small hail and/or snow pellets',
  PE: 'Ice pellets',
  UP: 'Unknown precipitation',
  TS: 'Thunderstorm',
  SH: 'Showers',
  FZ: 'Freezing',
  DS: 'Dust storm',
  SS: 'Sandstorm',
  PO: 'Well-developed dust/sand whirls',
  SQ: 'Squall',
  FC: 'Funnel cloud (tornado or waterspout)',
  VC: 'In the vicinity'
}

const ICONS = {
  SKC: 'wi-day-sunny',
  CLR: 'wi-day-sunny',
  FEW: 'wi-day-cloudy',
  SCT: 'wi-day-cloudy',
  BKN: 'wi-day-cloudy',
  OVC: 'wi-day-cloudy',
  NSC: 'wi-day-sunny',
  CAVOK: 'wi-day-sunny',
  VV: 'wi-day-sunny',
  BR: 'wi-day-fog',
  FG: 'wi-day-fog',
  FU: 'wi-day-fog',
  HZ: 'wi-day-fog',
  DU: 'wi-day-fog',
  SA: 'wi-day-fog',
  VA: 'wi-day-fog',
  RA: 'wi-day-rain',
  DZ: 'wi-day-rain',
  SN: 'wi-day-snow',
  SG: 'wi-day-snow',
  IC: 'wi-day-snow',
  PL: 'wi-day-snow',
  GR: 'wi-day-snow',
  GS: 'wi-day-snow',
  PE: 'wi-day-snow',
  UP: 'wi-day-snow',
  TS: 'wi-day-thunderstorm',
  SH: 'wi-day-showers',
  FZ: 'wi-day-snow',
  DS: 'wi-day-fog',
  SS: 'wi-dust',
  PO: 'wi-day-fog',
  SQ: 'wi-day-fog',
  FC: 'wi-day-fog'
}

function WidgetWrapper({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <div
      className={`${className} flex size-full flex-col gap-4 rounded-lg p-6 shadow-custom ${componentBg}`}
    >
      {children}
    </div>
  )
}

function Weather(): React.ReactElement {
  const { componentBgLighter } = useThemeColors()
  const { airportID } = useParams()
  const [METARData] = useFetch<IAirportMETARData | 'none'>(
    `airports/airport/${airportID}/METAR`
  )

  return (
    <APIComponentWithFallback data={METARData}>
      {data =>
        data !== 'none' ? (
          <div className="mb-8 mt-6 grid w-full grid-cols-4 gap-4">
            <WidgetWrapper>
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="tabler:plane" className="text-2xl" />
                <span className="ml-2">Flight Category</span>
              </h1>
              <div className="flex w-full flex-1 flex-col items-center justify-center">
                <div
                  className={`w-full rounded-md p-4 text-center text-3xl font-semibold tracking-widest ${
                    {
                      VFR: 'bg-green-500/20 text-green-500',
                      MVFR: 'bg-blue-500/20 text-blue-500',
                      IFR: 'bg-red-500/20 text-red-500',
                      LIFR: 'bg-purple-500/20 text-purple-500',
                      UNKN: 'bg-gray-500/20 text-gray-500'
                    }[data.flight_category]
                  }
            `}
                >
                  {data.flight_category}
                </div>
              </div>
            </WidgetWrapper>
            <WidgetWrapper className="col-span-3">
              <div className="flex-between flex">
                <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                  <Icon icon="tabler:code" className="text-2xl" />
                  <span className="ml-2">Raw METAR Data</span>
                </h1>
                <span className="text-bg-500">
                  Last fetched {moment(data.observed).fromNow()}
                </span>
              </div>
              <code
                className={`rounded-md p-4 text-bg-500 shadow-custom ${componentBgLighter}`}
              >
                {data.raw_text}
              </code>
            </WidgetWrapper>
            <WidgetWrapper className="col-span-2">
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="tabler:cloud-exclamation" className="text-2xl" />
                <span className="ml-2">Weather</span>
              </h1>
              <div className="flex flex-1 items-center justify-center gap-4">
                {data.conditions !== undefined ? (
                  <>
                    <Icon
                      icon={
                        ICONS[
                          data.conditions?.filter(
                            e => !'+-,VC'.includes(e.code)
                          )[0].code as keyof typeof ICONS
                        ]
                      }
                      className="text-6xl text-custom-500"
                    />
                    <span className="text-2xl font-medium">
                      {data?.conditions
                        ?.map(
                          ({ code }) =>
                            metarCodes[code as keyof typeof metarCodes]
                        )
                        .join(', ')
                        .replace(/(Heavy|Light|vicinity),/g, '$1')}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-medium">
                    No significant weather
                  </span>
                )}
              </div>
            </WidgetWrapper>
            <WidgetWrapper>
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="tabler:thermometer" className="text-2xl" />
                <span className="ml-2">Temperature</span>
              </h1>
              <div className="flex flex-1 flex-col items-center justify-center">
                <p className="text-center text-3xl font-medium">
                  {data.temperature.celsius.toFixed(2)}°C /{' '}
                  {data.temperature.fahrenheit.toFixed(2)}°F
                </p>
              </div>
            </WidgetWrapper>
            <WidgetWrapper>
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="tabler:droplet" className="text-2xl" />
                <span className="ml-2">Dewpoint</span>
              </h1>
              <div className="flex flex-1 flex-col items-center justify-center">
                <p className="text-center text-3xl font-medium">
                  {data.dewpoint.celsius.toFixed(2)}°C /{' '}
                  {data.dewpoint.fahrenheit.toFixed(2)}°F
                </p>
              </div>
            </WidgetWrapper>
            <WidgetWrapper>
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="tabler:wind" className="text-2xl" />
                <span className="ml-2">Wind</span>
              </h1>
              {data.wind !== undefined ? (
                <div
                  className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-md p-4 ${(() => {
                    if (data.wind.gust_kts > 30) {
                      return 'bg-red-500/20 text-red-500'
                    }
                    if (data.wind.gust_kts > 20) {
                      return 'bg-yellow-500/20 text-yellow-500'
                    }
                    return 'bg-green-500/20 text-green-500'
                  })()}`}
                >
                  <p className="text-center text-3xl font-medium">
                    {data.wind.speed_kts.toFixed(2)} kts{' '}
                    <span className="text-lg">
                      ({data.wind.speed_mps.toFixed(2)} m/s)
                    </span>
                  </p>
                  <p className="text-center">
                    {data.wind.degrees}° ({data.wind.gust_kts.toFixed(2)} kts)
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-md bg-bg-500/20 p-4 text-bg-500">
                  <p className="text-center text-3xl font-medium">Calm</p>
                </div>
              )}
            </WidgetWrapper>
            <WidgetWrapper>
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="tabler:eye" className="text-2xl" />
                <span className="ml-2">Visibility</span>
              </h1>
              <div
                className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-md p-4 ${
                  data.visibility.miles_float < 1
                    ? 'bg-red-500/20 text-red-500'
                    : data.visibility.miles_float < 3
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-green-500/20 text-green-500'
                }`}
              >
                <p className="text-center text-3xl font-medium">
                  {data.visibility.miles} mi{' '}
                  <span className="text-lg">({data.visibility.meters} m)</span>
                </p>
              </div>
            </WidgetWrapper>
            <WidgetWrapper>
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="tabler:arrow-bar-to-up" className="text-2xl" />
                <span className="ml-2">Celling</span>
              </h1>
              {data.ceiling !== undefined ? (
                <div
                  className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-md p-4 ${
                    data.ceiling.feet_agl < 1000
                      ? 'bg-red-500/20 text-red-500'
                      : data.ceiling.feet_agl < 3000
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-green-500/20 text-green-500'
                  }`}
                >
                  <p className="text-center text-3xl font-medium">
                    {data.ceiling.feet_agl} ft{' '}
                    <span className="text-lg">AGL</span>
                  </p>
                  <p className="text-center">
                    ({data.ceiling.meters_agl} m AGL)
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-md bg-bg-500/20 p-4 text-bg-500">
                  <p className="text-center text-3xl font-medium">No ceiling</p>
                </div>
              )}
            </WidgetWrapper>
            <WidgetWrapper>
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="uil:monitor" className="text-2xl" />
                <span className="ml-2">Barometer</span>
              </h1>
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <p className="text-center text-3xl font-medium">
                  {data.barometer.hg.toFixed(2)} inHg
                </p>
                <p className="text-center text-bg-500">
                  {data.barometer.kpa.toFixed(2)} kPa (
                  {data.barometer.mb.toFixed(2)} mb)
                </p>
              </div>
            </WidgetWrapper>
            <WidgetWrapper className="col-span-4">
              <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
                <Icon icon="tabler:cloud" className="text-2xl" />
                <span className="ml-2">Clouds</span>
              </h1>
              <ul className="space-y-2">
                {data.clouds !== undefined ? (
                  data.clouds.map(cloud => (
                    <div
                      key={cloud.code}
                      className={`flex-between flex rounded-md p-4 pl-6 ${componentBgLighter}`}
                    >
                      <p className="text-2xl font-medium">
                        {metarCodes[cloud.code as keyof typeof metarCodes]}
                      </p>
                      <p className="flex flex-col text-right text-2xl font-medium">
                        {cloud.base_feet_agl} ft AGL
                        <span className="text-base font-normal text-bg-500">
                          {cloud.base_meters_agl.toFixed(2)} m AGL
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-4  pl-6">
                    <p className="text-xl text-bg-500">No significant clouds</p>
                  </div>
                )}
              </ul>
            </WidgetWrapper>
          </div>
        ) : (
          <div className="my-8 w-full">
            <EmptyStateScreen
              title="No METAR data found"
              description="Try searching for something else"
              icon="tabler:cloud-off"
            />
          </div>
        )
      }
    </APIComponentWithFallback>
  )
}

export default Weather
