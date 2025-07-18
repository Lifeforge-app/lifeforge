import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";

const Entries = {
  /**
   * @route       GET /utils/status-counter
   * @description Get status counter for todo entries
   */
  getStatusCounter: {
    response: TodoListSchemas.TodoListStatusCounterSchema,
  },

  /**
   * @route       GET /:id
   * @description Get todo entry by ID
   */
  getEntryById: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(TodoListSchemas.EntrySchema),
  },

  /**
   * @route       GET /
   * @description Get all todo entries with optional filters
   */
  getAllEntries: {
    query: z.object({
      list: z.string().optional(),
      status: z.string().optional().default("all"),
      priority: z.string().optional(),
      tag: z.string().optional(),
      query: z.string().optional(),
    }),
    response: z.array(SchemaWithPB(TodoListSchemas.EntrySchema)),
  },

  /**
   * @route       POST /
   * @description Create a new todo entry
   */
  createEntry: {
    body: TodoListSchemas.EntrySchema.omit({
      completed_at: true,
      done: true,
    }),
    response: SchemaWithPB(TodoListSchemas.EntrySchema),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing todo entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: TodoListSchemas.EntrySchema.omit({
      completed_at: true,
      done: true,
    }),
    response: SchemaWithPB(TodoListSchemas.EntrySchema),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a todo entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       POST /toggle/:id
   * @description Toggle completion status of a todo entry
   */
  toggleEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(TodoListSchemas.EntrySchema),
  },
};

const Tags = {
  /**
   * @route       GET /
   * @description Get all todo tags
   */
  getAllTags: {
    response: z.array(
      SchemaWithPB(
        TodoListSchemas.TagSchema.extend({
          amount: z.number(),
        }),
      ),
    ),
  },

  /**
   * @route       POST /
   * @description Create a new todo tag
   */
  createTag: {
    body: TodoListSchemas.TagSchema,
    response: SchemaWithPB(
      TodoListSchemas.TagSchema.extend({
        amount: z.number(),
      }),
    ),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing todo tag
   */
  updateTag: {
    params: z.object({
      id: z.string(),
    }),
    body: TodoListSchemas.TagSchema,
    response: SchemaWithPB(
      TodoListSchemas.TagSchema.extend({
        amount: z.number(),
      }),
    ),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a todo tag
   */
  deleteTag: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Lists = {
  /**
   * @route       GET /
   * @description Get all todo lists
   */
  getAllLists: {
    response: z.array(
      SchemaWithPB(
        TodoListSchemas.ListSchema.extend({
          amount: z.number(),
        }),
      ),
    ),
  },

  /**
   * @route       POST /
   * @description Create a new todo list
   */
  createList: {
    body: TodoListSchemas.ListSchema.pick({
      name: true,
      icon: true,
      color: true,
    }),
    response: SchemaWithPB(
      TodoListSchemas.ListSchema.extend({
        amount: z.number(),
      }),
    ),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing todo list
   */
  updateList: {
    params: z.object({
      id: z.string(),
    }),
    body: TodoListSchemas.ListSchema.pick({
      name: true,
      icon: true,
      color: true,
    }),
    response: SchemaWithPB(
      TodoListSchemas.ListSchema.extend({
        amount: z.number(),
      }),
    ),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a todo list
   */
  deleteList: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Priorities = {
  /**
   * @route       GET /
   * @description Get all todo priorities
   */
  getAllPriorities: {
    response: z.array(
      SchemaWithPB(
        TodoListSchemas.PrioritySchema.extend({
          amount: z.number(),
        }),
      ),
    ),
  },

  /**
   * @route       POST /
   * @description Create a new todo priority
   */
  createPriority: {
    body: TodoListSchemas.PrioritySchema,
    response: SchemaWithPB(
      TodoListSchemas.PrioritySchema.extend({
        amount: z.number(),
      }),
    ),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing todo priority
   */
  updatePriority: {
    params: z.object({
      id: z.string(),
    }),
    body: TodoListSchemas.PrioritySchema.pick({
      name: true,
      color: true,
    }),
    response: SchemaWithPB(
      TodoListSchemas.PrioritySchema.extend({
        amount: z.number(),
      }),
    ),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a todo priority
   */
  deletePriority: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

type IEntries = z.infer<typeof Entries>;
type ITags = z.infer<typeof Tags>;
type ILists = z.infer<typeof Lists>;
type IPriorities = z.infer<typeof Priorities>;

export type { IEntries, ITags, ILists, IPriorities };
export { Entries, Tags, Lists, Priorities };
