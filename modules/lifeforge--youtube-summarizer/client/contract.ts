export const contract = {
  "youtube": {
    "getYoutubeVideoInfo": {
      "method": "get",
      "description": "Retrieve YouTube video metadata and captions",
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
            },
            "captions": {
              "type": "object",
              "additionalProperties": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "ext": {
                      "type": "string"
                    },
                    "url": {
                      "type": "string"
                    },
                    "name": {
                      "type": ["string", "null"]
                    }
                  },
                  "required": [
                    "ext",
                    "url",
                    "name"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "auto_captions": {
              "type": "object",
              "additionalProperties": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "ext": {
                      "type": "string"
                    },
                    "url": {
                      "type": "string"
                    },
                    "name": {
                      "type": ["string", "null"]
                    }
                  },
                  "required": [
                    "ext",
                    "url",
                    "name"
                  ],
                  "additionalProperties": false
                }
              }
            }
          },
          "required": [
            "title",
            "uploadDate",
            "uploader",
            "duration",
            "viewCount",
            "likeCount",
            "thumbnail",
            "captions",
            "auto_captions"
          ],
          "additionalProperties": false
        }
      }
    },
    "summarize": {
      "method": "post",
      "description": "Summarize a YouTube transcript URL",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "format": "uri"
            }
          },
          "required": [
            "url"
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
  }
} as const

export default contract
