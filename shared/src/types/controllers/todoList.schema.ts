import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { TodoListCollectionsSchemas } from "../collections";
import { TodoListStatusCounterSchema } from "../collections/todoList.schema";
import type { InferApiESchemaDynamic } from "../utils/inferSchema";

const Entries = {
  /**
   * @route       GET /utils/status-counter
   * @description Get status counter for todo entries
   */
  getStatusCounter: {
    response: TodoListStatusCounterSchema,
  },

  /**
   * @route       GET /:id
   * @description Get todo entry by ID
   */
  getEntryById: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(TodoListCollectionsSchemas.Entry),
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
    response: z.array(SchemaWithPB(TodoListCollectionsSchemas.Entry)),
  },

  /**
   * @route       POST /
   * @description Create a new todo entry
   */
  createEntry: {
    body: TodoListCollectionsSchemas.Entry.omit({
      completed_at: true,
      done: true,
    }),
    response: SchemaWithPB(TodoListCollectionsSchemas.Entry),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing todo entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: TodoListCollectionsSchemas.Entry.omit({
      completed_at: true,
      done: true,
    }),
    response: SchemaWithPB(TodoListCollectionsSchemas.Entry),
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
    response: SchemaWithPB(TodoListCollectionsSchemas.Entry),
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
        TodoListCollectionsSchemas.Tag.extend({
          amount: z.number(),
        })
      )
    ),
  },

  /**
   * @route       POST /
   * @description Create a new todo tag
   */
  createTag: {
    body: TodoListCollectionsSchemas.Tag,
    response: SchemaWithPB(
      TodoListCollectionsSchemas.Tag.extend({
        amount: z.number(),
      })
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
    body: TodoListCollectionsSchemas.Tag,
    response: SchemaWithPB(
      TodoListCollectionsSchemas.Tag.extend({
        amount: z.number(),
      })
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
        TodoListCollectionsSchemas.List.extend({
          amount: z.number(),
        })
      )
    ),
  },

  /**
   * @route       POST /
   * @description Create a new todo list
   */
  createList: {
    body: TodoListCollectionsSchemas.List.pick({
      name: true,
      icon: true,
      color: true,
    }),
    response: SchemaWithPB(
      TodoListCollectionsSchemas.List.extend({
        amount: z.number(),
      })
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
    body: TodoListCollectionsSchemas.List.pick({
      name: true,
      icon: true,
      color: true,
    }),
    response: SchemaWithPB(
      TodoListCollectionsSchemas.List.extend({
        amount: z.number(),
      })
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
        TodoListCollectionsSchemas.Priority.extend({
          amount: z.number(),
        })
      )
    ),
  },

  /**
   * @route       POST /
   * @description Create a new todo priority
   */
  createPriority: {
    body: TodoListCollectionsSchemas.Priority,
    response: SchemaWithPB(
      TodoListCollectionsSchemas.Priority.extend({
        amount: z.number(),
      })
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
    body: TodoListCollectionsSchemas.Priority.pick({
      name: true,
      color: true,
    }),
    response: SchemaWithPB(
      TodoListCollectionsSchemas.Priority.extend({
        amount: z.number(),
      })
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

type IEntries = InferApiESchemaDynamic<typeof Entries>;
type ITags = InferApiESchemaDynamic<typeof Tags>;
type ILists = InferApiESchemaDynamic<typeof Lists>;
type IPriorities = InferApiESchemaDynamic<typeof Priorities>;

export type { IEntries, ITags, ILists, IPriorities };
export { Entries, Tags, Lists, Priorities };
