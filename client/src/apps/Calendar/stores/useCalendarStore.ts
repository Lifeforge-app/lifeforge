import dayjs from 'dayjs'
import { create } from 'zustand'

interface CalendarState {
  eventQueryKey: unknown[]
  setEventQueryKey: (eventQueryKey: unknown[]) => void
}

export const useCalendarStore = create<CalendarState>()(set => {
  const start = dayjs().startOf('month').format('YYYY-MM-DD')

  const end = dayjs().endOf('month').format('YYYY-MM-DD')

  return {
    eventQueryKey: ['calendar', 'events', start, end],
    setEventQueryKey: (eventQueryKey: unknown[]) => set({ eventQueryKey })
  }
})
