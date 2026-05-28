<!-- source: https://docs.rollbar.com/reference/update-an-item.md -->

# Update an item

Used to modify an item's state. Currently supports:
* setting the status, level, title, assigned user
* when resolving, setting the "resolved in version"
* snoozing / unsnoozing an item (only available for paid accounts)
* setting the item owner to a team (only available for Advanced and Enterprise accounts)

Example -
```curl
curl -X PATCH 'https://api.rollbar.com/api/1/item/275123456' \
  --header "Content-Type: application/json" \
  --data '{"status": "resolved", "resolved_in_version": "aabbcc1"}'
  ```

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
    "/api/1/item/{itemid}": {
      "patch": {
        "tags": [
          "Item"
        ],
        "summary": "Update an item",
        "description": "Used to modify an item's state. Currently supports:\n* setting the status, level, title, assigned user\n* when resolving, setting the \"resolved in version\"\n* snoozing / unsnoozing an item (only available for paid accounts)\n* setting the item owner to a team (only available for Advanced and Enterprise accounts)\n\nExample -\n```curl\ncurl -X PATCH 'https://api.rollbar.com/api/1/item/275123456' \\\n  --header \"Content-Type: application/json\" \\\n  --data '{\"status\": \"resolved\", \"resolved_in_version\": \"aabbcc1\"}'\n  ```\n",
        "operationId": "update-an-item",
        "parameters": [
          {
            "name": "itemid",
            "in": "path",
            "description": "System-wide id (not project counter) of the item to be modified.",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "$ref": "#/paths/~1api~11~1service_links/post/parameters/0"
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "description": "If present, the new status. Valid values: `active`, `resolved`, `muted`."
                  },
                  "resolved_in_version": {
                    "type": "string",
                    "description": "If not empty, a string up to 40 characters describing the version that the item was resolved in. Only used if `status` is set to `resolved`."
                  },
                  "title": {
                    "type": "string",
                    "description": "If present, the new title. Should be a string with length 1 to 255."
                  },
                  "level": {
                    "type": "string",
                    "description": "If present, the new level. Valid values: `critical`, `error`, `warning`, `info`, `debug`"
                  },
                  "assigned_user_id": {
                    "type": "integer",
                    "description": "If present, the new assigned user ID. Valid values are null or any user ID with access to this item.",
                    "format": "int32"
                  },
                  "assigned_team_id": {
                    "type": "integer",
                    "description": "If present, the new assigned team ID. Valid values are null or any team ID with access to this item.",
                    "format": "int32"
                  },
                  "snooze_enabled": {
                    "type": "boolean",
                    "description": "If present, true to snooze or false to unsnooze item."
                  },
                  "snooze_expiration_in_seconds": {
                    "type": "integer",
                    "description": "If present, the new snooze expiration in seconds. Valid values are integer values expressing number of seconds. For example `60` (a minute), `3600` (an hour), and `86400` (a day).",
                    "format": "int32"
                  }
                }
              }
            }
          }
        },
        "deprecated": false,
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
                        "status": {
                          "type": "string",
                          "description": "`active`, `resolved`, `muted`. Returned if the field was sent in the patch body."
                        },
                        "resolved_in_version": {
                          "type": "string",
                          "description": "Returned if the field was sent in the patch body."
                        },
                        "title": {
                          "type": "string",
                          "description": "Returned if the field was sent in the patch body."
                        },
                        "level": {
                          "type": "string",
                          "description": "`critical`, `error`, `warning`, `info`, `debug`. Returned if the field was sent in the patch body."
                        },
                        "assigned_user_id": {
                          "type": "integer",
                          "description": "Returned if the field was sent in the patch body.",
                          "format": "int32"
                        },
                        "assigned_team_id": {
                          "type": "integer",
                          "description": "Returned if the field was sent in the patch body.",
                          "format": "int32"
                        },
                        "snooze_enabled": {
                          "type": "boolean",
                          "description": "Returned if the field was sent in the patch body."
                        },
                        "snooze_expiration_in_seconds": {
                          "type": "integer",
                          "description": "Returned if the field was sent in the patch body.",
                          "format": "int32"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Error",
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
                      "example": "Item not found in this project."
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