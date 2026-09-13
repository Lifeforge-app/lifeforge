import z from 'zod'
import { cleanSchemas } from '@lifeforge/pocketbase'

export const schemas = {
  entries: {
    schema: z.object({
      type: z.enum(['text', 'audio', 'video', 'photos', '']),
      file: z.array(z.string()),
      content: z.string(),
      transcription: z.string(),
      reviewed: z.boolean(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'moment_vault__entries',
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
          maxSelect: 1,
          name: 'type',
          presentable: false,
          required: false,
          system: false,
          type: 'select',
          values: ['text', 'audio', 'video', 'photos']
        },
        {
          hidden: false,
          maxSelect: 99,
          maxSize: 9999999999,
          mimeTypes: [],
          name: 'file',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: [],
          type: 'file'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'content',
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
          name: 'transcription',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          name: 'reviewed',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
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
  }
}

export default cleanSchemas(schemas)
