export const contract = {
  settings: {
    get: {
      method: 'get',
      description: 'Get user pomodoro settings',
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
            auto_start_break: {
              type: 'boolean'
            },
            auto_start_work: {
              type: 'boolean'
            },
            notification_sound: {
              type: 'string'
            },
            work_color: {
              type: 'string'
            },
            short_break_color: {
              type: 'string'
            },
            long_break_color: {
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
            'auto_start_break',
            'auto_start_work',
            'notification_sound',
            'work_color',
            'short_break_color',
            'long_break_color',
            'created',
            'updated',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      }
    },
    update: {
      method: 'post',
      description: 'Update pomodoro settings',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: {
        notification_sound: {
          optional: true
        }
      },
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            auto_start_break: {
              type: 'boolean'
            },
            auto_start_work: {
              type: 'boolean'
            },
            work_color: {
              type: 'string'
            },
            short_break_color: {
              type: 'string'
            },
            long_break_color: {
              type: 'string'
            }
          },
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            auto_start_break: {
              type: 'boolean'
            },
            auto_start_work: {
              type: 'boolean'
            },
            notification_sound: {
              type: 'string'
            },
            work_color: {
              type: 'string'
            },
            short_break_color: {
              type: 'string'
            },
            long_break_color: {
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
            'auto_start_break',
            'auto_start_work',
            'notification_sound',
            'work_color',
            'short_break_color',
            'long_break_color',
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
  },
  sessions: {
    changeStatus: {
      method: 'post',
      description: 'Change status of a pomodoro session',
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
            status: {
              type: 'string',
              enum: ['new', 'active', 'completed']
            },
            subSessions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['work', 'short_break', 'long_break']
                  },
                  duration_elapsed: {
                    type: 'number'
                  },
                  ended: {
                    type: 'string'
                  },
                  is_completed: {
                    type: 'boolean'
                  }
                },
                required: ['type', 'duration_elapsed', 'ended', 'is_completed'],
                additionalProperties: false
              }
            },
            pomodoroCount: {
              type: 'number'
            }
          },
          required: ['status'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            work_duration: {
              type: 'number'
            },
            short_break_duration: {
              type: 'number'
            },
            long_break_duration: {
              type: 'number'
            },
            session_until_long_break: {
              type: 'number'
            },
            name: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['new', 'active', 'completed']
            },
            created: {
              type: 'string'
            },
            pomodoro_count: {
              type: 'number'
            },
            total_time_elapsed: {},
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
            'work_duration',
            'short_break_duration',
            'long_break_duration',
            'session_until_long_break',
            'name',
            'status',
            'created',
            'pomodoro_count',
            'total_time_elapsed',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    create: {
      method: 'post',
      description: 'Create a new pomodoro session',
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
            work_duration: {
              type: 'number',
              minimum: 1,
              maximum: 120
            },
            short_break_duration: {
              type: 'number',
              minimum: 1,
              maximum: 60
            },
            long_break_duration: {
              type: 'number',
              minimum: 1,
              maximum: 120
            },
            session_until_long_break: {
              type: 'number',
              minimum: 1,
              maximum: 10
            }
          },
          required: [
            'name',
            'work_duration',
            'short_break_duration',
            'long_break_duration',
            'session_until_long_break'
          ],
          additionalProperties: false
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            work_duration: {
              type: 'number'
            },
            short_break_duration: {
              type: 'number'
            },
            long_break_duration: {
              type: 'number'
            },
            session_until_long_break: {
              type: 'number'
            },
            name: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['new', 'active', 'completed']
            },
            created: {
              type: 'string'
            },
            total_time_elapsed: {
              type: 'number'
            },
            pomodoro_count: {
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
            'work_duration',
            'short_break_duration',
            'long_break_duration',
            'session_until_long_break',
            'name',
            'status',
            'created',
            'total_time_elapsed',
            'pomodoro_count',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      }
    },
    getById: {
      method: 'get',
      description: 'Get pomodoro session by ID',
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
            work_duration: {
              type: 'number'
            },
            short_break_duration: {
              type: 'number'
            },
            long_break_duration: {
              type: 'number'
            },
            session_until_long_break: {
              type: 'number'
            },
            name: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['new', 'active', 'completed']
            },
            created: {
              type: 'string'
            },
            pomodoro_count: {
              type: 'number'
            },
            total_time_elapsed: {},
            id: {
              type: 'string'
            },
            collectionId: {
              type: 'string'
            },
            collectionName: {
              type: 'string'
            },
            lastSubSessionType: {
              type: 'string',
              enum: ['work', 'short_break', 'long_break']
            }
          },
          required: [
            'work_duration',
            'short_break_duration',
            'long_break_duration',
            'session_until_long_break',
            'name',
            'status',
            'created',
            'pomodoro_count',
            'total_time_elapsed',
            'id',
            'collectionId',
            'collectionName',
            'lastSubSessionType'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    list: {
      method: 'get',
      description: 'List all pomodoro sessions',
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
              work_duration: {
                type: 'number'
              },
              short_break_duration: {
                type: 'number'
              },
              long_break_duration: {
                type: 'number'
              },
              session_until_long_break: {
                type: 'number'
              },
              name: {
                type: 'string'
              },
              status: {
                type: 'string',
                enum: ['new', 'active', 'completed']
              },
              created: {
                type: 'string'
              },
              pomodoro_count: {
                type: 'number'
              },
              total_time_elapsed: {},
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
              'work_duration',
              'short_break_duration',
              'long_break_duration',
              'session_until_long_break',
              'name',
              'status',
              'created',
              'pomodoro_count',
              'total_time_elapsed',
              'id',
              'collectionId',
              'collectionName'
            ],
            additionalProperties: false
          }
        }
      }
    },
    listSubSessions: {
      method: 'get',
      description: 'List sub-sessions for a pomodoro session',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            sessionId: {
              type: 'string'
            }
          },
          required: ['sessionId'],
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
              type: {
                type: 'string',
                enum: ['work', 'short_break', 'long_break']
              },
              duration_elapsed: {
                type: 'number'
              },
              is_completed: {
                type: 'boolean'
              },
              session: {
                type: 'string'
              },
              ended: {
                type: 'string'
              },
              created: {
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
              'type',
              'duration_elapsed',
              'is_completed',
              'session',
              'ended',
              'created',
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
      description: 'Delete a pomodoro session',
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
      description: 'Update a pomodoro session',
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
            work_duration: {
              type: 'number'
            },
            short_break_duration: {
              type: 'number'
            },
            long_break_duration: {
              type: 'number'
            },
            session_until_long_break: {
              type: 'number'
            },
            name: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['new', 'active', 'completed']
            },
            created: {
              type: 'string'
            },
            total_time_elapsed: {
              type: 'number'
            },
            pomodoro_count: {
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
            'work_duration',
            'short_break_duration',
            'long_break_duration',
            'session_until_long_break',
            'name',
            'status',
            'created',
            'total_time_elapsed',
            'pomodoro_count',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    }
  }
} as const

export default contract
