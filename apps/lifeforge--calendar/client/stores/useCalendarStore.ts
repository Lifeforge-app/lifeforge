import dayjs from 'dayjs'
import { create } from 'zustand'

interface CalendarState {
  start: string
  end: string
  isEventLoading: boolean
  setStart: (start: string) => void
  setEnd: (end: string) => void
  setIsEventLoading: (isEventLoading: boolean) => void
}

export const useCalendarStore = create<CalendarState>()(set => {
  const start = dayjs().startOf('month').format('YYYY-MM-DD')

  const end = dayjs().endOf('month').format('YYYY-MM-DD')

  return {
    start,
    end,
    isEventLoading: false,
    setStart: (start: string) => set({ start }),
    setEnd: (end: string) => set({ end }),
    setIsEventLoading: (isEventLoading: boolean) => set({ isEventLoading })
  }
})
