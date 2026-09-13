export const contract = {
  "transactions": {
    "create": {
      "method": "post",
      "description": "Create a new transaction with receipt",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "receipt": {
          "optional": true
        }
      },
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
                }
              },
              "required": [
                "amount",
                "date"
              ]
            },
            {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "income",
                        "expenses"
                      ]
                    },
                    "particulars": {
                      "type": "string"
                    },
                    "asset": {
                      "type": "string"
                    },
                    "category": {
                      "type": "string"
                    },
                    "ledgers": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "location": {
                      "anyOf": [
                        {
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
                        },
                        {
                          "type": "null"
                        }
                      ]
                    }
                  },
                  "required": [
                    "type",
                    "particulars",
                    "asset",
                    "category",
                    "ledgers"
                  ]
                },
                {
                  "type": "object",
                  "properties": {
                    "from": {
                      "type": "string"
                    },
                    "to": {
                      "type": "string"
                    },
                    "type": {
                      "type": "string",
                      "const": "transfer"
                    }
                  },
                  "required": [
                    "from",
                    "to",
                    "type"
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
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "const": "transfer"
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
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
                },
                "receipt": {
                  "type": "string"
                },
                "from": {
                  "type": "string"
                },
                "to": {
                  "type": "string"
                }
              },
              "required": [
                "type",
                "amount",
                "date",
                "created",
                "updated",
                "id",
                "collectionId",
                "collectionName",
                "from",
                "to"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "const": "income_expenses"
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
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
                },
                "receipt": {
                  "type": "string"
                }
              },
              "required": [
                "type",
                "amount",
                "date",
                "created",
                "updated",
                "id",
                "collectionId",
                "collectionName"
              ],
              "additionalProperties": false
            }
          ]
        },
        "NOT_FOUND": true
      }
    },
    "createMultiple": {
      "method": "post",
      "description": "Create multiple new transactions",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "transactions": {
              "type": "array",
              "items": {
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "amount": {
                        "type": "number"
                      },
                      "date": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "amount",
                      "date"
                    ]
                  },
                  {
                    "anyOf": [
                      {
                        "type": "object",
                        "properties": {
                          "type": {
                            "type": "string",
                            "enum": [
                              "income",
                              "expenses"
                            ]
                          },
                          "particulars": {
                            "type": "string"
                          },
                          "asset": {
                            "type": "string"
                          },
                          "category": {
                            "type": "string"
                          },
                          "ledgers": {
                            "type": "array",
                            "items": {
                              "type": "string"
                            }
                          },
                          "location": {
                            "anyOf": [
                              {
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
                              },
                              {
                                "type": "null"
                              }
                            ]
                          }
                        },
                        "required": [
                          "type",
                          "particulars",
                          "asset",
                          "category",
                          "ledgers"
                        ]
                      },
                      {
                        "type": "object",
                        "properties": {
                          "from": {
                            "type": "string"
                          },
                          "to": {
                            "type": "string"
                          },
                          "type": {
                            "type": "string",
                            "const": "transfer"
                          }
                        },
                        "required": [
                          "from",
                          "to",
                          "type"
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          },
          "required": [
            "transactions"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "null"
        }
      }
    },
    "getById": {
      "method": "get",
      "description": "Get wallet transaction by ID",
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
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "const": "transfer"
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
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
                },
                "receipt": {
                  "type": "string"
                },
                "from": {
                  "type": "string"
                },
                "to": {
                  "type": "string"
                }
              },
              "required": [
                "type",
                "amount",
                "date",
                "created",
                "updated",
                "id",
                "collectionId",
                "collectionName",
                "from",
                "to"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "const": "income"
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
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
                },
                "receipt": {
                  "type": "string"
                },
                "particulars": {
                  "type": "string"
                },
                "asset": {
                  "type": "string"
                },
                "category": {
                  "type": "string"
                },
                "ledgers": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "location_name": {
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
                }
              },
              "required": [
                "type",
                "amount",
                "date",
                "created",
                "updated",
                "id",
                "collectionId",
                "collectionName",
                "particulars",
                "asset",
                "category",
                "ledgers",
                "location_name",
                "location_coords"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "const": "expenses"
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
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
                },
                "receipt": {
                  "type": "string"
                },
                "particulars": {
                  "type": "string"
                },
                "asset": {
                  "type": "string"
                },
                "category": {
                  "type": "string"
                },
                "ledgers": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "location_name": {
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
                }
              },
              "required": [
                "type",
                "amount",
                "date",
                "created",
                "updated",
                "id",
                "collectionId",
                "collectionName",
                "particulars",
                "asset",
                "category",
                "ledgers",
                "location_name",
                "location_coords"
              ],
              "additionalProperties": false
            }
          ]
        },
        "NOT_FOUND": true
      }
    },
    "list": {
      "method": "get",
      "description": "Get all wallet transactions",
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
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses",
                "transfer"
              ]
            },
            "year": {
              "type": "string"
            },
            "month": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "const": "transfer"
                  },
                  "amount": {
                    "type": "number"
                  },
                  "date": {
                    "type": "string"
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
                  },
                  "receipt": {
                    "type": "string"
                  },
                  "from": {
                    "type": "string"
                  },
                  "to": {
                    "type": "string"
                  }
                },
                "required": [
                  "type",
                  "amount",
                  "date",
                  "created",
                  "updated",
                  "id",
                  "collectionId",
                  "collectionName",
                  "from",
                  "to"
                ],
                "additionalProperties": false
              },
              {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "const": "income"
                  },
                  "amount": {
                    "type": "number"
                  },
                  "date": {
                    "type": "string"
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
                  },
                  "receipt": {
                    "type": "string"
                  },
                  "particulars": {
                    "type": "string"
                  },
                  "asset": {
                    "type": "string"
                  },
                  "category": {
                    "type": "string"
                  },
                  "ledgers": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "location_name": {
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
                  }
                },
                "required": [
                  "type",
                  "amount",
                  "date",
                  "created",
                  "updated",
                  "id",
                  "collectionId",
                  "collectionName",
                  "particulars",
                  "asset",
                  "category",
                  "ledgers",
                  "location_name",
                  "location_coords"
                ],
                "additionalProperties": false
              },
              {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "const": "expenses"
                  },
                  "amount": {
                    "type": "number"
                  },
                  "date": {
                    "type": "string"
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
                  },
                  "receipt": {
                    "type": "string"
                  },
                  "particulars": {
                    "type": "string"
                  },
                  "asset": {
                    "type": "string"
                  },
                  "category": {
                    "type": "string"
                  },
                  "ledgers": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "location_name": {
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
                  }
                },
                "required": [
                  "type",
                  "amount",
                  "date",
                  "created",
                  "updated",
                  "id",
                  "collectionId",
                  "collectionName",
                  "particulars",
                  "asset",
                  "category",
                  "ledgers",
                  "location_name",
                  "location_coords"
                ],
                "additionalProperties": false
              }
            ]
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a transaction",
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
    "scanReceipt": {
      "method": "post",
      "description": "Extract transaction data from receipt using OCR",
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
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "amount": {
              "type": "number"
            },
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
            },
            "category": {
              "type": "string"
            },
            "particulars": {
              "type": "string"
            },
            "location_coords": {
              "type": "object",
              "properties": {
                "lon": {
                  "type": "number"
                },
                "lat": {
                  "type": "number"
                }
              },
              "required": [
                "lon",
                "lat"
              ],
              "additionalProperties": false
            },
            "location_name": {
              "type": "string"
            }
          },
          "required": [
            "date",
            "amount",
            "type",
            "category",
            "particulars",
            "location_coords",
            "location_name"
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
      "description": "Update transaction details",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "receipt": {
          "optional": true
        }
      },
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
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
                }
              },
              "required": [
                "amount",
                "date"
              ]
            },
            {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "income",
                        "expenses"
                      ]
                    },
                    "particulars": {
                      "type": "string"
                    },
                    "asset": {
                      "type": "string"
                    },
                    "category": {
                      "type": "string"
                    },
                    "ledgers": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "location": {
                      "anyOf": [
                        {
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
                        },
                        {
                          "type": "null"
                        }
                      ]
                    }
                  },
                  "required": [
                    "type",
                    "particulars",
                    "asset",
                    "category",
                    "ledgers"
                  ]
                },
                {
                  "type": "object",
                  "properties": {
                    "from": {
                      "type": "string"
                    },
                    "to": {
                      "type": "string"
                    },
                    "type": {
                      "type": "string",
                      "const": "transfer"
                    }
                  },
                  "required": [
                    "from",
                    "to",
                    "type"
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
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "const": "transfer"
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
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
                },
                "receipt": {
                  "type": "string"
                },
                "from": {
                  "type": "string"
                },
                "to": {
                  "type": "string"
                }
              },
              "required": [
                "type",
                "amount",
                "date",
                "created",
                "updated",
                "id",
                "collectionId",
                "collectionName",
                "from",
                "to"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "const": "income_expenses"
                },
                "amount": {
                  "type": "number"
                },
                "date": {
                  "type": "string"
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
                },
                "receipt": {
                  "type": "string"
                }
              },
              "required": [
                "type",
                "amount",
                "date",
                "created",
                "updated",
                "id",
                "collectionId",
                "collectionName"
              ],
              "additionalProperties": false
            }
          ]
        },
        "NOT_FOUND": true
      }
    },
    "fromNaturalLanguage": {
      "method": "post",
      "description": "Convert human natural language into partial transaction object",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "description": {
              "type": "string"
            }
          },
          "required": [
            "description"
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
              "amount": {
                "type": "number"
              },
              "type": {
                "type": "string",
                "enum": [
                  "income",
                  "expenses",
                  "transfer"
                ]
              },
              "category": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "particulars": {
                "type": "string"
              },
              "location_coords": {
                "type": "object",
                "properties": {
                  "lon": {
                    "type": "number"
                  },
                  "lat": {
                    "type": "number"
                  }
                },
                "required": [
                  "lon",
                  "lat"
                ],
                "additionalProperties": false
              },
              "location_name": {
                "type": "string"
              },
              "asset": {
                "type": "string"
              },
              "from": {
                "type": "string"
              },
              "to": {
                "type": "string"
              },
              "ledgers": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": [
              "date",
              "amount",
              "type",
              "category",
              "particulars",
              "location_coords",
              "location_name"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "prompts": {
      "autoGenerate": {
        "method": "post",
        "description": "Auto-generate prompt using AI",
        "noAuth": false,
        "encrypted": true,
        "isDownloadable": false,
        "media": null,
        "input": {
          "body": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "income",
                  "expenses"
                ]
              },
              "count": {
                "type": "number",
                "minimum": 10,
                "maximum": 500
              }
            },
            "required": [
              "type",
              "count"
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
      },
      "get": {
        "method": "get",
        "description": "Get AI prompts for transaction generation",
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
              "income": {
                "type": "string"
              },
              "expenses": {
                "type": "string"
              }
            },
            "required": [
              "income",
              "expenses"
            ],
            "additionalProperties": false
          }
        }
      },
      "update": {
        "method": "post",
        "description": "Update AI generation prompts",
        "noAuth": false,
        "encrypted": true,
        "isDownloadable": false,
        "media": null,
        "input": {
          "body": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "income": {
                "type": "string",
                "minLength": 1
              },
              "expenses": {
                "type": "string",
                "minLength": 1
              }
            },
            "required": [
              "income",
              "expenses"
            ],
            "additionalProperties": false
          }
        },
        "output": {
          "OK": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "income": {
                "type": "string"
              },
              "expenses": {
                "type": "string"
              }
            },
            "required": [
              "income",
              "expenses"
            ],
            "additionalProperties": false
          }
        }
      }
    }
  },
  "categories": {
    "create": {
      "method": "post",
      "description": "Create a new transaction category",
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
            },
            "color": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
            }
          },
          "required": [
            "name",
            "icon",
            "color",
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
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
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
            "type",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "CONFLICT": true
      }
    },
    "list": {
      "method": "get",
      "description": "Get all transaction categories",
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
              "type": {
                "type": "string",
                "enum": [
                  "income",
                  "expenses"
                ]
              },
              "name": {
                "type": "string"
              },
              "icon": {
                "type": "string"
              },
              "color": {
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
              "type",
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
    },
    "remove": {
      "method": "post",
      "description": "Delete a transaction category",
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
      "description": "Update category details",
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
            },
            "color": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
            }
          },
          "required": [
            "name",
            "icon",
            "color",
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
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
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
            "type",
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
  "assets": {
    "create": {
      "method": "post",
      "description": "Create a new wallet asset",
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
            },
            "starting_balance": {
              "type": "number"
            }
          },
          "required": [
            "name",
            "icon",
            "starting_balance"
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
            "starting_balance": {
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
            "starting_balance",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      }
    },
    "getAllAssetAccumulatedBalance": {
      "method": "get",
      "description": "Get all asset balances for a specific month",
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
            },
            "month": {
              "type": "string"
            }
          },
          "required": [
            "year",
            "month"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "last": {
                "type": "number"
              },
              "current": {
                "type": "number"
              }
            },
            "required": [
              "last",
              "current"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "getAssetAccumulatedBalance": {
      "method": "get",
      "description": "Get asset balance over time",
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
            "rangeMode": {
              "type": "string",
              "enum": [
                "week",
                "month",
                "year",
                "all",
                "custom",
                "quarter"
              ]
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "rangeMode"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "balances": {
              "type": "object",
              "additionalProperties": {
                "type": "number"
              }
            },
            "startBalance": {
              "type": "number"
            },
            "endBalance": {
              "type": "number"
            }
          },
          "required": [
            "balances",
            "startBalance",
            "endBalance"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "list": {
      "method": "get",
      "description": "Get all wallet assets",
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
              "starting_balance": {
                "type": "number"
              },
              "transaction_count": {
                "type": "number"
              },
              "current_balance": {
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
              "starting_balance",
              "transaction_count",
              "current_balance",
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
      "description": "Delete a wallet asset",
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
      "description": "Update asset details",
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
            },
            "starting_balance": {
              "type": "number"
            }
          },
          "required": [
            "name",
            "icon",
            "starting_balance"
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
            "starting_balance": {
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
            "starting_balance",
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
  "ledgers": {
    "create": {
      "method": "post",
      "description": "Create a new ledger",
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
            },
            "color": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
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
            "icon": {
              "type": "string"
            },
            "color": {
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
            "color",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "CONFLICT": true
      }
    },
    "list": {
      "method": "get",
      "description": "Get all ledgers",
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
              "color",
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
      "description": "Delete a ledger",
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
      "description": "Update ledger details",
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
            },
            "color": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
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
            "icon": {
              "type": "string"
            },
            "color": {
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
            "color",
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
  "templates": {
    "create": {
      "method": "post",
      "description": "Create a new transaction template",
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
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
            },
            "amount": {
              "type": "number"
            },
            "particulars": {
              "type": "string"
            },
            "asset": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "ledgers": {
              "type": "array",
              "items": {
                "type": "string"
              }
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
            "name",
            "type",
            "amount",
            "particulars",
            "asset",
            "category",
            "ledgers"
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
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
            },
            "amount": {
              "type": "number"
            },
            "particulars": {
              "type": "string"
            },
            "asset": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "ledgers": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "location_name": {
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
            "type",
            "amount",
            "particulars",
            "asset",
            "category",
            "ledgers",
            "location_name",
            "location_coords",
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
      "description": "Get all transaction templates",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "propertyNames": {
            "type": "string",
            "enum": [
              "income",
              "expenses"
            ]
          },
          "additionalProperties": false,
          "required": [
            "income",
            "expenses"
          ],
          "properties": {
            "income": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "income",
                      "expenses"
                    ]
                  },
                  "amount": {
                    "type": "number"
                  },
                  "particulars": {
                    "type": "string"
                  },
                  "asset": {
                    "type": "string"
                  },
                  "category": {
                    "type": "string"
                  },
                  "ledgers": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "location_name": {
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
                  "type",
                  "amount",
                  "particulars",
                  "asset",
                  "category",
                  "ledgers",
                  "location_name",
                  "location_coords",
                  "id",
                  "collectionId",
                  "collectionName"
                ],
                "additionalProperties": false
              }
            },
            "expenses": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "income",
                      "expenses"
                    ]
                  },
                  "amount": {
                    "type": "number"
                  },
                  "particulars": {
                    "type": "string"
                  },
                  "asset": {
                    "type": "string"
                  },
                  "category": {
                    "type": "string"
                  },
                  "ledgers": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "location_name": {
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
                  "type",
                  "amount",
                  "particulars",
                  "asset",
                  "category",
                  "ledgers",
                  "location_name",
                  "location_coords",
                  "id",
                  "collectionId",
                  "collectionName"
                ],
                "additionalProperties": false
              }
            }
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a transaction template",
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
      "description": "Update transaction template",
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
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
            },
            "amount": {
              "type": "number"
            },
            "particulars": {
              "type": "string"
            },
            "asset": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "ledgers": {
              "type": "array",
              "items": {
                "type": "string"
              }
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
            "name",
            "type",
            "amount",
            "particulars",
            "asset",
            "category",
            "ledgers"
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
            "type": {
              "type": "string",
              "enum": [
                "income",
                "expenses"
              ]
            },
            "amount": {
              "type": "number"
            },
            "particulars": {
              "type": "string"
            },
            "asset": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "ledgers": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "location_name": {
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
            "type",
            "amount",
            "particulars",
            "asset",
            "category",
            "ledgers",
            "location_name",
            "location_coords",
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
  "analytics": {
    "getAvailableYearMonths": {
      "method": "get",
      "description": "Get available years and months from transaction dates",
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
            "years": {
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "monthsByYear": {
              "type": "object",
              "additionalProperties": {
                "type": "array",
                "items": {
                  "type": "number"
                }
              }
            }
          },
          "required": [
            "years",
            "monthsByYear"
          ],
          "additionalProperties": false
        }
      }
    },
    "getCategoriesBreakdown": {
      "method": "get",
      "description": "Get income and expenses breakdown by category for a month",
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
            },
            "month": {
              "type": "string"
            }
          },
          "required": [
            "year",
            "month"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "income": {
              "type": "object",
              "additionalProperties": {
                "type": "object",
                "properties": {
                  "amount": {
                    "type": "number"
                  },
                  "count": {
                    "type": "number"
                  },
                  "percentage": {
                    "type": "number"
                  }
                },
                "required": [
                  "amount",
                  "count",
                  "percentage"
                ],
                "additionalProperties": false
              }
            },
            "expenses": {
              "type": "object",
              "additionalProperties": {
                "type": "object",
                "properties": {
                  "amount": {
                    "type": "number"
                  },
                  "count": {
                    "type": "number"
                  },
                  "percentage": {
                    "type": "number"
                  }
                },
                "required": [
                  "amount",
                  "count",
                  "percentage"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "income",
            "expenses"
          ],
          "additionalProperties": false
        }
      }
    },
    "getChartData": {
      "method": "get",
      "description": "Get chart data for income/expenses by date range",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "range": {
              "type": "string",
              "enum": [
                "week",
                "month",
                "ytd"
              ]
            }
          },
          "required": [
            "range"
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
              "income": {
                "type": "number"
              },
              "expenses": {
                "type": "number"
              }
            },
            "required": [
              "date",
              "income",
              "expenses"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "getIncomeExpensesSummary": {
      "method": "get",
      "description": "Get income and expenses summary for a month",
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
            },
            "month": {
              "type": "string"
            }
          },
          "required": [
            "year",
            "month"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "totalIncome": {
              "type": "number"
            },
            "totalExpenses": {
              "type": "number"
            },
            "monthlyIncome": {
              "type": "number"
            },
            "monthlyExpenses": {
              "type": "number"
            }
          },
          "required": [
            "totalIncome",
            "totalExpenses",
            "monthlyIncome",
            "monthlyExpenses"
          ],
          "additionalProperties": false
        }
      }
    },
    "getSpendingByLocation": {
      "method": "get",
      "description": "Get spending aggregated by location for heatmap",
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
              "lat": {
                "type": "number"
              },
              "lng": {
                "type": "number"
              },
              "locationName": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              },
              "count": {
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
              "lat",
              "lng",
              "locationName",
              "amount",
              "count",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "getTransactionCountByDay": {
      "method": "get",
      "description": "Get transaction counts by day for a specific month",
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
            },
            "month": {
              "type": "string"
            },
            "viewFilter": {
              "type": "string"
            }
          },
          "required": [
            "year",
            "month"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "income": {
                "type": "number"
              },
              "expenses": {
                "type": "number"
              },
              "transfer": {
                "type": "number"
              },
              "total": {
                "type": "number"
              },
              "count": {
                "type": "number"
              }
            },
            "required": [
              "income",
              "expenses",
              "transfer",
              "total",
              "count"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "getTypesCount": {
      "method": "get",
      "description": "Get transaction counts and totals by type",
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
            },
            "month": {
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
          "additionalProperties": {
            "type": "object",
            "properties": {
              "transactionCount": {
                "type": "number"
              },
              "accumulatedAmount": {
                "type": "number"
              }
            },
            "required": [
              "transactionCount",
              "accumulatedAmount"
            ],
            "additionalProperties": false
          }
        }
      }
    }
  }
} as const

export default contract
