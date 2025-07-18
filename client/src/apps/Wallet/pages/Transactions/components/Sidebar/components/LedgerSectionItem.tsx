import { SidebarItem } from 'lifeforge-ui'
import { useCallback } from 'react'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

export default function LedgerSectionItem({
  icon,
  name,
  color,
  id,
  amount
}: {
  icon: string
  name: string
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
    if (name === 'All') {
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
      name={name}
      number={amount}
      sideStripColor={color}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}
