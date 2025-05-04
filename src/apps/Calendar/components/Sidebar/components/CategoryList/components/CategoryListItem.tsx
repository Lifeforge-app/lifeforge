import { useCallback, useMemo } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import { useModalStore } from '../../../../../../../core/modals/useModalStore'
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
      open('calendar.modifyCategory', {
        existedData: item,
        type: 'update'
      })
    },
    [item]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      open('deleteConfirmation', {
        apiEndpoint: 'calendar/categories',
        confirmationText: 'Delete this event',
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
