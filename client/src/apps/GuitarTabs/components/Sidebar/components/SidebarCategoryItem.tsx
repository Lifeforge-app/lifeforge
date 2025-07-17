import { useCallback } from 'react'

import { SidebarItem } from '@lifeforge/ui'

function SidebarCategoryItem({
  isActive,
  category,
  icon,
  name,
  count,
  onCancel,
  onSelect
}: {
  isActive: boolean
  category: string
  icon: string
  name: string
  count: number
  onCancel: () => void
  onSelect: (category: string) => void
}) {
  const handleSelect = useCallback(() => {
    onSelect(category)
  }, [])

  return (
    <SidebarItem
      key={category}
      active={isActive}
      icon={icon}
      name={name}
      namespace="apps.guitarTabs"
      number={count}
      onCancelButtonClick={onCancel}
      onClick={handleSelect}
    />
  )
}

export default SidebarCategoryItem
