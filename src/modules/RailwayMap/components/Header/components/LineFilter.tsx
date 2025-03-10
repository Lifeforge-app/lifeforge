import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import HamburgerSelectorWrapper from '@components/buttons/HamburgerMenu/components/HamburgerSelectorWrapper'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { IRailwayMapLine } from '@interfaces/railway_map_interfaces'

interface LineFilterProps {
  lines: IRailwayMapLine[]
  filteredLines: string[]
  setFilteredLines: React.Dispatch<React.SetStateAction<string[]>>
}

function LineFilter({
  lines,
  filteredLines,
  setFilteredLines
}: LineFilterProps): React.ReactElement {
  return (
    <HamburgerMenu largerIcon largerPadding customIcon="tabler:filter">
      <HamburgerSelectorWrapper icon="lucide:rail-symbol" title="Railway Lines">
        {lines.map(line => (
          <MenuItem
            key={line.id}
            preventDefault
            icon={
              <span
                className="text-bg-100 rounded-full px-2.5 py-0.5 font-['LTAIdentityMedium'] text-sm"
                style={{
                  backgroundColor: line.color
                }}
              >
                {line.code}
              </span>
            }
            isToggled={filteredLines.includes(line.id)}
            namespace={false}
            text={line.name}
            onClick={() => {
              setFilteredLines(prev =>
                prev.includes(line.id)
                  ? prev.filter(l => l !== line.id)
                  : [...prev, line.id]
              )
            }}
          />
        ))}
      </HamburgerSelectorWrapper>
    </HamburgerMenu>
  )
}

export default LineFilter
