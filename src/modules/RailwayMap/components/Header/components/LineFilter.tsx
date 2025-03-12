import { useTranslation } from 'react-i18next'

import { HamburgerMenuSelectorWrapper, MenuItem } from '@lifeforge/ui'

import { useRailwayMapContext } from '../../../providers/RailwayMapProvider'

function LineFilter() {
  const { lines, filteredLines, setFilteredLines } = useRailwayMapContext()
  const { t } = useTranslation('modules.railwayMap')

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
          onClick={() => {
            setFilteredLines(prev =>
              prev.includes(line.id)
                ? prev.filter(l => l !== line.id)
                : [...prev, line.id]
            )
          }}
        />
      ))}
    </HamburgerMenuSelectorWrapper>
  )
}

export default LineFilter
