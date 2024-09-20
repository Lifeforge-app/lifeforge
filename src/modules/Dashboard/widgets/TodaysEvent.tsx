import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import {
  type ICalendarEvent,
  type ICalendarCategory
} from '@interfaces/calendar_interfaces'

export default function TodaysEvent(): React.ReactElement {
  const [rawEvents] = useFetch<ICalendarEvent[]>('calendar/event')
  const [categories] = useFetch<ICalendarCategory[]>('calendar/category')
  const { t } = useTranslation()

  return (
    <div className="flex size-full flex-col gap-4 rounded-lg bg-bg-50 p-6 px-2 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 px-4 text-xl font-semibold">
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
        {rawEvents =>
          rawEvents.filter(event =>
            moment().isBetween(
              moment(event.start),
              moment(event.end).subtract(1, 'second'),
              'day',
              '[]'
            )
          ).length > 0 ? (
            <APIComponentWithFallback data={categories}>
              {categories => (
                <>
                  {rawEvents
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
                        className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
                      >
                        <li className="flex-between flex max-h-24 flex-1 gap-4 rounded-lg bg-bg-100/50 p-4 shadow-custom dark:bg-bg-800">
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
                </>
              )}
            </APIComponentWithFallback>
          ) : (
            <EmptyStateScreen
              title="No events today"
              description="You have no events scheduled for today."
              icon="tabler:calendar-off"
            />
          )
        }
      </APIComponentWithFallback>
    </div>
  )
}
