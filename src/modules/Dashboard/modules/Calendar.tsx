import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import {
  type ICalendarEvent,
  type ICalendarCategory
} from '@interfaces/calendar_interfaces'
import MiniCalendarContent from '../../Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarContent'
import MiniCalendarHeader from '../../Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarHeader'

export default function Calendar(): React.ReactElement {
  const { t } = useTranslation()

  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  const [events] = useFetch<ICalendarEvent[]>('calendar/event/list')
  const [categories] = useFetch<ICalendarCategory[]>('calendar/category/list')

  return (
    <section className="col-span-2 row-span-1 flex w-full flex-col gap-4 rounded-lg bg-bg-50 p-8 pt-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
      <h1 className="my-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:calendar" className="text-2xl" />
        <span className="ml-2">{t('dashboard.modules.calendar.title')}</span>
      </h1>
      <APIComponentWithFallback data={events}>
        {typeof events !== 'string' && typeof categories !== 'string' && (
          <div className="size-full">
            <div className="px-2">
              <MiniCalendarHeader
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                currentYear={currentYear}
                setCurrentYear={setCurrentYear}
              />
            </div>
            <MiniCalendarContent
              currentMonth={currentMonth}
              currentYear={currentYear}
              events={events}
              categories={categories}
            />
          </div>
        )}
      </APIComponentWithFallback>
    </section>
  )
}
