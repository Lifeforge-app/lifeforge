interface ICalendarEvent {
  collectionId: string
  collectionName: string
  created: string
  id: string
  updated: string
  title: string
  start: string | Date
  end: string | Date
  category: string
}

interface ICalendarCategory {
  collectionId: string
  collectionName: string
  color: string
  created: string
  icon: string
  id: string
  name: string
  updated: string
  amount: number
}

export type { ICalendarEvent, ICalendarCategory }
