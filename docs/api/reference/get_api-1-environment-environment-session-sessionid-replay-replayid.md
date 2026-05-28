<!-- source: https://docs.rollbar.com/reference/get_api-1-environment-environment-session-sessionid-replay-replayid.md -->

# Get a session replay

Retrieves the replay payload for a recorded session in the specified environment. Requires a project access token with `read` scope.

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
      "name": "Replay"
    }
  ],
  "info": {
    "title": "Rollbar API",
    "version": "1.0",
    "description": "# Getting Started\nThe Rollbar API provides a RESTful interface to much of the data in the\nsystem. It is used by our official libraries to report exceptions,\ndeploys, and other messages. It can be used to create notifiers for\nadditional languages, get data out to integrate with other systems, or\nwhatever else you can imagine. If the API is missing something you'd\nlike to see, please [let us know](support@rollbar.com).\n\n# Ping\nTo test whether you're able to ping the API server, you can simply run the\nfollowing command:\n\n```\ncurl 'https://api.rollbar.com/api/1/status/ping'\n```\n\nYou will get back pong from our server if your request was successful.\n\n# Timestamps\nAll timestamps (inputs and outputs) are GMT unix timestamps.\n\n# Authentication\nAuthentication is done via access token included as a header parameter. For authenticated requests, pass your access token\nthrough the `X-Rollbar-Access-Token` parameter in the header.\n\n```\ncurl -H \"X-Rollbar-Access-Token: YOUR_ACCESS_TOKEN\" 'https://api.rollbar.com/api/1/item/12345'\n```\n\n## Project access tokens\nMany operations require a project-specific access token. You can find and administer your\naccess tokens in Settings -> Project Access Tokens. Access tokens can have any or\nall of the following scopes:\n\n### post_server_item\nCan perform all POST requests to /deploy/ and /item/. Can also be used to upload source maps (JS, proguard, dSym, flutter)\n\n### post_client_item\nCan perform POST requests to /item/, but only if the item has a client-side platform (browser, mobile)\n\n### read\nCan perform all GET requests\n\n### write\nCan perform PATCH and DELETE requests\n\n## Account Access Tokens\nOperations performed at the level of the account require an account-specific\naccess token. These can be found and managed at\n{Account name} Settings -> Account Access Tokens.\nAccount access tokens can have the following scopes:\n\n### read\nSupports all GET operations at the account level.\n\n### write\nSupports all POST, PUT, PATCH, and DELETE operations at the account level.\n\n# HTTP responses\nThe API can return the following HTTP response codes:\n\n### 200\tOK\nOperation was completed successfully\n\n### 400\tBad request\nThe request was malformed and could not be parsed.\n\n### 403\tAccess denied\nAccess token was missing, invalid, or does not have the necessary permissions.\n\n### 404\tNot found\nThe requested resource was not found. This response will be returned if the URL is entirely invalid (i.e. /asdf), or if it is a URL that could be valid but is referencing something that does not exist (i.e. /item/12345).\n\n### 413\tRequest entity too large\nThe request exceeded the maximum size of 128KB.\n\n### 422\tUnprocessable Entity\nThe request was parseable (i.e. valid JSON), but some parameters were missing or otherwise invalid.\n\n### 429\tToo Many Requests\nIf rate limiting is enabled for your access token, this return code signifies that\n\n# Examples\n\n### [api-examples](https://github.com/rollbar/api-examples)\nAuthor: Rollbar\n\nLanguage: Python\n\nExamples using RQL, deploys, occurrences, and reports\n\n### [api-people-example](https://github.com/rollbar/api-people-example)\nAuthor: Rollbar\n\nLanguage: Python\n\nShows how to gather the Person data for each occurrence of a list of items\n\n### [rolltools](https://github.com/jslate/rolltools)\nAuthor: Jonathan Slate\n\nLanguage: Ruby\n\nA few utilities using the Rollbar API\n"
  },
  "paths": {
    "/api/1/environment/{environment}/session/{sessionId}/replay/{replayId}": {
      "get": {
        "tags": [
          "Replay"
        ],
        "summary": "Get a session replay",
        "description": "Retrieves the replay payload for a recorded session in the specified environment. Requires a project access token with `read` scope.\n",
        "parameters": [
          {
            "$ref": "#/paths/~1api~11~1instances/get/parameters/0"
          },
          {
            "name": "environment",
            "in": "path",
            "schema": {
              "type": "string"
            },
            "required": true,
            "description": "The environment slug for the session replay"
          },
          {
            "name": "sessionId",
            "in": "path",
            "schema": {
              "type": "string"
            },
            "required": true,
            "description": "The session identifier provided in the replay payload"
          },
          {
            "name": "replayId",
            "in": "path",
            "schema": {
              "type": "string"
            },
            "required": true,
            "description": "The replay identifier generated for the session payload"
          }
        ],
        "responses": {
          "200": {
            "description": "success",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/SessionReplayResponse"
                },
                "example": {
                  "err": 0,
                  "result": {
                    "events": [
                      {
                        "project_id": 12345,
                        "environment": "production",
                        "session_id": "1234",
                        "span_id": "span_01",
                        "name": "rrweb-replay-recording",
                        "start_time": "2025-10-01T16:20:00Z",
                        "duration": 3337000000,
                        "span_count": "1",
                        "attributes": [
                          {
                            "name": "rollbar.replay.id",
                            "value": "a2a2"
                          },
                          {
                            "name": "session.id",
                            "value": "1234"
                          },
                          {
                            "name": "scope.name",
                            "value": "rollbar-browser-js"
                          }
                        ],
                        "timeline_events": [
                          {
                            "name": "rollbar-log-event",
                            "time": "2025-10-01T16:20:01Z",
                            "attributes": [
                              {
                                "name": "level",
                                "value": "error"
                              },
                              {
                                "name": "message",
                                "value": "Warning: ReactDOM.render is deprecated (truncated)"
                              }
                            ]
                          },
                          {
                            "name": "rollbar-network-event",
                            "time": "2025-10-01T16:20:01Z",
                            "attributes": [
                              {
                                "name": "method",
                                "value": "GET"
                              },
                              {
                                "name": "url",
                                "value": "https://example.com/app.js"
                              },
                              {
                                "name": "statusCode",
                                "value": "200"
                              }
                            ]
                          }
                        ],
                        "rrweb_replay_events": [
                          {
                            "time": "2025-10-01T16:20:02Z",
                            "type": "4",
                            "data": {
                              "summary": "Initial viewport snapshot (redacted)"
                            }
                          }
                        ]
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
      "SessionReplayResponse": {
        "type": "object",
        "required": [
          "err",
          "result"
        ],
        "properties": {
          "err": {
            "type": "integer",
            "enum": [
              0
            ]
          },
          "result": {
            "type": "object",
            "required": [
              "events"
            ],
            "properties": {
              "events": {
                "type": "array",
                "description": "Ordered list of replay events captured for the session.",
                "items": {
                  "$ref": "#/components/schemas/SessionReplayEvent"
                }
              }
            }
          }
        }
      },
      "SessionReplayEvent": {
        "type": "object",
        "description": "Replay segment derived from the recorded session telemetry.",
        "properties": {
          "project_id": {
            "type": "integer",
            "description": "Project identifier associated with the replay."
          },
          "environment": {
            "type": "string",
            "description": "Environment captured in the replay event."
          },
          "session_id": {
            "type": "string",
            "description": "Unique session identifier."
          },
          "span_id": {
            "type": "string",
            "description": "Primary span identifier for the replay event."
          },
          "name": {
            "type": "string",
            "description": "Span name describing the replay component."
          },
          "start_time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp marking when the replay event began."
          },
          "duration": {
            "type": "integer",
            "description": "Duration of the replay event in nanoseconds."
          },
          "span_count": {
            "oneOf": [
              {
                "type": "integer"
              },
              {
                "type": "string"
              }
            ],
            "description": "Number of spans aggregated in this replay event."
          },
          "attributes": {
            "type": "array",
            "description": "Additional metadata captured for the replay event.",
            "items": {
              "$ref": "#/components/schemas/SessionReplayAttribute"
            }
          },
          "timeline_events": {
            "type": "array",
            "description": "Key events that occurred during the replay timeline.",
            "items": {
              "$ref": "#/components/schemas/SessionReplayTimelineEvent"
            }
          },
          "rrweb_replay_events": {
            "type": "array",
            "description": "rrweb events recorded for the replayed session.",
            "items": {
              "$ref": "#/components/schemas/SessionReplayRrwebEvent"
            }
          }
        }
      },
      "SessionReplayAttribute": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Attribute name."
          },
          "value": {
            "type": "string",
            "description": "Attribute value. Complex values are JSON encoded strings."
          }
        }
      },
      "SessionReplayTimelineEvent": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Timeline event name."
          },
          "time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the timeline event occurred."
          },
          "attributes": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SessionReplayAttribute"
            }
          }
        }
      },
      "SessionReplayRrwebEvent": {
        "type": "object",
        "properties": {
          "time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp recorded for the rrweb event."
          },
          "type": {
            "type": "string",
            "description": "rrweb event type identifier."
          },
          "data": {
            "type": "object",
            "additionalProperties": true,
            "description": "rrweb payload for the event. Large payloads are redacted."
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