import z from 'zod'
import { cleanSchemas } from '@lifeforge/pocketbase'

export const schemas = {
  entries: {
    schema: z.object({
      name: z.string(),
      duration: z.string(),
      author: z.string(),
      file: z.string(),
      is_favourite: z.boolean()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'music__entries',
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
          name: 'duration',
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
          name: 'author',
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
          maxSize: 1073741824,
          mimeTypes: [
            'audio/mpeg',
            'audio/flac',
            'audio/midi',
            'audio/ogg',
            'audio/ape',
            'audio/musepack',
            'audio/amr',
            'audio/wav',
            'audio/aiff',
            'audio/basic',
            'audio/aac',
            'audio/x-unknown',
            'audio/mp4'
          ],
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
          name: 'is_favourite',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        }
      ],
      indexes: [],
      system: false
    }
  }
}

export default cleanSchemas(schemas)
