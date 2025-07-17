import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { HamburgerMenuSelectorWrapper, MenuItem } from '@lifeforge/ui'

import { IRailwayMapLine } from '@apps/RailwayMap/interfaces/railway_map_interfaces'

import { useRailwayMapContext } from '../../../providers/RailwayMapProvider'

function LineFilter() {
  const { lines, filteredLines, setFilteredLines } = useRailwayMapContext()
  const { t } = useTranslation('apps.railwayMap')

  const onClick = useCallback((line: IRailwayMapLine) => {
    setFilteredLines(prev =>
      prev.includes(line.id)
        ? prev.filter(l => l !== line.id)
        : [...prev, line.id]
    )
  }, [])

  return (
    <HamburgerMenuSelectorWrapper
      icon="lucide:rail-symbol"
      title={t('railwayLinesSelectorTitle')}
    >
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
          onClick={() => onClick(line)}
        />
      ))}
    </HamburgerMenuSelectorWrapper>
  )
}

export default LineFilter
