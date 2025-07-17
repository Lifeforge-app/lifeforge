import { SidebarItem } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import { IWalletTransaction } from '@apps/Wallet/interfaces/wallet_interfaces'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import CategoriesSectionItemIcon from './CategoriesSectionItemIcon'

function CategoriesSectionItem({
  icon,
  name,
  color,
  id,
  type,
  amount
}: {
  icon: string
  name: string
  color: string
  id: string | null
  type: 'income' | 'expenses' | null
  amount: number | undefined
}) {
  const {
    selectedCategory,
    setSelectedCategory,
    setSelectedType,
    setSidebarOpen
  } = useWalletStore()

  const memoizedIcon = useMemo(
    () => <CategoriesSectionItemIcon icon={icon} id={id} type={type} />,
    [icon, type, id]
  )

  const handleCancelButtonClick = useCallback(() => {
    setSelectedCategory(null)
    setSidebarOpen(false)
  }, [])

  const handleClick = useCallback(() => {
    if (id === null) {
      setSelectedCategory(null)
      setSidebarOpen(false)
    } else {
      setSelectedCategory(id)
      setSelectedType(type as IWalletTransaction['type'])
      setSidebarOpen(false)
    }
  }, [])

  return (
    <SidebarItem
      key={id}
      active={selectedCategory === id}
      icon={memoizedIcon}
      name={name}
      number={amount}
      sideStripColor={color}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}

export default CategoriesSectionItem
