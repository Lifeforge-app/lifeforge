/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: calendar
 * Generated at: 2025-07-19T08:49:31.509Z
 * Contains: calendar__events, calendar__categories, calendar__categories_aggregated, calendar__calendars
 */
import { z } from 'zod/v4'

const BaseEvent = z.object({
  title: z.string(),
  category: z.string(),
  calendar: z.string(),
  location: z.string(),
  reference_link: z.string(),
  description: z.string(),
  use_google_map: z.boolean()
})

const Event = BaseEvent.and(
  z.union([
    z.object({
      type: z.literal('recurring'),
      recurring_rrule: z.string(),
      recurring_duration_unit: z.enum(['hour', 'day', 'week', 'month', 'year']),
      recurring_duration_amount: z.number(),
      exceptions: z.any(),
      start: z.string(),
      end: z.string()
    }),
    z.object({
      start: z.string(),
      end: z.literal(''),
      type: z.literal('single'),
      recurring_rrule: z.literal(''),
      recurring_duration_unit: z.literal(''),
      recurring_duration_amount: z.literal(0),
      exceptions: z.literal(null)
    })
  ])
)

const Category = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string()
})

const CategoryAggregated = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  amount: z.number()
})

const Calendar = z.object({
  name: z.string(),
  color: z.string()
})

type IBaseEvent = z.infer<typeof BaseEvent>
type IEvent = z.infer<typeof Event>
type ICategory = z.infer<typeof Category>
type ICategoryAggregated = z.infer<typeof CategoryAggregated>
type ICalendar = z.infer<typeof Calendar>

export { BaseEvent, Event, Category, CategoryAggregated, Calendar }

export type { IBaseEvent, IEvent, ICategory, ICategoryAggregated, ICalendar }

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
