import moment from 'moment'
import { Link } from 'react-router'

import {
  APIFallbackComponent,
  Button,
  DashboardItem,
  EmptyStateScreen,
  Scrollbar
} from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../Calendar/interfaces/calendar_interfaces'

export default function TodaysEvent() {
  const [rawEvents] = useFetch<ICalendarEvent[]>('calendar/events/today')
  const [categories] = useFetch<ICalendarCategory[]>('calendar/categories')

  return (
    <DashboardItem
      componentBesideTitle={
        <Button
          as={Link}
          className="p-2!"
          icon="tabler:chevron-right"
          to="/calendar"
          variant="plain"
        />
      }
      icon="tabler:calendar"
      title="Todays Event"
    >
      <Scrollbar>
        <APIFallbackComponent
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
              <ul className="flex flex-1 flex-col gap-4">
                <APIFallbackComponent data={categories}>
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
                          <li
                            key={event.id}
                            className="flex-between bg-bg-100/50 shadow-custom dark:bg-bg-800 flex max-h-24 flex-1 gap-4 rounded-lg p-4"
                          >
                            <div
                              className="h-full w-1.5 rounded-full"
                              style={{
                                backgroundColor: categories.find(
                                  category => category.id === event.category
                                )?.color
                              }}
                            />
                            <div className="flex w-full flex-col gap-1">
                              <div className="font-semibold">{event.title}</div>
                              <div className="text-bg-500 text-sm">
                                {
                                  categories.find(
                                    category => category.id === event.category
                                  )?.name
                                }
                              </div>
                            </div>
                          </li>
                        ))}
                    </>
                  )}
                </APIFallbackComponent>
              </ul>
            ) : (
              <div className="flex-center flex-1">
                <EmptyStateScreen
                  smaller
                  icon="tabler:calendar-off"
                  name="event"
                  namespace="modules.dashboard"
                  tKey="widgets.todaysEvent"
                />
              </div>
            )
          }
        </APIFallbackComponent>
      </Scrollbar>
    </DashboardItem>
  )
}
