import { Icon } from '@iconify/react'
import { useCallback } from 'react'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import { type ICalendarCalendar } from '../../../../interfaces/calendar_interfaces'
import CalendarListItem from './components/CalendarListItem'

function CalendarList({
  selectedCalendar,
  setSidebarOpen,
  setSelectedCalendar
}: {
  selectedCalendar: string | undefined
  setSidebarOpen: (value: boolean) => void
  setSelectedCalendar: React.Dispatch<React.SetStateAction<string | undefined>>
}) {
  const calendarsQuery = useAPIQuery<ICalendarCalendar[]>(
    'calendar/calendars',
    ['calendar', 'calendars']
  )
  const open = useModalStore(state => state.open)

  const handleSelect = useCallback(
    (item: ICalendarCalendar) => {
      setSelectedCalendar(item.id)
      setSidebarOpen(false)
    },
    [setSelectedCalendar, setSidebarOpen]
  )

  const handleCancelSelect = useCallback(() => {
    setSelectedCalendar(undefined)
    setSidebarOpen(false)
  }, [setSelectedCalendar, setSidebarOpen])

  const handleCreate = useCallback(() => {
    open('calendar.modifyCalendar', {
      existedData: null,
      type: 'create'
    })
  }, [])

  return (
    <QueryWrapper query={calendarsQuery}>
      {calendars => (
        <section className="flex w-full min-w-0 flex-1 flex-col">
          <div className="mt-4">
            <SidebarTitle
              actionButtonIcon="tabler:plus"
              actionButtonOnClick={handleCreate}
              name="Calendars"
              namespace="apps.calendar"
            />
          </div>
          {calendars.length > 0 ? (
            <ul className="-mt-2 flex h-full min-w-0 flex-col pb-4">
              {calendars.map(item => (
                <CalendarListItem
                  key={item.id}
                  isSelected={selectedCalendar === item.id}
                  item={item}
                  onCancelSelect={handleCancelSelect}
                  onSelect={handleSelect}
                />
              ))}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-2">
              <Icon className="size-12" icon="tabler:article-off" />
              <p className="text-lg font-medium">Oops, no calendars found.</p>
              <p className="text-bg-500 text-center text-sm">
                You can create calendars by clicking the plus button above.
              </p>
            </div>
          )}
        </section>
      )}
    </QueryWrapper>
  )
}

export default CalendarList
