const emptyQuery = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {},
  additionalProperties: false
} as const

const item = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    source: { type: 'string', enum: ['personal', 'mission'] },
    status: { type: 'string', enum: ['todo', 'doing', 'done'] },
    priority: { type: 'string' },
    squadMissionId: { type: 'string' },
    repo: { type: 'string' },
    kind: { type: 'string' }
  },
  required: ['id', 'title', 'source', 'status'],
  additionalProperties: false
} as const

const board = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    lanes: {
      type: 'object',
      properties: {
        personal: { type: 'array', items: item },
        work: { type: 'array', items: item }
      },
      required: ['personal', 'work'],
      additionalProperties: false
    }
  },
  required: ['lanes'],
  additionalProperties: false
} as const

const moveBody = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    source: { type: 'string', enum: ['personal', 'mission'] },
    id: { type: 'string' },
    status: { type: 'string', enum: ['todo', 'doing', 'done'] }
  },
  required: ['source', 'id', 'status'],
  additionalProperties: false
} as const

export const contract = {
  board: {
    get: {
      method: 'get',
      description: 'Get unified personal and Squad board data',
      noAuth: false,
      encrypted: false,
      isDownloadable: false,
      media: null,
      input: { query: emptyQuery },
      output: { OK: board }
    },
    promote: {
      method: 'post',
      description:
        'Create or return the Squad mission linked to a personal task',
      noAuth: false,
      encrypted: false,
      isDownloadable: false,
      media: null,
      input: {
        query: emptyQuery,
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: { taskId: { type: 'string' } },
          required: ['taskId'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            squadMissionId: { type: 'string' },
            already: { type: 'boolean' }
          },
          required: ['taskId', 'squadMissionId', 'already'],
          additionalProperties: false
        }
      }
    },
    move: {
      method: 'post',
      description: 'Move an item to a lifecycle column',
      noAuth: false,
      encrypted: false,
      isDownloadable: false,
      media: null,
      input: { query: emptyQuery, body: moveBody },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: { type: 'string' },
            source: { type: 'string', enum: ['personal', 'mission'] },
            status: { type: 'string', enum: ['todo', 'doing', 'done'] }
          },
          required: ['id', 'source', 'status'],
          additionalProperties: false
        }
      }
    },
    undoPromote: {
      method: 'post',
      description:
        'Remove the link between a personal task and its Squad mission',
      noAuth: false,
      encrypted: false,
      isDownloadable: false,
      media: null,
      input: {
        query: emptyQuery,
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: { taskId: { type: 'string' } },
          required: ['taskId'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            squadMissionId: { type: ['string', 'null'] },
            unlinked: { type: 'boolean' }
          },
          required: ['taskId', 'squadMissionId', 'unlinked'],
          additionalProperties: false
        }
      }
    },
    deleteTask: {
      method: 'delete',
      description: 'Delete a personal task and clean up its Squad mission link',
      noAuth: false,
      encrypted: false,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: { taskId: { type: 'string' } },
          required: ['taskId'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: { taskId: { type: 'string' } },
          required: ['taskId'],
          additionalProperties: false
        }
      }
    }
  }
} as const

export default contract
