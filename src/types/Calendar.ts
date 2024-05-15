interface ICalendarEvent {
  collectionId: string
  collectionName: string
  created: string
  id: string
  updated: string
  title: string
  start: string | Date
  end: string | Date
}

export type { ICalendarEvent }
