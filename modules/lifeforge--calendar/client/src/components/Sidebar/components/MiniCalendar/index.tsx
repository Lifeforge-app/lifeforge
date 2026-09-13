import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'

import { Flex, WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'

function MiniCalendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs().month())
  const [currentYear, setCurrentYear] = useState(dayjs().year())

  const startDate = dayjs()
    .year(currentYear)
    .month(currentMonth)
    .startOf('month')
    .format('YYYY-MM-DD')

  const endDate = dayjs()
    .year(currentYear)
    .month(currentMonth)
    .endOf('month')
    .format('YYYY-MM-DD')

  const eventsQuery = useQuery(
    forgeAPI.events.getByDateRange
      .input({
        start: startDate,
        end: endDate
      })
      .queryOptions()
  )

  return (
    <Flex as="section" direction="column" gap="md" px="lg" py="md" width="100%">
      <MiniCalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />
      <WithQuery query={eventsQuery}>
        {events => (
          <MiniCalendarContent
            currentMonth={currentMonth}
            currentYear={currentYear}
            events={events}
          />
        )}
      </WithQuery>
    </Flex>
  )
}

export default MiniCalendar
