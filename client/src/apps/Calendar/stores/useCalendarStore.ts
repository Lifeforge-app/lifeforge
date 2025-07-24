import dayjs from 'dayjs'
import { create } from 'zustand'

interface CalendarState {
  start: string
  end: string
  setStart: (start: string) => void
  setEnd: (end: string) => void
}

export const useCalendarStore = create<CalendarState>()(set => {
  const start = dayjs().startOf('month').format('YYYY-MM-DD')

  const end = dayjs().endOf('month').format('YYYY-MM-DD')

  return {
    start,
    end,
    setStart: (start: string) => set({ start }),
    setEnd: (end: string) => set({ end })
  }
})
