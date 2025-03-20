import { ListboxOrComboboxInput, ListboxOrComboboxOption } from '@lifeforge/ui'

import { IRailwayMapStation } from '@apps/RailwayMap/interfaces/railway_map_interfaces'

import StationCodes from '../../StationCode'
import { formatStationDisplay } from '../utils/stations'

interface StationSelectorProps {
  stations: IRailwayMapStation[]
  filteredStations: IRailwayMapStation[]
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
    <ListboxOrComboboxInput
      className={className}
      displayValue={value => formatStationDisplay(stations, value)}
      icon={icon}
      name={name}
      namespace={namespace}
      setQuery={setQuery}
      setValue={setValue}
      type="combobox"
      value={value}
    >
      {filteredStations.map(station => (
        <ListboxOrComboboxOption
          key={station.id}
          iconAtEnd
          noCheckmark
          icon={<StationCodes codes={station.codes} />}
          text={station.name}
          type="combobox"
          value={station.id}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default StationSelector
