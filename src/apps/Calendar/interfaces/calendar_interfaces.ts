import type { RecordModel } from 'pocketbase'

interface ICalendarEvent extends RecordModel {
  title: string
  start: string | Date
  end: string | Date
  category: string
  location: string
  reference_link: string
  cannot_delete: boolean
  description: string
  is_strikethrough: boolean
  is_recurring: boolean
}

type ICalendarEventFormState = {
  title: string
  start: string
  end: string
  category: string
  location: string
  reference_link: string
  description: string
  type: 'single' | 'recurring'
}

interface ICalendarCategory extends RecordModel {
  color: string
  icon: string
  name: string
  amount: number
}

type ICalendarCategoryFormState = {
  color: string
  icon: string
  name: string
}

export type {
  ICalendarCategory,
  ICalendarEventFormState,
  ICalendarEvent,
  ICalendarCategoryFormState
}
