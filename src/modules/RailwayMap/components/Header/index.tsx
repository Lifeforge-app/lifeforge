import React from 'react'
import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import { useRailwayMapContext } from '@providers/RailwayMapProvider'
import LineFilter from './components/LineFilter'
import ViewTypeSwitcher from './components/ViewTypeSwitcher'

function Header(): React.ReactElement {
  const {
    viewType,
    setViewType,
    searchQuery,
    setSearchQuery,
    lines,
    filteredLines,
    setFilteredLines,
    routePlannerOpen,
    setRoutePlannerOpen
  } = useRailwayMapContext()

  return (
    <div className="mt-6 flex items-center gap-2">
      <ViewTypeSwitcher setViewType={setViewType} viewType={viewType} />
      <SearchInput
        hasTopMargin={false}
        namespace="modules.railwayMap"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="station"
      />
      <LineFilter
        filteredLines={filteredLines}
        lines={lines}
        setFilteredLines={setFilteredLines}
      />
      <Button
        icon="tabler:route"
        variant={routePlannerOpen ? 'primary' : 'no-bg'}
        onClick={() => {
          setRoutePlannerOpen(!routePlannerOpen)
        }}
      />
    </div>
  )
}

export default Header
