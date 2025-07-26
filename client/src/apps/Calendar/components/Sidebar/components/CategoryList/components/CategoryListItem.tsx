import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, SidebarItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import type { CalendarCategory } from '@apps/Calendar/components/Calendar'
import ModifyCategoryModal from '@apps/Calendar/components/modals/ModifyCategoryModal'

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

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      open(ModifyCategoryModal, {
        initialData: item,
        type: 'update'
      })
    },
    [item]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      open(ConfirmationModal, {
        title: 'Delete Category',
        description: `Are you sure you want to delete the category "${item.name}"?`,
        onConfirm: async () => {
          await deleteMutation.mutateAsync({})
        },
        confirmationPrompt: item.name
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
