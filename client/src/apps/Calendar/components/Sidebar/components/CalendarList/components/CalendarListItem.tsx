import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, SidebarItem, useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import type { CalendarCalendar } from '@apps/Calendar/components/Calendar'
import ModifyCalendarModal from '@apps/Calendar/components/modals/ModifyCalendarModal'

import ActionMenu from './ActionMenu'

function CalendarListItem({
  item,
  isSelected,
  onSelect,
  onCancelSelect,
  modifiable = true
}: {
  item: CalendarCalendar
  isSelected: boolean
  onSelect: (item: CalendarCalendar) => void
  onCancelSelect: () => void
  modifiable?: boolean
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const deleteMutation = useMutation(
    forgeAPI.calendar.calendars.remove.input({ id: item.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.calendar.calendars.list.key
        })
        onCancelSelect()
      }
    })
  )

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      open(ModifyCalendarModal, {
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
        title: 'Delete Calendar',
        description: `Are you sure you want to delete the calendar "${item.name}"?`,
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
      name={item.name}
      sideStripColor={item.color}
      onCancelButtonClick={onCancelSelect}
      onClick={handleClick}
    />
  )
}

export default CalendarListItem
