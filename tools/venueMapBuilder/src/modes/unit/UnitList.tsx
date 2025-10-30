import type { Unit } from '../../types'
import UnitListItem from './UnitListItem'

interface UnitListProps {
  units: Unit[]
}

export function UnitList({ units }: UnitListProps) {
  return (
    <div className="space-y-2">
      {units.map(unit => (
        <UnitListItem key={unit.id} unit={unit} />
      ))}
    </div>
  )
}
