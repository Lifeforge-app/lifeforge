export const contract = {
  "getActivities": {
    "method": "get",
    "description": "Get coding activity calendar by year",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "year": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "date": {
                  "type": "string"
                },
                "count": {
                  "type": "number"
                },
                "level": {
                  "type": "number"
                }
              },
              "required": [
                "date",
                "count",
                "level"
              ],
              "additionalProperties": false
            }
          },
          "firstYear": {
            "type": "number"
          }
        },
        "required": [
          "data",
          "firstYear"
        ],
        "additionalProperties": false
      }
    }
  },
  "getStatistics": {
    "method": "get",
    "description": "Get overall coding statistics",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {},
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "additionalProperties": {
          "type": "number"
        }
      }
    }
  },
  "getLastXDays": {
    "method": "get",
    "description": "Get coding data for last X days",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "days": {
            "type": "string"
          }
        },
        "required": [
          "days"
        ],
        "additionalProperties": false
      }
    },
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "relative_files": {},
            "projects": {},
            "languages": {},
            "hourly": {},
            "total_minutes": {
              "type": "number"
            },
            "last_timestamp": {
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
            "date",
            "relative_files",
            "projects",
            "languages",
            "hourly",
            "total_minutes",
            "last_timestamp",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      },
      "BAD_REQUEST": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "string"
      }
    }
  },
  "getTopProjects": {
    "method": "get",
    "description": "Get top projects by time spent",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "last": {
            "default": "7 days",
            "type": "string",
            "enum": [
              "24 hours",
              "7 days",
              "30 days"
            ]
          }
        },
        "required": [
          "last"
        ],
        "additionalProperties": false
      }
    },
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "additionalProperties": {
          "type": "number"
        }
      }
    }
  },
  "getTopLanguages": {
    "method": "get",
    "description": "Get top languages by usage",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "last": {
            "default": "7 days",
            "type": "string",
            "enum": [
              "24 hours",
              "7 days",
              "30 days"
            ]
          }
        },
        "required": [
          "last"
        ],
        "additionalProperties": false
      }
    },
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "additionalProperties": {
          "type": "number"
        }
      }
    }
  },
  "getEachDay": {
    "method": "get",
    "description": "Get daily coding time breakdown",
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
            "date": {
              "type": "string"
            },
            "duration": {
              "type": "number"
            }
          },
          "required": [
            "date",
            "duration"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "getTimeDistribution": {
    "method": "get",
    "description": "Get hourly coding time distribution",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {},
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "additionalProperties": {
          "type": "number"
        }
      }
    }
  },
  "user": {
    "minutes": {
      "method": "get",
      "description": "Get total coding minutes",
      "noAuth": true,
      "encrypted": false,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "minutes": {
              "type": "string"
            }
          },
          "required": [
            "minutes"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "minutes": {
              "type": "number"
            }
          },
          "required": [
            "minutes"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "eventLog": {
    "method": "post",
    "description": "Record a coding activity event",
    "noAuth": true,
    "encrypted": false,
    "isDownloadable": false,
    "media": null,
    "input": {
      "body": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {},
        "additionalProperties": {}
      }
    },
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "status": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "status",
          "message"
        ],
        "additionalProperties": false
      }
    }
  },
  "readme": {
    "method": "get",
    "description": "Generate README stats image",
    "noAuth": true,
    "encrypted": false,
    "isDownloadable": false,
    "media": null,
    "input": {},
    "output": "custom"
  }
} as const

export default contract
