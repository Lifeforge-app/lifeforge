import type { CalendarCalendar } from '@/components/Calendar'
import ModifyCalendarModal from '@/components/modals/ModifyCalendarModal'
import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import {
  EmptyStateScreen,
  SidebarTitle,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'

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
            actionButton={{
              icon: 'tabler:plus',
              onClick: handleCreate
            }}
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
            <EmptyStateScreen
              smaller
              icon="tabler:calendar"
              message={{
                id: 'calendars',
                namespace: 'apps.calendar'
              }}
            />
          )}
        </section>
      )}
    </WithQuery>
  )
}

export default CalendarList
