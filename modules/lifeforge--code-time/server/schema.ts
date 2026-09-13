import z from 'zod'
import { cleanSchemas } from '@lifeforge/pocketbase'

export const schemas = {
  daily_entries: {
    schema: z.object({
      date: z.string(),
      relative_files: z.any(),
      projects: z.any(),
      languages: z.any(),
      hourly: z.any(),
      total_minutes: z.number(),
      last_timestamp: z.number()
    }),
    raw: {
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: null,
      name: 'code_time__daily_entries',
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
          hidden: false,
          max: '',
          min: '',
          name: 'date',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          hidden: false,
          maxSize: 2000000,
          name: 'relative_files',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 2000000,
          name: 'projects',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 2000000,
          name: 'languages',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 0,
          name: 'hourly',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'total_minutes',
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
          name: 'last_timestamp',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false
    }
  }
}

export default cleanSchemas(schemas)
