export const contract = {
  entries: {
    listByListId: {
      method: 'get',
      description: 'Get wishlist entries by list ID',
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
            },
            bought: {
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
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              url: {
                type: 'string'
              },
              price: {
                type: 'number'
              },
              image: {
                type: 'string'
              },
              list: {
                type: 'string'
              },
              bought: {
                type: 'boolean'
              },
              bought_at: {
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
              'name',
              'url',
              'price',
              'image',
              'list',
              'bought',
              'bought_at',
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
    scrapeExternal: {
      method: 'post',
      description: 'Scrape external website for wishlist entry data',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            url: {
              type: 'string'
            },
            provider: {
              type: 'string'
            }
          },
          required: ['url', 'provider'],
          additionalProperties: false
        }
      },
      output: {
        OK: {}
      }
    },
    create: {
      method: 'post',
      description: 'Create a new wishlist entry',
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
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            url: {
              type: 'string'
            },
            price: {
              type: 'number',
              minimum: 0
            },
            list: {
              type: 'string'
            }
          },
          required: ['name', 'url', 'price', 'list'],
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
            url: {
              type: 'string'
            },
            price: {
              type: 'number'
            },
            image: {
              type: 'string'
            },
            list: {
              type: 'string'
            },
            bought: {
              type: 'boolean'
            },
            bought_at: {
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
            'name',
            'url',
            'price',
            'image',
            'list',
            'bought',
            'bought_at',
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
      description: 'Update an existing wishlist entry',
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
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            url: {
              type: 'string'
            },
            price: {
              type: 'number',
              minimum: 0
            },
            list: {
              type: 'string'
            }
          },
          required: ['name', 'url', 'price', 'list'],
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
            url: {
              type: 'string'
            },
            price: {
              type: 'number'
            },
            image: {
              type: 'string'
            },
            list: {
              type: 'string'
            },
            bought: {
              type: 'boolean'
            },
            bought_at: {
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
            'name',
            'url',
            'price',
            'image',
            'list',
            'bought',
            'bought_at',
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
    updateBoughtStatus: {
      method: 'post',
      description: 'Update wishlist entry bought status',
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
            name: {
              type: 'string'
            },
            url: {
              type: 'string'
            },
            price: {
              type: 'number'
            },
            image: {
              type: 'string'
            },
            list: {
              type: 'string'
            },
            bought: {
              type: 'boolean'
            },
            bought_at: {
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
            'name',
            'url',
            'price',
            'image',
            'list',
            'bought',
            'bought_at',
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
    remove: {
      method: 'post',
      description: 'Delete a wishlist entry',
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
        NO_CONTENT: true
      }
    }
  },
  lists: {
    getById: {
      method: 'get',
      description: 'Get wishlist by ID',
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
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            icon: {
              type: 'string'
            },
            total_count: {
              type: 'number'
            },
            total_amount: {},
            bought_count: {
              type: 'number'
            },
            bought_amount: {},
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
            'description',
            'color',
            'icon',
            'total_count',
            'total_amount',
            'bought_count',
            'bought_amount',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      }
    },
    validate: {
      method: 'get',
      description: 'Check if wishlist exists',
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
          type: 'boolean'
        }
      }
    },
    list: {
      method: 'get',
      description: 'Get all wishlists with statistics',
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
              description: {
                type: 'string'
              },
              color: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              total_count: {
                type: 'number'
              },
              total_amount: {},
              bought_count: {
                type: 'number'
              },
              bought_amount: {},
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
              'description',
              'color',
              'icon',
              'total_count',
              'total_amount',
              'bought_count',
              'bought_amount',
              'id',
              'collectionId',
              'collectionName'
            ],
            additionalProperties: false
          }
        }
      }
    },
    create: {
      method: 'post',
      description: 'Create a new wishlist',
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
            description: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            icon: {
              type: 'string'
            }
          },
          required: ['name', 'description', 'color', 'icon'],
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
            description: {
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
            'description',
            'color',
            'icon',
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
      description: 'Update an existing wishlist',
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
            description: {
              type: 'string'
            },
            color: {
              type: 'string'
            },
            icon: {
              type: 'string'
            }
          },
          required: ['name', 'description', 'color', 'icon'],
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
            description: {
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
            'description',
            'color',
            'icon',
            'id',
            'collectionId',
            'collectionName'
          ],
          additionalProperties: false
        }
      }
    },
    remove: {
      method: 'post',
      description: 'Delete a wishlist',
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
        NO_CONTENT: true
      }
    }
  }
} as const

export default contract
