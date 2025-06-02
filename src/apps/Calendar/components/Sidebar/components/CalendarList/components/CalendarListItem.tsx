import { useCallback, useMemo } from 'react'

import { SidebarItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { type ICalendarCalendar } from '../../../../../interfaces/calendar_interfaces'
import ActionMenu from './ActionMenu'

function CalendarListItem({
  item,
  isSelected,
  onSelect,
  onCancelSelect,
  modifiable = true
}: {
  item: ICalendarCalendar
  isSelected: boolean
  onSelect: (item: ICalendarCalendar) => void
  onCancelSelect: () => void
  modifiable?: boolean
}) {
  const open = useModalStore(state => state.open)

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      open('calendar.modifyCalendar', {
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
        apiEndpoint: 'calendar/calendars',
        confirmationText: 'Delete this calendar',
        data: item,
        itemName: 'calendar',
        nameKey: 'name',
        queryKey: ['calendar', 'calendars']
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

export default CalendarListItem
