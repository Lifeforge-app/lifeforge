import { useWalletStore } from '@modules/wallet/client/stores/useWalletStore'
import { SidebarItem } from 'lifeforge-ui'
import { useCallback } from 'react'

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
  const { selectedLedger, setSelectedLedger } = useWalletStore()

  const active =
    selectedLedger === id || (selectedLedger === null && id === null)

  const handleCancelButtonClick = useCallback(() => {
    setSelectedLedger(null)
  }, [])

  const handleClick = useCallback(() => {
    if (label === 'All') {
      setSelectedLedger(null)

      return
    }
    setSelectedLedger(id)
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
