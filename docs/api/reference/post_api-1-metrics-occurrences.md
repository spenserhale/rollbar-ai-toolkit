<!-- source: https://docs.rollbar.com/reference/post_api-1-metrics-occurrences.md -->

# Occurrences over a span of time

Get occurrences metrics over a span of time by filtering, grouping, and aggregating. The endpoint follows search/query semantics as a POST request using project read access token.

List of **columns/fields** that can be used with some components of your query:
* `project_id`
* `item_id`
* `environment`
* `browser_family`
* `browser_version`
* `os_family`
* `os_version`
* `device_brand`
* `device_model`
* `ip_address`
* `item_status`
* `item_level`
* `item_group_item_id`
* `item_title`
* `item_counter`
* `person_username`
* `person_email`
* `person_id`
* `code_version`
* `count`
* `occurrence_id`
* `uuid`
* `context`
* `platform`
* `framework`
* `platform_canonical`
* `framework_canonical`
* `language`
* `language_name`
* `notifier_name`
* `notifier_version`
* `occurrence_count`
* `message_body`
* `timestamp`
* `fingerprint`
* `server_host`
* `server_root`
* `server_pid`
* `server_cpu`
* `scm_branch`
* `request_url`
* `request_method`
* `request_query_string`
* `request_body`

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
    "/api/1/metrics/occurrences": {
      "post": {
        "tags": [
          "Metrics"
        ],
        "summary": "Occurrences over a span of time",
        "description": "Get occurrences metrics over a span of time by filtering, grouping, and aggregating. The endpoint follows search/query semantics as a POST request using project read access token.\n\nList of **columns/fields** that can be used with some components of your query:\n* `project_id`\n* `item_id`\n* `environment`\n* `browser_family`\n* `browser_version`\n* `os_family`\n* `os_version`\n* `device_brand`\n* `device_model`\n* `ip_address`\n* `item_status`\n* `item_level`\n* `item_group_item_id`\n* `item_title`\n* `item_counter`\n* `person_username`\n* `person_email`\n* `person_id`\n* `code_version`\n* `count`\n* `occurrence_id`\n* `uuid`\n* `context`\n* `platform`\n* `framework`\n* `platform_canonical`\n* `framework_canonical`\n* `language`\n* `language_name`\n* `notifier_name`\n* `notifier_version`\n* `occurrence_count`\n* `message_body`\n* `timestamp`\n* `fingerprint`\n* `server_host`\n* `server_root`\n* `server_pid`\n* `server_cpu`\n* `scm_branch`\n* `request_url`\n* `request_method`\n* `request_query_string`\n* `request_body`\n",
        "parameters": [
          {
            "$ref": "#/paths/~1api~11~1instances/get/parameters/0"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OccurrencesMetrics"
              },
              "example": {
                "start_time": 1632500000,
                "end_time": 1632600000,
                "group_by": [
                  "item_counter",
                  "environment",
                  "item_status",
                  "item_level"
                ],
                "aggregates": [
                  {
                    "field": "person_id",
                    "function": "count_distinct",
                    "alias": "person_count"
                  },
                  {
                    "field": "ip_address",
                    "function": "count_distinct",
                    "alias": "ip_address_count"
                  }
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "List of timepoints for the provided occurences metrics query",
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
                      "$ref": "#/components/schemas/OccurencesMetricsResult"
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
      "OccurrencesMetricsAggregateColumns": {
        "type": "string",
        "enum": [
          "project_id",
          "item_id",
          "environment",
          "browser_family",
          "browser_version",
          "os_family",
          "os_version",
          "device_brand",
          "device_model",
          "ip_address",
          "item_status",
          "item_level",
          "item_group_item_id",
          "item_title",
          "item_counter",
          "person_username",
          "person_email",
          "person_id",
          "code_version",
          "count",
          "occurrence_id",
          "uuid",
          "context",
          "platform",
          "framework",
          "platform_canonical",
          "framework_canonical",
          "language",
          "language_name",
          "notifier_name",
          "notifier_version",
          "occurrence_count",
          "message_body",
          "timestamp",
          "fingerprint",
          "server_host",
          "server_root",
          "server_pid",
          "server_cpu",
          "scm_branch",
          "request_url",
          "request_method",
          "request_query_string",
          "request_body"
        ]
      },
      "OccurrencesMetricsAggregateFunctions": {
        "type": "string",
        "enum": [
          "count_all",
          "count_distinct",
          "max",
          "min"
        ]
      },
      "OccurrencesMetrics": {
        "type": "object",
        "required": [
          "start_time",
          "end_time"
        ],
        "properties": {
          "start_time": {
            "type": "integer",
            "description": "Unix timestamp of start time for the query"
          },
          "end_time": {
            "type": "integer",
            "description": "Unix timestamp of end time for the query, inclusive"
          },
          "filters": {
            "type": "array",
            "description": "Array of JSON objects containing field/value entries of column name and an array of match values. Supports: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `not_like`, `between`, and `not_between` operators. `eq` and `ne` supports multiple values",
            "items": {
              "type": "object",
              "properties": {
                "field": {
                  "description": "Field/column name for wich the filter will be applied to",
                  "$ref": "#/components/schemas/OccurrencesMetricsAggregateColumns"
                },
                "values": {
                  "type": "array",
                  "description": "Filtered possible values of the specified column/field",
                  "items": {
                    "type": "string",
                    "description": ""
                  }
                },
                "operator": {
                  "type": "string",
                  "description": "Operator to use for filtering, eg: `eq`, `gt`, and etc."
                }
              }
            }
          },
          "group_by": {
            "type": "array",
            "description": "An array of column names on which to group the results",
            "items": {
              "$ref": "#/components/schemas/OccurrencesMetricsAggregateColumns"
            }
          },
          "aggregates": {
            "type": "array",
            "description": "An array of columns on which an aggregate function should be performed for each group. An alias name may also be set, which will be used in the response. Supported functions are: `count_all`, `count_distinct`, `max`, and `min`",
            "items": {
              "type": "object",
              "description": "Aggregate",
              "properties": {
                "field": {
                  "description": "Column to aggregate on",
                  "$ref": "#/components/schemas/OccurrencesMetricsAggregateColumns"
                },
                "function": {
                  "description": "Aggregate function to apply",
                  "$ref": "#/components/schemas/OccurrencesMetricsAggregateFunctions"
                },
                "alias": {
                  "description": "Alias name to set in the response",
                  "type": "string"
                }
              }
            }
          },
          "sort": {
            "type": "object",
            "description": "Sort on a specified column/field name",
            "properties": {
              "order": {
                "type": "string",
                "description": "Sort direction: `asc` or `desc`"
              },
              "field": {
                "type": "string",
                "description": "Name of the column/field to sort on"
              }
            }
          },
          "granularity": {
            "type": "string",
            "description": "Timepoint size of the returned results in: `second`, `minute`, `hour`, `day`, `week`, `month`, or `year`"
          },
          "timezone": {
            "type": "string",
            "description": "Optional, default is `US/Pacific`. Other examples: `Europe/London`, `Japan`, and etc."
          },
          "limit": {
            "type": "integer",
            "description": "Total rows/groups to return in the set"
          },
          "offset": {
            "type": "integer",
            "description": "Specific offset/starting point"
          }
        }
      },
      "OccurencesMetricsResult": {
        "type": "object",
        "properties": {
          "last_occurrence_id": {
            "type": "integer",
            "description": "The occurrence id of the last occurrence in the result set"
          },
          "last_occurrence_timestamp": {
            "type": "integer",
            "description": "The timestamp of the last occurrence in the result set"
          },
          "timepoints": {
            "allOf": [
              {
                "$ref": "#/components/schemas/OccurencesMetricsTimepoints"
              }
            ]
          }
        }
      },
      "OccurencesMetricsTimepoints": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "timestamp": {
              "type": "integer",
              "description": "Unix timestamp for the current timestamp groups"
            },
            "metrics_rows": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "field": {
                    "type": "string",
                    "description": "Field name or alias name for the current group"
                  },
                  "value": {
                    "type": "integer",
                    "description": "The calculated value of the current group"
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