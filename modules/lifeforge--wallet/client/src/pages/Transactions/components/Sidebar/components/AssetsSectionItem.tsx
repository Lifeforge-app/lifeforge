import { useCallback } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

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
  const { asset, updateFilter } = useFilter()

  const handleCancelButtonClick = useCallback(() => {
    updateFilter('asset', '')
  }, [updateFilter])

  const handleClick = useCallback(() => {
    if (id === null) {
      updateFilter('asset', '')
    } else {
      updateFilter('asset', id)
    }
  }, [id, updateFilter])

  return (
    <SidebarItem
      active={asset === id || (asset === '' && id === null)}
      icon={icon}
      label={label}
      namespace={id ? false : undefined}
      number={amount}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}

export default AssetsSectionItem
