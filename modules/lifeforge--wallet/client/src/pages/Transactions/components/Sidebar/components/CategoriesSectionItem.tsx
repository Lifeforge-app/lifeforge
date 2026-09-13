import { useCallback, useMemo } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

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
  const { category, updateFilter, setFilters } = useFilter()

  const memoizedIcon = useMemo(
    () => <CategoriesSectionItemIcon icon={icon} id={id} type={type} />,
    [icon, type, id]
  )

  const handleCancelButtonClick = useCallback(() => {
    updateFilter('category', '')
  }, [updateFilter])

  const handleClick = useCallback(() => {
    if (id === null) {
      updateFilter('category', '')
    } else {
      setFilters({ category: id, type: type! })
    }
  }, [id, type, updateFilter])

  return (
    <SidebarItem
      key={id}
      active={category === id || (category === '' && id === null)}
      icon={memoizedIcon}
      label={label}
      namespace={id ? false : undefined}
      number={amount}
      sideStripColor={color}
      onCancelButtonClick={id !== null ? handleCancelButtonClick : undefined}
      onClick={handleClick}
    />
  )
}

export default CategoriesSectionItem
