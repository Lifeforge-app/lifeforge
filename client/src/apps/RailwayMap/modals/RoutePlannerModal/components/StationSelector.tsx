import { ComboboxInput, ComboboxOption } from 'lifeforge-ui'

import type { RailwayMapStation } from '@apps/RailwayMap/providers/RailwayMapProvider'

import StationCodes from '../../../components/StationCode'
import { formatStationDisplay } from '../utils/stations'

interface StationSelectorProps {
  stations: RailwayMapStation[]
  filteredStations: RailwayMapStation[]
  value: string
  setValue: (value: string) => void
  setQuery: (query: string) => void
  className?: string
  icon: string
  name: string
  namespace: string
}

function StationSelector({
  stations,
  filteredStations,
  value,
  setValue,
  setQuery,
  className,
  icon,
  name,
  namespace
}: StationSelectorProps) {
  return (
    <ComboboxInput
      className={className}
      displayValue={value => formatStationDisplay(stations, value)}
      icon={icon}
      label={name}
      namespace={namespace}
      setQuery={setQuery}
      setValue={setValue}
      value={value}
    >
      {filteredStations.map(station => (
        <ComboboxOption
          key={station.id}
          iconAtEnd
          noCheckmark
          icon={<StationCodes codes={station.codes} />}
          label={station.name}
          value={station.id}
        />
      ))}
    </ComboboxInput>
  )
}

export default StationSelector
