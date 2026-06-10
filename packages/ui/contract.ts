export const contract = {
  '': {
    method: 'get',
    description: 'Welcome to LifeForge API',
    noAuth: true,
    encrypted: false,
    isDownloadable: false,
    media: null,
    input: {},
    output: {
      OK: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'string',
        const: 'Get ready to forge your life!'
      }
    }
  },
  locales: {
    listLanguages: {
      method: 'get',
      description: 'List all languages',
      noAuth: true,
      encrypted: false,
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
              alternative: {
                type: 'array',
                items: {
                  type: 'string'
                }
              },
              icon: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              }
            },
            required: ['name', 'icon', 'displayName'],
            additionalProperties: false
          }
        }
      }
    },
    getLocale: {
      method: 'get',
      description: 'Retrieve localization strings for namespace',
      noAuth: true,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            lang: {
              type: 'string'
            },
            namespace: {
              type: 'string',
              enum: ['apps', 'common']
            },
            subnamespace: {
              type: 'string'
            }
          },
          required: ['lang', 'namespace', 'subnamespace'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          additionalProperties: {}
        },
        NOT_FOUND: true
      }
    },
    notifyMissing: {
      method: 'post',
      description: 'Report missing localization key',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            namespace: {
              type: 'string'
            },
            key: {
              type: 'string'
            }
          },
          required: ['namespace', 'key'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true
      }
    }
  },
  user: {
    exists: {
      method: 'get',
      description: 'Check if user exists',
      noAuth: true,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {},
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'boolean'
        }
      }
    },
    auth: {
      createFirstUser: {
        method: 'post',
        description: 'Create the first user (only works when no users exist)',
        noAuth: true,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                pattern:
                  "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
              },
              username: {
                type: 'string',
                minLength: 3
              },
              name: {
                type: 'string',
                minLength: 1
              },
              password: {
                type: 'string',
                minLength: 8
              }
            },
            required: ['email', 'username', 'name', 'password'],
            additionalProperties: false
          }
        },
        output: {
          CREATED: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              state: {
                type: 'string',
                const: 'success'
              }
            },
            required: ['state'],
            additionalProperties: false
          },
          BAD_REQUEST: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      },
      generateOTP: {
        method: 'get',
        description: 'Generate one-time password',
        noAuth: false,
        encrypted: false,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      },
      getUserData: {
        method: 'get',
        description: 'Get current user data',
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
              email: {
                type: 'string',
                format: 'email',
                pattern:
                  "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
              },
              emailVisibility: {
                type: 'boolean'
              },
              verified: {
                type: 'boolean'
              },
              username: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              avatar: {
                type: 'string'
              },
              dateOfBirth: {
                type: 'string'
              },
              theme: {
                type: 'string',
                enum: ['system', 'light', 'dark']
              },
              color: {
                type: 'string'
              },
              bgTemp: {
                type: 'string'
              },
              bgImage: {
                type: 'string'
              },
              backdropFilters: {},
              fontFamily: {
                type: 'string'
              },
              language: {
                type: 'string'
              },
              dashboardLayout: {},
              fontScale: {
                type: 'number'
              },
              pinnedFontFamilies: {},
              borderRadiusMultiplier: {
                type: 'number'
              },
              bordered: {
                type: 'boolean'
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
              },
              hasMasterPassword: {
                type: 'boolean'
              },
              hasJournalMasterPassword: {
                type: 'boolean'
              },
              hasAPIKeysMasterPassword: {
                type: 'boolean'
              },
              twoFAEnabled: {
                type: 'boolean'
              }
            },
            required: [
              'email',
              'emailVisibility',
              'verified',
              'username',
              'name',
              'avatar',
              'dateOfBirth',
              'theme',
              'color',
              'bgTemp',
              'bgImage',
              'backdropFilters',
              'fontFamily',
              'language',
              'dashboardLayout',
              'fontScale',
              'pinnedFontFamilies',
              'borderRadiusMultiplier',
              'bordered',
              'created',
              'updated',
              'id',
              'collectionId',
              'collectionName',
              'hasMasterPassword',
              'hasJournalMasterPassword',
              'hasAPIKeysMasterPassword',
              'twoFAEnabled'
            ],
            additionalProperties: false
          },
          NOT_FOUND: true
        }
      },
      login: {
        method: 'post',
        description: 'Authenticate user with credentials',
        noAuth: true,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            },
            required: ['email', 'password'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            anyOf: [
              {
                type: 'object',
                properties: {
                  state: {
                    type: 'string',
                    const: '2fa_required'
                  },
                  tid: {
                    type: 'string'
                  }
                },
                required: ['state', 'tid'],
                additionalProperties: false
              },
              {
                type: 'object',
                properties: {
                  state: {
                    type: 'string',
                    const: 'success'
                  },
                  session: {
                    type: 'string'
                  }
                },
                required: ['state', 'session'],
                additionalProperties: false
              }
            ]
          },
          UNAUTHORIZED: true
        }
      },
      validateOTP: {
        method: 'post',
        description: 'Verify one-time password',
        noAuth: false,
        encrypted: false,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              otp: {
                type: 'string'
              },
              otpId: {
                type: 'string'
              }
            },
            required: ['otp', 'otpId'],
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
      verifySessionToken: {
        method: 'post',
        description: 'Validate user session token',
        noAuth: false,
        encrypted: false,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'boolean'
          },
          UNAUTHORIZED: true
        }
      }
    },
    oauth: {
      getEndpoint: {
        method: 'get',
        description: 'Get OAuth authorization URL for provider',
        noAuth: true,
        encrypted: false,
        isDownloadable: false,
        media: null,
        input: {
          query: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              provider: {
                type: 'string'
              }
            },
            required: ['provider'],
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
              state: {
                type: 'string'
              },
              codeVerifier: {
                type: 'string'
              },
              codeChallenge: {
                type: 'string'
              },
              codeChallengeMethod: {
                type: 'string'
              },
              authURL: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              }
            },
            required: [
              'name',
              'state',
              'codeVerifier',
              'codeChallenge',
              'codeChallengeMethod',
              'authURL',
              'displayName'
            ],
            additionalProperties: false
          },
          BAD_REQUEST: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      },
      listProviders: {
        method: 'get',
        description: 'Retrieve available OAuth providers',
        noAuth: true,
        encrypted: false,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      },
      verify: {
        method: 'post',
        description: 'Verify OAuth authorization callback',
        noAuth: true,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              provider: {
                type: 'string'
              },
              code: {
                type: 'string'
              }
            },
            required: ['provider', 'code'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            anyOf: [
              {
                type: 'object',
                properties: {
                  state: {
                    type: 'string',
                    const: '2fa_required'
                  },
                  tid: {
                    type: 'string'
                  }
                },
                required: ['state', 'tid'],
                additionalProperties: false
              },
              {
                type: 'string'
              }
            ]
          },
          UNAUTHORIZED: true,
          BAD_REQUEST: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      }
    },
    '2fa': {
      disable: {
        method: 'post',
        description: 'Disable two-factor authentication',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          NO_CONTENT: true
        }
      },
      generateAuthenticatorLink: {
        method: 'get',
        description: 'Generate authenticator app setup link',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      },
      getChallenge: {
        method: 'get',
        description: 'Retrieve 2FA challenge token',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      },
      requestOTP: {
        method: 'get',
        description: 'Request OTP for two-factor authentication',
        noAuth: true,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          query: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                pattern:
                  "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
              }
            },
            required: ['email'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          },
          BAD_REQUEST: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      },
      verify: {
        method: 'post',
        description: 'Verify two-factor authentication code',
        noAuth: true,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              otp: {
                type: 'string'
              },
              tid: {
                type: 'string'
              },
              type: {
                type: 'string',
                enum: ['email', 'app']
              }
            },
            required: ['otp', 'tid', 'type'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              session: {
                type: 'string'
              }
            },
            required: ['session'],
            additionalProperties: false
          },
          UNAUTHORIZED: true
        }
      },
      verifyAndEnable: {
        method: 'post',
        description: 'Verify and activate two-factor authentication',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              otp: {
                type: 'string'
              }
            },
            required: ['otp'],
            additionalProperties: false
          }
        },
        output: {
          NO_CONTENT: true,
          UNAUTHORIZED: true
        }
      }
    },
    qrLogin: {
      approveQRLogin: {
        method: 'post',
        description: 'Approve a QR login request',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                format: 'uuid',
                pattern:
                  '^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$'
              }
            },
            required: ['sessionId'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              success: {
                type: 'boolean'
              },
              browserInfo: {
                type: 'string'
              }
            },
            required: ['success', 'browserInfo'],
            additionalProperties: false
          },
          NOT_FOUND: true,
          BAD_REQUEST: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      },
      checkQRSessionStatus: {
        method: 'get',
        description: 'Check QR login session status',
        noAuth: true,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          query: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                format: 'uuid',
                pattern:
                  '^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$'
              }
            },
            required: ['sessionId'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            anyOf: [
              {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    const: 'not_found'
                  }
                },
                required: ['status'],
                additionalProperties: false
              },
              {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    const: 'expired'
                  }
                },
                required: ['status'],
                additionalProperties: false
              },
              {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    const: 'approved'
                  },
                  session: {
                    type: 'string'
                  }
                },
                required: ['status', 'session'],
                additionalProperties: false
              },
              {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    const: 'pending'
                  },
                  expiresAt: {
                    type: 'string'
                  }
                },
                required: ['status', 'expiresAt'],
                additionalProperties: false
              }
            ]
          }
        }
      },
      registerQRSession: {
        method: 'post',
        description: 'Register a new QR login session',
        noAuth: true,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                format: 'uuid',
                pattern:
                  '^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$'
              },
              browserInfo: {
                type: 'string'
              }
            },
            required: ['sessionId', 'browserInfo'],
            additionalProperties: false
          }
        },
        output: {
          CREATED: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              sessionId: {
                type: 'string'
              },
              expiresAt: {
                type: 'string'
              }
            },
            required: ['sessionId', 'expiresAt'],
            additionalProperties: false
          },
          BAD_REQUEST: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      }
    },
    settings: {
      deleteAvatar: {
        method: 'post',
        description: 'Remove user avatar',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          NO_CONTENT: true
        }
      },
      requestPasswordReset: {
        method: 'post',
        description: 'Request password reset email',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          NO_CONTENT: true
        }
      },
      updateAvatar: {
        method: 'post',
        description: 'Upload new user avatar',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: {
          file: {
            optional: false
          }
        },
        input: {},
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      },
      updateProfile: {
        method: 'post',
        description: 'Update user profile information',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                    pattern: '^[a-zA-Z0-9]+$'
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    pattern:
                      "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
                  },
                  name: {
                    type: 'string'
                  },
                  dateOfBirth: {
                    type: 'string'
                  }
                },
                additionalProperties: false
              }
            },
            required: ['data'],
            additionalProperties: false
          }
        },
        output: {
          NO_CONTENT: true
        }
      }
    },
    personalization: {
      deleteBgImage: {
        method: 'post',
        description: 'Remove background image',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          NO_CONTENT: true
        }
      },
      getGoogleFont: {
        method: 'get',
        description: 'Get details of a specific Google Font',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          query: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              family: {
                type: 'string'
              }
            },
            required: ['family'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              enabled: {
                type: 'boolean'
              },
              items: {}
            },
            required: ['enabled'],
            additionalProperties: false
          }
        }
      },
      listGoogleFonts: {
        method: 'get',
        description: 'Retrieve available Google Fonts',
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
              enabled: {
                type: 'boolean'
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    family: {
                      type: 'string'
                    },
                    variants: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    },
                    subsets: {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    },
                    version: {
                      type: 'string'
                    },
                    lastModified: {
                      type: 'string'
                    },
                    files: {
                      type: 'object',
                      properties: {
                        '100': {
                          type: 'string'
                        },
                        '200': {
                          type: 'string'
                        },
                        '300': {
                          type: 'string'
                        },
                        '500': {
                          type: 'string'
                        },
                        '600': {
                          type: 'string'
                        },
                        '700': {
                          type: 'string'
                        },
                        '800': {
                          type: 'string'
                        },
                        '900': {
                          type: 'string'
                        },
                        regular: {
                          type: 'string'
                        },
                        italic: {
                          type: 'string'
                        },
                        '100italic': {
                          type: 'string'
                        },
                        '200italic': {
                          type: 'string'
                        },
                        '300italic': {
                          type: 'string'
                        },
                        '500italic': {
                          type: 'string'
                        },
                        '600italic': {
                          type: 'string'
                        },
                        '700italic': {
                          type: 'string'
                        },
                        '800italic': {
                          type: 'string'
                        },
                        '900italic': {
                          type: 'string'
                        }
                      },
                      additionalProperties: false
                    },
                    category: {
                      type: 'string',
                      enum: [
                        'display',
                        'handwriting',
                        'monospace',
                        'sans-serif',
                        'serif'
                      ]
                    },
                    kind: {
                      type: 'string',
                      const: 'webfonts#webfont'
                    },
                    menu: {
                      type: 'string'
                    },
                    colorCapabilities: {
                      type: 'array',
                      items: {
                        type: 'string',
                        enum: ['COLRv0', 'COLRv1', 'SVG']
                      }
                    }
                  },
                  required: [
                    'family',
                    'variants',
                    'subsets',
                    'version',
                    'lastModified',
                    'files',
                    'category',
                    'kind',
                    'menu'
                  ],
                  additionalProperties: false
                }
              }
            },
            required: ['enabled', 'items'],
            additionalProperties: false
          }
        }
      },
      listGoogleFontsPin: {
        method: 'get',
        description: 'Retrieve pinned Google Fonts',
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
              type: 'string'
            }
          },
          UNAUTHORIZED: true
        }
      },
      toggleGoogleFontsPin: {
        method: 'post',
        description: 'Pin or unpin a Google Font',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              family: {
                type: 'string'
              }
            },
            required: ['family'],
            additionalProperties: false
          }
        },
        output: {
          NO_CONTENT: true,
          UNAUTHORIZED: true
        }
      },
      updateBgImage: {
        method: 'post',
        description: 'Upload new background image',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: {
          file: {
            optional: false
          }
        },
        input: {},
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              collectionId: {
                type: 'string'
              },
              recordId: {
                type: 'string'
              },
              fieldId: {
                type: 'string'
              }
            },
            required: ['collectionId', 'recordId', 'fieldId'],
            additionalProperties: false
          }
        }
      },
      updatePersonalization: {
        method: 'post',
        description: 'Update user personalization preferences',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  fontFamily: {
                    type: 'string'
                  },
                  theme: {
                    type: 'string'
                  },
                  color: {
                    type: 'string'
                  },
                  bgTemp: {
                    type: 'string'
                  },
                  language: {
                    type: 'string'
                  },
                  fontScale: {
                    type: 'number'
                  },
                  borderRadiusMultiplier: {
                    type: 'number'
                  },
                  bordered: {
                    type: 'boolean'
                  },
                  dashboardLayout: {
                    type: 'object',
                    additionalProperties: {}
                  },
                  backdropFilters: {
                    type: 'object',
                    additionalProperties: {}
                  }
                },
                additionalProperties: false
              }
            },
            required: ['data'],
            additionalProperties: false
          }
        },
        output: {
          NO_CONTENT: true,
          BAD_REQUEST: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      }
    },
    customFonts: {
      get: {
        method: 'get',
        description: 'Get a specific custom font by ID',
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
              id: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              },
              family: {
                type: 'string'
              },
              weight: {
                type: 'number'
              },
              file: {
                type: 'string'
              },
              collectionId: {
                type: 'string'
              }
            },
            required: [
              'id',
              'displayName',
              'family',
              'weight',
              'file',
              'collectionId'
            ],
            additionalProperties: false
          },
          NOT_FOUND: true
        }
      },
      list: {
        method: 'get',
        description: 'List all custom uploaded fonts',
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
                id: {
                  type: 'string'
                },
                displayName: {
                  type: 'string'
                },
                family: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                },
                file: {
                  type: 'string'
                },
                collectionId: {
                  type: 'string'
                }
              },
              required: [
                'id',
                'displayName',
                'family',
                'weight',
                'file',
                'collectionId'
              ],
              additionalProperties: false
            }
          }
        }
      },
      remove: {
        method: 'post',
        description: 'Delete a custom font',
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
      upload: {
        method: 'post',
        description: 'Upload a new custom font',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: {
          file: {
            optional: false
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
            additionalProperties: false
          },
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              displayName: {
                type: 'string',
                minLength: 1
              },
              family: {
                type: 'string',
                minLength: 1
              },
              weight: {
                default: 400,
                type: 'number',
                minimum: 100,
                maximum: 900
              }
            },
            required: ['displayName', 'family', 'weight'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              },
              family: {
                type: 'string'
              },
              weight: {
                type: 'number'
              },
              file: {
                type: 'string'
              },
              collectionId: {
                type: 'string'
              }
            },
            required: [
              'id',
              'displayName',
              'family',
              'weight',
              'file',
              'collectionId'
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
    }
  },
  apiKeys: {
    entries: {
      get: {
        method: 'get',
        description:
          'Retrieve API key by key ID. Only exposable keys can be retrieved.',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          query: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              keyId: {
                type: 'string'
              }
            },
            required: ['keyId'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            anyOf: [
              {
                type: 'string'
              },
              {
                type: 'null'
              }
            ]
          },
          FORBIDDEN: true
        }
      },
      list: {
        method: 'get',
        description: 'Retrieve all API key entries',
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
                keyId: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                key: {
                  type: 'string'
                },
                exposable: {
                  type: 'boolean'
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
                'keyId',
                'name',
                'icon',
                'key',
                'exposable',
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
      checkKeys: {
        method: 'get',
        description: 'Verify if API keys exist',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          query: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              keys: {
                type: 'string'
              }
            },
            required: ['keys'],
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
      create: {
        method: 'post',
        description: 'Create a new API key entry',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              keyId: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              key: {
                type: 'string'
              },
              exposable: {
                type: 'boolean'
              }
            },
            required: ['keyId', 'name', 'icon', 'key', 'exposable'],
            additionalProperties: false
          }
        },
        output: {
          CREATED: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              keyId: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              key: {
                type: 'string'
              },
              exposable: {
                type: 'boolean'
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
              'keyId',
              'name',
              'icon',
              'key',
              'exposable',
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
        description: 'Update an existing API key entry',
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
              keyId: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              key: {
                type: 'string'
              },
              exposable: {
                type: 'boolean'
              },
              overrideKey: {
                type: 'boolean'
              }
            },
            required: [
              'keyId',
              'name',
              'icon',
              'key',
              'exposable',
              'overrideKey'
            ],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              keyId: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              key: {
                type: 'string'
              },
              exposable: {
                type: 'boolean'
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
              'keyId',
              'name',
              'icon',
              'key',
              'exposable',
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
        description: 'Delete an API key entry',
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
      }
    }
  },
  pixabay: {
    searchImages: {
      method: 'get',
      description: 'Search for images on Pixabay',
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
              type: 'string',
              minLength: 1
            },
            page: {
              default: '1',
              type: 'string'
            },
            type: {
              default: 'all',
              type: 'string',
              enum: ['all', 'photo', 'illustration', 'vector']
            },
            category: {
              type: 'string',
              enum: [
                'backgrounds',
                'fashion',
                'nature',
                'science',
                'education',
                'feelings',
                'health',
                'people',
                'religion',
                'places',
                'animals',
                'industry',
                'computer',
                'food',
                'sports',
                'transportation',
                'travel',
                'buildings',
                'business',
                'music'
              ]
            },
            colors: {
              anyOf: [
                {
                  type: 'string',
                  enum: [
                    'grayscale',
                    'transparent',
                    'red',
                    'orange',
                    'yellow',
                    'green',
                    'turquoise',
                    'blue',
                    'lilac',
                    'pink',
                    'white',
                    'gray',
                    'black',
                    'brown'
                  ]
                },
                {
                  type: 'null'
                }
              ]
            },
            editors_choice: {
              default: 'false',
              type: 'string',
              enum: ['true', 'false']
            }
          },
          required: ['q', 'page', 'type', 'editors_choice'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            total: {
              type: 'number'
            },
            hits: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string'
                  },
                  thumbnail: {
                    type: 'object',
                    properties: {
                      url: {
                        type: 'string'
                      },
                      width: {
                        type: 'number'
                      },
                      height: {
                        type: 'number'
                      }
                    },
                    required: ['url', 'width', 'height'],
                    additionalProperties: false
                  },
                  imageURL: {
                    type: 'string'
                  }
                },
                required: ['id', 'thumbnail', 'imageURL'],
                additionalProperties: false
              }
            }
          },
          required: ['total', 'hits'],
          additionalProperties: false
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        }
      }
    }
  },
  locations: {
    search: {
      method: 'get',
      description: 'Search for locations using Google Places API',
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
            }
          },
          required: ['q'],
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
              formattedAddress: {
                type: 'string'
              },
              location: {
                type: 'object',
                properties: {
                  latitude: {
                    type: 'number'
                  },
                  longitude: {
                    type: 'number'
                  }
                },
                required: ['latitude', 'longitude'],
                additionalProperties: false
              }
            },
            required: ['name', 'formattedAddress', 'location'],
            additionalProperties: false
          }
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        }
      }
    }
  },
  backups: {
    list: {
      method: 'get',
      description: 'Retrieve all database backups',
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
              key: {
                type: 'string'
              },
              size: {
                type: 'number'
              },
              modified: {
                type: 'string'
              }
            },
            required: ['key', 'size', 'modified'],
            additionalProperties: false
          }
        }
      }
    },
    download: {
      method: 'get',
      description: 'Download a database backup file',
      noAuth: false,
      encrypted: true,
      isDownloadable: true,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            key: {
              type: 'string'
            }
          },
          required: ['key'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true,
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        }
      }
    },
    create: {
      method: 'post',
      description: 'Create a new database backup',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            backupName: {
              type: 'string'
            }
          },
          additionalProperties: false
        }
      },
      output: {
        CREATED: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'null'
        }
      }
    },
    remove: {
      method: 'post',
      description: 'Delete a database backup',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            key: {
              type: 'string'
            }
          },
          required: ['key'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true
      }
    }
  },
  database: {
    collections: {
      list: {
        method: 'get',
        description: 'Retrieve all database collections',
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
                type: {
                  type: 'string',
                  enum: ['base', 'view']
                },
                fields: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string'
                      },
                      type: {
                        type: 'string'
                      },
                      optional: {
                        type: 'boolean'
                      },
                      options: {
                        type: 'array',
                        items: {
                          type: 'string'
                        }
                      }
                    },
                    required: ['name', 'type', 'optional'],
                    additionalProperties: false
                  }
                }
              },
              required: ['name', 'type', 'fields'],
              additionalProperties: false
            }
          }
        }
      }
    }
  },
  modules: {
    checkModuleAvailability: {
      method: 'get',
      description: 'Check if a module is available (installed)',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            moduleId: {
              type: 'string',
              minLength: 1
            }
          },
          required: ['moduleId'],
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
    list: {
      method: 'get',
      description: 'List installed modules with metadata',
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
              moduleId: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              },
              version: {
                type: 'string'
              },
              description: {
                type: 'string'
              },
              author: {
                type: 'string'
              },
              icon: {
                type: 'string'
              },
              category: {
                type: 'string'
              },
              isInternal: {
                type: 'boolean'
              },
              isDevMode: {
                type: 'boolean'
              },
              hasDist: {
                type: 'boolean'
              },
              hasSource: {
                type: 'boolean'
              }
            },
            required: [
              'name',
              'moduleId',
              'displayName',
              'version',
              'description',
              'author',
              'icon',
              'category',
              'isInternal',
              'isDevMode',
              'hasDist',
              'hasSource'
            ],
            additionalProperties: false
          }
        }
      }
    },
    manifest: {
      method: 'get',
      description: 'Get installed modules manifest for runtime loading',
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
            modules: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  },
                  moduleId: {
                    type: 'string'
                  },
                  displayName: {
                    type: 'string'
                  },
                  version: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  },
                  author: {
                    type: 'string'
                  },
                  icon: {
                    type: 'string'
                  },
                  category: {
                    type: 'string'
                  },
                  remoteEntryUrl: {
                    type: 'string'
                  },
                  isInternal: {
                    type: 'boolean'
                  },
                  isDevMode: {
                    type: 'boolean'
                  },
                  APIKeyAccess: {
                    type: 'object',
                    additionalProperties: {
                      type: 'object',
                      properties: {
                        usage: {
                          type: 'string'
                        },
                        required: {
                          type: 'boolean'
                        }
                      },
                      required: ['usage', 'required'],
                      additionalProperties: false
                    }
                  }
                },
                required: [
                  'name',
                  'moduleId',
                  'displayName',
                  'version',
                  'description',
                  'author',
                  'icon',
                  'category',
                  'remoteEntryUrl',
                  'isInternal'
                ],
                additionalProperties: false
              }
            }
          },
          required: ['modules'],
          additionalProperties: false
        }
      }
    },
    uninstall: {
      method: 'post',
      description: 'Uninstall a module',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            moduleName: {
              type: 'string',
              minLength: 1
            }
          },
          required: ['moduleName'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            error: {
              type: 'string'
            }
          },
          required: ['success'],
          additionalProperties: false
        }
      }
    },
    categories: {
      aiTranslate: {
        method: 'post',
        description: 'Translate a specific category into desired languages',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              key: {
                type: 'string'
              },
              languages: {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            },
            required: ['key', 'languages'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            anyOf: [
              {
                type: 'object',
                additionalProperties: {
                  type: 'string'
                }
              },
              {
                type: 'null'
              }
            ]
          }
        }
      },
      list: {
        method: 'get',
        description: 'Get the category display order',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {},
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            additionalProperties: {
              type: 'object',
              additionalProperties: {
                type: 'string'
              }
            }
          }
        }
      },
      update: {
        method: 'post',
        description: 'Update the category display order',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              data: {
                type: 'object',
                additionalProperties: {
                  type: 'object',
                  additionalProperties: {
                    type: 'string'
                  }
                }
              }
            },
            required: ['data'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              success: {
                type: 'boolean'
              }
            },
            required: ['success'],
            additionalProperties: false
          }
        }
      }
    },
    devMode: {
      toggle: {
        method: 'post',
        description: 'Toggle dev mode for a module',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              moduleName: {
                type: 'string',
                minLength: 1
              }
            },
            required: ['moduleName'],
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
    }
  },
  ai: {
    imageGeneration: {
      generateImage: {
        method: 'post',
        description: 'Generate image from text prompt using AI',
        noAuth: false,
        encrypted: true,
        isDownloadable: false,
        media: null,
        input: {
          body: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                minLength: 1
              }
            },
            required: ['prompt'],
            additionalProperties: false
          }
        },
        output: {
          OK: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          },
          BAD_REQUEST: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string'
          }
        }
      }
    }
  },
  ping: {
    method: 'post',
    description: 'Ping the server',
    noAuth: true,
    encrypted: false,
    isDownloadable: false,
    media: null,
    input: {
      body: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        properties: {
          timestamp: {
            type: 'number',
            minimum: 0
          }
        },
        required: ['timestamp'],
        additionalProperties: false
      }
    },
    output: {
      OK: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'string'
      }
    }
  },
  status: {
    method: 'get',
    description: 'Get server status',
    noAuth: true,
    encrypted: false,
    isDownloadable: false,
    media: null,
    input: {},
    output: {
      OK: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        properties: {
          environment: {
            type: 'string'
          }
        },
        required: ['environment'],
        additionalProperties: false
      }
    }
  },
  media: {
    method: 'get',
    description: 'Retrieve media file from PocketBase',
    noAuth: true,
    encrypted: false,
    isDownloadable: false,
    media: null,
    input: {
      query: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        properties: {
          collectionId: {
            type: 'string'
          },
          recordId: {
            type: 'string'
          },
          fieldId: {
            type: 'string'
          },
          thumb: {
            type: 'string'
          },
          token: {
            type: 'string'
          }
        },
        required: ['collectionId', 'recordId', 'fieldId'],
        additionalProperties: false
      }
    },
    output: 'custom'
  },
  corsAnywhere: {
    method: 'get',
    description: 'CORS Anywhere - Fetch external URL content',
    noAuth: false,
    encrypted: true,
    isDownloadable: false,
    media: null,
    input: {
      query: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        properties: {
          url: {
            type: 'string',
            format: 'uri'
          }
        },
        required: ['url'],
        additionalProperties: false
      }
    },
    output: {
      OK: {
        $schema: 'https://json-schema.org/draft/2020-12/schema'
      },
      BAD_REQUEST: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'string'
      }
    }
  },
  encryptionPublicKey: {
    method: 'get',
    description: 'Get server public key for end-to-end encryption',
    noAuth: true,
    encrypted: false,
    isDownloadable: false,
    media: null,
    input: {},
    output: {
      OK: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'string'
      }
    }
  }
} as const

export default contract
