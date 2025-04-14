import type { RecordModel } from 'pocketbase'

interface ICalendarEvent extends RecordModel {
  type: 'single' | 'recurring'
  title: string
  start: string | Date
  end: string | Date
  category: string
  use_google_map: boolean
  location: string
  reference_link: string
  description: string
  is_strikethrough: boolean
  recurring_rrule: string
  recurring_duration_amount: number
  recurring_duration_unit: string
}

type ICalendarEventFormState = {
  title: string
  start: string
  end: string
  use_google_map: boolean
  category: string
  location: string
  reference_link: string
  description: string
  type: 'single' | 'recurring'
  recurring_rrule: string
  recurring_duration_amount: string
  recurring_duration_unit: string
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
