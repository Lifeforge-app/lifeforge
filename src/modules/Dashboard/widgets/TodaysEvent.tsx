import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import {
  type ICalendarEvent,
  type ICalendarCategory
} from '@interfaces/calendar_interfaces'

export default function TodaysEvent(): React.ReactElement {
  const [rawEvents] = useFetch<ICalendarEvent[]>('calendar/event/list')
  const [categories] = useFetch<ICalendarCategory[]>('calendar/category/list')
  const { t } = useTranslation()

  return (
    <div className="flex size-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:calendar" className="text-2xl" />
        <span className="ml-2">{t('dashboard.widgets.todaysEvent.title')}</span>
      </h1>
      <APIComponentWithFallback
        data={
          [rawEvents, categories].some(d => d === 'loading')
            ? 'loading'
            : rawEvents
        }
      >
        {typeof rawEvents !== 'string' &&
          typeof categories !== 'string' &&
          rawEvents
            .filter(event =>
              moment().isBetween(
                moment(event.start),
                moment(event.end).subtract(1, 'second'),
                'day',
                '[]'
              )
            )
            .map(event => (
              <ul
                key={event.id}
                className="flex h-full flex-col gap-4 overflow-y-auto"
              >
                <li className="flex max-h-24 flex-1 items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-bg-800">
                  <div
                    className="h-full w-1.5 rounded-full"
                    style={{
                      backgroundColor: categories.find(
                        category => category.id === event.category
                      )?.color
                    }}
                  />
                  <div className="flex w-full flex-col gap-1">
                    <div className="font-semibold ">{event.title}</div>
                    <div className="text-sm text-bg-500">
                      {
                        categories.find(
                          category => category.id === event.category
                        )?.name
                      }
                    </div>
                  </div>
                </li>
              </ul>
            ))}
      </APIComponentWithFallback>
    </div>
  )
}
