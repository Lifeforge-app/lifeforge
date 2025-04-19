import { useCallback } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function AssetsSectionItem({
  icon,
  name,
  id
}: {
  icon: string
  name: string
  id: string | null
}) {
  const { selectedAsset, setSelectedAsset, setSidebarOpen } = useWalletStore()

  const handleCancelButtonClick = useCallback(() => {
    setSelectedAsset(null)
    setSidebarOpen(false)
  }, [setSelectedAsset, setSidebarOpen])

  const handleClick = useCallback(() => {
    if (id === null) {
      setSelectedAsset(null)
      setSidebarOpen(false)
    } else {
      setSelectedAsset(id)
      setSidebarOpen(false)
    }
  }, [id, setSelectedAsset, setSidebarOpen])

  return (
    <SidebarItem
      active={selectedAsset === id || (selectedAsset === null && id === null)}
      icon={icon}
      name={name}
      number={0}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}

export default AssetsSectionItem
