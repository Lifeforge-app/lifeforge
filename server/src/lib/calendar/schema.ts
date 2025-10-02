import { z } from "zod";

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
  calendars: z.object({
    name: z.string(),
    color: z.string(),
    link: z.url(),
    last_synced: z.string(),
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
  events_ical: z.object({
    calendar: z.string(),
    external_id: z.string(),
    title: z.string(),
    description: z.string(),
    start: z.string(),
    end: z.string(),
    location: z.string(),
    recurrence_rule: z.string(),
  }),
};

export default calendarSchemas;
