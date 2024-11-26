import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import MiniCalendarContent from '../../Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarContent'
import MiniCalendarHeader from '../../Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarHeader'

export default function MiniCalendar(): React.ReactElement {
  const { t } = useTranslation()
  const { componentBg } = useThemeColors()

  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  const [events] = useFetch<ICalendarEvent[]>('calendar/event')
  const [categories] = useFetch<ICalendarCategory[]>('calendar/category')

  return (
    <div
      className={`flex size-full flex-col gap-4 rounded-lg p-8 pt-6 shadow-custom ${componentBg}`}
    >
      <h1 className="my-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:calendar" className="text-2xl" />
        <span className="ml-2">
          {t('dashboard.widgets.miniCalendar.title')}
        </span>
      </h1>
      <APIComponentWithFallback data={events}>
        {events => (
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
    </div>
  )
}
