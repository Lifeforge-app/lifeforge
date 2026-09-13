export const contract = {
  entries: {
    list: {
      method: 'get',
      description: 'Get all blog entries',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {},
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              content: {
                type: 'string'
              },
              title: {
                type: 'string'
              },
              media: {
                type: 'array',
                items: {
                  type: 'string'
                }
              },
              excerpt: {
                type: 'string'
              },
              visibility: {
                type: 'string',
                enum: ['private', 'public', 'unlisted', '']
              },
              featured_image: {
                type: 'string'
              },
              labels: {},
              category: {
                type: 'string'
              },
              created: {
                type: 'string'
              },
              updated: {
                type: 'string'
              },
              id: {
                type: 'string'
              },
              collectionId: {
                type: 'string'
              },
              collectionName: {
                type: 'string'
              }
            },
            required: [
              'content',
              'title',
              'media',
              'excerpt',
              'visibility',
              'featured_image',
              'labels',
              'category',
              'created',
              'updated',
              'id',
              'collectionId',
              'collectionName'
            ],
            additionalProperties: false
          }
        }
      }
    }
  }
} as const

export default contract
