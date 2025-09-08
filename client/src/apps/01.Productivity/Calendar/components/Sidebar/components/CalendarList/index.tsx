import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { SidebarTitle, WithQuery, useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import type { CalendarCalendar } from '@apps/01.Productivity/Calendar/components/Calendar'
import ModifyCalendarModal from '@apps/01.Productivity/Calendar/components/modals/ModifyCalendarModal'

import CalendarListItem from './components/CalendarListItem'

function CalendarList({
  selectedCalendar,
  setSelectedCalendar
}: {
  selectedCalendar: string | null
  setSelectedCalendar: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const calendarsQuery = useQuery(
    forgeAPI.calendar.calendars.list.queryOptions()
  )

  const open = useModalStore(state => state.open)

  const handleSelect = useCallback(
    (item: CalendarCalendar) => {
      setSelectedCalendar(item.id)
    },
    [setSelectedCalendar]
  )

  const handleCancelSelect = useCallback(() => {
    setSelectedCalendar(null)
  }, [setSelectedCalendar])

  const handleCreate = useCallback(() => {
    open(ModifyCalendarModal, {
      type: 'create'
    })
  }, [])

  return (
    <WithQuery query={calendarsQuery}>
      {calendars => (
        <section className="flex w-full min-w-0 flex-1 flex-col">
          <SidebarTitle
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={handleCreate}
            label="Calendars"
            namespace="apps.calendar"
          />
          {calendars.length > 0 ? (
            <ul className="-mt-2 flex h-full min-w-0 flex-col">
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
            <div className="flex h-full flex-col items-center justify-center gap-3 px-2">
              <Icon className="size-12" icon="tabler:article-off" />
              <p className="text-lg font-medium">Oops, no calendars found.</p>
              <p className="text-bg-500 text-center text-sm">
                You can create calendars by clicking the plus button above.
              </p>
            </div>
          )}
        </section>
      )}
    </WithQuery>
  )
}

export default CalendarList
