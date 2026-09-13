export const contract = {
  "events": {
    "addException": {
      "method": "post",
      "description": "Add exception date to recurring event",
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
            "date": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "date"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "boolean"
        },
        "NOT_FOUND": true
      }
    },
    "create": {
      "method": "post",
      "description": "Create a new event",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string"
                },
                "category": {
                  "type": "string"
                },
                "reference_link": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "calendar": {
                  "type": "string"
                },
                "location": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "formattedAddress": {
                      "type": "string"
                    },
                    "location": {
                      "type": "object",
                      "properties": {
                        "latitude": {
                          "type": "number"
                        },
                        "longitude": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "latitude",
                        "longitude"
                      ]
                    }
                  },
                  "required": [
                    "name",
                    "formattedAddress",
                    "location"
                  ]
                }
              },
              "required": [
                "title",
                "category",
                "reference_link",
                "description"
              ]
            },
            {
              "anyOf": [
                {
                  "allOf": [
                    {
                      "type": "object",
                      "properties": {
                        "type": {
                          "type": "string",
                          "const": "single"
                        }
                      },
                      "required": [
                        "type"
                      ]
                    },
                    {
                      "type": "object",
                      "properties": {
                        "start": {
                          "type": "string"
                        },
                        "end": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "start",
                        "end"
                      ]
                    }
                  ]
                },
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "const": "recurring"
                    },
                    "rrule": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "type",
                    "rrule"
                  ]
                }
              ]
            }
          ]
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "calendar": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "location_coords": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "number"
                },
                "lon": {
                  "type": "number"
                }
              },
              "required": [
                "lat",
                "lon"
              ],
              "additionalProperties": false
            },
            "reference_link": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "single",
                "recurring"
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
            "category",
            "calendar",
            "location",
            "location_coords",
            "reference_link",
            "description",
            "type",
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
    "getByDateRange": {
      "method": "get",
      "description": "Get events within a date range",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            }
          },
          "required": [
            "start",
            "end"
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
              "id": {
                "type": "string"
              },
              "type": {
                "type": "string",
                "enum": [
                  "single",
                  "recurring"
                ]
              },
              "start": {
                "type": "string"
              },
              "end": {
                "type": "string"
              },
              "rrule": {
                "type": "string"
              },
              "title": {
                "type": "string"
              },
              "calendar": {
                "type": "string"
              },
              "category": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "location": {
                "type": "string"
              },
              "location_coords": {
                "type": "object",
                "properties": {
                  "lat": {
                    "type": "number"
                  },
                  "lon": {
                    "type": "number"
                  }
                },
                "required": [
                  "lat",
                  "lon"
                ],
                "additionalProperties": false
              },
              "reference_link": {
                "type": "string"
              },
              "is_strikethrough": {
                "type": "boolean"
              }
            },
            "required": [
              "id",
              "type",
              "start",
              "end",
              "title",
              "calendar",
              "category",
              "description",
              "location",
              "location_coords",
              "reference_link"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "getById": {
      "method": "get",
      "description": "Get a specific event by ID",
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
            "category": {
              "type": "string"
            },
            "calendar": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "location_coords": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "number"
                },
                "lon": {
                  "type": "number"
                }
              },
              "required": [
                "lat",
                "lon"
              ],
              "additionalProperties": false
            },
            "reference_link": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "single",
                "recurring"
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
            "category",
            "calendar",
            "location",
            "location_coords",
            "reference_link",
            "description",
            "type",
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
    "getToday": {
      "method": "get",
      "description": "Get today's events",
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
              "title": {
                "type": "string"
              },
              "category": {
                "type": "string"
              },
              "calendar": {
                "type": "string"
              },
              "location": {
                "type": "string"
              },
              "location_coords": {
                "type": "object",
                "properties": {
                  "lat": {
                    "type": "number"
                  },
                  "lon": {
                    "type": "number"
                  }
                },
                "required": [
                  "lat",
                  "lon"
                ],
                "additionalProperties": false
              },
              "reference_link": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "type": {
                "type": "string",
                "enum": [
                  "single",
                  "recurring"
                ]
              },
              "id": {
                "type": "string"
              },
              "start": {
                "type": "string"
              },
              "end": {
                "type": "string"
              }
            },
            "required": [
              "title",
              "category",
              "calendar",
              "location",
              "location_coords",
              "reference_link",
              "description",
              "type",
              "id",
              "start",
              "end"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete an event",
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
    "scanImage": {
      "method": "post",
      "description": "Extract event details from image using AI",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "file": {
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
            "title": {
              "type": "string"
            },
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "location_coords": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "number"
                },
                "lon": {
                  "type": "number"
                }
              },
              "required": [
                "lat",
                "lon"
              ],
              "additionalProperties": false
            },
            "description": {
              "type": "string"
            },
            "category": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "start",
            "end",
            "location",
            "location_coords",
            "description",
            "category"
          ],
          "additionalProperties": false
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    },
    "update": {
      "method": "post",
      "description": "Update event details",
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
          "allOf": [
            {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string"
                },
                "category": {
                  "type": "string"
                },
                "reference_link": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "calendar": {
                  "type": "string"
                },
                "location": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "formattedAddress": {
                      "type": "string"
                    },
                    "location": {
                      "type": "object",
                      "properties": {
                        "latitude": {
                          "type": "number"
                        },
                        "longitude": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "latitude",
                        "longitude"
                      ]
                    }
                  },
                  "required": [
                    "name",
                    "formattedAddress",
                    "location"
                  ]
                }
              },
              "required": [
                "title",
                "category",
                "reference_link",
                "description"
              ]
            },
            {
              "anyOf": [
                {
                  "allOf": [
                    {
                      "type": "object",
                      "properties": {
                        "type": {
                          "type": "string",
                          "const": "single"
                        }
                      },
                      "required": [
                        "type"
                      ]
                    },
                    {
                      "type": "object",
                      "properties": {
                        "start": {
                          "type": "string"
                        },
                        "end": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "start",
                        "end"
                      ]
                    }
                  ]
                },
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "const": "recurring"
                    },
                    "rrule": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "type",
                    "rrule"
                  ]
                }
              ]
            }
          ]
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
            "category": {
              "type": "string"
            },
            "calendar": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "location_coords": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "number"
                },
                "lon": {
                  "type": "number"
                }
              },
              "required": [
                "lat",
                "lon"
              ],
              "additionalProperties": false
            },
            "reference_link": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "single",
                "recurring"
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
            "category",
            "calendar",
            "location",
            "location_coords",
            "reference_link",
            "description",
            "type",
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
    }
  },
  "calendars": {
    "create": {
      "method": "post",
      "description": "Create a new calendar with optional ICS sync",
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
            "color": {
              "type": "string"
            },
            "icsUrl": {
              "type": "string",
              "format": "uri"
            }
          },
          "required": [
            "name",
            "color"
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
            "color": {
              "type": "string"
            },
            "link": {
              "type": "string",
              "format": "uri"
            },
            "last_synced": {
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
            "color",
            "link",
            "last_synced",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      }
    },
    "getById": {
      "method": "get",
      "description": "Get a specific calendar by ID",
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
            "color": {
              "type": "string"
            },
            "link": {
              "type": "string",
              "format": "uri"
            },
            "last_synced": {
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
            "color",
            "link",
            "last_synced",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "list": {
      "method": "get",
      "description": "Get all calendars",
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
              "color": {
                "type": "string"
              },
              "link": {
                "type": "string",
                "format": "uri"
              },
              "last_synced": {
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
              "color",
              "link",
              "last_synced",
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
      "description": "Delete a calendar",
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
      "description": "Update calendar name and color",
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
            "color": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "color"
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
            "color": {
              "type": "string"
            },
            "link": {
              "type": "string",
              "format": "uri"
            },
            "last_synced": {
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
            "color",
            "link",
            "last_synced",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "validateICS": {
      "method": "post",
      "description": "Validate if an ICS URL is accessible",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "icsUrl": {
              "type": "string",
              "format": "uri"
            }
          },
          "required": [
            "icsUrl"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "boolean"
        }
      }
    }
  },
  "categories": {
    "create": {
      "method": "post",
      "description": "Create a new event category",
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
            "color": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "color",
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
            "color": {
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
            "color",
            "icon",
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
    "getById": {
      "method": "get",
      "description": "Get a specific event category by ID",
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
            "color": {
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
            "color",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "list": {
      "method": "get",
      "description": "Get all event categories",
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
              "color": {
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
              "color",
              "icon",
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
      "description": "Delete an event category",
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
      "description": "Update event category details",
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
            "color": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "color",
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
            "color": {
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
            "color",
            "icon",
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
    }
  }
} as const

export default contract
