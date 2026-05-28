<!-- source: https://docs.rollbar.com/docs/upgrading-from-node_rollbar.md -->

# Upgrading from node_rollbar

The upgrade path from `node_rollbar` version 0.6.4 to version 2.0.0 of this library is not automatic, but it should be straightforward. The main changes are related to naming, however we also changed the library from being a singleton to being used via individual instances. As we have said above, the recommended way to use the constructor is to pass an object which represents the configuration options with the access token contained within. The old style was to always pass the access token as the first parameter, we permit this style for convenience when no other options are necessary to ease the migration path, but for new code one should use an object as the only argument.

Old:

```javascript
var rollbar = require("rollbar");
rollbar.init("POST_SERVER_ITEM_ACCESS_TOKEN");
rollbar.reportMessage("Hello world!");
```

New:

```javascript
var Rollbar = require("rollbar");
var rollbar = new Rollbar("POST_SERVER_ITEM_ACCESS_TOKEN");
rollbar.log("Hello world!");
```

* Instead of importing the library as a singleton upon which you act, you are now importing a constructor.
* The constructor is a function of the form `function (options)` where options is an object with the same configuration options as before, and also requires a key `accessToken` with your access token as the value.
* `reportMessage`, `reportMessageWithPayloadData`, `handleError`, and `handleErrorWithPayloadData` are all deprecated in favor of: log/debug/info/warning/error/critical
* Each of these new logging functions can be called with any of the following sets of arguments:
  * message/error, callback
  * message/error, request
  * message/error, request, callback
  * message/error, request, custom
  * message/error, request, custom, callback
* In other words, the first argument can be a string or an exception, the type of which will be used to subsequently construct the payload. The last argument can be a callback or the callback can be omitted. The second argument must be a request or null (or a callback if only two arguments are present). The third argument is treated as extra custom data which will be sent along with the payload. Note that to include custom data and no request, you must pass null for the second argument.

The other major change is that if you wish to capture uncaught exceptions and unhandled rejections, you now use a configuration option.

Old:

```javascript
rollbar.handleUncaughtExceptionsAndRejections("POST_SERVER_ITEM_ACCESS_TOKEN", options);
```

New:

```javascript
var rollbar = new Rollbar({
  accessToken: "POST_SERVER_ITEM_ACCESS_TOKEN",
  captureUncaught: true,
  captureUnhandledRejections: true
});

```

We have also changed the `minimumLevel` configuration option to `reportLevel` in order to match the configuration option currently in use by the browserjs library.

Now that we have said the above, because of how one might be using the library currently, converting to not use a singleton may be problematic. Therefore, we provide a convenient interface to what is essentially a singleton managed by the library. First, you would use this code somewhere before any other instances of rollbar are required or used:

```javascript
const Rollbar = require('rollbar');

const rollbar = Rollbar.init({
  accessToken: "POST_SERVER_ITEM_ACCESS_TOKEN",
  captureUncaught: true
});
```

Then, in other places, you can use:

```javascript
const Rollbar = require('rollbar');

Rollbar.log('hello world');
```

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar.js, see the docs [here](https://docs.rollbar.com/docs/javascript)."
}
[/block]