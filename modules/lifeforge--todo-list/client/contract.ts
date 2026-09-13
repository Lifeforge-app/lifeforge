export const contract = {
  entries: {
    backfillStatuses: {
      method: 'post',
      description: 'Backfill lifecycle statuses for existing todos',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {},
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            updated: {
              type: 'number'
            }
          },
          required: ['updated'],
          additionalProperties: false
        }
      }
    },
    create: {
      method: 'post',
      description: 'Create a new todo',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            summary: {
              type: 'string'
            },
            notes: {
              type: 'string'
            },
            due_date: {
              type: 'string'
            },
            due_date_has_time: {
              type: 'boolean'
            },
            list: {
              type: 'string'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            priority: {
              type: 'string'
            }
          },
          required: [
            'summary',
            'notes',
            'due_date',
            'due_date_has_time',
            'list',
            'tags',
            'priority'
          ],
          additionalProperties: false
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            summary: {
              type: 'string'
            },
            notes: {
              type: 'string'
            },
            due_date: {
              type: 'string'
            },
            due_date_has_time: {
              type: 'boolean'
            },
            list: {
              type: 'string'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            priority: {
              type: 'string'
            },
            done: {
              type: 'boolean'
            },
            status: {
              type: 'string',
              enum: ['todo', 'doing', 'done']
            },
            squad_mission_id: {
              type: 'string'
            },
            completed_at: {
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
            'summary',
            'notes',
            'due_date',
            'due_date_has_time',
            'list',
            'tags',
            'priority',
            'done',
            'status',
            'squad_mission_id',
            'completed_at',
            'created',
            'updated',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    getById: {
      method: 'get',
      description: 'Get a specific todo by ID',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            summary: {
              type: 'string'
            },
            notes: {
              type: 'string'
            },
            due_date: {
              type: 'string'
            },
            due_date_has_time: {
              type: 'boolean'
            },
            list: {
              type: 'string'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            priority: {
              type: 'string'
            },
            done: {
              type: 'boolean'
            },
            status: {
              type: 'string',
              enum: ['todo', 'doing', 'done']
            },
            squad_mission_id: {
              type: 'string'
            },
            completed_at: {
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
            'summary',
            'notes',
            'due_date',
            'due_date_has_time',
            'list',
            'tags',
            'priority',
            'done',
            'status',
            'squad_mission_id',
            'completed_at',
            'created',
            'updated',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    getStatusCounter: {
      method: 'get',
      description: 'Get todo counts by status',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {},
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            all: {
              type: 'number'
            },
            today: {
              type: 'number'
            },
            scheduled: {
              type: 'number'
            },
            overdue: {
              type: 'number'
            },
            completed: {
              type: 'number'
            }
          },
          required: ['all', 'today', 'scheduled', 'overdue', 'completed'],
          additionalProperties: false
        }
      }
    },
    list: {
      method: 'get',
      description: 'Get todos with filters',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            list: {
              type: 'string'
            },
            status: {
              default: 'all',
              type: 'string'
            },
            priority: {
              type: 'string'
            },
            tag: {
              type: 'string'
            },
            query: {
              type: 'string'
            }
          },
          required: ['status'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              summary: {
                type: 'string'
              },
              notes: {
                type: 'string'
              },
              due_date: {
                type: 'string'
              },
              due_date_has_time: {
                type: 'boolean'
              },
              list: {
                type: 'string'
              },
              tags: {
                type: 'array',
                items: {
                  type: 'string'
                }
              },
              priority: {
                type: 'string'
              },
              done: {
                type: 'boolean'
              },
              status: {
                type: 'string',
                enum: ['todo', 'doing', 'done']
              },
              squad_mission_id: {
                type: 'string'
              },
              completed_at: {
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
              'summary',
              'notes',
              'due_date',
              'due_date_has_time',
              'list',
              'tags',
              'priority',
              'done',
              'status',
              'squad_mission_id',
              'completed_at',
              'created',
              'updated',
              'id',
              'collectionId',
              'collectionName'
            ],
            additionalProperties: false
          }
        },
        NOT_FOUND: true
      }
    },
    remove: {
      method: 'post',
      description: 'Delete a todo',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true,
        NOT_FOUND: true
      }
    },
    toggleEntry: {
      method: 'post',
      description: 'Toggle todo completion status',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            summary: {
              type: 'string'
            },
            notes: {
              type: 'string'
            },
            due_date: {
              type: 'string'
            },
            due_date_has_time: {
              type: 'boolean'
            },
            list: {
              type: 'string'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            priority: {
              type: 'string'
            },
            done: {
              type: 'boolean'
            },
            status: {
              type: 'string',
              enum: ['todo', 'doing', 'done']
            },
            squad_mission_id: {
              type: 'string'
            },
            completed_at: {
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
            'summary',
            'notes',
            'due_date',
            'due_date_has_time',
            'list',
            'tags',
            'priority',
            'done',
            'status',
            'squad_mission_id',
            'completed_at',
            'created',
            'updated',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    update: {
      method: 'post',
      description: 'Update todo details',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        },
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            summary: {
              type: 'string'
            },
            notes: {
              type: 'string'
            },
            due_date: {
              type: 'string'
            },
            due_date_has_time: {
              type: 'boolean'
            },
            list: {
              type: 'string'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            priority: {
              type: 'string'
            }
          },
          required: [
            'summary',
            'notes',
            'due_date',
            'due_date_has_time',
            'list',
            'tags',
            'priority'
          ],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            summary: {
              type: 'string'
            },
            notes: {
              type: 'string'
            },
            due_date: {
              type: 'string'
            },
            due_date_has_time: {
              type: 'boolean'
            },
            list: {
              type: 'string'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            priority: {
              type: 'string'
            },
            done: {
              type: 'boolean'
            },
            status: {
              type: 'string',
              enum: ['todo', 'doing', 'done']
            },
            squad_mission_id: {
              type: 'string'
            },
            completed_at: {
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
            'summary',
            'notes',
            'due_date',
            'due_date_has_time',
            'list',
            'tags',
            'priority',
            'done',
            'status',
            'squad_mission_id',
            'completed_at',
            'created',
            'updated',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    }
  },
  priorities: {
    create: {
      method: 'post',
      description: 'Create a new priority level',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            color: {
              type: 'string'
            }
          },
          required: ['name', 'color'],
          additionalProperties: false
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            color: {
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
          required: ['name', 'color', 'id', 'collectionId', 'collectionName'],
          additionalProperties: false
        }
      }
    },
    list: {
      method: 'get',
      description: 'Get all todo priorities',
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
              name: {
                type: 'string'
              },
              color: {
                type: 'string'
              },
              amount: {
                type: 'number'
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
              'name',
              'color',
              'amount',
              'id',
              'collectionId',
              'collectionName'
            ],
            additionalProperties: false
          }
        }
      }
    },
    remove: {
      method: 'post',
      description: 'Delete a priority level',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true,
        NOT_FOUND: true
      }
    },
    update: {
      method: 'post',
      description: 'Update priority details',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        },
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            color: {
              type: 'string'
            }
          },
          required: ['name', 'color'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            color: {
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
          required: ['name', 'color', 'id', 'collectionId', 'collectionName'],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    }
  },
  lists: {
    create: {
      method: 'post',
      description: 'Create a new todo list',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            color: {
              type: 'string'
            }
          },
          required: ['name', 'icon', 'color'],
          additionalProperties: false
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            color: {
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
            'name',
            'icon',
            'color',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      }
    },
    list: {
      method: 'get',
      description: 'Get all todo lists',
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
              name: {
                type: 'string'
              },
              color: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              amount: {
                type: 'number'
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
              'name',
              'color',
              'icon',
              'amount',
              'id',
              'collectionId',
              'collectionName'
            ],
            additionalProperties: false
          }
        }
      }
    },
    remove: {
      method: 'post',
      description: 'Delete a todo list',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true,
        NOT_FOUND: true
      }
    },
    update: {
      method: 'post',
      description: 'Update todo list details',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        },
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            color: {
              type: 'string'
            }
          },
          required: ['name', 'icon', 'color'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            color: {
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
            'name',
            'icon',
            'color',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    }
  },
  tags: {
    create: {
      method: 'post',
      description: 'Create a new todo tag',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          },
          required: ['name'],
          additionalProperties: false
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
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
          required: ['name', 'id', 'collectionId', 'collectionName'],
          additionalProperties: false
        }
      }
    },
    list: {
      method: 'get',
      description: 'Get all todo tags',
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
              name: {
                type: 'string'
              },
              amount: {
                type: 'number'
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
              'name',
              'amount',
              'id',
              'collectionId',
              'collectionName'
            ],
            additionalProperties: false
          }
        }
      }
    },
    remove: {
      method: 'post',
      description: 'Delete a todo tag',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true,
        NOT_FOUND: true
      }
    },
    update: {
      method: 'post',
      description: 'Update todo tag details',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        },
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          },
          required: ['name'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            name: {
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
          required: ['name', 'id', 'collectionId', 'collectionName'],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    }
  }
} as const

export default contract
