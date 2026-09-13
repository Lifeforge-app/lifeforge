export const contract = {
  "entries": {
    "create": {
      "method": "post",
      "description": "Create a new moment vault entry",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "files": {
          "multiple": true,
          "optional": true
        }
      },
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "text",
                "audio",
                "photos"
              ]
            },
            "content": {
              "type": "string"
            },
            "transcription": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "text",
                "audio",
                "video",
                "photos",
                ""
              ]
            },
            "file": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "content": {
              "type": "string"
            },
            "transcription": {
              "type": "string"
            },
            "reviewed": {
              "type": "boolean"
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
            "type",
            "file",
            "content",
            "transcription",
            "reviewed",
            "created",
            "updated",
            "id",
            "collectionId",
            "collectionName"
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
      "description": "Get paginated list of moment vault entries",
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
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": [
                      "text",
                      "audio",
                      "video",
                      "photos",
                      ""
                    ]
                  },
                  "file": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "content": {
                    "type": "string"
                  },
                  "transcription": {
                    "type": "string"
                  },
                  "reviewed": {
                    "type": "boolean"
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
                  "type",
                  "file",
                  "content",
                  "transcription",
                  "reviewed",
                  "created",
                  "updated",
                  "id",
                  "collectionId",
                  "collectionName"
                ],
                "additionalProperties": false
              }
            },
            "page": {
              "type": "number"
            },
            "perPage": {
              "type": "number"
            },
            "totalItems": {
              "type": "number"
            },
            "totalPages": {
              "type": "number"
            }
          },
          "required": [
            "items",
            "page",
            "perPage",
            "totalItems",
            "totalPages"
          ],
          "additionalProperties": false
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a moment vault entry",
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
    "toggleReviewed": {
      "method": "post",
      "description": "Toggle reviewed status of an audio entry",
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
            "type": {
              "type": "string",
              "enum": [
                "text",
                "audio",
                "video",
                "photos",
                ""
              ]
            },
            "file": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "content": {
              "type": "string"
            },
            "transcription": {
              "type": "string"
            },
            "reviewed": {
              "type": "boolean"
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
            "type",
            "file",
            "content",
            "transcription",
            "reviewed",
            "created",
            "updated",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "NOT_FOUND": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update content of a moment vault entry",
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
            "content": {
              "type": "string"
            }
          },
          "required": [
            "content"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "text",
                "audio",
                "video",
                "photos",
                ""
              ]
            },
            "file": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "content": {
              "type": "string"
            },
            "transcription": {
              "type": "string"
            },
            "reviewed": {
              "type": "boolean"
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
            "type",
            "file",
            "content",
            "transcription",
            "reviewed",
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
    }
  },
  "transcribe": {
    "cleanupTranscription": {
      "method": "post",
      "description": "Clean up and improve transcription text",
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
            },
            "newText": {
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
          "type": "string"
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "NOT_FOUND": true
      }
    },
    "transcribeExisted": {
      "method": "post",
      "description": "Transcribe an existing audio entry",
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
          "type": "string"
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "NOT_FOUND": true
      }
    },
    "transcribeNew": {
      "method": "post",
      "description": "Transcribe a new audio file",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "file": {
          "optional": false
        }
      },
      "input": {},
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
    },
    "updateTranscription": {
      "method": "post",
      "description": "Update transcription of an audio entry",
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
            "transcription": {
              "type": "string"
            }
          },
          "required": [
            "transcription"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "text",
                "audio",
                "video",
                "photos",
                ""
              ]
            },
            "file": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "content": {
              "type": "string"
            },
            "transcription": {
              "type": "string"
            },
            "reviewed": {
              "type": "boolean"
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
            "type",
            "file",
            "content",
            "transcription",
            "reviewed",
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
    }
  }
} as const

export default contract
