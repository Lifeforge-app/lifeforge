import z from 'zod'

const blogSchemas = {
  entries: {
    schema: z.object({
      content: z.string(),
      title: z.string(),
      media: z.array(z.string()),
      excerpt: z.string(),
      visibility: z.enum(['private', 'public', 'unlisted', '']),
      featured_image: z.string(),
      labels: z.any(),
      category: z.string(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'blog__entries',
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
          max: 1000000000000000,
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
          name: 'title',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          maxSelect: 9999,
          maxSize: 9999999999,
          mimeTypes: [],
          name: 'media',
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
          name: 'excerpt',
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
          name: 'visibility',
          presentable: false,
          required: false,
          system: false,
          type: 'select',
          values: ['private', 'public', 'unlisted']
        },
        {
          hidden: false,
          maxSelect: 1,
          maxSize: 0,
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/gif',
            'image/webp'
          ],
          name: 'featured_image',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: [],
          type: 'file'
        },
        {
          hidden: false,
          maxSize: 0,
          name: 'labels',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          cascadeDelete: false,
          collectionId: 'blog__categories',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'category',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
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
  categories: {
    schema: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string()
    }),
    raw: {
      listRule: '',
      viewRule: null,
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'blog__categories',
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
        'CREATE UNIQUE INDEX `idx_GuuYBxu9OR` ON `blog__categories` (`name`)'
      ],
      system: false
    }
  }
}

export default blogSchemas
