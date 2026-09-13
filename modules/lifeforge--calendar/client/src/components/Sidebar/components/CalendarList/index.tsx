import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import {
  EmptyStateScreen,
  SidebarTitle,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import type { CalendarCalendar } from '@/components/Calendar'
import ModifyCalendarModal from '@/components/modals/ModifyCalendarModal'
import { forgeAPI } from '@/manifest'

import CalendarListItem from './components/CalendarListItem'

function CalendarList({
  selectedCalendar,
  setSelectedCalendar
}: {
  selectedCalendar: string | null
  setSelectedCalendar: (value: string | null) => void
}) {
  const calendarsQuery = useQuery(forgeAPI.calendars.list.queryOptions())
  const { open } = useModalStore()

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
        <Stack as="section">
          <SidebarTitle
            actionButton={{
              icon: 'tabler:plus',
              onClick: handleCreate
            }}
            label="Calendars"
          />
          {calendars.length > 0 ? (
            <>
              {calendars.map(item => (
                <CalendarListItem
                  key={item.id}
                  isSelected={selectedCalendar === item.id}
                  item={item}
                  onCancelSelect={handleCancelSelect}
                  onSelect={handleSelect}
                />
              ))}
            </>
          ) : (
            <EmptyStateScreen
              smaller
              icon="tabler:calendar"
              message={{
                id: 'calendars'
              }}
            />
          )}
        </Stack>
      )}
    </WithQuery>
  )
}

export default CalendarList
