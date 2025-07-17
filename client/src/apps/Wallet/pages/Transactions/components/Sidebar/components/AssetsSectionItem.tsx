import { SidebarItem } from 'lifeforge-ui'
import { useCallback } from 'react'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function AssetsSectionItem({
  icon,
  name,
  id,
  amount
}: {
  icon: string
  name: string
  id: string | null
  amount: number | undefined
}) {
  const { selectedAsset, setSelectedAsset, setSidebarOpen } = useWalletStore()

  const handleCancelButtonClick = useCallback(() => {
    setSelectedAsset(null)
    setSidebarOpen(false)
  }, [])

  const handleClick = useCallback(() => {
    if (id === null) {
      setSelectedAsset(null)
      setSidebarOpen(false)
    } else {
      setSelectedAsset(id)
      setSidebarOpen(false)
    }
  }, [])

  return (
    <SidebarItem
      active={selectedAsset === id || (selectedAsset === null && id === null)}
      icon={icon}
      name={name}
      number={amount}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}

export default AssetsSectionItem
