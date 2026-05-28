<!-- source: https://docs.rollbar.com/reference/upload-a-js-source-map.md -->

# Upload a JS source map

In the above example, our website is http://example.com, we have a minified JavaScript file at http://example.com/js/example.min.js, and we have a source tree like this:
```
example/
example/static/js/example.min.js
example/static/js/example.min.map
example/static/js/site.js
example/static/js/util.js
```

## Example

Here's an example cURL command:

```curl shell
curl https://api.rollbar.com/api/1/sourcemap \
  -F access_token={access token} \
  -F version=version_string_here \
  -F minified_url=http://example.com/static/js/example.min.js \
  -F source_map=@static/js/example.min.map \
  -F static/js/site.js=@static/js/site.js \
  -F static/js/util.js=@static/js/util.js
```

In the above example:

* Our website is `http://example.com`

* We have a minified javascript file at\
  `http://example.com/js/example.min.js`

* We have a source tree like this:

  ```
  example/
  example/static/js/example.min.js
  example/static/js/example.min.map
  example/static/js/site.js
  example/static/js/util.js
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
      "name": "Symbol Maps"
    }
  ],
  "info": {
    "title": "Rollbar API",
    "version": "1.0",
    "description": "# Getting Started\nThe Rollbar API provides a RESTful interface to much of the data in the\nsystem. It is used by our official libraries to report exceptions,\ndeploys, and other messages. It can be used to create notifiers for\nadditional languages, get data out to integrate with other systems, or\nwhatever else you can imagine. If the API is missing something you'd\nlike to see, please [let us know](support@rollbar.com).\n\n# Ping\nTo test whether you're able to ping the API server, you can simply run the\nfollowing command:\n\n```\ncurl 'https://api.rollbar.com/api/1/status/ping'\n```\n\nYou will get back pong from our server if your request was successful.\n\n# Timestamps\nAll timestamps (inputs and outputs) are GMT unix timestamps.\n\n# Authentication\nAuthentication is done via access token included as a header parameter. For authenticated requests, pass your access token\nthrough the `X-Rollbar-Access-Token` parameter in the header.\n\n```\ncurl -H \"X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN\" 'https://api.rollbar.com/api/1/item/12345'\n```\n\n## Project access tokens\nMany operations require a project-specific access token. You can find and administer your\naccess tokens in Settings -> Project Access Tokens. Access tokens can have any or\nall of the following scopes:\n\n### post_server_item\nCan perform all POST requests to /deploy/ and /item/. Can also be used to upload source maps (JS, proguard, dSym, flutter)\n\n### post_client_item\nCan perform POST requests to /item/, but only if the item has a client-side platform (browser, mobile)\n\n### read\nCan perform all GET requests\n\n### write\nCan perform PATCH and DELETE requests\n\n## Account Access Tokens\nOperations performed at the level of the account require an account-specific\naccess token. These can be found and managed at\n{Account name} Settings -> Account Access Tokens.\nAccount access tokens can have the following scopes:\n\n### read\nSupports all GET operations at the account level.\n\n### write\nSupports all POST, PUT, PATCH, and DELETE operations at the account level.\n\n# HTTP responses\nThe API can return the following HTTP response codes:\n\n### 200\tOK\nOperation was completed successfully\n\n### 400\tBad request\nThe request was malformed and could not be parsed.\n\n### 403\tAccess denied\nAccess token was missing, invalid, or does not have the necessary permissions.\n\n### 404\tNot found\nThe requested resource was not found. This response will be returned if the URL is entirely invalid (i.e. /asdf), or if it is a URL that could be valid but is referencing something that does not exist (i.e. /item/12345).\n\n### 413\tRequest entity too large\nThe request exceeded the maximum size of 128KB.\n\n### 422\tUnprocessable Entity\nThe request was parseable (i.e. valid JSON), but some parameters were missing or otherwise invalid.\n\n### 429\tToo Many Requests\nIf rate limiting is enabled for your access token, this return code signifies that\n\n# Examples\n\n### [api-examples](https://github.com/rollbar/api-examples)\nAuthor: Rollbar\n\nLanguage: Python\n\nExamples using RQL, deploys, occurrences, and reports\n\n### [api-people-example](https://github.com/rollbar/api-people-example)\nAuthor: Rollbar\n\nLanguage: Python\n\nShows how to gather the Person data for each occurrence of a list of items\n\n### [rolltools](https://github.com/jslate/rolltools)\nAuthor: Jonathan Slate\n\nLanguage: Ruby\n\nA few utilities using the Rollbar API\n"
  },
  "paths": {
    "/api/1/sourcemap": {
      "post": {
        "tags": [
          "Symbol Maps"
        ],
        "summary": "Upload a JS source map",
        "description": "In the above example, our website is http://example.com, we have a minified JavaScript file at http://example.com/js/example.min.js, and we have a source tree like this:\n```\nexample/\nexample/static/js/example.min.js\nexample/static/js/example.min.map\nexample/static/js/site.js\nexample/static/js/util.js\n```\n",
        "operationId": "upload-a-js-source-map",
        "parameters": [
          {
            "$ref": "#/paths/~1api~11~1dsym/post/parameters/0"
          }
        ],
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "required": [
                  "version",
                  "minified_url",
                  "source_map"
                ],
                "properties": {
                  "version": {
                    "type": "string",
                    "description": "Current code version (typically a git SHA)"
                  },
                  "minified_url": {
                    "type": "string",
                    "description": "The full URL of the minified file, as it appears in the stack trace. This should start with `http:` or `https:`."
                  },
                  "source_map": {
                    "type": "string",
                    "description": "Your source map file.",
                    "format": "binary"
                  },
                  "source files": {
                    "type": "string",
                    "description": "One or more source unminified files",
                    "format": "binary"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
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