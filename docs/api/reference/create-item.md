<!-- source: https://docs.rollbar.com/reference/create-item.md -->

# Create item

Rollbar receives Occurrences (exceptions and messages) via a RESTful JSON API. Clients send JSON data via an HTTP POST to https://api.rollbar.com/api/1/item/

We strongly recommend using HTTPS, but HTTP is also supported. For HTTP, use http://api.rollbar.com/api/1/item/

POSTed JSON data is accepted either as the body of the request, or form-encoded as the value of the payload parameter (which should be the only parameter).

All responses (including error responses) are returned as JSON.

### Data Format
The example JSON payload below describes all the required and optional params that Rollbar understands. The meaning of each key is explained in the comments.

```json
{
  // Required: data
  "data": {

    // Required: environment
    // The name of the environment in which this occurrence was seen.
    // A string up to 255 characters. For best results, use "production" or "prod" for your
    // production environment.
    // You don't need to configure anything in the Rollbar UI for new environment names;
    // we'll detect them automatically.
    "environment": "production",

    // Required: body
    // The main data being sent. It can either be a message, an exception, or a crash report.
    "body": {

      // Required: "trace", "trace_chain", "message", or "crash_report" (exactly one)
      // If this payload is a single exception, use "trace"
      // If a chain of exceptions (for languages that support inner exceptions), use "trace_chain"
      // If a message with no stack trace, use "message"
      // If an iOS crash report, use "crash_report"

      // Optional: "telemetry". Only applicable if you are sending telemetry data.
      "telemetry": [
        {
        // Required: level
        // The severity level of the telemetry data. One of: "critical", "error", "warning", "info", "debug".
        "level": "info",

        // Required: type
        // The type of telemetry data. One of: "log", "network", "dom", "navigation", "error", "manual".
        "type": "network",

        // Required: source
        // The source of the telemetry data. Usually "client" or "server".
        "source": "client",

        // Required: timestamp_ms
        // When this occurred, as a unix timestamp in milliseconds.
        "timestamp_ms": 1720413393557,

        // Required: body
        // The key-value pairs for the telemetry data point. See "body" key below.
        // If type above is "log", body should contain "message" key.
        // If type above is "network", body should contain "method", "url", and "status_code" keys.
        // If type above is "dom", body should contain "element" key.
        // If type above is "navigation", body should contain "from" and "to" keys.
        // If type above is "error", body should contain "message" key.
        "body": {
          "subtype": "xhr",
          "method": "GET",
          "url": "/api/1/item/4/",
          "status_code": "200",
          "start_timestamp_ms": 1720413394557,
          "end_timestamp_ms": 1720413394957
        },
      },
        // more telemetry array elements follow...
      ],

      // Option 1: "trace"
      "trace": {

        // Required: frames
        // A list of stack frames, ordered such that the most recent call is last in the list.
        "frames": [
          // Each frame is an object.
          {
            // Required: filename
            // The filename including its full path.
            "filename": "/Users/brian/www/mox/mox/views/project.py",

            // Optional: lineno
            // The line number as an integer
            "lineno": 26,

            // Optional: colno
            // The column number as an integer
            "colno": 8,

            // Optional: method
            // The method or function name
            "method": "index",

            // Optional: code
            // The line of code
            "code": "_save_last_project(request, project_id, force=True)",

            // Optional: class_name
            // A string containing the class name.
            // Used in the UI when the payload's top-level "language" key has the value "java"
            "class_name": "java.lang.String",

            // Optional: context
            // Additional code before and after the "code" line
            "context": {
              // Optional: pre
              // List of lines of code before the "code" line
              "pre": [
                "project = request.context",
                "project_id = project.id"
              ],

              // Optional: post
              // List of lines of code after the "code" line
              "post": []
            },

            // (Deprecated) Optional: args
            // List of values of positional arguments to the method/function call
            // NOTE: as this can contain sensitive data, you may want to scrub the values
            "args": ["<Request object>", 25],

            // (Deprecated) Optional: kwargs
            // Object of keyword arguments (name => value) to the method/function call
            // NOTE: as this can contain sensitive data, you may want to scrub the values
            "kwargs": {
              "force": true
            },

            // Optional: argspec
            // List of the names of the arguments to the method/function call.
            "argspec": ["request", "user"],

            // Optional: varargspec
            // If the function call takes an arbitrary number of unnamed positional arguments,
            // the name of the argument that is the list containing those arguments.
            // For example, in Python, this would typically be "args" when "*args" is used.
            // The actual list will be found in locals.
            "varargspec": "args",

            // Optional: keywordspec
            // If the function call takes an arbitrary number of keyword arguments, the name
            // of the argument that is the object containing those arguments.
            // For example, in Python, this would typically be "kwargs" when "**kwargs" is used.
            // The actual object will be found in locals.
            "keywordspec": "kwargs",

            // Optional: locals
            // Object of local variables for the method/function call.
            // The values of variables from argspec, vararspec and keywordspec
            // can be found in locals.
            "locals": {
                "request": "<Request object>",
                "user": "<User object>",
                "args": [true, "Python"],
                "kwargs": {"level": "warning"}
            }
          },
          {
            "filename": "/Users/brian/www/mox/mox/views/project.py",
            "lineno": 497,
            "method": "_save_last_project",
            "code": "user = foo"
          }
        ],

        // Required: exception
        // An object describing the exception instance.
        "exception": {
          // Required: class
          // The exception class name.
          "class": "NameError",

          // Optional: message
          // The exception message, as a string
          "message": "global name 'foo' is not defined",

          // Optional: description
          // An alternate human-readable string describing the exception
          // Usually the original exception message will have been machine-generated;
          // you can use this to send something custom
          "description": "Something went wrong while trying to save the user object"
        }

      },

      // Option 2: "trace_chain"
      // Used for exceptions with inner exceptions or causes
      "trace_chain": [
        // Each element in the list should be a "trace" object, as shown above
        // Must contain at least one element.
      ],

      // Option 3: "message"
      // Only one of "trace", "trace_chain", "message", or "crash_report" should be present.
      // Presence of a "message" key means that this payload is a log message.
      "message": {

        // Required: body
        // The primary message text, as a string
        "body": "Request over threshold of 10 seconds",

        // Can also contain any arbitrary keys of metadata. Their values can be any valid JSON.
        // For example:

        "route": "home#index",
        "time_elapsed": 15.23

      },

      // Option 4: "crash_report"
      // Only one of "trace", "trace_chain", "message", or "crash_report" should be present.
      "crash_report": {
        // Required: raw
        // The raw crash report, as a string
        // Rollbar expects the format generated by rollbar-ios
        "raw": "<crash report here>"
      }

    },

    // Optional: level
    // The severity level. One of: "critical", "error", "warning", "info", "debug"
    // Defaults to "error" for exceptions and "info" for messages.
    // The level of the *first* occurrence of an item is used as the item's level.
    "level": "error",

    // Optional: timestamp
    // When this occurred, as a unix timestamp.
    "timestamp": 1723188822,

    // Optional: code_version
    // A string, up to 40 characters, describing the version of the application code
    // Rollbar understands these formats:
    // - semantic version (i.e. "2.1.12")
    // - integer (i.e. "45")
    // - git SHA (i.e. "3da541559918a808c2402bba5012f6c60b27661c")
    // If you have multiple code versions that are relevant, those can be sent inside "client" and "server"
    // (see those sections below)
    // For most cases, just send it here.
    "code_version": "3da541559918a808c2402bba5012f6c60b27661c",

    // Optional: platform
    // The platform on which this occurred. Meaningful platform names:
    // "browser", "android", "ios", "flash", "client", "heroku", "google-app-engine"
    // If this is a client-side event, be sure to specify the platform and use a post_client_item access token.
    "platform": "linux",

    // Optional: language
    // The name of the language your code is written in.
    // This can affect the order of the frames in the stack trace. The following languages set the most
    // recent call first - 'ruby', 'javascript', 'php', 'java', 'objective-c', 'lua'
    // It will also change the way the individual frames are displayed, with what is most consistent with
    // users of the language.
    "language": "python",

    // Optional: framework
    // The name of the framework your code uses
    "framework": "pyramid",

    // Optional: context
    // An identifier for which part of your application this event came from.
    // Items can be searched by context (prefix search)
    // For example, in a Rails app, this could be `controller#action`.
    // In a single-page javascript app, it could be the name of the current screen or route.
    "context": "project#index",

    // Optional: request
    // Data about the request this event occurred in.
    "request": {
      // Can contain any arbitrary keys. Rollbar understands the following:

      // url: full URL where this event occurred
      "url": "https://rollbar.com/project/1",

      // method: the request method
      "method": "GET",

      // headers: object containing the request headers.
      "headers": {
        // Header names should be formatted like they are in HTTP.
        "Accept": "text/html",
        "Referer": "https://rollbar.com/"
      },

      // params: any routing parameters (i.e. for use with Rails Routes)
      "params": {
        "controller": "project",
        "action": "index"
      },

      // GET: query string params
      "GET": {},

      // query_string: the raw query string
      "query_string": "",

      // POST: POST params
      "POST": {},

      // body: the raw POST body
      "body": "",

      // user_ip: the user's IP address as a string.
      // Can also be the special value "$remote_ip", which will be replaced with the source IP of the API request.
      // Will be indexed, as long as it is a valid IPv4 address.
      "user_ip": "100.51.43.14"

    },

    // Optional: person
    // The user affected by this event. Will be indexed by ID, username, and email.
    // People are stored in Rollbar keyed by ID. If you send a multiple different usernames/emails for the
    // same ID, the last received values will overwrite earlier ones.
    "person": {
      // Required: id
      // A string up to 40 characters identifying this user in your system.
      "id": "12345",

      // Optional: username
      // A string up to 255 characters
      "username": "brianr",

      // Optional: email
      // A string up to 255 characters
      "email": "brian@rollbar.com"
    },

    // Optional: server
    // Data about the server related to this event.
    "server": {
      // Can contain any arbitrary keys. Rollbar understands the following:

      // Optional: cpu
      // A string up to 255 characters
      "cpu": "x64",

      // Optional: host
      // host: The server hostname. Will be indexed.
      "host": "web4",

      // Optional: root
      // root: Path to the application code root, not including the final slash.
      // Used to collapse non-project code when displaying tracebacks.
      "root": "/Users/brian/www/mox",

      // Optional: Branch
      // branch: Name of the checked-out source control branch. Defaults to "master"
      "branch": "master",

      // Optional: code_version
      // String describing the running code version on the server
      // See note about "code_version" above
      "code_version": "b6437f45b7bbbb15f5eddc2eace4c71a8625da8c",

      // (Deprecated) sha: Git SHA of the running code revision. Use the full sha.
      "sha": "b6437f45b7bbbb15f5eddc2eace4c71a8625da8c"
    },

    // Optional: client
    // Data about the client device this event occurred on.
    // As there can be multiple client environments for a given event (i.e. Flash running inside
    // an HTML page), data should be namespaced by platform.
    "client": {
      // Can contain any arbitrary keys. Rollbar understands the following:

      // Optional: cpu
      // A string up to 255 characters
      "cpu": "x64",

      "javascript": {

        // Optional: browser
        // The user agent string
        "browser": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3)",

        // Optional: code_version
        // String describing the running code version in javascript
        // See note about "code_version" above
        "code_version": "b6437f45b7bbbb15f5eddc2eace4c71a8625da8c",

        // Optional: source_map_enabled
        // Set to true to enable source map deobfuscation
        // See the "Source Maps" guide for more details.
        "source_map_enabled": false,

        // Optional: guess_uncaught_frames
        // Set to true to enable frame guessing
        // See the "Source Maps" guide for more details.
        "guess_uncaught_frames": false

      }
    },

    // Optional: custom
    // Any arbitrary metadata you want to send. "custom" itself should be an object.
    "custom": {},

    // Optional: fingerprint
    // A string controlling how this occurrence should be grouped. Occurrences with the same
    // fingerprint are grouped together. See the "Grouping" guide for more information.
    // Should be a string up to 40 characters long; if longer than 40 characters, we'll use its SHA1 hash.
    // If omitted, we'll determine this on the backend.
    "fingerprint": "50a5ef9dbcf9d0e0af2d4e25338da0d430f20e52",

    // Optional: title
    // A string that will be used as the title of the Item occurrences will be grouped into.
    // Max length 255 characters.
    // If omitted, Rollbar will determine this on the backend.
    "title": "NameError when setting last project in views/project.py",

    // Optional: uuid
    // A string, up to 36 characters, that uniquely identifies this occurrence.
    // While it can now be any latin1 string, this may change to be a 16 byte field in the future.
    // We recommend using a UUID4 (16 random bytes).
    // The UUID space is unique to each project, and can be used to look up an occurrence later.
    // It is also used to detect duplicate requests. If you send the same UUID in two payloads, the second
    // one will be discarded.
    // While optional, it is recommended that all clients generate and provide this field
    "uuid": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",

    // Optional: notifier
    // Describes the library used to send this event.
    "notifier": {
      // Optional: name
      // Name of the library
      "name": "pyrollbar",

      // Optional: version
      // Library version string
      "version": "1.0.0"
    }

  }
}
```
Note that you can send us whatever data you want and we'll store it. Max payload size is 1024kb (kilobytes). For best results, put custom data in `request`, `server`, `client`, `person`, or `custom`.

### Response Format

#### Success

On success, this endpoint will respond with HTTP status code 200, and a JSON response like the following:

```javascript
{
  // Always present: err
  // 0 indiciates that there was no error
  err: 0,

  // Always present: result
  result: {
    // Always present: uuid
    // UUID of the posted occurrence.
    // If you provided one in the payload, this will be the value you provided
    // If you did not, one will be generated for you.
    // You can use this later to look up the occurrence by UUID.
    uuid: "d4c7acef55bf4c9ea95e4fe9428a8287",

    // Deprecated: id
    // Unused; will be removed in the future
    id: null
  }
}
```

On error, this endpoint will respond with an HTTP error code 400 or higher, and a JSON response like the following:

```javascript
{
  // Always present: err
  // 1 indicates there was an error
  err: 1,

  // Always present: message
  // A human-readable message describing the error
  message: "request entity too large"
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
    "/api/1/item/": {
      "post": {
        "tags": [
          "Item"
        ],
        "summary": "Create item",
        "description": "Rollbar receives Occurrences (exceptions and messages) via a RESTful JSON API. Clients send JSON data via an HTTP POST to https://api.rollbar.com/api/1/item/\n\nWe strongly recommend using HTTPS, but HTTP is also supported. For HTTP, use http://api.rollbar.com/api/1/item/\n\nPOSTed JSON data is accepted either as the body of the request, or form-encoded as the value of the payload parameter (which should be the only parameter).\n\nAll responses (including error responses) are returned as JSON.\n\n### Data Format\nThe example JSON payload below describes all the required and optional params that Rollbar understands. The meaning of each key is explained in the comments.\n\n```json\n{\n  // Required: data\n  \"data\": {\n\n    // Required: environment\n    // The name of the environment in which this occurrence was seen.\n    // A string up to 255 characters. For best results, use \"production\" or \"prod\" for your\n    // production environment.\n    // You don't need to configure anything in the Rollbar UI for new environment names;\n    // we'll detect them automatically.\n    \"environment\": \"production\",\n\n    // Required: body\n    // The main data being sent. It can either be a message, an exception, or a crash report.\n    \"body\": {\n\n      // Required: \"trace\", \"trace_chain\", \"message\", or \"crash_report\" (exactly one)\n      // If this payload is a single exception, use \"trace\"\n      // If a chain of exceptions (for languages that support inner exceptions), use \"trace_chain\"\n      // If a message with no stack trace, use \"message\"\n      // If an iOS crash report, use \"crash_report\"\n\n      // Optional: \"telemetry\". Only applicable if you are sending telemetry data.\n      \"telemetry\": [\n        {\n        // Required: level\n        // The severity level of the telemetry data. One of: \"critical\", \"error\", \"warning\", \"info\", \"debug\".\n        \"level\": \"info\",\n\n        // Required: type\n        // The type of telemetry data. One of: \"log\", \"network\", \"dom\", \"navigation\", \"error\", \"manual\".\n        \"type\": \"network\",\n\n        // Required: source\n        // The source of the telemetry data. Usually \"client\" or \"server\".\n        \"source\": \"client\",\n\n        // Required: timestamp_ms\n        // When this occurred, as a unix timestamp in milliseconds.\n        \"timestamp_ms\": 1720413393557,\n\n        // Required: body\n        // The key-value pairs for the telemetry data point. See \"body\" key below.\n        // If type above is \"log\", body should contain \"message\" key.\n        // If type above is \"network\", body should contain \"method\", \"url\", and \"status_code\" keys.\n        // If type above is \"dom\", body should contain \"element\" key.\n        // If type above is \"navigation\", body should contain \"from\" and \"to\" keys.\n        // If type above is \"error\", body should contain \"message\" key.\n        \"body\": {\n          \"subtype\": \"xhr\",\n          \"method\": \"GET\",\n          \"url\": \"/api/1/item/4/\",\n          \"status_code\": \"200\",\n          \"start_timestamp_ms\": 1720413394557,\n          \"end_timestamp_ms\": 1720413394957\n        },\n      },\n        // more telemetry array elements follow...\n      ],\n\n      // Option 1: \"trace\"\n      \"trace\": {\n\n        // Required: frames\n        // A list of stack frames, ordered such that the most recent call is last in the list.\n        \"frames\": [\n          // Each frame is an object.\n          {\n            // Required: filename\n            // The filename including its full path.\n            \"filename\": \"/Users/brian/www/mox/mox/views/project.py\",\n\n            // Optional: lineno\n            // The line number as an integer\n            \"lineno\": 26,\n\n            // Optional: colno\n            // The column number as an integer\n            \"colno\": 8,\n\n            // Optional: method\n            // The method or function name\n            \"method\": \"index\",\n\n            // Optional: code\n            // The line of code\n            \"code\": \"_save_last_project(request, project_id, force=True)\",\n\n            // Optional: class_name\n            // A string containing the class name.\n            // Used in the UI when the payload's top-level \"language\" key has the value \"java\"\n            \"class_name\": \"java.lang.String\",\n\n            // Optional: context\n            // Additional code before and after the \"code\" line\n            \"context\": {\n              // Optional: pre\n              // List of lines of code before the \"code\" line\n              \"pre\": [\n                \"project = request.context\",\n                \"project_id = project.id\"\n              ],\n\n              // Optional: post\n              // List of lines of code after the \"code\" line\n              \"post\": []\n            },\n\n            // (Deprecated) Optional: args\n            // List of values of positional arguments to the method/function call\n            // NOTE: as this can contain sensitive data, you may want to scrub the values\n            \"args\": [\"<Request object>\", 25],\n\n            // (Deprecated) Optional: kwargs\n            // Object of keyword arguments (name => value) to the method/function call\n            // NOTE: as this can contain sensitive data, you may want to scrub the values\n            \"kwargs\": {\n              \"force\": true\n            },\n\n            // Optional: argspec\n            // List of the names of the arguments to the method/function call.\n            \"argspec\": [\"request\", \"user\"],\n\n            // Optional: varargspec\n            // If the function call takes an arbitrary number of unnamed positional arguments,\n            // the name of the argument that is the list containing those arguments.\n            // For example, in Python, this would typically be \"args\" when \"*args\" is used.\n            // The actual list will be found in locals.\n            \"varargspec\": \"args\",\n\n            // Optional: keywordspec\n            // If the function call takes an arbitrary number of keyword arguments, the name\n            // of the argument that is the object containing those arguments.\n            // For example, in Python, this would typically be \"kwargs\" when \"**kwargs\" is used.\n            // The actual object will be found in locals.\n            \"keywordspec\": \"kwargs\",\n\n            // Optional: locals\n            // Object of local variables for the method/function call.\n            // The values of variables from argspec, vararspec and keywordspec\n            // can be found in locals.\n            \"locals\": {\n                \"request\": \"<Request object>\",\n                \"user\": \"<User object>\",\n                \"args\": [true, \"Python\"],\n                \"kwargs\": {\"level\": \"warning\"}\n            }\n          },\n          {\n            \"filename\": \"/Users/brian/www/mox/mox/views/project.py\",\n            \"lineno\": 497,\n            \"method\": \"_save_last_project\",\n            \"code\": \"user = foo\"\n          }\n        ],\n\n        // Required: exception\n        // An object describing the exception instance.\n        \"exception\": {\n          // Required: class\n          // The exception class name.\n          \"class\": \"NameError\",\n\n          // Optional: message\n          // The exception message, as a string\n          \"message\": \"global name 'foo' is not defined\",\n\n          // Optional: description\n          // An alternate human-readable string describing the exception\n          // Usually the original exception message will have been machine-generated;\n          // you can use this to send something custom\n          \"description\": \"Something went wrong while trying to save the user object\"\n        }\n\n      },\n\n      // Option 2: \"trace_chain\"\n      // Used for exceptions with inner exceptions or causes\n      \"trace_chain\": [\n        // Each element in the list should be a \"trace\" object, as shown above\n        // Must contain at least one element.\n      ],\n\n      // Option 3: \"message\"\n      // Only one of \"trace\", \"trace_chain\", \"message\", or \"crash_report\" should be present.\n      // Presence of a \"message\" key means that this payload is a log message.\n      \"message\": {\n\n        // Required: body\n        // The primary message text, as a string\n        \"body\": \"Request over threshold of 10 seconds\",\n\n        // Can also contain any arbitrary keys of metadata. Their values can be any valid JSON.\n        // For example:\n\n        \"route\": \"home#index\",\n        \"time_elapsed\": 15.23\n\n      },\n\n      // Option 4: \"crash_report\"\n      // Only one of \"trace\", \"trace_chain\", \"message\", or \"crash_report\" should be present.\n      \"crash_report\": {\n        // Required: raw\n        // The raw crash report, as a string\n        // Rollbar expects the format generated by rollbar-ios\n        \"raw\": \"<crash report here>\"\n      }\n\n    },\n\n    // Optional: level\n    // The severity level. One of: \"critical\", \"error\", \"warning\", \"info\", \"debug\"\n    // Defaults to \"error\" for exceptions and \"info\" for messages.\n    // The level of the *first* occurrence of an item is used as the item's level.\n    \"level\": \"error\",\n\n    // Optional: timestamp\n    // When this occurred, as a unix timestamp.\n    \"timestamp\": 1723188822,\n\n    // Optional: code_version\n    // A string, up to 40 characters, describing the version of the application code\n    // Rollbar understands these formats:\n    // - semantic version (i.e. \"2.1.12\")\n    // - integer (i.e. \"45\")\n    // - git SHA (i.e. \"3da541559918a808c2402bba5012f6c60b27661c\")\n    // If you have multiple code versions that are relevant, those can be sent inside \"client\" and \"server\"\n    // (see those sections below)\n    // For most cases, just send it here.\n    \"code_version\": \"3da541559918a808c2402bba5012f6c60b27661c\",\n\n    // Optional: platform\n    // The platform on which this occurred. Meaningful platform names:\n    // \"browser\", \"android\", \"ios\", \"flash\", \"client\", \"heroku\", \"google-app-engine\"\n    // If this is a client-side event, be sure to specify the platform and use a post_client_item access token.\n    \"platform\": \"linux\",\n\n    // Optional: language\n    // The name of the language your code is written in.\n    // This can affect the order of the frames in the stack trace. The following languages set the most\n    // recent call first - 'ruby', 'javascript', 'php', 'java', 'objective-c', 'lua'\n    // It will also change the way the individual frames are displayed, with what is most consistent with\n    // users of the language.\n    \"language\": \"python\",\n\n    // Optional: framework\n    // The name of the framework your code uses\n    \"framework\": \"pyramid\",\n\n    // Optional: context\n    // An identifier for which part of your application this event came from.\n    // Items can be searched by context (prefix search)\n    // For example, in a Rails app, this could be `controller#action`.\n    // In a single-page javascript app, it could be the name of the current screen or route.\n    \"context\": \"project#index\",\n\n    // Optional: request\n    // Data about the request this event occurred in.\n    \"request\": {\n      // Can contain any arbitrary keys. Rollbar understands the following:\n\n      // url: full URL where this event occurred\n      \"url\": \"https://rollbar.com/project/1\",\n\n      // method: the request method\n      \"method\": \"GET\",\n\n      // headers: object containing the request headers.\n      \"headers\": {\n        // Header names should be formatted like they are in HTTP.\n        \"Accept\": \"text/html\",\n        \"Referer\": \"https://rollbar.com/\"\n      },\n\n      // params: any routing parameters (i.e. for use with Rails Routes)\n      \"params\": {\n        \"controller\": \"project\",\n        \"action\": \"index\"\n      },\n\n      // GET: query string params\n      \"GET\": {},\n\n      // query_string: the raw query string\n      \"query_string\": \"\",\n\n      // POST: POST params\n      \"POST\": {},\n\n      // body: the raw POST body\n      \"body\": \"\",\n\n      // user_ip: the user's IP address as a string.\n      // Can also be the special value \"$remote_ip\", which will be replaced with the source IP of the API request.\n      // Will be indexed, as long as it is a valid IPv4 address.\n      \"user_ip\": \"100.51.43.14\"\n\n    },\n\n    // Optional: person\n    // The user affected by this event. Will be indexed by ID, username, and email.\n    // People are stored in Rollbar keyed by ID. If you send a multiple different usernames/emails for the\n    // same ID, the last received values will overwrite earlier ones.\n    \"person\": {\n      // Required: id\n      // A string up to 40 characters identifying this user in your system.\n      \"id\": \"12345\",\n\n      // Optional: username\n      // A string up to 255 characters\n      \"username\": \"brianr\",\n\n      // Optional: email\n      // A string up to 255 characters\n      \"email\": \"brian@rollbar.com\"\n    },\n\n    // Optional: server\n    // Data about the server related to this event.\n    \"server\": {\n      // Can contain any arbitrary keys. Rollbar understands the following:\n\n      // Optional: cpu\n      // A string up to 255 characters\n      \"cpu\": \"x64\",\n\n      // Optional: host\n      // host: The server hostname. Will be indexed.\n      \"host\": \"web4\",\n\n      // Optional: root\n      // root: Path to the application code root, not including the final slash.\n      // Used to collapse non-project code when displaying tracebacks.\n      \"root\": \"/Users/brian/www/mox\",\n\n      // Optional: Branch\n      // branch: Name of the checked-out source control branch. Defaults to \"master\"\n      \"branch\": \"master\",\n\n      // Optional: code_version\n      // String describing the running code version on the server\n      // See note about \"code_version\" above\n      \"code_version\": \"b6437f45b7bbbb15f5eddc2eace4c71a8625da8c\",\n\n      // (Deprecated) sha: Git SHA of the running code revision. Use the full sha.\n      \"sha\": \"b6437f45b7bbbb15f5eddc2eace4c71a8625da8c\"\n    },\n\n    // Optional: client\n    // Data about the client device this event occurred on.\n    // As there can be multiple client environments for a given event (i.e. Flash running inside\n    // an HTML page), data should be namespaced by platform.\n    \"client\": {\n      // Can contain any arbitrary keys. Rollbar understands the following:\n\n      // Optional: cpu\n      // A string up to 255 characters\n      \"cpu\": \"x64\",\n\n      \"javascript\": {\n\n        // Optional: browser\n        // The user agent string\n        \"browser\": \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3)\",\n\n        // Optional: code_version\n        // String describing the running code version in javascript\n        // See note about \"code_version\" above\n        \"code_version\": \"b6437f45b7bbbb15f5eddc2eace4c71a8625da8c\",\n\n        // Optional: source_map_enabled\n        // Set to true to enable source map deobfuscation\n        // See the \"Source Maps\" guide for more details.\n        \"source_map_enabled\": false,\n\n        // Optional: guess_uncaught_frames\n        // Set to true to enable frame guessing\n        // See the \"Source Maps\" guide for more details.\n        \"guess_uncaught_frames\": false\n\n      }\n    },\n\n    // Optional: custom\n    // Any arbitrary metadata you want to send. \"custom\" itself should be an object.\n    \"custom\": {},\n\n    // Optional: fingerprint\n    // A string controlling how this occurrence should be grouped. Occurrences with the same\n    // fingerprint are grouped together. See the \"Grouping\" guide for more information.\n    // Should be a string up to 40 characters long; if longer than 40 characters, we'll use its SHA1 hash.\n    // If omitted, we'll determine this on the backend.\n    \"fingerprint\": \"50a5ef9dbcf9d0e0af2d4e25338da0d430f20e52\",\n\n    // Optional: title\n    // A string that will be used as the title of the Item occurrences will be grouped into.\n    // Max length 255 characters.\n    // If omitted, Rollbar will determine this on the backend.\n    \"title\": \"NameError when setting last project in views/project.py\",\n\n    // Optional: uuid\n    // A string, up to 36 characters, that uniquely identifies this occurrence.\n    // While it can now be any latin1 string, this may change to be a 16 byte field in the future.\n    // We recommend using a UUID4 (16 random bytes).\n    // The UUID space is unique to each project, and can be used to look up an occurrence later.\n    // It is also used to detect duplicate requests. If you send the same UUID in two payloads, the second\n    // one will be discarded.\n    // While optional, it is recommended that all clients generate and provide this field\n    \"uuid\": \"f81d4fae-7dec-11d0-a765-00a0c91e6bf6\",\n\n    // Optional: notifier\n    // Describes the library used to send this event.\n    \"notifier\": {\n      // Optional: name\n      // Name of the library\n      \"name\": \"pyrollbar\",\n\n      // Optional: version\n      // Library version string\n      \"version\": \"1.0.0\"\n    }\n\n  }\n}\n```\nNote that you can send us whatever data you want and we'll store it. Max payload size is 1024kb (kilobytes). For best results, put custom data in `request`, `server`, `client`, `person`, or `custom`.\n\n### Response Format\n\n#### Success\n\nOn success, this endpoint will respond with HTTP status code 200, and a JSON response like the following:\n\n```javascript\n{\n  // Always present: err\n  // 0 indiciates that there was no error\n  err: 0,\n\n  // Always present: result\n  result: {\n    // Always present: uuid\n    // UUID of the posted occurrence.\n    // If you provided one in the payload, this will be the value you provided\n    // If you did not, one will be generated for you.\n    // You can use this later to look up the occurrence by UUID.\n    uuid: \"d4c7acef55bf4c9ea95e4fe9428a8287\",\n\n    // Deprecated: id\n    // Unused; will be removed in the future\n    id: null\n  }\n}\n```\n\nOn error, this endpoint will respond with an HTTP error code 400 or higher, and a JSON response like the following:\n\n```javascript\n{\n  // Always present: err\n  // 1 indicates there was an error\n  err: 1,\n\n  // Always present: message\n  // A human-readable message describing the error\n  message: \"request entity too large\"\n}\n```\n",
        "operationId": "create-item",
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
            "description": "An access token with scope `post_server_item` or `post_client_item`. A post_client_item token must be used if the `platform` is `browser\"`, `android`, `ios`, `flash`, or `client`. A post_server_item token should be used for other platforms."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "data"
                ],
                "properties": {
                  "data": {
                    "type": "string",
                    "description": "Details of the exception or log message. For a simple example, try `{\"environment\": \"development\", \"body\": { \"message\": {\"body\": \"Hello, world!\"}}}`",
                    "default": "",
                    "format": "json"
                  }
                }
              }
            }
          }
        },
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
                        "uuid": {
                          "type": "string",
                          "example": "d4c7acef55bf4c9ea95e4fe9428a8287"
                        },
                        "id": {
                          "type": "integer",
                          "description": "Deprecated, will return null"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "error occurred",
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
                      "example": "request entity too large"
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