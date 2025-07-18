import PocketBase from "pocketbase";
import { CalendarCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllCalendars = (
  pb: PocketBase,
): Promise<WithPB<CalendarCollectionsSchemas.ICalendar>[]> =>
  pb
    .collection("calendar__calendars")
    .getFullList<WithPB<CalendarCollectionsSchemas.ICalendar>>({
      sort: "+name",
    });

export const getCalendarById = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<CalendarCollectionsSchemas.ICalendar>> =>
  pb
    .collection("calendar__calendars")
    .getOne<WithPB<CalendarCollectionsSchemas.ICalendar>>(id);

export const createCalendar = (
  pb: PocketBase,
  calendarData: CalendarCollectionsSchemas.ICalendar,
): Promise<WithPB<CalendarCollectionsSchemas.ICalendar>> =>
  pb
    .collection("calendar__calendars")
    .create<WithPB<CalendarCollectionsSchemas.ICalendar>>(calendarData);

export const updateCalendar = (
  pb: PocketBase,
  id: string,
  calendarData: CalendarCollectionsSchemas.ICalendar,
): Promise<WithPB<CalendarCollectionsSchemas.ICalendar>> =>
  pb
    .collection("calendar__calendars")
    .update<WithPB<CalendarCollectionsSchemas.ICalendar>>(id, calendarData);

export const deleteCalendar = async (pb: PocketBase, id: string) => {
  await pb.collection("calendar__calendars").delete(id);
};
