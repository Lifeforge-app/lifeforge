export const contract = {
  "entries": {
    "count": {
      "method": "get",
      "description": "Get watched and unwatched entry counts",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "watched": {
              "type": "number"
            },
            "unwatched": {
              "type": "number"
            }
          },
          "required": [
            "watched",
            "unwatched"
          ],
          "additionalProperties": false
        }
      }
    },
    "create": {
      "method": "post",
      "description": "Create a movie entry from TMDB",
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
            "tgvId": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "tmdb_id": {
              "type": "number"
            },
            "tgv_id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "original_title": {
              "type": "string"
            },
            "poster": {
              "type": "string"
            },
            "genres": {},
            "duration": {
              "type": "number"
            },
            "overview": {
              "type": "string"
            },
            "language": {
              "type": "string"
            },
            "release_date": {
              "type": "string"
            },
            "watch_date": {
              "type": "string"
            },
            "ticket_number": {
              "type": "string"
            },
            "theatre_seat": {
              "type": "string"
            },
            "theatre_showtime": {
              "type": "string"
            },
            "theatre_location": {
              "type": "string"
            },
            "theatre_location_coords": {
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
            "theatre_number": {
              "type": "string"
            },
            "is_watched": {
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
            "tmdb_id",
            "tgv_id",
            "title",
            "original_title",
            "poster",
            "genres",
            "duration",
            "overview",
            "language",
            "release_date",
            "watch_date",
            "ticket_number",
            "theatre_seat",
            "theatre_showtime",
            "theatre_location",
            "theatre_location_coords",
            "theatre_number",
            "is_watched",
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
      "description": "Get all movie entries",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "watched": {
              "type": "string",
              "enum": [
                "true",
                "false"
              ]
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
            "total": {
              "type": "number"
            },
            "entries": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "tmdb_id": {
                    "type": "number"
                  },
                  "tgv_id": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "original_title": {
                    "type": "string"
                  },
                  "poster": {
                    "type": "string"
                  },
                  "genres": {},
                  "duration": {
                    "type": "number"
                  },
                  "overview": {
                    "type": "string"
                  },
                  "language": {
                    "type": "string"
                  },
                  "release_date": {
                    "type": "string"
                  },
                  "watch_date": {
                    "type": "string"
                  },
                  "ticket_number": {
                    "type": "string"
                  },
                  "theatre_seat": {
                    "type": "string"
                  },
                  "theatre_showtime": {
                    "type": "string"
                  },
                  "theatre_location": {
                    "type": "string"
                  },
                  "theatre_location_coords": {
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
                  "theatre_number": {
                    "type": "string"
                  },
                  "is_watched": {
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
                  "tmdb_id",
                  "tgv_id",
                  "title",
                  "original_title",
                  "poster",
                  "genres",
                  "duration",
                  "overview",
                  "language",
                  "release_date",
                  "watch_date",
                  "ticket_number",
                  "theatre_seat",
                  "theatre_showtime",
                  "theatre_location",
                  "theatre_location_coords",
                  "theatre_number",
                  "is_watched",
                  "id",
                  "collectionId",
                  "collectionName"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "total",
            "entries"
          ],
          "additionalProperties": false
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a movie entry",
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
    "toggleWatchStatus": {
      "method": "post",
      "description": "Toggle watch status of a movie entry",
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
            "tmdb_id": {
              "type": "number"
            },
            "tgv_id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "original_title": {
              "type": "string"
            },
            "poster": {
              "type": "string"
            },
            "genres": {},
            "duration": {
              "type": "number"
            },
            "overview": {
              "type": "string"
            },
            "language": {
              "type": "string"
            },
            "release_date": {
              "type": "string"
            },
            "watch_date": {
              "type": "string"
            },
            "ticket_number": {
              "type": "string"
            },
            "theatre_seat": {
              "type": "string"
            },
            "theatre_showtime": {
              "type": "string"
            },
            "theatre_location": {
              "type": "string"
            },
            "theatre_location_coords": {
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
            "theatre_number": {
              "type": "string"
            },
            "is_watched": {
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
            "tmdb_id",
            "tgv_id",
            "title",
            "original_title",
            "poster",
            "genres",
            "duration",
            "overview",
            "language",
            "release_date",
            "watch_date",
            "ticket_number",
            "theatre_seat",
            "theatre_showtime",
            "theatre_location",
            "theatre_location_coords",
            "theatre_number",
            "is_watched",
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
      "description": "Update movie entry with the latest data from TMDB",
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
            "tmdb_id": {
              "type": "number"
            },
            "tgv_id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "original_title": {
              "type": "string"
            },
            "poster": {
              "type": "string"
            },
            "genres": {},
            "duration": {
              "type": "number"
            },
            "overview": {
              "type": "string"
            },
            "language": {
              "type": "string"
            },
            "release_date": {
              "type": "string"
            },
            "watch_date": {
              "type": "string"
            },
            "ticket_number": {
              "type": "string"
            },
            "theatre_seat": {
              "type": "string"
            },
            "theatre_showtime": {
              "type": "string"
            },
            "theatre_location": {
              "type": "string"
            },
            "theatre_location_coords": {
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
            "theatre_number": {
              "type": "string"
            },
            "is_watched": {
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
            "tmdb_id",
            "tgv_id",
            "title",
            "original_title",
            "poster",
            "genres",
            "duration",
            "overview",
            "language",
            "release_date",
            "watch_date",
            "ticket_number",
            "theatre_seat",
            "theatre_showtime",
            "theatre_location",
            "theatre_location_coords",
            "theatre_number",
            "is_watched",
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
  "tgv": {
    "fetchTicket": {
      "method": "post",
      "description": "Fetch TGV booking ticket by movie recid",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "pin": {
              "type": "string"
            },
            "tgvId": {
              "type": "string"
            }
          },
          "required": [
            "tgvId"
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
                "theatre_location": {
                  "type": "string"
                },
                "theatre_number": {
                  "type": "string"
                },
                "theatre_seat": {
                  "type": "string"
                },
                "theatre_showtime": {
                  "type": "string"
                },
                "ticket_number": {
                  "type": "string"
                },
                "theatre_location_coords": {
                  "anyOf": [
                    {
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
                      ],
                      "additionalProperties": false
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "required": [
                "theatre_location",
                "theatre_number",
                "theatre_seat",
                "theatre_showtime",
                "ticket_number",
                "theatre_location_coords"
              ],
              "additionalProperties": false
            },
            {
              "type": "boolean",
              "const": false
            }
          ]
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    },
    "getExperienceLogos": {
      "method": "get",
      "description": "Get experience logos from TGV",
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
              "key": {
                "type": "string"
              },
              "subject": {
                "type": "string"
              },
              "logoUrl": {
                "type": "string"
              }
            },
            "required": [
              "key",
              "subject",
              "logoUrl"
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
    "getMovieCinemas": {
      "method": "get",
      "description": "Get cinemas screening a movie on a given date",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "movieId": {
              "type": "string"
            },
            "businessDate": {
              "type": "string"
            }
          },
          "required": [
            "movieId",
            "businessDate"
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
              "state": {
                "type": "string"
              },
              "label": {
                "type": "string"
              },
              "cinemas": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    },
                    "name": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "id",
                    "name"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "required": [
              "state",
              "label",
              "cinemas"
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
    "getMovieSessions": {
      "method": "get",
      "description": "Get sessions for a movie at a cinema on a given date",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "cinemaId": {
              "type": "string"
            },
            "businessDate": {
              "type": "string"
            },
            "movieId": {
              "type": "string"
            }
          },
          "required": [
            "cinemaId",
            "businessDate",
            "movieId"
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
              "sessionid": {
                "type": "string"
              },
              "screenname": {
                "type": "string"
              },
              "showtime": {
                "type": "string"
              },
              "experience": {
                "type": "string"
              },
              "seatstotal": {
                "type": "number"
              },
              "seatsused": {
                "type": "number"
              },
              "usedpercentage": {
                "type": "number"
              }
            },
            "required": [
              "sessionid",
              "screenname",
              "showtime",
              "experience",
              "seatstotal",
              "seatsused",
              "usedpercentage"
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
    "getSeatPlan": {
      "method": "get",
      "description": "Get seat plan for a movie session",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "sessionId": {
              "type": "string"
            },
            "cinemaId": {
              "type": "string"
            }
          },
          "required": [
            "sessionId",
            "cinemaId"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "areas": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "rows": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "physicalName": {
                          "type": "string"
                        },
                        "seats": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "columnIndex": {
                                "type": "number"
                              },
                              "status": {
                                "type": "number"
                              },
                              "seatsInGroup": {
                                "anyOf": [
                                  {
                                    "type": "array",
                                    "items": {
                                      "type": "object",
                                      "properties": {
                                        "areaNumber": {
                                          "type": "number"
                                        },
                                        "rowIndex": {
                                          "type": "number"
                                        },
                                        "columnIndex": {
                                          "type": "number"
                                        }
                                      },
                                      "required": [
                                        "areaNumber",
                                        "rowIndex",
                                        "columnIndex"
                                      ],
                                      "additionalProperties": false
                                    }
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              }
                            },
                            "required": [
                              "columnIndex",
                              "status",
                              "seatsInGroup"
                            ],
                            "additionalProperties": false
                          }
                        }
                      },
                      "required": [
                        "physicalName",
                        "seats"
                      ],
                      "additionalProperties": false
                    }
                  }
                },
                "required": [
                  "rows"
                ],
                "additionalProperties": false
              }
            },
            "screenStart": {
              "type": "number"
            },
            "screenWidth": {
              "type": "number"
            },
            "boundaryRight": {
              "type": "number"
            },
            "boundaryLeft": {
              "type": "number"
            },
            "boundaryTop": {
              "type": "number"
            }
          },
          "required": [
            "areas",
            "screenStart",
            "screenWidth",
            "boundaryRight",
            "boundaryLeft",
            "boundaryTop"
          ],
          "additionalProperties": false
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    },
    "getSessionDates": {
      "method": "get",
      "description": "Get available session business dates for a TGV movie",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "movieId": {
              "type": "string"
            }
          },
          "required": [
            "movieId"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    },
    "hasCachedSession": {
      "method": "get",
      "description": "Check if TGV session is cached and valid",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "boolean"
        }
      }
    },
    "list": {
      "method": "get",
      "description": "Fetch movies from TGV Cinemas by type",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "nowShowing",
                "comingSoon"
              ]
            }
          },
          "required": [
            "type"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "movies": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "itemkey": {
                    "type": "string"
                  },
                  "recid": {
                    "type": "string"
                  },
                  "name": {
                    "type": "string"
                  },
                  "poster": {
                    "type": "string"
                  },
                  "genres": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "duration": {
                    "type": "number"
                  },
                  "overview": {
                    "type": "string"
                  },
                  "language": {
                    "type": "string"
                  },
                  "release_date": {
                    "type": "string"
                  }
                },
                "required": [
                  "itemkey",
                  "recid",
                  "name",
                  "poster",
                  "genres",
                  "duration",
                  "overview",
                  "language",
                  "release_date"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "movies"
          ],
          "additionalProperties": false
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    }
  },
  "ticket": {
    "clear": {
      "method": "post",
      "description": "Clear ticket information for a movie entry",
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
      "description": "Update ticket information for a movie entry",
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
            "ticket_number": {
              "type": "string"
            },
            "theatre_number": {
              "type": "string"
            },
            "theatre_seat": {
              "type": "string"
            },
            "theatre_showtime": {
              "type": "string"
            },
            "theatre_location": {
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
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "name",
                "formattedAddress",
                "location"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "ticket_number",
            "theatre_number",
            "theatre_seat"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "tmdb_id": {
              "type": "number"
            },
            "tgv_id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "original_title": {
              "type": "string"
            },
            "poster": {
              "type": "string"
            },
            "genres": {},
            "duration": {
              "type": "number"
            },
            "overview": {
              "type": "string"
            },
            "language": {
              "type": "string"
            },
            "release_date": {
              "type": "string"
            },
            "watch_date": {
              "type": "string"
            },
            "ticket_number": {
              "type": "string"
            },
            "theatre_seat": {
              "type": "string"
            },
            "theatre_showtime": {
              "type": "string"
            },
            "theatre_location": {
              "type": "string"
            },
            "theatre_location_coords": {
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
            "theatre_number": {
              "type": "string"
            },
            "is_watched": {
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
            "tmdb_id",
            "tgv_id",
            "title",
            "original_title",
            "poster",
            "genres",
            "duration",
            "overview",
            "language",
            "release_date",
            "watch_date",
            "ticket_number",
            "theatre_seat",
            "theatre_showtime",
            "theatre_location",
            "theatre_location_coords",
            "theatre_number",
            "is_watched",
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
  "tmdb": {
    "search": {
      "method": "get",
      "description": "Search movies using TMDB API",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "q": {
              "type": "string",
              "minLength": 1
            },
            "page": {
              "default": "1",
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
            "page": {
              "type": "number"
            },
            "results": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "adult": {
                    "type": "boolean"
                  },
                  "backdrop_path": {
                    "type": "string"
                  },
                  "genre_ids": {
                    "type": "array",
                    "items": {
                      "type": "number"
                    }
                  },
                  "existed": {
                    "type": "boolean"
                  },
                  "id": {
                    "type": "number"
                  },
                  "original_language": {
                    "type": "string"
                  },
                  "original_title": {
                    "type": "string"
                  },
                  "overview": {
                    "type": "string"
                  },
                  "popularity": {
                    "type": "number"
                  },
                  "poster_path": {
                    "type": "string"
                  },
                  "release_date": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "video": {
                    "type": "boolean"
                  },
                  "vote_average": {
                    "type": "number"
                  },
                  "vote_count": {
                    "type": "number"
                  }
                },
                "required": [
                  "adult",
                  "backdrop_path",
                  "genre_ids",
                  "existed",
                  "id",
                  "original_language",
                  "original_title",
                  "overview",
                  "popularity",
                  "poster_path",
                  "release_date",
                  "title",
                  "video",
                  "vote_average",
                  "vote_count"
                ],
                "additionalProperties": false
              }
            },
            "total_pages": {
              "type": "number"
            },
            "total_results": {
              "type": "number"
            }
          },
          "required": [
            "page",
            "results",
            "total_pages",
            "total_results"
          ],
          "additionalProperties": false
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
