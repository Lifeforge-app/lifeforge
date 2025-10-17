import { Icon } from '@iconify/react'
import { EmptyStateScreen, SearchInput } from 'lifeforge-ui'
import { useMemo, useState } from 'react'

import type { Line, Station } from '../../typescript/mrt.interfaces'
import StationItem from '../StationItem'

function StationSection({
  mrtLines,
  mrtStations,
  setMrtStations
}: {
  mrtLines: Line[]
  mrtStations: Station[]
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
}) {
  const [searchStationQuery, setSearchStationQuery] = useState('')

  const filteredStations = useMemo(() => {
    return mrtStations.filter(station =>
      station.name.toLowerCase().includes(searchStationQuery.toLowerCase())
    )
  }, [mrtStations, searchStationQuery])

  return (
    <>
      <div className="mb-4 flex items-center gap-3 px-4">
        <Icon className="text-2xl" icon="tabler:map-pin" />
        <h2 className="text-xl font-medium">Stations</h2>
      </div>

      <div className="flex flex-col space-y-3 px-4">
        <SearchInput
          className="component-bg-lighter mb-4"
          value={searchStationQuery}
          setValue={setSearchStationQuery}
          searchTarget="stations"
        />
        {mrtStations.length > 0 ? (
          filteredStations.length > 0 ? (
            <div className="space-y-3">
              {filteredStations.map(station => (
                <StationItem
                  key={station.id}
                  mrtLines={mrtLines}
                  setMrtStations={setMrtStations}
                  station={station}
                />
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              smaller
              description="No stations found matching your search query."
              icon="tabler:search-off"
              name={false}
              title="No Stations Found"
            />
          )
        ) : (
          <EmptyStateScreen
            smaller
            description="Click the button below to add a new MRT station."
            icon="tabler:map-pin-off"
            name={false}
            title="No MRT Stations"
          />
        )}
      </div>
    </>
  )
}

export default StationSection
