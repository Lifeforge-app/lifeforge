import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, SidebarItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import type { CalendarCategory } from '@apps/01.Productivity/Calendar/components/Calendar'
import ModifyCategoryModal from '@apps/01.Productivity/Calendar/components/modals/ModifyCategoryModal'

import ActionMenu from './ActionMenu'

function CategoryListItem({
  item,
  isSelected,
  onSelect,
  onCancelSelect,
  modifiable = true
}: {
  item: CalendarCategory
  isSelected: boolean
  onSelect: (item: CalendarCategory) => void
  onCancelSelect: () => void
  modifiable?: boolean
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const deleteMutation = useMutation(
    forgeAPI.calendar.categories.remove.input({ id: item.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.calendar.categories.list.key
        })
        onCancelSelect()
      }
    })
  )

  const handleEdit = useCallback(() => {
    open(ModifyCategoryModal, {
      initialData: item,
      type: 'update'
    })
  }, [item])

  const handleDelete = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Category',
      description: `Are you sure you want to delete the category "${item.name}"?`,
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      },
      confirmationPrompt: item.name
    })
  }, [item])

  const contextMenuItems = useMemo(
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
      contextMenuItems={contextMenuItems}
      icon={item.icon}
      label={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={onCancelSelect}
      onClick={handleClick}
    />
  )
}

export default CategoryListItem
