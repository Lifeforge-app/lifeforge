import fetchAPI from '@utils/fetchAPI'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { APIFallbackComponent, Button, EmptyStateScreen } from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import { type IAirportNOTAMEntry } from '../../../../interfaces/airports_interfaces'
import NOTAMListItem from './components/NOTAMListItem'

function NOTAM({
  setSelectedNOTAMId: setSelectedNOTAMData,
  setViewDetailsModalOpen
}: {
  setSelectedNOTAMId: React.Dispatch<
    React.SetStateAction<IAirportNOTAMEntry | null>
  >
  setViewDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { airportID } = useParams()
  const [NOTAMData] = useFetch<IAirportNOTAMEntry[] | 'none'>(
    `airports/airport/${airportID}/NOTAM`
  )
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(-1)
  const [hasNextPage, setHasNextPage] = useState(true)

  async function fetchNextPage(): Promise<void> {
    if (!hasNextPage) return

    setLoading(true)
    const nextPage = currentPage === -1 ? 1 : currentPage + 1

    try {
      const data = await fetchAPI<IAirportNOTAMEntry[]>(
        `airports/airport/${airportID}/NOTAM?page=${nextPage}`
      )

      if (data.length === 0) {
        setHasNextPage(false)
      } else {
        if (typeof NOTAMData !== 'string') {
          NOTAMData.push(...data)
          setCurrentPage(nextPage)
        }
      }
    } catch {
      toast.error('Failed to fetch NOTAM data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <APIFallbackComponent data={NOTAMData}>
      {NOTAMData =>
        NOTAMData !== 'none' ? (
          <div className="my-8 space-y-4">
            {NOTAMData.map(NOTAM => (
              <NOTAMListItem
                key={NOTAM.id}
                data={NOTAM}
                setSelectedNOTAMData={setSelectedNOTAMData}
                setViewDetailsModalOpen={setViewDetailsModalOpen}
              />
            ))}
            {hasNextPage && (
              <Button
                iconAtEnd
                className="w-full"
                icon="tabler:arrow-down"
                loading={loading}
                variant="secondary"
                onClick={() => {
                  fetchNextPage().catch(console.error)
                }}
              >
                {!loading ? 'Load more' : ''}
              </Button>
            )}
          </div>
        ) : (
          <div className="my-8 w-full">
            <EmptyStateScreen
              icon="tabler:exclamation-mark-off"
              name="NOTAM"
              namespace="modules.airports"
            />
          </div>
        )
      }
    </APIFallbackComponent>
  )
}

export default NOTAM
