import { SidebarItem } from 'lifeforge-ui'
import { useCallback } from 'react'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

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
  const { selectedLedger, setSelectedLedger, setSidebarOpen } = useWalletStore()

  const active =
    selectedLedger === id || (selectedLedger === null && id === null)

  const handleCancelButtonClick = useCallback(() => {
    setSelectedLedger(null)
    setSidebarOpen(false)
  }, [])

  const handleClick = useCallback(() => {
    if (label === 'All') {
      setSelectedLedger(null)

      return
    }
    setSelectedLedger(id)
    setSidebarOpen(false)
  }, [])

  return (
    <SidebarItem
      active={active}
      icon={icon}
      label={label}
      number={amount}
      sideStripColor={color}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}
