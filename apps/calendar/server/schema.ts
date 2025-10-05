import z from 'zod'

const calendarSchemas = {
  events: {
    schema: z.object({
      title: z.string(),
      category: z.string(),
      calendar: z.string(),
      location: z.string(),
      location_coords: z.object({ lat: z.number(), lon: z.number() }),
      reference_link: z.string(),
      description: z.string(),
      type: z.enum(['single', 'recurring']),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      id: 'aq4whvpwcarmpux',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'calendar__events',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          id: 'flvfazzo',
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
          cascadeDelete: false,
          collectionId: 'lgqrpjmgz6rmsrg',
          hidden: false,
          id: 'msdsakrs',
          maxSelect: 1,
          minSelect: 0,
          name: 'category',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'pbc_2912871855',
          hidden: false,
          id: 'relation1856610630',
          maxSelect: 1,
          minSelect: 0,
          name: 'calendar',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text1587448267',
          max: 0,
          min: 0,
          name: 'location',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'geoPoint2468307335',
          name: 'location_coords',
          presentable: false,
          required: false,
          system: false,
          type: 'geoPoint'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text1097818449',
          max: 0,
          min: 0,
          name: 'reference_link',
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
          id: 'text3379474102',
          max: 0,
          min: 0,
          name: 'description',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'select2363381545',
          maxSelect: 1,
          name: 'type',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['single', 'recurring']
        },
        {
          hidden: false,
          id: 'autodate2990389176',
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          id: 'autodate3332085495',
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
  categories: {
    schema: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string()
    }),
    raw: {
      id: 'lgqrpjmgz6rmsrg',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'calendar__categories',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          id: '5gljytxm',
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
          id: 'p5zxtnom',
          max: 0,
          min: 0,
          name: 'color',
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
          id: 'tamumamt',
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
      indexes: [
        'CREATE UNIQUE INDEX `idx_isCrOV2gEh` ON `calendar__categories` (`name`)'
      ],
      system: false
    }
  },
  calendars: {
    schema: z.object({
      name: z.string(),
      color: z.string(),
      link: z.url(),
      last_synced: z.string()
    }),
    raw: {
      id: 'pbc_2912871855',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'calendar__calendars',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          id: 'text1579384326',
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
          id: 'text1716930793',
          max: 0,
          min: 0,
          name: 'color',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          exceptDomains: null,
          hidden: false,
          id: 'url917281265',
          name: 'link',
          onlyDomains: null,
          presentable: false,
          required: false,
          system: false,
          type: 'url'
        },
        {
          hidden: false,
          id: 'date2173440322',
          max: '',
          min: '',
          name: 'last_synced',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        }
      ],
      indexes: [
        'CREATE UNIQUE INDEX `idx_qUL2o05YBe` ON `calendar__calendars` (`name`)'
      ],
      system: false
    }
  },
  events_single: {
    schema: z.object({
      base_event: z.string(),
      start: z.string(),
      end: z.string()
    }),
    raw: {
      id: 'pbc_1417836082',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'calendar__events_single',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          cascadeDelete: true,
          collectionId: 'aq4whvpwcarmpux',
          hidden: false,
          id: 'relation3233087073',
          maxSelect: 1,
          minSelect: 0,
          name: 'base_event',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          id: 'date2675529103',
          max: '',
          min: '',
          name: 'start',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          hidden: false,
          id: 'date16528305',
          max: '',
          min: '',
          name: 'end',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        }
      ],
      indexes: [
        'CREATE UNIQUE INDEX `idx_Z0MvNxCsxl` ON `calendar__events_single` (`base_event`)'
      ],
      system: false
    }
  },
  events_recurring: {
    schema: z.object({
      recurring_rule: z.string(),
      duration_amount: z.number(),
      duration_unit: z.enum(['hour', 'year', 'month', 'day', 'week']),
      exceptions: z.any(),
      base_event: z.string()
    }),
    raw: {
      id: 'pbc_2966426400',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'calendar__events_recurring',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          id: 'text581711714',
          max: 0,
          min: 0,
          name: 'recurring_rule',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'number3612257647',
          max: null,
          min: null,
          name: 'duration_amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          id: 'select2414572776',
          maxSelect: 1,
          name: 'duration_unit',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['hour', 'year', 'month', 'day', 'week']
        },
        {
          hidden: false,
          id: 'json678566752',
          maxSize: 0,
          name: 'exceptions',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          cascadeDelete: true,
          collectionId: 'aq4whvpwcarmpux',
          hidden: false,
          id: 'relation2256903029',
          maxSelect: 1,
          minSelect: 0,
          name: 'base_event',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        }
      ],
      indexes: [
        'CREATE UNIQUE INDEX `idx_dyxH0lk7ka` ON `calendar__events_recurring` (`base_event`)'
      ],
      system: false
    }
  },
  events_ical: {
    schema: z.object({
      calendar: z.string(),
      external_id: z.string(),
      title: z.string(),
      description: z.string(),
      start: z.string(),
      end: z.string(),
      location: z.string(),
      recurrence_rule: z.string()
    }),
    raw: {
      id: 'pbc_3588948690',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'calendar__events_ical',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          cascadeDelete: true,
          collectionId: 'pbc_2912871855',
          hidden: false,
          id: 'relation1856610630',
          maxSelect: 1,
          minSelect: 0,
          name: 'calendar',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text2675300272',
          max: 0,
          min: 0,
          name: 'external_id',
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
          id: 'text724990059',
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
          id: 'text1843675174',
          max: 0,
          min: 0,
          name: 'description',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'date2675529103',
          max: '',
          min: '',
          name: 'start',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          hidden: false,
          id: 'date16528305',
          max: '',
          min: '',
          name: 'end',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text1587448267',
          max: 0,
          min: 0,
          name: 'location',
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
          id: 'text3329811012',
          max: 0,
          min: 0,
          name: 'recurrence_rule',
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
  }
}

export default calendarSchemas
