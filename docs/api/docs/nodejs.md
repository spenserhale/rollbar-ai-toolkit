<!-- source: https://docs.rollbar.com/docs/nodejs.md -->

# Node.js

How to configure Rollbar.js to work with your Node.js app | Support Level: Supported

## Quick Start

The recommended way to use the rollbar constructor is to pass an object which represents the configuration options with at least the one required key `accessToken` with the value equal to your `POST_SERVER_ITEM_ACCESS_TOKEN`. If you do not want to pass any configuration options, then for convenience, you can simply pass just the access token as a string as the only argument to the constructor.

```javascript
var Rollbar = require('rollbar');
var rollbar = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    code_version: '1.0.0',
  }
});

// log a generic message and send to rollbar
rollbar.log('Hello world!');
```

Setting the `captureUncaught` option to true will register Rollbar as a handler for any uncaught exceptions in your Node process.

Similarly, setting the `captureUnhandledRejections` option to true will register Rollbar as a handler for any unhandled Promise rejections in your Node process.

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

## Server Installation

Install using the node package manager, npm:

```
npm install --save rollbar
```

## Server Configuration

### Using Express

```javascript
var express = require('express');
var Rollbar = require('rollbar');
var rollbar = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    code_version: '1.0.0',
  }
});

var app = express();

app.get('/', function(req, res) {
  // ...
});

// Use the rollbar error handler to send exceptions to your rollbar account
app.use(rollbar.errorHandler());

app.listen(6943);
```

### Using Koa

```javascript
const Koa = require('koa');
const Rollbar = require('rollbar');
const rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');

const app = new Koa();

// Errors handling using Rollbar as first middleware to catch exception
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    rollbar.error(err, ctx.request);
  }
});

// ...

app.listen(3000);
```

### Using Hapi

For Hapi v17+:

```javascript
import Rollbar from 'rollbar'

const rollbar = new Rollbar()

exports.register = function(server, options) {
  const preResponse = function(request, h) {
    const response = request.response

    if (!response.isBoom) {
      return h.continue
    }

    const cb = function(rollbarErr) {
      if (rollbarErr) {
        log(`Error reporting to rollbar, ignoring: ${rollbarErr}`)
      }
    }

    const error = response

    if (error instanceof Error) {
      rollbar.error(error, request, cb)
    } else {
      rollbar.error(`Error: ${error}`, request, cb)
    }

    return h.continue
  }

  server.ext('onPreResponse', preResponse)
  server.expose('rollbar', rollbar)
  log('Rollbar: next')
  return Promise.resolve()
}

exports.name = 'rollbar'
```

For older Hapi versions:

```javascript
var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ host:'localhost', port:8000 });

// Begin Rollbar initialization code
var Rollbar = require('rollbar');
var rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');
server.on('request-error', function(request, error) {
  // Note: before Hapi v8.0.0, this should be 'internalError' instead of 'request-error'
  var cb = function(rollbarErr) {
    if (rollbarErr)
      console.error('Error reporting to rollbar, ignoring: '+rollbarErr);
  };
  if (error instanceof Error)
    return rollbar.error(error, request, cb);
  rollbar.error('Error: '+error, request, cb);
});
// End Rollbar initialization code

server.route({
  method: 'GET',
  path:'/throw_error',
  handler: function (request, reply) {
    throw new Error('Example error manually thrown from route.');
  }
});
server.start(function(err) {
  if (err)
    throw err;
  console.log('Server running at:', server.info.uri);
});
```

### Standalone

In your main application, require and construct a rollbar instance using your access\_token::

```javascript
var Rollbar = require("rollbar");
var rollbar = new Rollbar("POST_SERVER_ITEM_ACCESS_TOKEN");
```

Other options can be passed into the constructor as a collection. E.g.:

```javascript
// Configure the library to send errors to api.rollbar.com
new Rollbar({
  accessToken: "POST_SERVER_ITEM_ACCESS_TOKEN",
  environment: "production",
  endpoint: "https://api.rollbar.com/api/1/item"
});
```

## Server Usage

### Rollbar.log()

Log a message and potentially send it to Rollbar. The level that the message or error is logged at is determined by the `logLevel` config option.

In order for the message to be sent to Rollbar, the log level must be greater than or equal to the `reportLevel` config option.

