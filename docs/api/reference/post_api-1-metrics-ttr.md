<!-- source: https://docs.rollbar.com/reference/post_api-1-metrics-ttr.md -->

# Get resolution time metrics for a list of projects

Get resolution time metrics for a provided list of project IDs. It can be filtered by environments, levels and frameworks.

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
      "name": "Metrics"
    }
  ],
  "info": {
    "title": "Rollbar API",
    "version": "1.0",
    "description": "# Getting Started\nThe Rollbar API provides a RESTful interface to much of the data in the\nsystem. It is used by our official libraries to report exceptions,\ndeploys, and other messages. It can be used to create notifiers for\nadditional languages, get data out to integrate with other systems, or\nwhatever else you can imagine. If the API is missing something you'd\nlike to see, please [let us know](support@rollbar.com).\n\n# Ping\nTo test whether you're able to ping the API server, you can simply run the\nfollowing command:\n\n```\ncurl 'https://api.rollbar.com/api/1/status/ping'\n```\n\nYou will get back pong from our server if your request was successful.\n\n# Timestamps\nAll timestamps (inputs and outputs) are GMT unix timestamps.\n\n# Authentication\nAuthentication is done via access token included as a header parameter. For authenticated requests, pass your access token\nthrough the `X-Rollbar-Access-Token` parameter in the header.\n\n```\ncurl -H \"X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN\" 'https://api.rollbar.com/api/1/item/12345'\n```\n\n## Project access tokens\nMany operations require a project-specific access token. You can find and administer your\naccess tokens in Settings -> Project Access Tokens. Access tokens can have any or\nall of the following scopes:\n\n### post_server_item\nCan perform all POST requests to /deploy/ and /item/. Can also be used to upload source maps (JS, proguard, dSym, flutter)\n\n### post_client_item\nCan perform POST requests to /item/, but only if the item has a client-side platform (browser, mobile)\n\n### read\nCan perform all GET requests\n\n### write\nCan perform PATCH and DELETE requests\n\n## Account Access Tokens\nOperations performed at the level of the account require an account-specific\naccess token. These can be found and managed at\n{Account name} Settings -> Account Access Tokens.\nAccount access tokens can have the following scopes:\n\n### read\nSupports all GET operations at the account level.\n\n### write\nSupports all POST, PUT, PATCH, and DELETE operations at the account level.\n\n# HTTP responses\nThe API can return the following HTTP response codes:\n\n### 200\tOK\nOperation was completed successfully\n\n### 400\tBad request\nThe request was malformed and could not be parsed.\n\n### 403\tAccess denied\nAccess token was missing, invalid, or does not have the necessary permissions.\n\n### 404\tNot found\nThe requested resource was not found. This response will be returned if the URL is entirely invalid (i.e. /asdf), or if it is a URL that could be valid but is referencing something that does not exist (i.e. /item/12345).\n\n### 413\tRequest entity too large\nThe request exceeded the maximum size of 128KB.\n\n### 422\tUnprocessable Entity\nThe request was parseable (i.e. valid JSON), but some parameters were missing or otherwise invalid.\n\n### 429\tToo Many Requests\nIf rate limiting is enabled for your access token, this return code signifies that\n\n# Examples\n\n### [api-examples](https://github.com/rollbar/api-examples)\nAuthor: Rollbar\n\nLanguage: Python\n\nExamples using RQL, deploys, occurrences, and reports\n\n### [api-people-example](https://github.com/rollbar/api-people-example)\nAuthor: Rollbar\n\nLanguage: Python\n\nShows how to gather the Person data for each occurrence of a list of items\n\n### [rolltools](https://github.com/jslate/rolltools)\nAuthor: Jonathan Slate\n\nLanguage: Ruby\n\nA few utilities using the Rollbar API\n"
  },
  "paths": {
    "/api/1/metrics/ttr": {
      "post": {
        "tags": [
          "Metrics"
        ],
        "summary": "Get resolution time metrics for a list of projects",
        "description": "Get resolution time metrics for a provided list of project IDs. It can be filtered by environments, levels and frameworks.",
        "parameters": [
          {
            "name": "X-Rollbar-Access-Token",
            "in": "header",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "string"
            },
            "description": "Use a Project or Account Access Token with 'read' scope (Account tokens require a project_id to be specified)"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TTRMetrics"
              },
              "example": {
                "start_time": 1669971600,
                "end_time": 1670576400,
                "granularity": "week",
                "function": "median",
                "timezone": "US/Pacific",
                "project_ids": [
                  1,
                  2,
                  3
                ],
                "environments": [
                  "production"
                ],
                "levels": [
                  "error"
                ],
                "frameworks": [
                  "pyramid"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "List of metrics for the requested project IDs",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "err": {
                      "type": "integer",
                      "enum": [
                        0
                      ]
                    },
                    "result": {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/TTRMetricsData"
                        },
                        "params": {
                          "$ref": "#/components/schemas/TTRMetricsParams"
                        }
                      }
                    }
                  }
                },
                "example": {
                  "err": 0,
                  "result": {
                    "data": [
                      {
                        "timestamp": 1669971600,
                        "ttr": 583399
                      },
                      {
                        "timestamp": 1670576400,
                        "ttr": 435324
                      }
                    ],
                    "params": {
                      "start_time": 1632500000,
                      "granularity": "week",
                      "function": "median"
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
  "components": {
    "schemas": {
      "TTRMetrics": {
        "type": "object",
        "required": [
          "start_time"
        ],
        "properties": {
          "start_time": {
            "type": "integer",
            "description": "Unix timestamp of start time for the query"
          },
          "end_time": {
            "type": "integer",
            "description": "Unix timestamp of end time for the query, inclusive. Default is the current timestamp"
          },
          "granularity": {
            "type": "string",
            "description": "Timepoint size of the returned results in: `second`, `minute`, `hour`, `day`, `week`, `month`, or `year`"
          },
          "function": {
            "type": "string",
            "description": "Function to aggregate: `mean`, `median`, `min` or `max`. Default is `median`"
          },
          "project_ids": {
            "type": "array",
            "description": "List of project IDs. Requires Account Access Token",
            "items": {
              "type": "integer",
              "description": "Project ID"
            }
          },
          "environments": {
            "type": "array",
            "description": "List of environment names",
            "items": {
              "type": "string",
              "description": "Environment name"
            }
          },
          "levels": {
            "type": "array",
            "description": "List of level names",
            "items": {
              "type": "string",
              "description": "Level name"
            }
          },
          "frameworks": {
            "type": "array",
            "description": "List of framework names",
            "items": {
              "type": "string",
              "description": "Framework name"
            }
          },
          "timezone": {
            "type": "string",
            "description": "Timezone. Default is `US/Pacific`. Other examples: `Europe/London`, `Japan`, and etc."
          }
        }
      },
      "TTRMetricsData": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "timestamp": {
              "type": "integer",
              "description": "Unix timestamp for the current timestamp groups"
            },
            "ttr": {
              "type": "integer",
              "description": "Value for the parameters selected"
            }
          }
        }
      },
      "TTRMetricsParams": {
        "type": "object",
        "properties": {
          "start_time": {
            "type": "integer",
            "description": "Start time selected"
          },
          "end_time": {
            "type": "integer",
            "description": "End time selected"
          },
          "granularity": {
            "type": "string",
            "description": "Granularity selected"
          },
          "function": {
            "type": "string",
            "description": "Function to aggregate selected"
          },
          "project_ids": {
            "type": "array",
            "description": "Project IDs selected"
          },
          "environments": {
            "type": "array",
            "description": "Environments selected"
          },
          "levels": {
            "type": "array",
            "description": "Levels selected"
          },
          "frameworks": {
            "type": "array",
            "description": "Frameworks selected"
          },
          "timezone": {
            "type": "string",
            "description": "Timezone selected"
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