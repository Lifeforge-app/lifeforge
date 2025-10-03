import { useWalletStore } from '@modules/wallet/client/stores/useWalletStore'
import { SidebarItem } from 'lifeforge-ui'
import { useCallback } from 'react'

function AssetsSectionItem({
  icon,
  label,
  id,
  amount
}: {
  icon: string
  label: string
  id: string | null
  amount: number | undefined
}) {
  const { selectedAsset, setSelectedAsset } = useWalletStore()

  const handleCancelButtonClick = useCallback(() => {
    setSelectedAsset(null)
  }, [])

  const handleClick = useCallback(() => {
    if (id === null) {
      setSelectedAsset(null)
    } else {
      setSelectedAsset(id)
    }
  }, [])

  return (
    <SidebarItem
      active={selectedAsset === id || (selectedAsset === null && id === null)}
      icon={icon}
      label={label}
      number={amount}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}

export default AssetsSectionItem
