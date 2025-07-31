import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

const cache = new Map()

const cacheTime = 1000 * 60

let lastFetch = +new Date()

const getFlight = forgeController.query
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

      return data
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

    return data
  })

export default forgeRouter({
  getFlight
})
