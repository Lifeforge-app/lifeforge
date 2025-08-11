import { Icon } from '@iconify/react/dist/iconify.js'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import {
  Listbox,
  ListboxOption,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar,
  SearchInput
} from 'lifeforge-ui'
import { useState } from 'react'

const STATUSES = {
  Departed: ['text-green-500', 'tabler:plane-departure', 'bg-green-500/20'],
  Boarding: ['text-blue-500', 'tabler:users', 'bg-blue-500/20'],
  'Gate Closed': ['text-red-500', 'tabler:door-off', 'bg-red-500/20'],
  'Gate Closing': ['text-orange-500', 'tabler:door', 'bg-orange-500/20'],
  'Gate Open': ['text-yellow-500', 'tabler:door-enter', 'bg-yellow-500/20'],
  'New Gate': ['text-lime-500', 'tabler:transfer', 'bg-lime-500/20'],
  'Re-timed': ['text-fuchsia-500', 'tabler:clock', 'bg-fuchsia-500/20'],
  Scheduled: ['text-indigo-500', 'tabler:calendar-event', 'bg-indigo-500/20'],
  'Last Call': ['text-pink-500', 'tabler:bell', 'bg-pink-500/20'],
  Cancelled: ['text-red-500', 'tabler:ban', 'bg-red-500/20'],
  Landed: ['text-blue-500', 'tabler:plane-arrival', 'bg-blue-500/20'],
  Confirmed: ['text-green-500', 'tabler:check', 'bg-green-500/20'],
  Delayed: ['text-red-500', 'tabler:clock-stop', 'bg-red-500/20']
}

const SEARCH_TYPE = [
  ['Departures', 'tabler:plane-departure', 'dep'],
  ['Arrivals', 'tabler:plane-arrival', 'arr']
]

function ChangiAirportFlightStatus() {
  const [type, setType] = useState<'dep' | 'arr'>('dep')

  const [searchQuery, setSearchQuery] = useState('')

  const flightsQuery = useQuery(
    forgeAPI.changiAirportFlightStatus.getFlight.input({ type }).queryOptions()
  )

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:plane" title="Changi Airport Flight Status" />
      <div className="mb-6 flex items-center gap-2">
        <Listbox
          buttonContent={
            <div className="flex items-center gap-2">
              <Icon
                className="size-6"
                icon={
                  SEARCH_TYPE.find(([, , t]) => t === type)?.[1] ||
                  'tabler:plane-departure'
                }
              />
              <span className="font-medium whitespace-nowrap">
                {SEARCH_TYPE.find(([, , t]) => t === type)?.[0] || 'Departure'}
              </span>
            </div>
          }
          className="bg-bg-50 w-min min-w-56"
          setValue={value => {
            setType(value)
          }}
          value={type}
        >
          {SEARCH_TYPE.map(([name, icon, value]) => (
            <ListboxOption key={value} icon={icon} text={name} value={value} />
          ))}
        </Listbox>
        <SearchInput
          className="bg-bg-50"
          namespace="modules.changiAirport"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="flight"
        />
      </div>
      <Scrollbar className="w-full flex-1">
        <QueryWrapper query={flightsQuery}>
          {flights => (
            <table className="mr-8 mb-8 w-max">
              <thead>
                <tr className="border-bg-200 text-bg-500 dark:border-bg-800 border-b-2">
                  {[
                    'Status',
                    'Scheduled Time',
                    'Flight Number',
                    'Aircraft Type',
                    'Airline',
                    `${type === 'dep' ? 'Destination' : 'Origin'} Airport`,
                    'Terminal',
                    'Gate',
                    type === 'dep' ? 'Check-In Row' : 'Baggage Belt',
                    'Estimated Time',
                    'Code Share'
                  ].map(column => (
                    <th key={column} className={'p-2 font-medium'}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flights.getFlights.flights.map(flight => (
                  <tr
                    key={flight.flight_number + flight.scheduled_time}
                    className="border-bg-200 dark:border-bg-800 border-b"
                  >
                    <td className="p-2 text-center whitespace-nowrap">
                      <div
                        className={clsx(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm whitespace-nowrap',
                          STATUSES[
                            flight.flight_status as keyof typeof STATUSES
                          ]?.[0],
                          STATUSES[
                            flight.flight_status as keyof typeof STATUSES
                          ]?.[2]
                        )}
                      >
                        <Icon
                          className="size-4"
                          icon={
                            STATUSES[
                              flight.flight_status as keyof typeof STATUSES
                            ]?.[1]
                          }
                        />
                        {flight.flight_status}
                      </div>
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {flight.scheduled_time}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {flight.flight_number}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {'AB'.includes(flight.aircraft_type[0]) ? (
                          <Icon
                            icon={
                              flight.aircraft_type[0] === 'B'
                                ? 'simple-icons:boeing'
                                : 'simple-icons:airbus'
                            }
                          />
                        ) : (
                          ''
                        )}
                        {flight.aircraft_type}
                      </div>
                    </td>
                    <td className="p-2 text-left whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          alt={flight.airline_details.name}
                          className="size-6"
                          src={flight.airline_details.logo_url}
                        />
                        {flight.airline_details.name} ({flight.airline})
                      </div>
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {flight.airport_details.name} ({flight.airport})
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      T{flight.terminal}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {type === 'dep'
                        ? flight.current_gate
                        : flight.display_gate}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {type === 'dep'
                        ? flight.check_in_row
                        : flight.display_belt}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {flight.estimated_timestamp}
                    </td>
                    <td className="p-2 text-left whitespace-nowrap">
                      {flight.slave_flights.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </QueryWrapper>
      </Scrollbar>
    </ModuleWrapper>
  )
}

export default ChangiAirportFlightStatus
