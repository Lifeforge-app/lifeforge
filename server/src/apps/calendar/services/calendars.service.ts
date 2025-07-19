import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { CalendarCollectionsSchemas } from 'shared/types/collections'

export const getAllCalendars = (
  pb: PocketBase
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>[]> =>
  pb
    .collection('calendar__calendars')
    .getFullList<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>>({
      sort: '+name'
    })

export const getCalendarById = (
  pb: PocketBase,
  id: string
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>> =>
  pb
    .collection('calendar__calendars')
    .getOne<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>>(id)

export const createCalendar = (
  pb: PocketBase,
  calendarData: CalendarCollectionsSchemas.ICalendar
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>> =>
  pb
    .collection('calendar__calendars')
    .create<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>>(calendarData)

export const updateCalendar = (
  pb: PocketBase,
  id: string,
  calendarData: CalendarCollectionsSchemas.ICalendar
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>> =>
  pb
    .collection('calendar__calendars')
    .update<
      ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>
    >(id, calendarData)

export const deleteCalendar = async (pb: PocketBase, id: string) => {
  await pb.collection('calendar__calendars').delete(id)
}
