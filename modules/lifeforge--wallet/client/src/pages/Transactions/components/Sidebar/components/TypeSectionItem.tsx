import _ from 'lodash'
import { useCallback, useMemo } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  SidebarItem,
  TAILWIND_PALETTE,
  usePersonalization
} from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

function TypeSectionItem({
  icon,
  label,
  amount
}: {
  icon: string
  label: string
  amount: number | undefined
}) {
  const { t } = useModuleTranslation()
  const { bgTempPalette } = usePersonalization()
  const { type, updateFilter } = useFilter()

  const sidebarStripColor = useMemo(
    () =>
      ({
        'All Types': bgTempPalette[100],
        Income: TAILWIND_PALETTE.green[500],
        Expenses: TAILWIND_PALETTE.red[500],
        Transfer: TAILWIND_PALETTE.blue[500]
      })[label],
    [bgTempPalette, label]
  )

  const handleCancelButtonClick = useCallback(() => {
    updateFilter('type', '')
  }, [updateFilter])

  const handleClick = useCallback(() => {
    if (label === 'All Types') {
      updateFilter('type', '')
    } else {
      updateFilter('category', '')
      updateFilter(
        'type',
        label.toLowerCase() as 'income' | 'expenses' | 'transfer'
      )
    }
  }, [label, updateFilter])

  return (
    <SidebarItem
      active={
        type === label.toLowerCase() || (type === '' && label === 'All Types')
      }
      icon={icon}
      label={t(
        label.includes('All')
          ? `sidebar.${_.camelCase(label)}`
          : `transactionTypes.${_.camelCase(label)}`
      )}
      namespace={false}
      number={amount}
      sideStripColor={sidebarStripColor}
      onCancelButtonClick={
        label !== 'All Types' ? handleCancelButtonClick : undefined
      }
      onClick={handleClick}
    />
  )
}

export default TypeSectionItem
