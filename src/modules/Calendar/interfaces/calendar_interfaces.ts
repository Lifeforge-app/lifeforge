import type BasePBCollection from '@interfaces/pb_interfaces'

interface ICalendarEvent extends BasePBCollection {
  title: string
  start: string | Date
  end: string | Date
  category: string
}

interface ICalendarEventFormState {
  title: string
  start: string
  end: string
  category: string
}

interface ICalendarCategory extends BasePBCollection {
  color: string
  icon: string
  name: string
  amount: number
}

interface ICalendarCategoryFormState {
  name: string
  icon: string
  color: string
}

export type {
  ICalendarCategory,
  ICalendarEventFormState,
  ICalendarEvent,
  ICalendarCategoryFormState
}
