import z from 'zod'

const musicSchemas = {
  entries: {
    schema: z.object({
      name: z.string(),
      duration: z.string(),
      author: z.string(),
      file: z.string(),
      is_favourite: z.boolean()
    }),
    raw: {
      id: 'ud0dpvvhcjj4jiw',
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
          id: 'bdxbqwdv',
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
          id: '7e11dvi3',
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
          id: 'ucubj502',
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
          id: 'wwccga9q',
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
          id: 'ziq6worb',
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

export default musicSchemas
