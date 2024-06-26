import React from 'react'
import { useParams } from 'react-router'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IAirportNOTAMEntry } from '@interfaces/airports_interfaces'
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

  return (
    <APIComponentWithFallback data={NOTAMData}>
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
    </APIComponentWithFallback>
  )
}

export default NOTAM
