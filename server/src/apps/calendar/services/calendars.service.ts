import PocketBase from "pocketbase";
import { CalendarSchemas } from "shared";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllCalendars = (
  pb: PocketBase,
): Promise<WithPB<CalendarSchemas.ICalendar>[]> =>
  pb
    .collection("calendar__calendars")
    .getFullList<WithPB<CalendarSchemas.ICalendar>>({
      sort: "+name",
    });

export const getCalendarById = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<CalendarSchemas.ICalendar>> =>
  pb
    .collection("calendar__calendars")
    .getOne<WithPB<CalendarSchemas.ICalendar>>(id);

export const createCalendar = (
  pb: PocketBase,
  calendarData: CalendarSchemas.ICalendar,
): Promise<WithPB<CalendarSchemas.ICalendar>> =>
  pb
    .collection("calendar__calendars")
    .create<WithPB<CalendarSchemas.ICalendar>>(calendarData);

export const updateCalendar = (
  pb: PocketBase,
  id: string,
  calendarData: CalendarSchemas.ICalendar,
): Promise<WithPB<CalendarSchemas.ICalendar>> =>
  pb
    .collection("calendar__calendars")
    .update<WithPB<CalendarSchemas.ICalendar>>(id, calendarData);

export const deleteCalendar = async (pb: PocketBase, id: string) => {
  await pb.collection("calendar__calendars").delete(id);
};
