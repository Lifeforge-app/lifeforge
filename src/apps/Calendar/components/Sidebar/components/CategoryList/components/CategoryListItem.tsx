import { useCallback, useMemo } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import { type ICalendarCategory } from '../../../../../interfaces/calendar_interfaces'
import ActionMenu from './ActionMenu'

function CategoryListItem({
  item,
  isSelected,
  onSelect,
  onCancelSelect,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteConfirmationModalOpen
}: {
  item: ICalendarCategory
  isSelected: boolean
  onSelect: (item: ICalendarCategory) => void
  onCancelSelect: () => void
  setSelectedData?: React.Dispatch<
    React.SetStateAction<ICalendarCategory | null>
  >
  setModifyModalOpenType?: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteConfirmationModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedData?.(item)
      setModifyModalOpenType?.('update')
    },
    [item]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedData?.(item)
      setDeleteConfirmationModalOpen?.(true)
    },
    [item]
  )

  const hamburgerMenuItems = useMemo(
    () =>
      setSelectedData &&
      setModifyModalOpenType &&
      setDeleteConfirmationModalOpen && (
        <ActionMenu onDelete={handleDelete} onEdit={handleEdit} />
      ),
    []
  )

  const handleClick = useCallback(() => {
    onSelect(item)
  }, [])

  return (
    <SidebarItem
      active={isSelected}
      hamburgerMenuItems={hamburgerMenuItems}
      icon={item.icon}
      name={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={onCancelSelect}
      onClick={handleClick}
    />
  )
}

export default CategoryListItem