See [configuration](https://rollbar.com/docs/notifier/rollbar.js/#configuration-reference) for more information on configuring log levels.

**Returns**: `undefined`

**Params**

*Note*: order does not matter, however the first `Object` that contains at least one key from the list under `request` will be considered a request object.

* message: `String` - The message to send to Rollbar.
* err: `Exception` - The exception object to send.
* custom: `Object` - The custom payload data to send to Rollbar.
* callback: `Function` - The function to call once the message has been sent to Rollbar.
* request: `Object` - A request object containing at least one of these optional keys:
  * `headers`: an object containing the request headers
  * `protocol`: the request protocol (e.g. `"https"`)
  * `url`: the URL starting after the domain name (e.g. `"/index.html?foo=bar"`)
  * `method`: the request method (e.g. `"GET"`)
  * `body`: the request body as a string
  * `route`: an object containing a 'path' key, which will be used as the "context" for the event (e.g. `{"path": "home/index"}`)

### Caught exceptions

To report an exception that you have caught, use one of the named logging functions (log/debug/info/warning/error/critical) depending on the level of severity of the exception.

```javascript
var Rollbar = require('rollbar');
var rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');

try {
  someCode();
} catch (e) {
  rollbar.error(e);

  // if you have a request object (or a function that returns one), pass it in
  rollbar.error(e, request);

  // you can also pass a callback, which will be called upon success/failure
  rollbar.error(e, function(err2) {
    if (err2) {
      // an error occurred
    } else {
      // success
    }
  });

  // pass a request and a callback
  rollbar.error(e, request, callback);

  // to specify payload options - like extra data, or the level - pass a custom object
  rollbar.error(e, request, {level: "info"});

  // you can also pass a callback
  rollbar.error(e, request, {level: "info"}, callback);
}
```

### Log messages

To report a string message, possibly along with additional context, use (log/debug/info/warning/error/critical) depending on the level of severity to attach to the message.

```javascript
var Rollbar = require('rollbar');
var rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');

// reports a string message at the default severity level ("error")
rollbar.log("Timeout connecting to database");


// reports a string message at the specified level, along with a request and callback
// only the first param is required
rollbar.debug("Response time exceeded threshold of 1s", request, callback);
rollbar.info("Response time exceeded threshold of 1s", request, callback);
rollbar.warning("Response time exceeded threshold of 1s", request, callback);
rollbar.error("Response time exceeded threshold of 1s", request, callback);
rollbar.critical("Response time exceeded threshold of 1s", request, callback);

// reports a string message along with additional data conforming to the Rollbar API Schema
// documented here: https://rollbar.com/docs/api/items_post/
rollbar.warning(
  "Response time exceeded threshold of 1s",
  request,
  {
    threshold: 1,
    timeElapsed: 2.3
  }, callback
);
```

### The Request Object

If your Node.js application is responding to web requests, you can send data about the current request along with each report to Rollbar. This will allow you to replay requests, track events by browser, IP address, and much more.

All of the logging methods accept a `request` parameter.

If you're using Express, just pass the express request object. If you're using something custom, pass an object with these keys (all optional):

* `headers`: an object containing the request headers
* `protocol`: the request protocol (e.g. `"https"`)
* `url`: the URL starting after the domain name (e.g. `"/index.html?foo=bar"`)
* `method`: the request method (e.g. `"GET"`)
* `body`: the request body as a string
* `route`: an object containing a 'path' key, which will be used as the "context" for the event (e.g. `{"path": "home/index"}`)

Sensitive param names will be scrubbed from the request body and headers. See the `scrubFields` [configuration option](https://docs.rollbar.com/docs/rollbarjs-configuration-reference) for details.

### Person Tracking

If your application has authenticated users, you can track which user ("person" in Rollbar parlance) was associated with each event.

If you're using the [Passport](http://passportjs.org/) authentication library, this will happen automatically when you pass the request object (which will have "user" attached). Otherwise, attach one of these keys to the `request` object described in the previous section:

* `rollbar_person` or `user`: an object like `{"id": "123", "username": "foo", "email": "foo@example.com"}`. id is required, others are optional.
* `user_id`: the user id as an integer or string, or a function which when called will return the user id

Note: in Rollbar, the `id` is used to uniquely identify a person; `email` and `username` are supplemental and will be overwritten whenever a new value is received for an existing `id`. The `id` is a string up to 40 characters long.

By default we only attempt to capture the `id` for a user. Use the boolean configuration options `captureEmail` and `captureUsername` to change this behavior.

### Enabling local variables in stack traces

Collection of local variables is disabled by default. To enable, load the locals module separately and pass to Rollbar's configuration:

```javascript
const RollbarLocals = require('rollbar/src/server/locals');

const rollbar = Rollbar.init({
  accessToken: 'server-token',
  locals: RollbarLocals // Enable with default options
});
```

Which is equivalent to these defaults:

```javascript
options.locals = {
  module: RollbarLocals,
  enabled: true,
  uncaughtOnly: true,
  depth: 1,
  maxProperties: 30,
  maxArray: 5
}
```

The available options are:

`enabled`: Enables/disables the hook that captures local variables. This can be updated dynamically via `Rollbar.configure()`.

`uncaughtOnly`: Capture local variables only for uncaught errors, or set `false` to capture for all errors. This can be updated dynamically via `Rollbar.configure()`.

`depth`: Sets the depth of traversal and capture of object properties and array members.\
`maxProperties`: Sets the maximum number of properties that will be captured from objects.\
`maxArray`: Sets the maximum number of array members that will be captured.

`maxProperties` and `maxArray` protect against expansion of arbitrarily large objects or arrays. Set to smaller values to control payload size, or larger as needed.

`depth` sets the depth of inspection and capture of objects and arrays.

**Example output, depth = 0**

```javascript
locals: {
  foo: "bar",
  res: "<ServerResponse object>", 
  req: "<IncomingMessage object>", 
  next: "<Function object>"
}
```

**Example output, depth = 1**

```javascript
locals: {
  foo: "bar",
  res: {
    _header: null, 
    writable: true,
    _maxListeners: "undefined", 
    _last: false, 
    outputCallbacks: "<Array object>",
  }, 
  req: {
    _readableState: "<ReadableState object>", 
    _eventsCount: 1, 
    baseUrl: "", 
    query: "<Object object>",
    rawHeaders: "<Array object>",
  }, 
  next: "<Function object>" // Function objects are not expanded.
}
```

#### Performance impact of enabling local variables

Enabling local variables capture sets the `Debugger.setPauseOnExceptions` hook on the Node Inspector API. This will cause any `throw` or `reject` to take longer to execute. (In typical environments, a few milliseconds vs less than a millisecond normally.) When throw/catch are used for error handling, this isn’t likely to cause a problem. However, when throw/catch are used as a control mechanism in non-error code paths, care should be taken to ensure enabling locals capture won’t cause performance issues. If in doubt, run performance benchmarks with and without the feature enabled.

Performance issues can be mitigated by selective use of the `enabled` and `uncaughtOnly` flags. When the `uncaughtOnly` flag is set, the V8 Inspector won't perform additional processing on caught errors and production level runtime performance is possible. Similarly, setting `enabled: false` and enabling in specific code paths can help manage runtime performance.

#### Scrubbing sensitive data in locals

Any keys that are configured as scrub fields will be applied to the keys of locals data. Locals capture is off by default, and when enabled, it is the user’s responsibility to ensure all necessary scrub keys are configured. Variables that appear on the stack, and the names of those variables, may change as your application code changes. The scrub list should be updated to match the stack data your app generates.

### Telemetry

Starting in version 2.22.0 basic telemetry is supported for Node.js.

**Logging:**

* Hooks process.stdout and process.stderr.
* Records the log string and log level.

**Network:**

* Hooks http.request and https.request.
* Network capture records method/verb, URL, status code, start/end time in ms.
* Non-HTTP network errors (connection errors, DNS errors, etc.) are recorded.
* When header capture is enabled, headers are scrubbed based on scrubHeaders settings.

Config options are consistent with browser js telemetry options:

```javascript
{
  autoInstrument: true // enable logging and network capture, without network headers
}
```

```javascript
{
  autoInstrument: {
    network: true, // enable/disable network and log capture independently
    log: true 
  }
}
```

```javascript
{
  autoInstrument: {
    network: true, 
    networkRequestHeaders: true, // Capture request and/or response headers
    networkResponseHeaders: true 
  }
}
```

> 📘 More Information
>
> For more information about Rollbar Telemetry, see the [main Telemetry page](https://docs.rollbar.com/v1.0.0/docs/telemetry).

> 🚧 Node.js Telemetry Limitations
>
> The current telemetry hooks are global for the Node.js process and the telemetry history is global. During concurrent execution, telemetry events will be interleaved in a single event history.

### Source Maps

Starting in version 2.8.1 of the Rollbar JavaScript SDK, Node source maps are supported. Setting `nodeSourceMaps` in the config will enable this.

> 📘
>
> For help with importing or requiring Rollbar into your project with Typescript or a version of ECMAScript (ES5/ES6/ES7/ES8/ES9), please see this document [here](https://docs.rollbar.com/docs/importing-or-requiring-rollbar)

> 📘
>
> For more information on rollbar.js, please see the docs [here](https://docs.rollbar.com/v1.0.0/docs/javascript).