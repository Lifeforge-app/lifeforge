import { useCallback, useMemo } from 'react'

import { DeleteConfirmationModal, SidebarItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import ModifyCategoryModal from '@apps/Calendar/components/modals/ModifyCategoryModal'

import { type ICalendarCategory } from '../../../../../interfaces/calendar_interfaces'
import ActionMenu from './ActionMenu'

function CategoryListItem({
  item,
  isSelected,
  onSelect,
  onCancelSelect,
  modifiable = true
}: {
  item: ICalendarCategory
  isSelected: boolean
  onSelect: (item: ICalendarCategory) => void
  onCancelSelect: () => void
  modifiable?: boolean
}) {
  const open = useModalStore(state => state.open)

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      open(ModifyCategoryModal, {
        existedData: item,
        type: 'update'
      })
    },
    [item]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      open(DeleteConfirmationModal, {
        apiEndpoint: 'calendar/categories',
        confirmationText: 'Delete this category',
        data: item,
        itemName: 'category',
        nameKey: 'name',
        queryKey: ['calendar', 'categories']
      })
    },
    [item]
  )

  const hamburgerMenuItems = useMemo(
    () =>
      modifiable ? (
        <ActionMenu onDelete={handleDelete} onEdit={handleEdit} />
      ) : undefined,
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
