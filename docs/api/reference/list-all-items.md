<!-- source: https://docs.rollbar.com/reference/list-all-items.md -->

# List all items

# Examples
Get the 101st through 199th active items:
```curl
curl -H "X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN" 'https://api.rollbar.com/api/1/items/?status=active&page=2'
```
Get the first page of items that are error or critical, in the production environment:
```curl
curl -H "X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN" 'https://api.rollbar.com/api/1/items/?level=error&level=critical&environment=production'
```

Note that the `total_count` in the `result` will return `null` if your project has more than 100,000 unique items.

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
    "/api/1/items": {
      "get": {
        "tags": [
          "Item"
        ],
        "summary": "List all items",
        "description": "# Examples\nGet the 101st through 199th active items:\n```curl\ncurl -H \"X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN\" 'https://api.rollbar.com/api/1/items/?status=active&page=2'\n```\nGet the first page of items that are error or critical, in the production environment:\n```curl\ncurl -H \"X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN\" 'https://api.rollbar.com/api/1/items/?level=error&level=critical&environment=production'\n```\n\nNote that the `total_count` in the `result` will return `null` if your project has more than 100,000 unique items.\n",
        "operationId": "list-all-items",
        "parameters": [
          {
            "$ref": "#/paths/~1api~11~1instances/get/parameters/0"
          },
          {
            "name": "assigned_user",
            "in": "query",
            "description": "If not empty, only items assigned to the specified user will be returned. Must be a valid Rollbar username, or you can use the keywords `assigned` (items that are assigned to any user or team) or `unassigned` (items with no assigned user or team).",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "assigned_team",
            "in": "query",
            "description": "If not empty, only items assigned to the specified team will be returned. Must be a valid Rollbar team name. Specify multiple times to filter by multiple teams. Cannot be combined with `assigned_user`.",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "style": "form",
            "explode": true
          },
          {
            "name": "environment",
            "in": "query",
            "description": "If not empty, only items in the specified environment will be returned. Specify multiple times to filter by multiple environments.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "framework",
            "in": "query",
            "description": "If not empty, only items in the specified framework will be returned. Specify multiple times to filter by multiple frameworks.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "ids",
            "in": "query",
            "description": "(comma-separated list of integers) if not empty, list of item IDs to return, instead of using all items in the project",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "integer"
              }
            }
          },
          {
            "name": "level",
            "in": "query",
            "description": "If not empty, only items with the specified level will be returned. Valid values: `debug`, `info`, `warning`, `error`, `critical`. Specifiy multiple times to filter by multiple levels.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number, starting from 1. 100 items are returned per page by default.",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "query",
            "in": "query",
            "description": "A search string, using the same format as the search box on the Items page.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "status",
            "in": "query",
            "description": "If not empty, only items with the specified status will be returned. Valid values: `active`, `resolved`, `muted`, `archived`. Specify multiple times to filter by multiple statuses.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "is_snoozed",
            "in": "query",
            "description": "If true, only snoozed items will be returned. If false, snoozed items will be excluded.",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "deprecated": false,
        "responses": {
          "200": {
            "description": "success",
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
                        "page": {
                          "type": "integer",
                          "example": 1
                        },
                        "total_count": {
                          "type": "integer",
                          "example": 50,
                          "description": "The count of all the items the query would return if no limit was applied."
                        },
                        "items": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "public_item_id": {
                                "type": [
                                  "integer",
                                  "null"
                                ]
                              },
                              "integrations_data": {
                                "type": [
                                  "string",
                                  "null"
                                ]
                              },
                              "level_lock": {
                                "type": "integer"
                              },
                              "controlling_id": {
                                "type": "integer"
                              },
                              "last_activated_timestamp": {
                                "type": "integer",
                                "example": 1658171383
                              },
                              "assigned_user_id": {
                                "type": [
                                  "integer",
                                  "null"
                                ]
                              },
                              "assigned_team_id": {
                                "type": [
                                  "integer",
                                  "null"
                                ]
                              },
                              "group_status": {
                                "type": "integer"
                              },
                              "hash": {
                                "type": "string"
                              },
                              "id": {
                                "type": "integer"
                              },
                              "environment": {
                                "type": "string",
                                "example": "production"
                              },
                              "title_lock": {
                                "type": "integer"
                              },
                              "title": {
                                "type": "string",
                                "example": "GraphQLError: Expected `join([])` to be called with an array of multiple elements, but got an empty array\n"
                              },
                              "last_occurrence_id": {
                                "type": "integer"
                              },
                              "platform": {
                                "type": "string"
                              },
                              "last_occurrence_timestamp": {
                                "type": "integer",
                                "example": 1658171387
                              },
                              "first_occurrence_timestamp": {
                                "type": "integer",
                                "example": 1658171383
                              },
                              "project_id": {
                                "type": "integer",
                                "example": 12345
                              },
                              "resolved_in_version": {
                                "type": [
                                  "string",
                                  "null"
                                ]
                              },
                              "status": {
                                "type": "string",
                                "description": "One of: `active`, `resolved`, `muted`.",
                                "example": "active"
                              },
                              "unique_occurrences": {
                                "type": [
                                  "integer",
                                  "null"
                                ]
                              },
                              "group_item_id": {
                                "type": [
                                  "integer",
                                  "null"
                                ]
                              },
                              "framework": {
                                "type": "string",
                                "example": "node-js",
                                "description": "For the full integer-framework\nmapping, please see the [Framework IDs](https://docs.rollbar.com/docs/rql#framework-ids) section in our docs.\n"
                              },
                              "level": {
                                "type": "string",
                                "example": "error"
                              },
                              "total_occurrences": {
                                "type": "integer",
                                "example": 3
                              },
                              "counter": {
                                "type": "integer",
                                "example": 123
                              },
                              "last_modified_by": {
                                "type": "integer"
                              },
                              "first_occurrence_id": {
                                "type": "integer",
                                "example": 123456789012
                              },
                              "activating_occurrence_id": {
                                "type": "integer",
                                "example": 123456789013
                              },
                              "last_resolved_timestamp": {
                                "type": [
                                  "integer",
                                  "null"
                                ]
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
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