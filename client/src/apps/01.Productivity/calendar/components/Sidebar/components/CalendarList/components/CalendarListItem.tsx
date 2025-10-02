import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, SidebarItem, useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import type { CalendarCalendar } from '@apps/01.Productivity/calendar/components/Calendar'
import ModifyCalendarModal from '@apps/01.Productivity/calendar/components/modals/ModifyCalendarModal'

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
        queryClient.invalidateQueries({
          queryKey: ['calendar', 'events']
        })
        onCancelSelect()
      }
    })
  )

  const handleEdit = useCallback(() => {
    open(ModifyCalendarModal, {
      initialData: item,
      type: 'update'
    })
  }, [item])

  const handleDelete = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Calendar',
      description: `Are you sure you want to delete the calendar "${item.name}"?`,
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
      label={
        <div className="flex items-center gap-2">
          {item.name}
          {item.link && (
            <Icon
              className="text-bg-400 dark:text-bg-600 size-4"
              icon="tabler:bell"
            />
          )}
        </div>
      }
      sideStripColor={item.color}
      onCancelButtonClick={onCancelSelect}
      onClick={handleClick}
    />
  )
}

export default CalendarListItem
