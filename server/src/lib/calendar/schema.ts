import { z } from "zod/v4";

const calendarSchemas = {
  events: z.object({
    title: z.string(),
    category: z.string(),
    calendar: z.string(),
    location: z.string(),
    location_coords: z.object({ lat: z.number(), lon: z.number() }),
    reference_link: z.string(),
    description: z.string(),
    type: z.enum(["single", "recurring"]),
    created: z.string(),
    updated: z.string(),
  }),
  categories: z.object({
    name: z.string(),
    color: z.string(),
    icon: z.string(),
  }),
  categories_aggregated: z.object({
    name: z.string(),
    icon: z.string(),
    color: z.string(),
    amount: z.number(),
  }),
  calendars: z.object({
    name: z.string(),
    color: z.string(),
  }),
  events_single: z.object({
    base_event: z.string(),
    start: z.string(),
    end: z.string(),
  }),
  events_recurring: z.object({
    recurring_rule: z.string(),
    duration_amount: z.number(),
    duration_unit: z.enum(["hour", "year", "month", "day", "week"]),
    exceptions: z.any(),
    base_event: z.string(),
  }),
};

export default calendarSchemas;
