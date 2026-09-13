export const contract = {
  containers: {
    create: {
      method: 'post',
      description: 'Create a new container',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: {
        cover: {
          optional: true
        }
      },
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            icon: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
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
          required: [
            'icon',
            'color',
            'name',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            icon: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            cover: {
              type: 'string'
            },
            pinned: {
              type: 'boolean'
            },
            hidden: {
              type: 'boolean'
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
            'icon',
            'color',
            'name',
            'cover',
            'pinned',
            'hidden',
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
      description: 'Get all containers with stats',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            hidden: {
              type: 'string'
            }
          },
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
              name: {
                type: 'string'
              },
              color: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              cover: {
                type: 'string'
              },
              pinned: {
                type: 'boolean'
              },
              hidden: {
                type: 'boolean'
              },
              text_count: {
                type: 'number'
              },
              link_count: {
                type: 'number'
              },
              image_count: {
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
              'cover',
              'pinned',
              'hidden',
              'text_count',
              'link_count',
              'image_count',
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
      description: 'Delete a container',
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
    toggleHide: {
      method: 'post',
      description: 'Toggle visibility of a container',
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
            icon: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            cover: {
              type: 'string'
            },
            pinned: {
              type: 'boolean'
            },
            hidden: {
              type: 'boolean'
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
            'icon',
            'color',
            'name',
            'cover',
            'pinned',
            'hidden',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    togglePin: {
      method: 'post',
      description: 'Toggle pin status of a container',
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
            icon: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            cover: {
              type: 'string'
            },
            pinned: {
              type: 'boolean'
            },
            hidden: {
              type: 'boolean'
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
            'icon',
            'color',
            'name',
            'cover',
            'pinned',
            'hidden',
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
      description: 'Update an existing container',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: {
        cover: {
          optional: true
        }
      },
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
            icon: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
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
          required: [
            'icon',
            'color',
            'name',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            icon: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            cover: {
              type: 'string'
            },
            pinned: {
              type: 'boolean'
            },
            hidden: {
              type: 'boolean'
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
            'icon',
            'color',
            'name',
            'cover',
            'pinned',
            'hidden',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    validate: {
      method: 'get',
      description: 'Validate if a container exists',
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
          type: 'boolean'
        }
      }
    }
  },
  folders: {
    create: {
      method: 'post',
      description: 'Create a new folder',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            parent: {
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
            'container',
            'name',
            'color',
            'icon',
            'parent',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            parent: {
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
            'container',
            'name',
            'color',
            'icon',
            'parent',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    list: {
      method: 'get',
      description: 'Get all folders in a path',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            },
            path: {
              type: 'string'
            }
          },
          required: ['container', 'path'],
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
              container: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              color: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              parent: {
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
              'container',
              'name',
              'color',
              'icon',
              'parent',
              'id',
              'collectionId',
              'collectionName'
            ],
            additionalProperties: false
          }
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        },
        NOT_FOUND: true
      }
    },
    moveTo: {
      method: 'post',
      description: 'Move folder to another parent',
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
            target: {
              type: 'string'
            }
          },
          required: ['target'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            parent: {
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
            'container',
            'name',
            'color',
            'icon',
            'parent',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    remove: {
      method: 'post',
      description: 'Delete a folder',
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
    removeFromParent: {
      method: 'post',
      description: 'Move folder to parent folder',
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
            container: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            parent: {
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
            'container',
            'name',
            'color',
            'icon',
            'parent',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        },
        NOT_FOUND: true
      }
    },
    update: {
      method: 'post',
      description: 'Update folder details',
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
            },
            icon: {
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
            'color',
            'icon',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            parent: {
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
            'container',
            'name',
            'color',
            'icon',
            'parent',
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
  ideas: {
    archive: {
      method: 'post',
      description: 'Toggle archive status of an idea',
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
            type: {
              type: 'string',
              enum: ['text', 'image', 'link']
            },
            container: {
              type: 'string'
            },
            folder: {
              type: 'string'
            },
            pinned: {
              type: 'boolean'
            },
            archived: {
              type: 'boolean'
            },
            tags: {},
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
            'type',
            'container',
            'folder',
            'pinned',
            'archived',
            'tags',
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
    create: {
      method: 'post',
      description: 'Create a new idea entry',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: {
        image: {
          optional: true
        }
      },
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          allOf: [
            {
              type: 'object',
              properties: {
                container: {
                  type: 'string'
                },
                folder: {
                  type: 'string'
                },
                tags: {},
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
                'container',
                'folder',
                'tags',
                'id',
                'collectionId',
                'collectionName'
              ]
            },
            {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    content: {
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
                    },
                    type: {
                      type: 'string',
                      const: 'text'
                    }
                  },
                  required: [
                    'content',
                    'id',
                    'collectionId',
                    'collectionName',
                    'type'
                  ]
                },
                {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string'
                    },
                    collectionId: {
                      type: 'string'
                    },
                    collectionName: {
                      type: 'string'
                    },
                    type: {
                      type: 'string',
                      const: 'image'
                    }
                  },
                  required: ['id', 'collectionId', 'collectionName', 'type']
                },
                {
                  type: 'object',
                  properties: {
                    link: {
                      type: 'string',
                      format: 'uri'
                    },
                    id: {
                      type: 'string'
                    },
                    collectionId: {
                      type: 'string'
                    },
                    collectionName: {
                      type: 'string'
                    },
                    type: {
                      type: 'string',
                      const: 'link'
                    }
                  },
                  required: [
                    'link',
                    'id',
                    'collectionId',
                    'collectionName',
                    'type'
                  ]
                }
              ]
            }
          ]
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['text', 'image', 'link']
            },
            container: {
              type: 'string'
            },
            folder: {
              type: 'string'
            },
            pinned: {
              type: 'boolean'
            },
            archived: {
              type: 'boolean'
            },
            tags: {},
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
            'type',
            'container',
            'folder',
            'pinned',
            'archived',
            'tags',
            'created',
            'updated',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        },
        NOT_FOUND: true
      }
    },
    list: {
      method: 'get',
      description: 'Get all ideas from a folder or idea container',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            },
            path: {
              type: 'string'
            },
            archived: {
              type: 'string'
            }
          },
          required: ['container', 'path'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'array',
          items: {
            allOf: [
              {
                type: 'object',
                properties: {
                  container: {
                    type: 'string'
                  },
                  folder: {
                    type: 'string'
                  },
                  pinned: {
                    type: 'boolean'
                  },
                  archived: {
                    type: 'boolean'
                  },
                  tags: {},
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
                  'container',
                  'folder',
                  'pinned',
                  'archived',
                  'tags',
                  'created',
                  'updated',
                  'id',
                  'collectionId',
                  'collectionName'
                ]
              },
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      base_entry: {
                        type: 'string'
                      },
                      content: {
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
                      },
                      type: {
                        type: 'string',
                        const: 'text'
                      }
                    },
                    required: [
                      'base_entry',
                      'content',
                      'id',
                      'collectionId',
                      'collectionName',
                      'type'
                    ]
                  },
                  {
                    type: 'object',
                    properties: {
                      image: {
                        type: 'string'
                      },
                      base_entry: {
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
                      },
                      type: {
                        type: 'string',
                        const: 'image'
                      },
                      child: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string'
                          },
                          collectionId: {
                            type: 'string'
                          }
                        },
                        required: ['id', 'collectionId']
                      }
                    },
                    required: [
                      'image',
                      'base_entry',
                      'id',
                      'collectionId',
                      'collectionName',
                      'type',
                      'child'
                    ]
                  },
                  {
                    type: 'object',
                    properties: {
                      link: {
                        type: 'string',
                        format: 'uri'
                      },
                      base_entry: {
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
                      },
                      type: {
                        type: 'string',
                        const: 'link'
                      }
                    },
                    required: [
                      'link',
                      'base_entry',
                      'id',
                      'collectionId',
                      'collectionName',
                      'type'
                    ]
                  }
                ]
              }
            ]
          }
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        },
        NOT_FOUND: true
      }
    },
    moveTo: {
      method: 'post',
      description: 'Move an idea to another folder',
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
            target: {
              type: 'string'
            }
          },
          required: ['target'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true,
        NOT_FOUND: true
      }
    },
    pin: {
      method: 'post',
      description: 'Toggle pin status of an idea',
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
            type: {
              type: 'string',
              enum: ['text', 'image', 'link']
            },
            container: {
              type: 'string'
            },
            folder: {
              type: 'string'
            },
            pinned: {
              type: 'boolean'
            },
            archived: {
              type: 'boolean'
            },
            tags: {},
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
            'type',
            'container',
            'folder',
            'pinned',
            'archived',
            'tags',
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
    remove: {
      method: 'post',
      description: 'Delete an idea',
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
    removeFromParent: {
      method: 'post',
      description: 'Move idea to parent folder',
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
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        },
        NOT_FOUND: true
      }
    },
    update: {
      method: 'post',
      description: 'Update an existing idea',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: {
        image: {
          optional: true
        }
      },
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
          allOf: [
            {
              type: 'object',
              properties: {
                tags: {},
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
              required: ['tags', 'id', 'collectionId', 'collectionName']
            },
            {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    content: {
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
                    },
                    type: {
                      type: 'string',
                      const: 'text'
                    }
                  },
                  required: [
                    'content',
                    'id',
                    'collectionId',
                    'collectionName',
                    'type'
                  ]
                },
                {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string'
                    },
                    collectionId: {
                      type: 'string'
                    },
                    collectionName: {
                      type: 'string'
                    },
                    type: {
                      type: 'string',
                      const: 'image'
                    }
                  },
                  required: ['id', 'collectionId', 'collectionName', 'type']
                },
                {
                  type: 'object',
                  properties: {
                    link: {
                      type: 'string',
                      format: 'uri'
                    },
                    id: {
                      type: 'string'
                    },
                    collectionId: {
                      type: 'string'
                    },
                    collectionName: {
                      type: 'string'
                    },
                    type: {
                      type: 'string',
                      const: 'link'
                    }
                  },
                  required: [
                    'link',
                    'id',
                    'collectionId',
                    'collectionName',
                    'type'
                  ]
                }
              ]
            }
          ]
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['text', 'image', 'link']
            },
            container: {
              type: 'string'
            },
            folder: {
              type: 'string'
            },
            pinned: {
              type: 'boolean'
            },
            archived: {
              type: 'boolean'
            },
            tags: {},
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
            'type',
            'container',
            'folder',
            'pinned',
            'archived',
            'tags',
            'created',
            'updated',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        },
        NOT_FOUND: true
      }
    }
  },
  tags: {
    create: {
      method: 'post',
      description: 'Create a new tag',
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
            },
            container: {
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
            'container',
            'id',
            'collectionId',
            'collectionName'
          ],
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
            container: {
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
            'container',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    list: {
      method: 'get',
      description: 'Get all tags in a container',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            }
          },
          required: ['container'],
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
              name: {
                type: 'string'
              },
              color: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              container: {
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
              'container',
              'amount',
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
      description: 'Delete a tag',
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
      description: 'Update an existing tag',
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
            container: {
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
            'container',
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
  misc: {
    checkValid: {
      method: 'get',
      description: 'Validate if a folder path exists',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            },
            path: {
              type: 'string'
            }
          },
          required: ['container', 'path'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'boolean'
        }
      }
    },
    getOgData: {
      method: 'get',
      description: 'Get Open Graph metadata for a link entry',
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
          $schema: 'https://json-schema.org/draft/2020-12/schema'
        },
        NOT_FOUND: true
      }
    },
    getPath: {
      method: 'get',
      description: 'Get path information for a container or folder',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'string'
            },
            folder: {
              type: 'string'
            }
          },
          required: ['container'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            container: {
              type: 'object',
              properties: {
                icon: {
                  type: 'string'
                },
                color: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                cover: {
                  type: 'string'
                },
                pinned: {
                  type: 'boolean'
                },
                hidden: {
                  type: 'boolean'
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
                'icon',
                'color',
                'name',
                'cover',
                'pinned',
                'hidden',
                'id',
                'collectionId',
                'collectionName'
              ],
              additionalProperties: false
            },
            route: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  container: {
                    type: 'string'
                  },
                  name: {
                    type: 'string'
                  },
                  color: {
                    type: 'string'
                  },
                  icon: {
                    type: 'string'
                  },
                  parent: {
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
                  'container',
                  'name',
                  'color',
                  'icon',
                  'parent',
                  'id',
                  'collectionId',
                  'collectionName'
                ],
                additionalProperties: false
              }
            }
          },
          required: ['container', 'route'],
          additionalProperties: false
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        },
        NOT_FOUND: true
      }
    },
    search: {
      method: 'get',
      description: 'Search entries in a container',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            q: {
              type: 'string'
            },
            container: {
              type: 'string'
            },
            tags: {
              type: 'string'
            },
            folder: {
              type: 'string'
            }
          },
          required: ['q', 'container'],
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
                const: 'text'
              },
              container: {
                type: 'string'
              },
              folder: {
                type: 'string'
              },
              pinned: {
                type: 'boolean'
              },
              archived: {
                type: 'boolean'
              },
              tags: {},
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
              },
              content: {
                type: 'string'
              },
              fullPath: {
                type: 'string'
              },
              expand: {
                type: 'object',
                properties: {
                  folder: {
                    type: 'object',
                    properties: {
                      container: {
                        type: 'string'
                      },
                      name: {
                        type: 'string'
                      },
                      color: {
                        type: 'string'
                      },
                      icon: {
                        type: 'string'
                      },
                      parent: {
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
                      'container',
                      'name',
                      'color',
                      'icon',
                      'parent',
                      'id',
                      'collectionId',
                      'collectionName'
                    ],
                    additionalProperties: false
                  }
                },
                additionalProperties: false
              }
            },
            required: [
              'type',
              'container',
              'folder',
              'pinned',
              'archived',
              'tags',
              'created',
              'updated',
              'id',
              'collectionId',
              'collectionName',
              'content',
              'fullPath',
              'expand'
            ],
            additionalProperties: false
          }
        },
        NOT_FOUND: true
      }
    }
  }
} as const

export default contract
