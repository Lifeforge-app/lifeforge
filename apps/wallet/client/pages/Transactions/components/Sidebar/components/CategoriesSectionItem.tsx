import { useWalletStore } from '@modules/wallet/client/stores/useWalletStore'
import { SidebarItem } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import CategoriesSectionItemIcon from './CategoriesSectionItemIcon'

function CategoriesSectionItem({
  icon,
  label,
  color,
  id,
  type,
  amount
}: {
  icon: string
  label: string
  color: string
  id: string | null
  type: 'income' | 'expenses' | null
  amount: number | undefined
}) {
  const { selectedCategory, setSelectedCategory, setSelectedType } =
    useWalletStore()

  const memoizedIcon = useMemo(
    () => <CategoriesSectionItemIcon icon={icon} id={id} type={type} />,
    [icon, type, id]
  )

  const handleCancelButtonClick = useCallback(() => {
    setSelectedCategory(null)
  }, [])

  const handleClick = useCallback(() => {
    if (id === null) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(id)
      setSelectedType(type)
    }
  }, [])

  return (
    <SidebarItem
      key={id}
      active={selectedCategory === id}
      icon={memoizedIcon}
      label={label}
      number={amount}
      sideStripColor={color}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}

export default CategoriesSectionItem
