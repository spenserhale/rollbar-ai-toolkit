<!-- source: https://docs.rollbar.com/reference/put_api-1-notifications-slack-rule-rule-id.md -->

# /api/1/notifications/slack/rule/{rule_id}

Update a notification rule by ID

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
      "name": "Slack Notification Rules"
    }
  ],
  "info": {
    "title": "Rollbar API",
    "version": "1.0",
    "description": "# Getting Started\nThe Rollbar API provides a RESTful interface to much of the data in the\nsystem. It is used by our official libraries to report exceptions,\ndeploys, and other messages. It can be used to create notifiers for\nadditional languages, get data out to integrate with other systems, or\nwhatever else you can imagine. If the API is missing something you'd\nlike to see, please [let us know](support@rollbar.com).\n\n# Ping\nTo test whether you're able to ping the API server, you can simply run the\nfollowing command:\n\n```\ncurl 'https://api.rollbar.com/api/1/status/ping'\n```\n\nYou will get back pong from our server if your request was successful.\n\n# Timestamps\nAll timestamps (inputs and outputs) are GMT unix timestamps.\n\n# Authentication\nAuthentication is done via access token included as a header parameter. For authenticated requests, pass your access token\nthrough the `X-Rollbar-Access-Token` parameter in the header.\n\n```\ncurl -H \"X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN\" 'https://api.rollbar.com/api/1/item/12345'\n```\n\n## Project access tokens\nMany operations require a project-specific access token. You can find and administer your\naccess tokens in Settings -> Project Access Tokens. Access tokens can have any or\nall of the following scopes:\n\n### post_server_item\nCan perform all POST requests to /deploy/ and /item/. Can also be used to upload source maps (JS, proguard, dSym, flutter)\n\n### post_client_item\nCan perform POST requests to /item/, but only if the item has a client-side platform (browser, mobile)\n\n### read\nCan perform all GET requests\n\n### write\nCan perform PATCH and DELETE requests\n\n## Account Access Tokens\nOperations performed at the level of the account require an account-specific\naccess token. These can be found and managed at\n{Account name} Settings -> Account Access Tokens.\nAccount access tokens can have the following scopes:\n\n### read\nSupports all GET operations at the account level.\n\n### write\nSupports all POST, PUT, PATCH, and DELETE operations at the account level.\n\n# HTTP responses\nThe API can return the following HTTP response codes:\n\n### 200\tOK\nOperation was completed successfully\n\n### 400\tBad request\nThe request was malformed and could not be parsed.\n\n### 403\tAccess denied\nAccess token was missing, invalid, or does not have the necessary permissions.\n\n### 404\tNot found\nThe requested resource was not found. This response will be returned if the URL is entirely invalid (i.e. /asdf), or if it is a URL that could be valid but is referencing something that does not exist (i.e. /item/12345).\n\n### 413\tRequest entity too large\nThe request exceeded the maximum size of 128KB.\n\n### 422\tUnprocessable Entity\nThe request was parseable (i.e. valid JSON), but some parameters were missing or otherwise invalid.\n\n### 429\tToo Many Requests\nIf rate limiting is enabled for your access token, this return code signifies that\n\n# Examples\n\n### [api-examples](https://github.com/rollbar/api-examples)\nAuthor: Rollbar\n\nLanguage: Python\n\nExamples using RQL, deploys, occurrences, and reports\n\n### [api-people-example](https://github.com/rollbar/api-people-example)\nAuthor: Rollbar\n\nLanguage: Python\n\nShows how to gather the Person data for each occurrence of a list of items\n\n### [rolltools](https://github.com/jslate/rolltools)\nAuthor: Jonathan Slate\n\nLanguage: Ruby\n\nA few utilities using the Rollbar API\n"
  },
  "paths": {
    "/api/1/notifications/slack/rule/{rule_id}": {
      "put": {
        "tags": [
          "Slack Notification Rules"
        ],
        "description": "Update a notification rule by ID",
        "parameters": [
          {
            "$ref": "#/paths/~1api~11~1service_links/post/parameters/0"
          },
          {
            "$ref": "#/paths/~1api~11~1notifications~1slack~1rule~1%7Brule_id%7D/get/parameters/1"
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SlackRule"
              },
              "example": {
                "trigger": "new_item",
                "status": "enabled",
                "filters": [
                  {
                    "type": "environment",
                    "operation": "eq",
                    "value": "production"
                  },
                  {
                    "type": "level",
                    "operation": "gte",
                    "value": "error"
                  }
                ]
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/SlackRuleResponse"
                },
                "example": {
                  "err": 0,
                  "result": {
                    "id": 1000,
                    "trigger": "new_item",
                    "status": "enabled",
                    "filters": [
                      {
                        "type": "environment",
                        "operation": "eq",
                        "value": "production"
                      },
                      {
                        "type": "level",
                        "operation": "gte",
                        "value": "error"
                      }
                    ]
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
      "SlackRule": {
        "type": "object",
        "anyOf": [
          {
            "$ref": "#/components/schemas/NewItemSlackRule"
          },
          {
            "$ref": "#/components/schemas/OccurrenceSlackRule"
          },
          {
            "$ref": "#/components/schemas/DeploySlackRule"
          },
          {
            "$ref": "#/components/schemas/ReactivatedItemSlackRule"
          },
          {
            "$ref": "#/components/schemas/ResolvedItemSlackRule"
          },
          {
            "$ref": "#/components/schemas/NewVersionSlackRule"
          },
          {
            "$ref": "#/components/schemas/ReopenedItemSlackRule"
          },
          {
            "$ref": "#/components/schemas/OccurrenceRateSlackRule"
          },
          {
            "$ref": "#/components/schemas/ExpRepeatItemSlackRule"
          }
        ],
        "discriminator": {
          "propertyName": "trigger",
          "mapping": {
            "new_item": "#/components/schemas/NewItemSlackRule",
            "occurrence": "#/components/schemas/OccurrenceSlackRule",
            "deploy": "#/components/schemas/DeploySlackRule",
            "reactivated_item": "#/components/schemas/ReactivatedItemSlackRule",
            "resolved_item": "#/components/schemas/ResolvedItemSlackRule",
            "new_version": "#/components/schemas/NewVersionSlackRule",
            "reopened_item": "#/components/schemas/ReopenedItemSlackRule",
            "occurrence_rate": "#/components/schemas/OccurrenceRateSlackRule",
            "exp_repeat_item": "#/components/schemas/ExpRepeatItemSlackRule"
          }
        },
        "maxLength": 50,
        "uniqueItems": true
      },
      "SlackRuleResponse": {
        "type": "object",
        "properties": {
          "err": {
            "type": "integer",
            "enum": [
              0,
              1
            ]
          },
          "result": {
            "$ref": "#/components/schemas/SlackRule"
          }
        }
      },
      "SlackRuleConfig": {
        "type": "object",
        "properties": {
          "config": {
            "type": "object",
            "properties": {
              "message_template": {
                "type": "string",
                "description": "Define a custom template for the Slack message. More information here https://docs.rollbar.com/docs/slack#section-tips-tricks"
              },
              "show_message_buttons": {
                "type": "boolean",
                "description": "Show the Slack actionable buttons"
              },
              "channel": {
                "type": "string",
                "description": "The Slack channel to send the messages",
                "example": "#general"
              }
            }
          }
        }
      },
      "SlackRuleConfigNoButtons": {
        "type": "object",
        "properties": {
          "config": {
            "type": "object",
            "properties": {
              "message_template": {
                "type": "string",
                "description": "Define a custom template for the Slack message. More information here https://docs.rollbar.com/docs/slack#section-tips-tricks"
              },
              "channel": {
                "type": "string",
                "description": "The Slack channel to send the messages",
                "example": "#general"
              }
            }
          }
        }
      },
      "SlackAction": {
        "type": "object",
        "properties": {
          "action": {
            "type": "string",
            "enum": [
              "send_message"
            ],
            "default": "send_message",
            "description": "The action associated with this rule"
          }
        }
      },
      "NewItemSlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/NewItemRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfig"
          }
        ]
      },
      "OccurrenceSlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/OccurrenceRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfig"
          }
        ]
      },
      "DeploySlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/DeployRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfigNoButtons"
          }
        ]
      },
      "ReactivatedItemSlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/ReactivatedItemRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfig"
          }
        ]
      },
      "ResolvedItemSlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/ResolvedItemRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfig"
          }
        ]
      },
      "NewVersionSlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/NewVersionRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfigNoButtons"
          }
        ]
      },
      "ReopenedItemSlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/ReopenedItemRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfig"
          }
        ]
      },
      "OccurrenceRateSlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/OccurrenceRateRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfig"
          }
        ]
      },
      "ExpRepeatItemSlackRule": {
        "type": "object",
        "allOf": [
          {
            "$ref": "#/components/schemas/ExpRepeatItemRule"
          },
          {
            "$ref": "#/components/schemas/SlackAction"
          },
          {
            "$ref": "#/components/schemas/SlackRuleConfigNoButtons"
          }
        ]
      },
      "NewItemRule": {
        "type": "object",
        "required": [
          "trigger"
        ],
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "new_item"
            ],
            "description": "An error/ message is seen for the first time"
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "description": "To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents.",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                },
                {
                  "$ref": "#/components/schemas/level_filter"
                },
                {
                  "$ref": "#/components/schemas/title_filter"
                },
                {
                  "$ref": "#/components/schemas/filename_filter"
                },
                {
                  "$ref": "#/components/schemas/context_filter"
                },
                {
                  "$ref": "#/components/schemas/method_filter"
                },
                {
                  "$ref": "#/components/schemas/framework_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter_with_exists"
                }
              ]
            }
          }
        }
      },
      "OccurrenceRule": {
        "type": "object",
        "required": [
          "trigger"
        ],
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "occurrence"
            ],
            "description": "Every time an error/ message occurs (use wisely!)."
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "description": "To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents.",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                },
                {
                  "$ref": "#/components/schemas/level_filter"
                },
                {
                  "$ref": "#/components/schemas/title_filter"
                },
                {
                  "$ref": "#/components/schemas/filename_filter"
                },
                {
                  "$ref": "#/components/schemas/context_filter"
                },
                {
                  "$ref": "#/components/schemas/method_filter"
                },
                {
                  "$ref": "#/components/schemas/framework_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter_with_exists"
                },
                {
                  "$ref": "#/components/schemas/unique_occurences_filter"
                }
              ]
            }
          }
        }
      },
      "DeployRule": {
        "type": "object",
        "required": [
          "trigger"
        ],
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "deploy"
            ],
            "description": "A new deploy is reported."
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "description": "To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents.",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                },
                {
                  "$ref": "#/components/schemas/comment_filter"
                }
              ]
            }
          }
        }
      },
      "ReactivatedItemRule": {
        "required": [
          "trigger"
        ],
        "type": "object",
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "reactivated_item"
            ],
            "description": "An error/message occurs again after being marked Resolved"
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "description": "To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents.",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                },
                {
                  "$ref": "#/components/schemas/level_filter"
                },
                {
                  "$ref": "#/components/schemas/title_filter"
                },
                {
                  "$ref": "#/components/schemas/filename_filter"
                },
                {
                  "$ref": "#/components/schemas/context_filter"
                },
                {
                  "$ref": "#/components/schemas/method_filter"
                },
                {
                  "$ref": "#/components/schemas/framework_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter_with_exists"
                },
                {
                  "$ref": "#/components/schemas/unique_occurences_filter"
                }
              ]
            }
          }
        }
      },
      "ResolvedItemRule": {
        "required": [
          "trigger"
        ],
        "type": "object",
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "resolved_item"
            ],
            "description": "An error/message is marked Resolved."
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                },
                {
                  "$ref": "#/components/schemas/level_filter"
                },
                {
                  "$ref": "#/components/schemas/title_filter"
                },
                {
                  "$ref": "#/components/schemas/filename_filter"
                },
                {
                  "$ref": "#/components/schemas/context_filter"
                },
                {
                  "$ref": "#/components/schemas/method_filter"
                },
                {
                  "$ref": "#/components/schemas/framework_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter_with_exists"
                },
                {
                  "$ref": "#/components/schemas/unique_occurences_filter"
                }
              ]
            }
          }
        }
      },
      "NewVersionRule": {
        "required": [
          "trigger"
        ],
        "type": "object",
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "new_version"
            ],
            "description": "A new code version is detected"
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "description": "To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents.",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                }
              ]
            }
          }
        }
      },
      "ReopenedItemRule": {
        "required": [
          "trigger"
        ],
        "type": "object",
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "reopened_item"
            ],
            "description": "An error/message is marked Active by a user."
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "description": "To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents.",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                },
                {
                  "$ref": "#/components/schemas/level_filter"
                },
                {
                  "$ref": "#/components/schemas/title_filter"
                },
                {
                  "$ref": "#/components/schemas/filename_filter"
                },
                {
                  "$ref": "#/components/schemas/context_filter"
                },
                {
                  "$ref": "#/components/schemas/method_filter"
                },
                {
                  "$ref": "#/components/schemas/framework_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter_with_exists"
                },
                {
                  "$ref": "#/components/schemas/unique_occurences_filter"
                }
              ]
            }
          }
        }
      },
      "OccurrenceRateRule": {
        "required": [
          "trigger"
        ],
        "type": "object",
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "occurrence_rate"
            ],
            "description": "{x} occurrences seen in {y} minutes"
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "description": "To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents.",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                },
                {
                  "$ref": "#/components/schemas/level_filter"
                },
                {
                  "$ref": "#/components/schemas/title_filter"
                },
                {
                  "$ref": "#/components/schemas/filename_filter"
                },
                {
                  "$ref": "#/components/schemas/context_filter"
                },
                {
                  "$ref": "#/components/schemas/method_filter"
                },
                {
                  "$ref": "#/components/schemas/framework_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter_with_exists"
                },
                {
                  "$ref": "#/components/schemas/unique_occurences_filter"
                },
                {
                  "$ref": "#/components/schemas/rate_filter"
                }
              ]
            }
          }
        }
      },
      "ExpRepeatItemRule": {
        "required": [
          "trigger"
        ],
        "type": "object",
        "properties": {
          "trigger": {
            "type": "string",
            "enum": [
              "exp_repeat_item"
            ],
            "description": "10th, 100th, 1,000th, 10,000th, … occurrence"
          },
          "status": {
            "type": "string",
            "enum": [
              "enabled",
              "disabled"
            ],
            "description": "Whether the rule should be active or not."
          },
          "filters": {
            "type": "array",
            "description": "To keep your notifications relevant, you'll want to apply filters to limit when they send messages or create incidents.",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/environment_filter"
                },
                {
                  "$ref": "#/components/schemas/level_filter"
                },
                {
                  "$ref": "#/components/schemas/title_filter"
                },
                {
                  "$ref": "#/components/schemas/filename_filter"
                },
                {
                  "$ref": "#/components/schemas/context_filter"
                },
                {
                  "$ref": "#/components/schemas/method_filter"
                },
                {
                  "$ref": "#/components/schemas/framework_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter"
                },
                {
                  "$ref": "#/components/schemas/path_filter_with_exists"
                },
                {
                  "$ref": "#/components/schemas/unique_occurences_filter"
                },
                {
                  "$ref": "#/components/schemas/rate_filter"
                }
              ]
            }
          }
        }
      },
      "path_filter": {
        "type": "object",
        "example": "body.body.trace.exception.message",
        "properties": {
          "path": {
            "type": "string"
          },
          "type": {
            "enum": [
              "path"
            ],
            "type": "string",
            "description": "Allows for filtering based on any data in the JSON payload. To view the JSON structure of your errors, check out the Raw JSON section of any occurrence"
          },
          "value": {
            "type": "string"
          },
          "operation": {
            "enum": [
              "eq",
              "gte",
              "lte",
              "within",
              "nwithin",
              "neq",
              "regex",
              "nregex",
              "startswith"
            ],
            "type": "string"
          }
        },
        "required": [
          "path",
          "type",
          "operation",
          "value"
        ]
      },
      "path_filter_with_exists": {
        "type": "object",
        "example": "body.body.trace.exception.message",
        "properties": {
          "path": {
            "type": "string"
          },
          "type": {
            "enum": [
              "path"
            ],
            "type": "string",
            "description": "Allows for filtering based on any data in the JSON payload. To view the JSON structure of your errors, check out the Raw JSON section of any occurrence"
          },
          "value": {
            "type": "string"
          },
          "operation": {
            "enum": [
              "eq",
              "gte",
              "lte",
              "within",
              "nwithin",
              "neq",
              "regex",
              "nregex",
              "startswith",
              "exists",
              "nexists"
            ],
            "type": "string"
          }
        },
        "required": [
          "path",
          "type",
          "operation"
        ]
      },
      "level_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "level"
            ],
            "type": "string",
            "description": "Item Level"
          },
          "operation": {
            "type": "string",
            "enum": [
              "eq",
              "gte"
            ]
          },
          "value": {
            "type": "string",
            "enum": [
              "debug",
              "info",
              "warning",
              "error",
              "critical"
            ]
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
      },
      "title_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "title"
            ],
            "type": "string",
            "description": "Item Title"
          },
          "operation": {
            "type": "string",
            "enum": [
              "within",
              "nwithin",
              "regex",
              "nregex"
            ]
          },
          "value": {
            "type": "string"
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
      },
      "filename_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "filename"
            ],
            "type": "string",
            "description": "Matches the name of any file in the stack trace"
          },
          "operation": {
            "type": "string",
            "enum": [
              "within",
              "nwithin",
              "regex",
              "nregex"
            ]
          },
          "value": {
            "type": "string"
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
      },
      "context_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "context"
            ],
            "type": "string",
            "description": "Matches context value (if included in payload)"
          },
          "operation": {
            "type": "string",
            "enum": [
              "startswith",
              "eq",
              "neq"
            ]
          },
          "value": {
            "type": "string"
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
      },
      "method_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "method"
            ],
            "type": "string",
            "description": "Matches any method in the stack trace"
          },
          "operation": {
            "type": "string",
            "enum": [
              "within",
              "nwithin",
              "regex",
              "nregex"
            ]
          },
          "value": {
            "type": "string"
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
      },
      "framework_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "framework"
            ],
            "type": "string",
            "description": "Platform/language of the item"
          },
          "operation": {
            "type": "string",
            "enum": [
              "eq"
            ]
          },
          "value": {
            "type": "string"
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
      },
      "unique_occurences_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "unique_occurrences"
            ],
            "type": "string",
            "description": "Number of unique IPs affected for the item"
          },
          "operation": {
            "type": "string",
            "enum": [
              "gte"
            ]
          },
          "value": {
            "type": "number"
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
      },
      "comment_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "comment"
            ],
            "type": "string",
            "description": "Body of an item comment"
          },
          "operation": {
            "type": "string",
            "enum": [
              "within"
            ]
          },
          "value": {
            "type": "string"
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
      },
      "rate_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "rate"
            ],
            "type": "string",
            "description": "Rate of occurrences of an item"
          },
          "period": {
            "type": "number",
            "description": "Number of seconds"
          },
          "count": {
            "type": "number"
          }
        },
        "required": [
          "type",
          "period",
          "count"
        ]
      },
      "environment_filter": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "environment"
            ],
            "type": "string",
            "description": "Item Environment"
          },
          "operation": {
            "type": "string",
            "enum": [
              "eq",
              "neq"
            ]
          },
          "value": {
            "type": "string"
          }
        },
        "required": [
          "type",
          "operation",
          "value"
        ]
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