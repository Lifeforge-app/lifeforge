import { z } from 'zod/v4'

import { CalendarCollectionsSchemas } from '../collections'
import { SchemaWithPB } from '../collections/schemaWithPB'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Calendars = {
  /**
   * @route       GET /
   * @description Get all calendars
   */
  getAllCalendars: {
    response: z.array(SchemaWithPB(CalendarCollectionsSchemas.Calendar))
  },

  /**
   * @route       GET /:id
   * @description Get a calendar by ID
   */
  getCalendarById: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(CalendarCollectionsSchemas.Calendar)
  },

  /**
   * @route       POST /
   * @description Create a new calendar
   */
  createCalendar: {
    body: CalendarCollectionsSchemas.Calendar,
    response: SchemaWithPB(CalendarCollectionsSchemas.Calendar)
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing calendar
   */
  updateCalendar: {
    params: z.object({
      id: z.string()
    }),
    body: CalendarCollectionsSchemas.Calendar,
    response: SchemaWithPB(CalendarCollectionsSchemas.Calendar)
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing calendar
   */
  deleteCalendar: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

const Categories = {
  /**
   * @route       GET /
   * @description Get all calendar categories
   */
  getAllCategories: {
    response: z.array(SchemaWithPB(CalendarCollectionsSchemas.Category))
  },

  /**
   * @route       GET /:id
   * @description Get a category by ID
   */
  getCategoryById: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(CalendarCollectionsSchemas.Category)
  },

  /**
   * @route       POST /
   * @description Create a new category
   */
  createCategory: {
    body: CalendarCollectionsSchemas.Category,
    response: SchemaWithPB(CalendarCollectionsSchemas.Category)
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing category
   */
  updateCategory: {
    params: z.object({
      id: z.string()
    }),
    body: CalendarCollectionsSchemas.Category,
    response: SchemaWithPB(CalendarCollectionsSchemas.Category)
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing calendar category
   */
  deleteCategory: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

const Events = {
  /**
   * @route       GET /
   * @description Get events by date range
   */
  getEventsByDateRange: {
    query: z.object({
      start: z.string(),
      end: z.string()
    }),
    response: z.array(
      SchemaWithPB(
        CalendarCollectionsSchemas.Event.partial().extend({
          start: z.string(),
          end: z.string(),
          title: z.string(),
          category: z.string()
        })
      )
    )
  },

  /**
   * @route       GET /today
   * @description Get today's events
   */
  getEventsToday: {
    response: z.array(SchemaWithPB(CalendarCollectionsSchemas.Event))
  },

  /**
   * @route       GET /:id
   * @description Get an event by ID
   */
  getEventById: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(CalendarCollectionsSchemas.Event)
  },

  /**
   * @route       POST /
   * @description Create a new event
   */
  createEvent: {
    body: CalendarCollectionsSchemas.Event.omit({
      type: true
    }).extend({
      location: z
        .union([
          z.object({
            displayName: z.object({
              text: z.string()
            })
          }),
          z.string()
        ])
        .optional()
    }),
    response: SchemaWithPB(CalendarCollectionsSchemas.Event)
  },

  /**
   * @route       POST /scan-image
   * @description Scan an image to extract event data
   */
  scanImage: {
    response: CalendarCollectionsSchemas.Event.partial()
  },

  /**
   * @route       POST /exception/:id
   * @description Add an exception to a recurring event
   */
  addException: {
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      date: z.string()
    }),
    response: z.boolean()
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing event
   */
  updateEvent: {
    params: z.object({
      id: z.string()
    }),
    body: CalendarCollectionsSchemas.Event.partial().omit({
      type: true
    }),
    response: SchemaWithPB(CalendarCollectionsSchemas.Event)
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing event
   */
  deleteEvent: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

type ICalendars = InferApiESchemaDynamic<typeof Calendars>
type ICategories = InferApiESchemaDynamic<typeof Categories>
type IEvents = InferApiESchemaDynamic<typeof Events>

export type { ICalendars, ICategories, IEvents }

export { Calendars, Categories, Events }
