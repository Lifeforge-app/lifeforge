import React from 'react'
import { useParams } from 'react-router'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import Barometer from './components/Barometer'
import Ceiling from './components/Ceiling'
import Clouds from './components/Clouds'
import Dewpoint from './components/Dewpoint'
import FlightCategory from './components/FlightCategory'
import RawMETARData from './components/RawMETARData'
import SignificantWeather from './components/SignificantWeather'
import Temperature from './components/Temperature'
import Visibility from './components/Visibility'
import Wind from './components/Wind'

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

function Weather(): React.ReactElement {
  const { airportID } = useParams()
  const [METARData] = useFetch<IAirportMETARData | 'none'>(
    `airports/airport/${airportID}/METAR`
  )

  return (
    <APIFallbackComponent data={METARData}>
      {data =>
        data !== 'none' ? (
          <div className="mt-6 mb-8 grid w-full grid-cols-4 gap-4">
            <FlightCategory data={data} />
            <RawMETARData data={data} />
            <SignificantWeather data={data} />
            <Temperature data={data} />
            <Dewpoint data={data} />
            <Wind data={data} />
            <Visibility data={data} />
            <Ceiling data={data} />
            <Barometer data={data} />
            <Clouds data={data} />
          </div>
        ) : (
          <div className="my-8 w-full">
            <EmptyStateScreen
              icon="tabler:cloud-off"
              name="METAR"
              namespace="modules.airports"
            />
          </div>
        )
      }
    </APIFallbackComponent>
  )
}

export default Weather
