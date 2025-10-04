import { forgeController, forgeRouter } from '@functions/routes'
import z from 'zod'

const cache = new Map()

const cacheTime = 1000 * 60

let lastFetch = +new Date()

export interface IFlightStatus {
  getFlights: GetFlights
}

export interface GetFlights {
  next_token: string
  flights: Flight[]
}

export interface Flight {
  actual_timestamp: null
  aircraft_type: string
  airline: string
  airline_details: AirlineDetails
  airport: string
  airport_details: AirportDetails
  check_in_row: null | string
  current_gate: null | string
  direction: string
  display_belt: null
  display_checkinrowctr: null | string
  display_gate: null | string
  display_timestamp: string
  drop_off_door: null | string
  estimated_timestamp: null | string
  flight_number: string
  firstbag_timestamp: null
  flight_status: string
  flight_type: string
  last_updated_timestamp: Date
  lastbag_timestamp: null
  master_flight_number: null | string
  nature: string
  nearest_carpark: string | null
  offblock_timestamp: null | string
  origin_dep_country: null
  origin_dep_date: null
  origin_dep_terminal: null
  origin_dep_time: null
  origin_via_country: null
  pick_up_door: null
  previous_gate: null | string
  scheduled_date: Date
  scheduled_time: string
  slave_flights: string[]
  technical_flight_status1: string
  technical_flight_status2: string
  terminal: string
  via: null | string
  via_airport_details: AirportDetails | null
  status_mapping: StatusMapping
}

export interface AirlineDetails {
  logo_url: string
  code: string
  name: string
  name_zh: string
  name_zh_hant: null | string
  transfer_counters: string | null
  transit: string
}

export interface AirportDetails {
  code: string
  country_code: string
  lat: string
  lng: string
  name: string
  name_zh: string
  name_zh_hant: string
}

export interface StatusMapping {
  belt_status_en: null
  belt_status_zh: null
  details_status_en: string
  details_status_zh: string
  listing_status_en: string
  listing_status_zh: string
  show_gate: boolean
  status_text_color: string
}

const getFlight = forgeController
  .query()
  .description('Get flight status from Changi Airport')
  .input({
    query: z.object({
      type: z.enum(['arr', 'dep'])
    })
  })
  .callback(async ({ query: { type } }) => {
    if (
      cache.has('flights') &&
      cache.get('searchType') === type &&
      +new Date() - lastFetch < cacheTime
    ) {
      const data = cache.get('flights')

      return data as {
        getFlights: GetFlights
      }
    }

    const API_key = await fetch(
      'https://www.changiairport.com/en/flights/arrivals.html'
    )
      .then(res => res.text())
      .then(
        data => data.match(/&#34;appSyncApiKey&#34;: &#34;(.*?)&#34;,/)?.[1]
      )
      .catch(console.error)

    const { data } = await fetch(
      'https://ca-appsync.lz.changiairport.com/graphql',
      {
        method: 'POST',
        headers: {
          'x-api-key': API_key ?? ''
        },
        body: JSON.stringify({
          query: `
    query {
      getFlights(direction: "${type}", page_size: "500") {
        next_token
        flights {
          actual_timestamp
          aircraft_type
          airline
          airline_details {
            logo_url
            code
            name
            name_zh
            name_zh_hant
            transfer_counters
            transit
          }
          airport
          airport_details {
            code
            country_code
            lat
            lng
            name
            name_zh
            name_zh_hant
          }
          check_in_row
          current_gate
          direction
          display_belt
          display_checkinrowctr
          display_gate
          display_timestamp
          drop_off_door
          estimated_timestamp
          flight_number
          firstbag_timestamp
          flight_status
          flight_type
          last_updated_timestamp
          lastbag_timestamp
          master_flight_number
          nature
          nearest_carpark
          offblock_timestamp
          origin_dep_country
          origin_dep_date
          origin_dep_terminal
          origin_dep_time
          origin_via_country
          pick_up_door
          previous_gate
          scheduled_date
          scheduled_time
          slave_flights
          technical_flight_status1
          technical_flight_status2
          terminal
          via
          via_airport_details {
            code
            country_code
            lng
            lat
            name
            name_zh
            name_zh_hant
          }
          status_mapping {
            belt_status_en
            belt_status_zh
            details_status_en
            details_status_zh
            listing_status_en
            listing_status_zh
            show_gate
            status_text_color
          }
        }
      }
    }
                `
        })
      }
    ).then(res => res.json())

    cache.set('flights', data)
    cache.set('searchType', type)
    lastFetch = +new Date()

    return data as {
      getFlights: GetFlights
    }
  })

export default forgeRouter({
  getFlight
})
