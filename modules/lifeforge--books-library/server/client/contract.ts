export const contract = {
  "entries": {
    "getEpubMetadata": {
      "method": "post",
      "description": "Get EPUB file metadata",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "document": {
          "optional": false,
          "multiple": false
        }
      },
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "isbn": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "authors": {
              "type": "string"
            },
            "publisher": {
              "type": "string"
            },
            "year_published": {
              "type": "string"
            }
          },
          "required": [
            "isbn",
            "title",
            "authors",
            "publisher",
            "year_published"
          ],
          "additionalProperties": false
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    },
    "list": {
      "method": "get",
      "description": "Get all book entries. If the user asks for books from a specific collection, retrieve the collection ID first. Read status mapping: 1=read, 2=reading, 3=unread. Use query field for book name searches.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "page": {
              "default": "1",
              "type": "string"
            },
            "collection": {
              "description": "Collection ID of the collection",
              "type": "string"
            },
            "language": {
              "type": "string"
            },
            "favourite": {
              "type": "string",
              "enum": [
                "true",
                "false"
              ]
            },
            "readStatus": {
              "type": "string",
              "enum": [
                "1",
                "2",
                "3"
              ]
            },
            "fileType": {
              "type": "string"
            },
            "query": {
              "type": "string"
            }
          },
          "required": [
            "page"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "page": {
              "type": "number"
            },
            "totalPages": {
              "type": "number"
            },
            "totalItems": {
              "type": "number"
            },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string"
                  },
                  "authors": {
                    "type": "string"
                  },
                  "md5": {
                    "type": "string"
                  },
                  "year_published": {
                    "type": "number"
                  },
                  "publisher": {
                    "type": "string"
                  },
                  "languages": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "collection": {
                    "type": "string"
                  },
                  "extension": {
                    "type": "string"
                  },
                  "edition": {
                    "type": "string"
                  },
                  "size": {
                    "type": "number"
                  },
                  "word_count": {
                    "type": "number"
                  },
                  "page_count": {
                    "type": "number"
                  },
                  "isbn": {
                    "type": "string"
                  },
                  "file": {
                    "type": "string"
                  },
                  "thumbnail": {
                    "type": "string"
                  },
                  "is_favourite": {
                    "type": "boolean"
                  },
                  "time_started": {
                    "type": "string"
                  },
                  "time_finished": {
                    "type": "string"
                  },
                  "read_status": {
                    "type": "string",
                    "enum": [
                      "read",
                      "unread",
                      "reading"
                    ]
                  },
                  "created": {
                    "type": "string"
                  },
                  "updated": {
                    "type": "string"
                  },
                  "id": {
                    "type": "string"
                  },
                  "collectionId": {
                    "type": "string"
                  },
                  "collectionName": {
                    "type": "string"
                  }
                },
                "required": [
                  "title",
                  "authors",
                  "md5",
                  "year_published",
                  "publisher",
                  "languages",
                  "collection",
                  "extension",
                  "edition",
                  "size",
                  "word_count",
                  "page_count",
                  "isbn",
                  "file",
                  "thumbnail",
                  "is_favourite",
                  "time_started",
                  "time_finished",
                  "read_status",
                  "created",
                  "updated",
                  "id",
                  "collectionId",
                  "collectionName"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "page",
            "totalPages",
            "totalItems",
            "items"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a book entry",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true,
        "NOT_FOUND": true
      }
    },
    "sendToKindle": {
      "method": "post",
      "description": "Send book to Kindle email",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "target": {
              "type": "string",
              "format": "email",
              "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
            }
          },
          "required": [
            "target"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "NOT_FOUND": true
      }
    },
    "toggleFavouriteStatus": {
      "method": "post",
      "description": "Toggle book favorite status",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "authors": {
              "type": "string"
            },
            "md5": {
              "type": "string"
            },
            "year_published": {
              "type": "number"
            },
            "publisher": {
              "type": "string"
            },
            "languages": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "collection": {
              "type": "string"
            },
            "extension": {
              "type": "string"
            },
            "edition": {
              "type": "string"
            },
            "size": {
              "type": "number"
            },
            "word_count": {
              "type": "number"
            },
            "page_count": {
              "type": "number"
            },
            "isbn": {
              "type": "string"
            },
            "file": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            },
            "is_favourite": {
              "type": "boolean"
            },
            "time_started": {
              "type": "string"
            },
            "time_finished": {
              "type": "string"
            },
            "read_status": {
              "type": "string",
              "enum": [
                "read",
                "unread",
                "reading"
              ]
            },
            "created": {
              "type": "string"
            },
            "updated": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "authors",
            "md5",
            "year_published",
            "publisher",
            "languages",
            "collection",
            "extension",
            "edition",
            "size",
            "word_count",
            "page_count",
            "isbn",
            "file",
            "thumbnail",
            "is_favourite",
            "time_started",
            "time_finished",
            "read_status",
            "created",
            "updated",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "toggleReadStatus": {
      "method": "post",
      "description": "Toggle book read status",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "authors": {
              "type": "string"
            },
            "md5": {
              "type": "string"
            },
            "year_published": {
              "type": "number"
            },
            "publisher": {
              "type": "string"
            },
            "languages": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "collection": {
              "type": "string"
            },
            "extension": {
              "type": "string"
            },
            "edition": {
              "type": "string"
            },
            "size": {
              "type": "number"
            },
            "word_count": {
              "type": "number"
            },
            "page_count": {
              "type": "number"
            },
            "isbn": {
              "type": "string"
            },
            "file": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            },
            "is_favourite": {
              "type": "boolean"
            },
            "time_started": {
              "type": "string"
            },
            "time_finished": {
              "type": "string"
            },
            "read_status": {
              "type": "string",
              "enum": [
                "read",
                "unread",
                "reading"
              ]
            },
            "created": {
              "type": "string"
            },
            "updated": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "authors",
            "md5",
            "year_published",
            "publisher",
            "languages",
            "collection",
            "extension",
            "edition",
            "size",
            "word_count",
            "page_count",
            "isbn",
            "file",
            "thumbnail",
            "is_favourite",
            "time_started",
            "time_finished",
            "read_status",
            "created",
            "updated",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update an existing book entry",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "authors": {
              "type": "string"
            },
            "edition": {
              "type": "string"
            },
            "languages": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "isbn": {
              "type": "string"
            },
            "publisher": {
              "type": "string"
            },
            "year_published": {
              "type": "number"
            },
            "collection": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "authors",
            "edition",
            "languages",
            "isbn",
            "publisher",
            "year_published"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "authors": {
              "type": "string"
            },
            "md5": {
              "type": "string"
            },
            "year_published": {
              "type": "number"
            },
            "publisher": {
              "type": "string"
            },
            "languages": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "collection": {
              "type": "string"
            },
            "extension": {
              "type": "string"
            },
            "edition": {
              "type": "string"
            },
            "size": {
              "type": "number"
            },
            "word_count": {
              "type": "number"
            },
            "page_count": {
              "type": "number"
            },
            "isbn": {
              "type": "string"
            },
            "file": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            },
            "is_favourite": {
              "type": "boolean"
            },
            "time_started": {
              "type": "string"
            },
            "time_finished": {
              "type": "string"
            },
            "read_status": {
              "type": "string",
              "enum": [
                "read",
                "unread",
                "reading"
              ]
            },
            "created": {
              "type": "string"
            },
            "updated": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "authors",
            "md5",
            "year_published",
            "publisher",
            "languages",
            "collection",
            "extension",
            "edition",
            "size",
            "word_count",
            "page_count",
            "isbn",
            "file",
            "thumbnail",
            "is_favourite",
            "time_started",
            "time_finished",
            "read_status",
            "created",
            "updated",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "upload": {
      "method": "post",
      "description": "Upload a new book to the library",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "file": {
          "optional": false,
          "multiple": false
        }
      },
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "authors": {
              "type": "string"
            },
            "edition": {
              "type": "string"
            },
            "size": {
              "type": "number"
            },
            "languages": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "extension": {
              "type": "string"
            },
            "isbn": {
              "type": "string"
            },
            "publisher": {
              "type": "string"
            },
            "year_published": {
              "type": "number"
            },
            "collection": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "authors",
            "edition",
            "size",
            "languages",
            "extension",
            "isbn",
            "publisher",
            "year_published"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    }
  },
  "collections": {
    "create": {
      "method": "post",
      "description": "Create a new book collection",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "Get all book collections. If the user asks to list books in a specific collection, call this tool first to get the collection ID.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "icon": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              },
              "id": {
                "type": "string"
              },
              "collectionId": {
                "type": "string"
              },
              "collectionName": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "icon",
              "amount",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a book collection",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true,
        "NOT_FOUND": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update an existing book collection",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    }
  },
  "languages": {
    "create": {
      "method": "post",
      "description": "Create a new book language",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "Get all book languages",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "icon": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              },
              "id": {
                "type": "string"
              },
              "collectionId": {
                "type": "string"
              },
              "collectionName": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "icon",
              "amount",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a book language",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true,
        "NOT_FOUND": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update an existing book language",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    }
  },
  "fileTypes": {
    "list": {
      "method": "get",
      "description": "Get all book file types",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              },
              "id": {
                "type": "string"
              },
              "collectionId": {
                "type": "string"
              },
              "collectionName": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "amount",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    }
  },
  "readStatus": {
    "list": {
      "method": "get",
      "description": "Get all book read statuses",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {},
              "icon": {},
              "color": {},
              "amount": {
                "type": "number"
              },
              "id": {
                "type": "string"
              },
              "collectionId": {
                "type": "string"
              },
              "collectionName": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "icon",
              "color",
              "amount",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    }
  },
  "annas": {
    "search": {
      "method": "get",
      "description": "Search books in Anna's Archive",
      "noAuth": true,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "q": {
              "type": "string"
            },
            "page": {
              "type": "string"
            }
          },
          "required": [
            "q",
            "page"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean"
            },
            "results": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "md5": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "author": {
                    "type": "string"
                  },
                  "publisher": {
                    "type": "string"
                  },
                  "year": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string"
                  },
                  "language": {
                    "type": "string"
                  },
                  "format": {
                    "type": "string"
                  },
                  "fileSize": {
                    "type": "string"
                  },
                  "type": {
                    "type": "string"
                  },
                  "coverUrl": {
                    "type": "string"
                  },
                  "filePath": {
                    "type": "string"
                  }
                },
                "required": [
                  "md5",
                  "title"
                ],
                "additionalProperties": false
              }
            },
            "total": {
              "type": "number"
            },
            "totalPages": {
              "type": "number"
            },
            "currentPage": {
              "type": "number"
            },
            "query": {
              "type": "string"
            },
            "error": {
              "type": "string"
            }
          },
          "required": [
            "success",
            "results",
            "total",
            "totalPages",
            "currentPage",
            "query"
          ],
          "additionalProperties": false
        }
      }
    }
  }
} as const

export default contract
