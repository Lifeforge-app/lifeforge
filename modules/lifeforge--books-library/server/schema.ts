import z from 'zod'
import { cleanSchemas } from '@lifeforge/pocketbase'

export const schemas = {
  collections: {
    schema: z.object({
      name: z.string(),
      icon: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'books_library__collections',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        }
      ],
      indexes: [],
      system: false
    }
  },
  languages: {
    schema: z.object({
      name: z.string(),
      icon: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'books_library__languages',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        }
      ],
      indexes: [],
      system: false
    }
  },
  entries: {
    schema: z.object({
      title: z.string(),
      authors: z.string(),
      md5: z.string(),
      year_published: z.number(),
      publisher: z.string(),
      languages: z.array(z.string()),
      collection: z.string(),
      extension: z.string(),
      edition: z.string(),
      size: z.number(),
      word_count: z.number(),
      page_count: z.number(),
      isbn: z.string(),
      file: z.string(),
      thumbnail: z.string(),
      is_favourite: z.boolean(),
      time_started: z.string(),
      time_finished: z.string(),
      read_status: z.enum(['read', 'unread', 'reading']),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'books_library__entries',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'title',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'authors',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'md5',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'year_published',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'publisher',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          cascadeDelete: false,
          collectionId: 'books_library__languages',
          hidden: false,
          maxSelect: 2147483647,
          minSelect: 0,
          name: 'languages',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'books_library__collections',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'collection',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'extension',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'edition',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'size',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'word_count',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'page_count',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'isbn',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          maxSelect: 1,
          maxSize: 524288000000,
          mimeTypes: null,
          name: 'file',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: null,
          type: 'file'
        },
        {
          hidden: false,
          maxSelect: 1,
          maxSize: 524288000,
          mimeTypes: [],
          name: 'thumbnail',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: ['200x0'],
          type: 'file'
        },
        {
          hidden: false,
          name: 'is_favourite',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          max: '',
          min: '',
          name: 'time_started',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          hidden: false,
          max: '',
          min: '',
          name: 'time_finished',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          hidden: false,
          maxSelect: 1,
          name: 'read_status',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['read', 'unread', 'reading']
        },
        {
          hidden: false,
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate'
        }
      ],
      indexes: [],
      system: false
    }
  },
  file_types: {
    schema: z.object({
      name: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'books_library__file_types',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        }
      ],
      indexes: [],
      system: false
    }
  },
  file_types_aggregated: {
    schema: z.object({
      name: z.string(),
      amount: z.number()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'books_library__file_types_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'SELECT\n  books_library__file_types.id,\n  books_library__file_types.name,\n  count(books_library__entries.id) as amount\nFROM books_library__file_types\n  LEFT JOIN books_library__entries ON books_library__entries.extension = books_library__file_types.name\nGROUP BY books_library__file_types.id'
    }
  },
  languages_aggregated: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      amount: z.number()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'books_library__languages_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'WITH languages_map AS (\n  SELECT \n    books_library__entries.id AS entry_id,\n    json_each.value AS lang_id\n  FROM \n    books_library__entries,\n    JSON_EACH(books_library__entries.languages)\n) SELECT\n  books_library__languages.id,\n  books_library__languages.name,\n  books_library__languages.icon,\n  count(languages_map.entry_id) as amount\nFROM books_library__languages\n  LEFT JOIN languages_map ON languages_map.lang_id = books_library__languages.id\nGROUP BY books_library__languages.id'
    }
  },
  collections_aggregated: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      amount: z.number()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'books_library__collections_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'SELECT \n  books_library__collections.id,\n  books_library__collections.name,\n  books_library__collections.icon,\n  COUNT(books_library__entries.id) as amount\nFROM books_library__collections\n  LEFT JOIN books_library__entries ON books_library__entries.collection = books_library__collections.id\nGROUP BY books_library__collections.id'
    }
  },
  read_status_aggregated: {
    schema: z.object({
      name: z.any(),
      icon: z.any(),
      color: z.any(),
      amount: z.number()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'books_library__read_status_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'name',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'icon',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'color',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'SELECT \n    (ROW_NUMBER() OVER()) AS id,\n    json_extract(json_each.value, \'$.name\')  AS name,\n    json_extract(json_each.value, \'$.icon\')  AS icon,\n    json_extract(json_each.value, \'$.color\') AS color,\n    COUNT(books_library__entries.id)         AS amount\nFROM JSON_EACH(\'[\n  { "name": "read",    "icon": "tabler:progress-check",    "color": "#22c55e" },\n  { "name": "reading", "icon": "tabler:progress-bolt",  "color": "#3b82f6" },\n  { "name": "unread",  "icon": "tabler:progress", "color": "#ef4444" }\n]\')\nLEFT JOIN books_library__entries\n    ON books_library__entries.read_status = json_extract(json_each.value, \'$.name\')\nGROUP BY json_each.value;'
    }
  }
}

export default cleanSchemas(schemas)
