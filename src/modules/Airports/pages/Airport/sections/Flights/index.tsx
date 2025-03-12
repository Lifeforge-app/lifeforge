import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { APIFallbackComponent, Button } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'
import useFetch from '@hooks/useFetch'

import fetchAPI from '@utils/fetchAPI'

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
  const { componentBg } = useComponentBg()
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

    try {
      const data = await fetchAPI<FlightData[]>(
        `airports/airport/${IATA}/flights/${location.hash
          .replace('#', '')
          .toLowerCase()}?page=${nextPageNum[0]}`,
        {
          method: 'GET'
        }
      )

      setFlightsData(prevData => {
        if (typeof prevData === 'string') return prevData
        return [...data, ...prevData]
      })
      setPageNum([nextPageNum[0] - 1, nextPageNum[1]])
    } catch {
      setFlightsData('error')
      toast.error('Failed to fetch previous page')
    } finally {
      setPreviousPageLoading(false)
    }
  }

  async function fetchNextPage(): Promise<void> {
    setNextPageLoading(true)

    try {
      const data = await fetchAPI<FlightData[]>(
        `airports/airport/${IATA}/flights/${location.hash
          .replace('#', '')
          .toLowerCase()}?page=${nextPageNum[1]}`,
        {
          method: 'GET'
        }
      )

      setFlightsData(prevData => {
        if (typeof prevData === 'string') return prevData
        return [...prevData, ...data]
      })
      setPageNum([nextPageNum[0], nextPageNum[1] + 1])
    } catch {
      setFlightsData('error')
      toast.error('Failed to fetch next page')
    } finally {
      setNextPageLoading(false)
    }
  }

  useEffect(() => {
    if (!['#arrivals', '#departures'].includes(location.hash)) {
      navigate(location.pathname + location.search + '#arrivals')
    }
  }, [location, navigate])

  return (
    <APIFallbackComponent data={flightsData}>
      {(data: FlightData[]) => (
        <>
          <div
            className={clsx(
              'sticky top-[3.64rem] z-10 mt-6 flex items-center rounded-md',
              componentBg
            )}
          >
            {[
              ['Arrivals', 'tabler:plane-arrival'],
              ['Departures', 'tabler:plane-departure']
            ].map(([name, icon], index) => (
              <button
                key={index}
                className={clsx(
                  'flex w-full cursor-pointer items-center justify-center gap-2 border-b-2 p-4 uppercase tracking-widest transition-all',
                  location.hash.replace('#', '') === name.toLowerCase()
                    ? 'border-custom-500 text-custom-500 font-medium'
                    : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
                )}
                onClick={() => {
                  navigate(
                    location.pathname +
                      location.search +
                      `#${name.toLowerCase()}`
                  )
                }}
              >
                <Icon className="size-5" icon={icon} />
                {name}
              </button>
            ))}
          </div>
          <Button
            className="mt-6"
            icon="tabler:arrow-up"
            loading={previousPageLoading}
            variant="no-bg"
            onClick={() => {
              fetchPreviousPage().catch(console.error)
            }}
          >
            Previous Flights
          </Button>
          <FlightsTable data={data} />
          <Button
            className="mb-8"
            icon="tabler:arrow-down"
            loading={nextPageLoading}
            variant="no-bg"
            onClick={() => {
              fetchNextPage().catch(console.error)
            }}
          >
            Next Flights
          </Button>
        </>
      )}
    </APIFallbackComponent>
  )
}

export default Flights
