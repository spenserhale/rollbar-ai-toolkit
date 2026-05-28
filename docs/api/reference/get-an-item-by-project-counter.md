<!-- source: https://docs.rollbar.com/reference/get-an-item-by-project-counter.md -->

# Get an item (by project counter)

`counter` must be an item counter for an item in the project. The counter can be found in URLs like `https://rollbar.com/myaccount/myproject/items/456/` (456 is the counter).

The success response is a 301 redirect like this:

```
HTTP/1.1 301 Moved Permanently
Location: /api/1/item/272505123

{
  "err": 0,
  "result": {
    "itemId": 272505123,
    "path": "/api/1/item/272505123",
    "uri": "/api/1/item/272505123"
  }
}
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
    "/api/1/item_by_counter/{counter}": {
      "get": {
        "tags": [
          "Item"
        ],
        "summary": "Get an item (by project counter)",
        "description": "`counter` must be an item counter for an item in the project. The counter can be found in URLs like `https://rollbar.com/myaccount/myproject/items/456/` (456 is the counter).\n\nThe success response is a 301 redirect like this:\n\n```\nHTTP/1.1 301 Moved Permanently\nLocation: /api/1/item/272505123\n\n{\n  \"err\": 0,\n  \"result\": {\n    \"itemId\": 272505123,\n    \"path\": \"/api/1/item/272505123\",\n    \"uri\": \"/api/1/item/272505123\"\n  }\n}\n```\n",
        "operationId": "get-an-item-by-project-counter",
        "parameters": [
          {
            "name": "counter",
            "in": "path",
            "description": "item counter for an item in the project\n\n`counter` must be an item counter for an item in the project.\nThe counter can be found in URLs like https://rollbar.com/myaccount/myproject/items/456/\n(456 is the counter).\n",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "$ref": "#/paths/~1api~11~1instances/get/parameters/0"
          }
        ],
        "responses": {
          "301": {
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
                        "itemId": {
                          "type": "integer",
                          "example": 272505123
                        },
                        "path": {
                          "type": "string",
                          "example": "/api/1/item/272505123"
                        },
                        "uri": {
                          "type": "string",
                          "example": "/api/1/item/272505123"
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