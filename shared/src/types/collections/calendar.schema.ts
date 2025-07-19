/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: calendar
 * Generated at: 2025-07-19T14:24:04.967Z
 * Contains: calendar__events, calendar__categories, calendar__categories_aggregated, calendar__calendars, calendar__events_single, calendar__events_recurring
 */

import { z } from "zod/v4";

const Event = z.object({
  title: z.string(),
  category: z.string(),
  calendar: z.string(),
  location: z.string(),
  reference_link: z.string(),
  description: z.string(),
  use_google_map: z.boolean(),
  type: z.enum(["single","recurring",""]),
});

const Category = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
});

const CategoryAggregated = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  amount: z.number(),
});

const Calendar = z.object({
  name: z.string(),
  color: z.string(),
});

const EventsSingle = z.object({
  base_event: z.string(),
  start: z.string(),
  end: z.string(),
});

const EventsRecurring = z.object({
  recurring_rule: z.string(),
  duration_amount: z.number(),
  duration_unit: z.enum(["hour","year","month","day","week"]),
  exceptions: z.any(),
  base_event: z.string(),
});

type IEvent = z.infer<typeof Event>;
type ICategory = z.infer<typeof Category>;
type ICategoryAggregated = z.infer<typeof CategoryAggregated>;
type ICalendar = z.infer<typeof Calendar>;
type IEventsSingle = z.infer<typeof EventsSingle>;
type IEventsRecurring = z.infer<typeof EventsRecurring>;

export {
  Event,
  Category,
  CategoryAggregated,
  Calendar,
  EventsSingle,
  EventsRecurring,
};

export type {
  IEvent,
  ICategory,
  ICategoryAggregated,
  ICalendar,
  IEventsSingle,
  IEventsRecurring,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
