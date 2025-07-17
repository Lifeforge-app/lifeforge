import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { ICalendarCalendar } from "../schema";

export const getAllCalendars = (
  pb: PocketBase,
): Promise<WithPB<ICalendarCalendar>[]> =>
  pb.collection("calendar__calendars").getFullList<WithPB<ICalendarCalendar>>({
    sort: "+name",
  });

export const getCalendarById = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<ICalendarCalendar>> =>
  pb.collection("calendar__calendars").getOne<WithPB<ICalendarCalendar>>(id);

export const createCalendar = (
  pb: PocketBase,
  calendarData: ICalendarCalendar,
): Promise<WithPB<ICalendarCalendar>> =>
  pb
    .collection("calendar__calendars")
    .create<WithPB<ICalendarCalendar>>(calendarData);

export const updateCalendar = (
  pb: PocketBase,
  id: string,
  calendarData: ICalendarCalendar,
): Promise<WithPB<ICalendarCalendar>> =>
  pb
    .collection("calendar__calendars")
    .update<WithPB<ICalendarCalendar>>(id, calendarData);

export const deleteCalendar = async (pb: PocketBase, id: string) => {
  await pb.collection("calendar__calendars").delete(id);
};
