import { ContextMenuGroup, ContextMenuItem } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  type RailwayMapLine,
  useRailwayMapContext
} from '../../../providers/RailwayMapProvider'

function LineFilter() {
  const { lines, filteredLines, setFilteredLines } = useRailwayMapContext()

  const { t } = useTranslation('apps.railwayMap')

  const onClick = useCallback((line: RailwayMapLine) => {
    setFilteredLines(prev =>
      prev.includes(line.id)
        ? prev.filter(l => l !== line.id)
        : [...prev, line.id]
    )
  }, [])

  return (
    <ContextMenuGroup
      icon="lucide:rail-symbol"
      label={t('railwayLinesSelectorTitle')}
    >
      {lines.map(line => (
        <ContextMenuItem
          key={line.id}
          checked={filteredLines.includes(line.id)}
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
          label={line.name}
          shouldCloseMenuOnClick={false}
          onClick={() => onClick(line)}
        />
      ))}
    </ContextMenuGroup>
  )
}

export default LineFilter
