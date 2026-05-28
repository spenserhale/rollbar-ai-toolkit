<!-- source: https://docs.rollbar.com/reference/get-an-item-by-occurrence-uuid.md -->

# Get an item (by UUID)

The `UUID` must be an ocurrence UUID for an occurrence in the item. Occurrence UUIDs are part of the response in https://docs.rollbar.com/reference/create-item.

# OpenAPI definition

````json
{
  "openapi": "3.1.0",
  "servers": [
    {
      "url": "https://api.rollbar.com"
    }
  ],
  "tags": [
    {
      "name": "Item"
    }
  ],
  "info": {
    "title": "Rollbar API",
    "version": "1.0",
    "description": "# Getting Started\nThe Rollbar API provides a RESTful interface to much of the data in the\nsystem. It is used by our official libraries to report exceptions,\ndeploys, and other messages. It can be used to create notifiers for\nadditional languages, get data out to integrate with other systems, or\nwhatever else you can imagine. If the API is missing something you'd\nlike to see, please [let us know](support@rollbar.com).\n\n# Ping\nTo test whether you're able to ping the API server, you can simply run the\nfollowing command:\n\n```\ncurl 'https://api.rollbar.com/api/1/status/ping'\n```\n\nYou will get back pong from our server if your request was successful.\n\n# Timestamps\nAll timestamps (inputs and outputs) are GMT unix timestamps.\n\n# Authentication\nAuthentication is done via access token included as a header parameter. For authenticated requests, pass your access token\nthrough the `X-Rollbar-Access-Token` parameter in the header.\n\n```\ncurl -H \"X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN\" 'https://api.rollbar.com/api/1/item/12345'\n```\n\n## Project access tokens\nMany operations require a project-specific access token. You can find and administer your\naccess tokens in Settings -> Project Access Tokens. Access tokens can have any or\nall of the following scopes:\n\n### post_server_item\nCan perform all POST requests to /deploy/ and /item/. Can also be used to upload source maps (JS, proguard, dSym, flutter)\n\n### post_client_item\nCan perform POST requests to /item/, but only if the item has a client-side platform (browser, mobile)\n\n### read\nCan perform all GET requests\n\n### write\nCan perform PATCH and DELETE requests\n\n## Account Access Tokens\nOperations performed at the level of the account require an account-specific\naccess token. These can be found and managed at\n{Account name} Settings -> Account Access Tokens.\nAccount access tokens can have the following scopes:\n\n### read\nSupports all GET operations at the account level.\n\n### write\nSupports all POST, PUT, PATCH, and DELETE operations at the account level.\n\n# HTTP responses\nThe API can return the following HTTP response codes:\n\n### 200\tOK\nOperation was completed successfully\n\n### 400\tBad request\nThe request was malformed and could not be parsed.\n\n### 403\tAccess denied\nAccess token was missing, invalid, or does not have the necessary permissions.\n\n### 404\tNot found\nThe requested resource was not found. This response will be returned if the URL is entirely invalid (i.e. /asdf), or if it is a URL that could be valid but is referencing something that does not exist (i.e. /item/12345).\n\n### 413\tRequest entity too large\nThe request exceeded the maximum size of 128KB.\n\n### 422\tUnprocessable Entity\nThe request was parseable (i.e. valid JSON), but some parameters were missing or otherwise invalid.\n\n### 429\tToo Many Requests\nIf rate limiting is enabled for your access token, this return code signifies that\n\n# Examples\n\n### [api-examples](https://github.com/rollbar/api-examples)\nAuthor: Rollbar\n\nLanguage: Python\n\nExamples using RQL, deploys, occurrences, and reports\n\n### [api-people-example](https://github.com/rollbar/api-people-example)\nAuthor: Rollbar\n\nLanguage: Python\n\nShows how to gather the Person data for each occurrence of a list of items\n\n### [rolltools](https://github.com/jslate/rolltools)\nAuthor: Jonathan Slate\n\nLanguage: Ruby\n\nA few utilities using the Rollbar API\n"
  },
  "paths": {
    "/api/1/item/": {
      "get": {
        "tags": [
          "Item"
        ],
        "summary": "Get an item (by UUID)",
        "description": "The `UUID` must be an ocurrence UUID for an occurrence in the item. Occurrence UUIDs are part of the response in https://docs.rollbar.com/reference/create-item.\n",
        "operationId": "get-an-item-by-occurrence-uuid",
        "parameters": [
          {
            "name": "uuid",
            "in": "query",
            "description": "UUID of an occurrence in the item\n",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "$ref": "#/paths/~1api~11~1instances/get/parameters/0"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "err": {
                      "type": "integer",
                      "example": 0
                    },
                    "result": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "integer",
                          "description": "The item ID"
                        },
                        "project_id": {
                          "type": "integer",
                          "description": "The item's project ID"
                        },
                        "counter": {
                          "type": "integer",
                          "description": "The item identifier withing the project"
                        },
                        "environment": {
                          "type": "string"
                        },
                        "platform": {
                          "type": "string"
                        },
                        "framework": {
                          "type": "string"
                        },
                        "hash": {
                          "type": "string",
                          "description": "Fingerprint that identifies the item"
                        },
                        "title": {
                          "type": "string"
                        },
                        "first_occurrence_id": {
                          "type": "integer",
                          "description": "First occurrence ID of the item in the version"
                        },
                        "first_occurrence_timestamp": {
                          "type": "integer",
                          "description": "First occurrence timestamp of the item"
                        },
                        "activating_occurrence_id": {
                          "type": "integer",
                          "description": "Occurrence ID that activated the item"
                        },
                        "last_activated_timestamp": {
                          "type": "integer",
                          "description": "Last activation timestamp"
                        },
                        "last_resolved_timestamp": {
                          "type": "integer",
                          "description": "Last timestamp the item was resolved"
                        },
                        "last_muted_timestamp": {
                          "type": "integer",
                          "description": "Last timestamp the item was muted"
                        },
                        "last_occurrence_id": {
                          "type": "integer",
                          "description": "Last received occurrence ID of the item"
                        },
                        "last_occurrence_timestamp": {
                          "type": "integer",
                          "description": "Last received occurrence timestamp"
                        },
                        "total_occurrences": {
                          "type": "integer",
                          "description": "Total number of occurrences on the item"
                        },
                        "last_modified_by": {
                          "type": "string",
                          "description": "Last user ID that modified the item"
                        },
                        "status": {
                          "type": "string",
                          "enum": [
                            "active",
                            "resolved",
                            "muted"
                          ]
                        },
                        "level": {
                          "type": "string",
                          "enum": [
                            "debug",
                            "info",
                            "warning",
                            "error",
                            "critical"
                          ]
                        },
                        "integrations_data": {
                          "type": "object"
                        },
                        "assigned_user_id": {
                          "type": "integer",
                          "description": "User ID the item is assigned to"
                        },
                        "assigned_team_id": {
                          "type": [
                            "integer",
                            "null"
                          ],
                          "description": "Team ID the item is assigned to"
                        },
                        "group_item_id": {
                          "type": "integer",
                          "description": "Group item this item belongs to"
                        },
                        "group_status": {
                          "type": "integer"
                        },
                        "snooze_status": {
                          "type": "boolean",
                          "description": "Indicates the snooze status (only available for paid accounts)"
                        },
                        "snooze_type": {
                          "type": "string",
                          "description": "Indicates the snooze type (only available for paid accounts)"
                        },
                        "snooze_expiration_threshold_seconds": {
                          "type": "integer",
                          "description": "The time in seconds after which the snooze expires (only available for paid accounts)"
                        },
                        "snooze_expiration_datetime": {
                          "type": "integer",
                          "description": "The timestamp after which the snooze expires (only available for paid accounts)"
                        }
                      },
                      "example": {
                        "id": 1000,
                        "project_id": 5,
                        "counter": 4,
                        "environment": "production",
                        "platform": "unknown",
                        "framework": "rails",
                        "hash": "03044fc948dd2c51c4ebccafbf0a01b01339a7b5",
                        "title": "NotMethod Error",
                        "first_occurrence_id": 1234,
                        "first_occurrence_timestamp": 1583538518,
                        "activating_occurrence_id": 1234,
                        "last_activated_timestamp": 1583538518,
                        "last_resolved_timestamp": "None",
                        "last_muted_timestamp": "None",
                        "last_occurrence_id": 2234,
                        "last_occurrence_timestamp": 1583538118,
                        "total_occurrences": 1000,
                        "last_modified_by": 123,
                        "status": "active",
                        "level": "error",
                        "integrations_data": {},
                        "assigned_user_id": 400,
                        "assigned_team_id": "None",
                        "group_item_id": "None",
                        "group_status": 1,
                        "snooze_status": "active",
                        "snooze_type": "time",
                        "snooze_expiration_threshold_seconds": 60,
                        "snooze_expiration_datetime": 1583538518
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "The format of the UUID is invalid.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "err": {
                      "type": "integer",
                      "example": 1
                    },
                    "message": {
                      "type": "string",
                      "example": "Invalid UUID format"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "No occurrence matching the given UUID was found.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "err": {
                      "type": "integer",
                      "example": 1
                    },
                    "message": {
                      "type": "string",
                      "example": "UUID did not match any occurrence"
                    }
                  }
                }
              }
            }
          }
        },
        "deprecated": false
      }
    }
  },
  "x-readme": {
    "explorer-enabled": true,
    "proxy-enabled": true
  },
  "_id": {
    "buffer": {
      "0": 98,
      "1": 222,
      "2": 158,
      "3": 27,
      "4": 99,
      "5": 22,
      "6": 195,
      "7": 4,
      "8": 3,
      "9": 77,
      "10": 0,
      "11": 106
    }
  }
}
````