import type BasePBCollection from '@interfaces/pb_interfaces'

interface ICalendarEvent extends BasePBCollection {
  title: string
  start: string | Date
  end: string | Date
  category: string
}

type ICalendarEventFormState = Omit<ICalendarEvent, keyof BasePBCollection>

interface ICalendarCategory extends BasePBCollection {
  color: string
  icon: string
  name: string
  amount: number
}

type ICalendarCategoryFormState = Omit<
  ICalendarCategory,
  keyof BasePBCollection | 'amount'
>

export type {
  ICalendarCategory,
  ICalendarEventFormState,
  ICalendarEvent,
  ICalendarCategoryFormState
}
