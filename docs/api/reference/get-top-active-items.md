<!-- source: https://docs.rollbar.com/reference/get-top-active-items.md -->

# Get top active items

# Response
```json
{
  "err": 0,
  "result": [
    // each element in the list is an object with an "item" object and a "counts" list
    {
        // data describing the item (similar to that returned by GET /api/1/item/:id)
        "item": {
            "id": 2071,
            "counter": 1007,
            "environment": "production",
            "framework": 0,
            "last_occurrence_timestamp": 1728410581,
            "level": 40,
            "occurrences": 54,
            "project_id": 12345,
            "title": "Something went wrong",
            "unique_occurrences": 5
        },
        // list of occurrence counts in the past 24 hours. Oldest first.
        "counts": [12, 10, 7, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 5, 6]
    },
    { /* more elements ... */ }
  ]
}
```
By default, the sort of the top items is by the level of severity, then the number of occurrences. E.g. an item with a `warning` level and 300 occurrences will be below an item with an `error` level and 150 occurrences. This behavior can be changed by passing `sort=occurrences` in the query parameters, which will sort only by the number of occurrences in the time period.

Note that the level and framework are returned as integers here. `10`, `20`, `30`, `40`, and `50` representing the `debug`, `info`, `warning`, `error`, and `critical` levels, respectively. For the full integer-framework mapping, please see the [Framework IDs](https://docs.rollbar.com/docs/rql#framework-ids) section in our docs.

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
      "name": "Reports"
    }
  ],
  "info": {
    "title": "Rollbar API",
    "version": "1.0",
    "description": "# Getting Started\nThe Rollbar API provides a RESTful interface to much of the data in the\nsystem. It is used by our official libraries to report exceptions,\ndeploys, and other messages. It can be used to create notifiers for\nadditional languages, get data out to integrate with other systems, or\nwhatever else you can imagine. If the API is missing something you'd\nlike to see, please [let us know](support@rollbar.com).\n\n# Ping\nTo test whether you're able to ping the API server, you can simply run the\nfollowing command:\n\n```\ncurl 'https://api.rollbar.com/api/1/status/ping'\n```\n\nYou will get back pong from our server if your request was successful.\n\n# Timestamps\nAll timestamps (inputs and outputs) are GMT unix timestamps.\n\n# Authentication\nAuthentication is done via access token included as a header parameter. For authenticated requests, pass your access token\nthrough the `X-Rollbar-Access-Token` parameter in the header.\n\n```\ncurl -H \"X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN\" 'https://api.rollbar.com/api/1/item/12345'\n```\n\n## Project access tokens\nMany operations require a project-specific access token. You can find and administer your\naccess tokens in Settings -> Project Access Tokens. Access tokens can have any or\nall of the following scopes:\n\n### post_server_item\nCan perform all POST requests to /deploy/ and /item/. Can also be used to upload source maps (JS, proguard, dSym, flutter)\n\n### post_client_item\nCan perform POST requests to /item/, but only if the item has a client-side platform (browser, mobile)\n\n### read\nCan perform all GET requests\n\n### write\nCan perform PATCH and DELETE requests\n\n## Account Access Tokens\nOperations performed at the level of the account require an account-specific\naccess token. These can be found and managed at\n{Account name} Settings -> Account Access Tokens.\nAccount access tokens can have the following scopes:\n\n### read\nSupports all GET operations at the account level.\n\n### write\nSupports all POST, PUT, PATCH, and DELETE operations at the account level.\n\n# HTTP responses\nThe API can return the following HTTP response codes:\n\n### 200\tOK\nOperation was completed successfully\n\n### 400\tBad request\nThe request was malformed and could not be parsed.\n\n### 403\tAccess denied\nAccess token was missing, invalid, or does not have the necessary permissions.\n\n### 404\tNot found\nThe requested resource was not found. This response will be returned if the URL is entirely invalid (i.e. /asdf), or if it is a URL that could be valid but is referencing something that does not exist (i.e. /item/12345).\n\n### 413\tRequest entity too large\nThe request exceeded the maximum size of 128KB.\n\n### 422\tUnprocessable Entity\nThe request was parseable (i.e. valid JSON), but some parameters were missing or otherwise invalid.\n\n### 429\tToo Many Requests\nIf rate limiting is enabled for your access token, this return code signifies that\n\n# Examples\n\n### [api-examples](https://github.com/rollbar/api-examples)\nAuthor: Rollbar\n\nLanguage: Python\n\nExamples using RQL, deploys, occurrences, and reports\n\n### [api-people-example](https://github.com/rollbar/api-people-example)\nAuthor: Rollbar\n\nLanguage: Python\n\nShows how to gather the Person data for each occurrence of a list of items\n\n### [rolltools](https://github.com/jslate/rolltools)\nAuthor: Jonathan Slate\n\nLanguage: Ruby\n\nA few utilities using the Rollbar API\n"
  },
  "paths": {
    "/api/1/reports/top_active_items": {
      "get": {
        "tags": [
          "Reports"
        ],
        "summary": "Get top active items",
        "description": "# Response\n```json\n{\n  \"err\": 0,\n  \"result\": [\n    // each element in the list is an object with an \"item\" object and a \"counts\" list\n    {\n        // data describing the item (similar to that returned by GET /api/1/item/:id)\n        \"item\": {\n            \"id\": 2071,\n            \"counter\": 1007,\n            \"environment\": \"production\",\n            \"framework\": 0,\n            \"last_occurrence_timestamp\": 1728410581,\n            \"level\": 40,\n            \"occurrences\": 54,\n            \"project_id\": 12345,\n            \"title\": \"Something went wrong\",\n            \"unique_occurrences\": 5\n        },\n        // list of occurrence counts in the past 24 hours. Oldest first.\n        \"counts\": [12, 10, 7, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 5, 6]\n    },\n    { /* more elements ... */ }\n  ]\n}\n```\nBy default, the sort of the top items is by the level of severity, then the number of occurrences. E.g. an item with a `warning` level and 300 occurrences will be below an item with an `error` level and 150 occurrences. This behavior can be changed by passing `sort=occurrences` in the query parameters, which will sort only by the number of occurrences in the time period.\n\nNote that the level and framework are returned as integers here. `10`, `20`, `30`, `40`, and `50` representing the `debug`, `info`, `warning`, `error`, and `critical` levels, respectively. For the full integer-framework mapping, please see the [Framework IDs](https://docs.rollbar.com/docs/rql#framework-ids) section in our docs.\n",
        "operationId": "get-top-active-items",
        "parameters": [
          {
            "$ref": "#/paths/~1api~11~1instances/get/parameters/0"
          },
          {
            "name": "hours",
            "in": "query",
            "description": "Number of recent hours to consider. Min `1`, max `168`.",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 24
            }
          },
          {
            "name": "environments",
            "in": "query",
            "description": "Comma-separated list of environments to consider. If empty, then returns results for \"any environment\".",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sort",
            "in": "query",
            "description": "To sort by occurrences only and not by item level, add `sort=occurrences`. This is the only accepted value for sort at this time, any other value will return an error.",
            "required": false,
            "schema": {
              "type": "string",
              "enum": [
                "occurrences"
              ]
            }
          }
        ],
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
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "item": {
                            "type": "object",
                            "properties": {
                              "id": {
                                "type": "integer"
                              },
                              "environment": {
                                "type": "string",
                                "example": "production"
                              },
                              "title": {
                                "type": "string",
                                "example": "GraphQLError: Expected `join([])` to be called with an array of multiple elements, but got an empty array\n"
                              },
                              "last_occurrence_timestamp": {
                                "type": "integer",
                                "example": 1658171387
                              },
                              "project_id": {
                                "type": "integer",
                                "example": 12345
                              },
                              "unique_occurrences": {
                                "type": [
                                  "integer",
                                  "null"
                                ]
                              },
                              "occurrences": {
                                "type": "integer"
                              },
                              "framework": {
                                "type": "integer",
                                "description": "For the full integer-framework\nmapping, please see the [Framework IDs](https://docs.rollbar.com/docs/rql#framework-ids) section in our docs.\n"
                              },
                              "level": {
                                "type": "integer",
                                "example": 50
                              },
                              "counter": {
                                "type": "integer",
                                "example": 123
                              },
                              "group_status": {
                                "type": "integer",
                                "example": 1
                              }
                            }
                          },
                          "counts": {
                            "description": "list of occurrence counts in the past 24 hours. Oldest first.",
                            "type": "array",
                            "items": {
                              "type": "integer"
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