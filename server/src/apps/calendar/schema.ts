/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: calendar
 * Generated at: 2025-07-09T12:50:41.282Z
 * Contains: calendar__events, calendar__categories, calendar__categories_aggregated, calendar__calendars
 */
import { z } from "zod/v4";

const CalendarEventSchema = z.object({
  start: z.string(),
  end: z.string(),
  title: z.string(),
  category: z.string(),
  calendar: z.string(),
  location: z.string(),
  reference_link: z.string(),
  description: z.string(),
  is_striktethrough: z.boolean(),
  is_recurring: z.boolean(),
  use_google_map: z.boolean(),
  type: z.enum(["single", "recurring", ""]),
  recurring_rrule: z.string(),
  recurring_duration_unit: z.string(),
  recurring_duration_amount: z.number(),
  exceptions: z.any(),
});

const CalendarCategorySchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
});

const CalendarCategoryAggregatedSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  amount: z.number(),
});

const CalendarCalendarSchema = z.object({
  name: z.string(),
  color: z.string(),
});

type ICalendarEvent = z.infer<typeof CalendarEventSchema>;
type ICalendarCategory = z.infer<typeof CalendarCategorySchema>;
type ICalendarCategoryAggregated = z.infer<
  typeof CalendarCategoryAggregatedSchema
>;
type ICalendarCalendar = z.infer<typeof CalendarCalendarSchema>;

export {
  CalendarEventSchema,
  CalendarCategorySchema,
  CalendarCategoryAggregatedSchema,
  CalendarCalendarSchema,
};

export type {
  ICalendarEvent,
  ICalendarCategory,
  ICalendarCategoryAggregated,
  ICalendarCalendar,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
