import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import APIRequest from '@utils/fetchData'

interface FlightData {
  time: string
  date: string
  origin: {
    iata: string
    name: string
  }
  flightNumber: string
  airline: string
  status: string
}

function Flights({ IATA }: { IATA: string }): React.ReactElement {
  const [nextPageNum, setNageNum] = useState([-1, 1])
  const location = useLocation()
  const [flightsData, , setFlightsData] = useFetch<FlightData[]>(
    `airports/airport/${IATA}/flights/${location.hash
      .replace('#', '')
      .toLowerCase()}`,
    ['#arrivals', '#departures'].includes(location.hash)
  )
  const [previousPageLoading, setPreviousPageLoading] = useState(false)
  const [nextPageLoading, setNextPageLoading] = useState(false)
  const navigate = useNavigate()

  async function fetchPreviousPage(): Promise<void> {
    setPreviousPageLoading(true)
    await APIRequest({
      endpoint: `airports/airport/${IATA}/flights/${location.hash
        .replace('#', '')
        .toLowerCase()}?page=${nextPageNum[0]}`,
      method: 'GET',
      callback(data) {
        setFlightsData([...data.data, ...flightsData])
        setNageNum([nextPageNum[0] - 1, nextPageNum[1]])
      },
      finalCallback() {
        setPreviousPageLoading(false)
      }
    })
  }

  async function fetchNextPage(): Promise<void> {
    setNextPageLoading(true)
    await APIRequest({
      endpoint: `airports/airport/${IATA}/flights/${location.hash
        .replace('#', '')
        .toLowerCase()}?page=${nextPageNum[1]}`,
      method: 'GET',
      callback(data) {
        setFlightsData([...flightsData, ...data.data])
        setNageNum([nextPageNum[0], nextPageNum[1] + 1])
      },
      finalCallback() {
        setNextPageLoading(false)
      }
    })
  }

  useEffect(() => {
    if (!['#arrivals', '#departures'].includes(location.hash)) {
      navigate(location.pathname + location.search + '#arrivals')
    }
  }, [location, navigate])

  return (
    <APIComponentWithFallback data={flightsData}>
      {(data: FlightData[]) => (
        <>
          <div className="sticky top-[3.64rem] z-10 mt-8 flex items-center rounded-md bg-bg-50 dark:bg-bg-950">
            {[
              ['Arrivals', 'tabler:plane-arrival'],
              ['Departures', 'tabler:plane-departure']
            ].map(([name, icon], index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(
                    location.pathname +
                      location.search +
                      `#${name.toLowerCase()}`
                  )
                }}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 border-b-2 p-4 uppercase tracking-widest transition-all ${
                  location.hash.replace('#', '') === name.toLowerCase()
                    ? 'border-custom-500 font-medium text-custom-500'
                    : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
                }`}
              >
                <Icon icon={icon} className="size-5" />
                {name}
              </button>
            ))}
          </div>
          <Button
            onClick={() => {
              fetchPreviousPage().catch(console.error)
            }}
            loading={previousPageLoading}
            variant="no-bg"
            icon="tabler:arrow-up"
            className="mt-6"
          >
            Previous Flights
          </Button>
          <table className="mb-4 w-full border-separate border-spacing-0">
            <thead className="sticky top-[7.2rem]">
              <tr className="rounded-md">
                {[
                  'Time',
                  'Date',
                  'Origin',
                  'Flight Number',
                  'Airline',
                  'Status'
                ].map(title => (
                  <th
                    key={title}
                    className="border-b-2 border-bg-200 bg-bg-50 px-4 py-2 pt-4 text-bg-500 dark:border-bg-700 dark:bg-bg-950"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(flight => (
                <tr key={flight.flightNumber}>
                  {[
                    flight.time,
                    flight.date,
                    `${flight.origin.iata} - ${flight.origin.name}`,
                    flight.flightNumber,
                    flight.airline,
                    flight.status
                  ].map((value, index) => (
                    <td
                      key={index}
                      className={`border-b border-bg-200 px-4 py-2 text-center dark:border-bg-800 ${
                        index === 5
                          ? (() => {
                              if (value.startsWith('Landed')) {
                                return 'text-green-500'
                              }
                              if (value.startsWith('Estimated')) {
                                return 'text-yellow-500'
                              }
                              if (value.startsWith('Scheduled')) {
                                return 'text-blue-500'
                              }
                              if (value.startsWith('Cancelled')) {
                                return 'text-red-500'
                              }
                              if (value.startsWith('Departed')) {
                                return 'text-green-500'
                              }
                              return 'text-bg-500 dark:text-bg-400'
                            })()
                          : 'text-bg-500 dark:text-bg-400'
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            onClick={() => {
              fetchNextPage().catch(console.error)
            }}
            loading={nextPageLoading}
            variant="no-bg"
            icon="tabler:arrow-down"
            className="mb-6"
          >
            Next Flights
          </Button>
        </>
      )}
    </APIComponentWithFallback>
  )
}

export default Flights
