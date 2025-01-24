import React, { useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IAirportNOTAMEntry } from '@interfaces/airports_interfaces'
import APIRequest from '@utils/fetchData'
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
    if (hasNextPage) {
      setLoading(true)
      const nextPage = currentPage === -1 ? 1 : currentPage + 1
      await APIRequest({
        endpoint: `airports/airport/${airportID}/NOTAM?page=${nextPage}`,
        method: 'GET',
        callback(data) {
          if (data.data.length === 0) {
            setHasNextPage(false)
          } else {
            if (typeof NOTAMData !== 'string') {
              NOTAMData.push(...data.data)
              setCurrentPage(nextPage)
            }
          }
        },
        finalCallback() {
          setLoading(false)
        },
        onFailure() {
          toast.error('Failed to fetch NOTAM data')
        }
      })
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
                loading={loading}
                onClick={() => {
                  fetchNextPage().catch(console.error)
                }}
                className="w-full"
                variant="secondary"
                iconAtEnd
                icon="tabler:arrow-down"
              >
                {!loading ? 'Load more' : ''}
              </Button>
            )}
          </div>
        ) : (
          <div className="my-8 w-full">
            <EmptyStateScreen
              icon="tabler:exclamation-mark-off"
              title="No NOTAMs"
              description="There are no NOTAMs available for this airport."
            />
          </div>
        )
      }
    </APIFallbackComponent>
  )
}

export default NOTAM
