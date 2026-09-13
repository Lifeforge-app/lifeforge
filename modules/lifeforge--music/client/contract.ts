export const contract = {
  "entries": {
    "list": {
      "method": "get",
      "description": "Retrieve all music entries",
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
              "duration": {
                "type": "string"
              },
              "author": {
                "type": "string"
              },
              "file": {
                "type": "string"
              },
              "is_favourite": {
                "type": "boolean"
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
              "duration",
              "author",
              "file",
              "is_favourite",
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
      "description": "Delete a music entry",
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
    "toggleFavourite": {
      "method": "post",
      "description": "Toggle favourite status of a music entry",
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
            "name": {
              "type": "string"
            },
            "duration": {
              "type": "string"
            },
            "author": {
              "type": "string"
            },
            "file": {
              "type": "string"
            },
            "is_favourite": {
              "type": "boolean"
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
            "duration",
            "author",
            "file",
            "is_favourite",
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
      "description": "Update music entry details",
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
            "author": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "author"
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
            "duration": {
              "type": "string"
            },
            "author": {
              "type": "string"
            },
            "file": {
              "type": "string"
            },
            "is_favourite": {
              "type": "boolean"
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
            "duration",
            "author",
            "file",
            "is_favourite",
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
  "youtube": {
    "downloadVideo": {
      "method": "post",
      "description": "Download YouTube video as audio asynchronously",
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
            "uploader": {
              "type": "string"
            },
            "duration": {
              "type": "number"
            }
          },
          "required": [
            "title",
            "uploader",
            "duration"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    },
    "getVideoInfo": {
      "method": "get",
      "description": "Retrieve YouTube video metadata",
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
            "uploadDate": {
              "type": "string"
            },
            "uploader": {
              "type": "string"
            },
            "duration": {
              "type": "string"
            },
            "viewCount": {
              "type": "number"
            },
            "likeCount": {
              "type": "number"
            },
            "thumbnail": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "uploadDate",
            "uploader",
            "duration",
            "viewCount",
            "likeCount",
            "thumbnail"
          ],
          "additionalProperties": false
        }
      }
    },
    "parseMusicNameAndAuthor": {
      "method": "post",
      "description": "Extract music title and author from YouTube video using AI",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "uploader": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "uploader"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "anyOf": [
            {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "author": {
                  "type": "string"
                }
              },
              "required": [
                "name",
                "author"
              ],
              "additionalProperties": false
            },
            {
              "type": "null"
            }
          ]
        }
      }
    }
  }
} as const

export default contract
