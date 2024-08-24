import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import APIRequest from '@utils/fetchData'
import FlightsTable from './components/FlightsTable'

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
  const [nextPageNum, setPageNum] = useState([-1, 1])
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
        setPageNum([nextPageNum[0] - 1, nextPageNum[1]])
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
        setPageNum([nextPageNum[0], nextPageNum[1] + 1])
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
          <FlightsTable data={data} />
          <Button
            onClick={() => {
              fetchNextPage().catch(console.error)
            }}
            loading={nextPageLoading}
            variant="no-bg"
            icon="tabler:arrow-down"
            className="mb-12"
          >
            Next Flights
          </Button>
        </>
      )}
    </APIComponentWithFallback>
  )
}

export default Flights
