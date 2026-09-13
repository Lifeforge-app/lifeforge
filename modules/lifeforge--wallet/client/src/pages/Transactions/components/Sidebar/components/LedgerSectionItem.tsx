import { useCallback } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

export default function LedgerSectionItem({
  icon,
  label,
  color,
  id,
  amount
}: {
  icon: string
  label: string
  color: string
  id: string | null
  amount: number | undefined
}) {
  const { ledger, updateFilter } = useFilter()

  const active = ledger === id || (ledger === '' && id === null)

  const handleCancelButtonClick = useCallback(() => {
    updateFilter('ledger', '')
  }, [updateFilter])

  const handleClick = useCallback(() => {
    if (label === 'All') {
      updateFilter('ledger', '')

      return
    }
    updateFilter('ledger', id!)
  }, [label, id, updateFilter])

  return (
    <SidebarItem
      active={active}
      icon={icon}
      label={label}
      namespace={id ? false : undefined}
      number={amount}
      sideStripColor={color}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}
