import type { RecordModel } from 'pocketbase'

import { LocationsCustomSchemas } from 'shared/types/collections'

interface ICalendarEvent extends RecordModel {
  type: 'single' | 'recurring'
  title: string
  start: string | Date
  end: string | Date
  category: string
  calendar: string
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
  start: Date | null
  end: Date | null
  use_google_map: boolean
  category: string
  calendar: string
  location: string | LocationsCustomSchemas.ILocation | null
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

interface ICalendarCalendar extends RecordModel {
  name: string
  color: string
}

interface ICalendarCalendarFormState {
  name: string
  color: string
}

export type {
  ICalendarCategory,
  ICalendarEventFormState,
  ICalendarEvent,
  ICalendarCategoryFormState,
  ICalendarCalendar,
  ICalendarCalendarFormState
}
