/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: calendar
 * Generated at: 2025-07-17T08:55:29.692Z
 * Contains: calendar__events, calendar__categories, calendar__categories_aggregated, calendar__calendars
 */

import { z } from "zod/v4";
const EventSchema = z.object({
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
  type: z.enum(["single","recurring",""]),
  recurring_rrule: z.string(),
  recurring_duration_unit: z.string(),
  recurring_duration_amount: z.number(),
  exceptions: z.any(),
});

const CategorySchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
});

const CategoryAggregatedSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  amount: z.number(),
});

const CalendarSchema = z.object({
  name: z.string(),
  color: z.string(),
});

type IEvent = z.infer<typeof EventSchema>;
type ICategory = z.infer<typeof CategorySchema>;
type ICategoryAggregated = z.infer<typeof CategoryAggregatedSchema>;
type ICalendar = z.infer<typeof CalendarSchema>;

export {
  EventSchema,
  CategorySchema,
  CategoryAggregatedSchema,
  CalendarSchema,
};

export type {
  IEvent,
  ICategory,
  ICategoryAggregated,
  ICalendar,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
