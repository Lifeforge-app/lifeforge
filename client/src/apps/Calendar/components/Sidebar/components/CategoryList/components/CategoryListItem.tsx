import { DeleteConfirmationModal, SidebarItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import { CalendarCollectionsSchemas } from 'shared/types/collections'

import ModifyCategoryModal from '@apps/Calendar/components/modals/ModifyCategoryModal'

import ActionMenu from './ActionMenu'

function CategoryListItem({
  item,
  isSelected,
  onSelect,
  onCancelSelect,
  modifiable = true
}: {
  item: CalendarCollectionsSchemas.ICategoryAggregated & {
    id: string
  }
  isSelected: boolean
  onSelect: (
    item: CalendarCollectionsSchemas.ICategoryAggregated & { id: string }
  ) => void
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
        nameKey: 'name' as const,
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
