import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";

const Calendars = {
  /**
   * @route       GET /
   * @description Get all calendars
   */
  getAllCalendars: {
    response: z.array(SchemaWithPB(CalendarSchemas.CalendarSchema)),
  },

  /**
   * @route       GET /:id
   * @description Get a calendar by ID
   */
  getCalendarById: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(CalendarSchemas.CalendarSchema),
  },

  /**
   * @route       POST /
   * @description Create a new calendar
   */
  createCalendar: {
    body: CalendarSchemas.CalendarSchema,
    response: SchemaWithPB(CalendarSchemas.CalendarSchema),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing calendar
   */
  updateCalendar: {
    params: z.object({
      id: z.string(),
    }),
    body: CalendarSchemas.CalendarSchema,
    response: SchemaWithPB(CalendarSchemas.CalendarSchema),
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing calendar
   */
  deleteCalendar: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Categories = {
  /**
   * @route       GET /
   * @description Get all calendar categories
   */
  getAllCategories: {
    response: z.array(SchemaWithPB(CalendarSchemas.CategorySchema)),
  },

  /**
   * @route       GET /:id
   * @description Get a calendar category by ID
   */
  getCategoryById: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(CalendarSchemas.CategorySchema),
  },

  /**
   * @route       POST /
   * @description Create a new calendar category
   */
  createCategory: {
    body: CalendarSchemas.CategorySchema,
    response: SchemaWithPB(CalendarSchemas.CategorySchema),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing calendar category
   */
  updateCategory: {
    params: z.object({
      id: z.string(),
    }),
    body: CalendarSchemas.CategorySchema,
    response: SchemaWithPB(CalendarSchemas.CategorySchema),
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing calendar category
   */
  deleteCategory: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Events = {
  /**
   * @route       GET /
   * @description Get events by date range
   */
  getEventsByDateRange: {
    query: z.object({
      start: z.string(),
      end: z.string(),
    }),
    response: z.array(SchemaWithPB(CalendarSchemas.EventSchema.partial())),
  },

  /**
   * @route       GET /today
   * @description Get today's events
   */
  getEventsToday: {
    response: z.array(SchemaWithPB(CalendarSchemas.EventSchema.partial())),
  },

  /**
   * @route       GET /:id
   * @description Get an event by ID
   */
  getEventById: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(CalendarSchemas.EventSchema),
  },

  /**
   * @route       POST /
   * @description Create a new event
   */
  createEvent: {
    body: CalendarSchemas.EventSchema.omit({
      exceptions: true,
    }).extend({
      location: z
        .union([
          z.object({
            displayName: z.object({
              text: z.string(),
            }),
          }),
          z.string(),
        ])
        .optional(),
    }),
    response: SchemaWithPB(CalendarSchemas.EventSchema),
  },

  /**
   * @route       POST /scan-image
   * @description Scan an image to extract event data
   */
  scanImage: {
    response: CalendarSchemas.EventSchema.partial(),
  },

  /**
   * @route       POST /exception/:id
   * @description Add an exception to a recurring event
   */
  addException: {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      date: z.string(),
    }),
    response: z.boolean(),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing event
   */
  updateEvent: {
    params: z.object({
      id: z.string(),
    }),
    body: CalendarSchemas.EventSchema.partial().omit({
      exceptions: true,
    }),
    response: SchemaWithPB(CalendarSchemas.EventSchema),
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing event
   */
  deleteEvent: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

type ICalendars = z.infer<typeof Calendars>;
type ICategories = z.infer<typeof Categories>;
type IEvents = z.infer<typeof Events>;

export type { ICalendars, ICategories, IEvents };
export { Calendars, Categories, Events };
