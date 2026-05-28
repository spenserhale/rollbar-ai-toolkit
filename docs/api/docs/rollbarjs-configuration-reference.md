<!-- source: https://docs.rollbar.com/docs/rollbarjs-configuration-reference.md -->

# Configuration and Method Reference

Configuration options for rollbar.js

## Configuration Reference

### Configuration types

There are 2 types of configuration data -- context and payload. Context provides information about the environment of the error while payload describes information about the error itself.

#### Context

* Information about the environment of the error being sent to Rollbar
* e.g. server hostname, user's IP, custom fingerprint

#### Payload

* Information about the error -- usually custom
* e.g. The name of the javascript component that triggered the error

### Configuration levels

Rollbar can be configured at 2 different levels -- global and notifier. All configuration is inherited at each level, so global configuration affects all notifiers while notifier configuration only affects the notifier being configured.

#### Global configuration

* Affects all notifiers
* Set by calling `global()` on any notifier
* Merges/updates previous configuration
* Currently, the only supported options are `maxItems` and `itemsPerMinute`

#### Notifier configuration - context and/or payload

* Affects only the notifier you call `configure()` on
* Merges/updates previous configuration for the notifier you call `configure()` on

### Examples

#### Global

```javascript
// Only send a max of 5 items to Rollbar per minute
Rollbar.global({itemsPerMinute: 5});
```

```javascript
// Only send a maximum of 10 items to Rollbar per page load
Rollbar.global({maxItems: 10});
```

#### Notifier

```javascript
// Set the top-level notifier's checkIgnore() function
Rollbar.configure({checkIgnore: function(isUncaught, args, payload) {
    // ignore all uncaught errors and all 'debug' items
    return isUncaught === true || payload.level === 'debug';
}});

// Set the onSendCallback() function
Rollbar.configure({onSendCallback: function(isUncaught, args, payload) {
    //do something
}});

// Set the environment, default log level and the context
Rollbar.configure({logLevel: 'info', payload: {environment: 'staging', context: 'home#index'}});
Rollbar.log('this will be sent with level="info"');

// Only send "error" or higher items to Rollbar
Rollbar.configure({reportLevel: 'error'});
Rollbar.info('this will not get reported to Rollbar since it\'s at the "info" level');

// Set the person information to be sent with all items to Rollbar
Rollbar.configure({payload: {person: {id: 12345, email: 'stewie@familyguy.com'}}});

// Add the following payload data to all items sent to Rollbar
// from this notifier
Rollbar.configure({payload: {sessionId: "asdf12345"}});

// Scrub any payload keys/query parameters named 'creditCardNumber'
Rollbar.configure({scrubFields: ['creditCardNumber']});

// Only allow items to be sent from certain domains
Rollbar.configure({hostSafeList: ['domain1.com', 'domain2.com']});

// Don't allow items to be sent from certain domains
Rollbar.configure({hostBlockList: ['domain1.com', 'domain2.com']});

// Set the uncaught error level to 'warning'
Rollbar.configure({uncaughtErrorLevel: 'warning'});

// Set the endpoint
Rollbar.configure({endpoint: 'https://api.rollbar.com/api/1/item'});

// Send the config
Rollbar.configure({sendConfig: true});

// Anonymize IP addresses
Rollbar.configure({captureIp: 'anonymize'});

// Capture uncaught exceptions and unhandled rejections
Rollbar.configure({captureUncaught: true, captureUnhandledRejections: true});

// Set the verbose option
Rollbar.configure({verbose: true});

// Enable automatic telemetry event collection with a max queue size of 50, and not including any input values in Telemetry events
Rollbar.configure({autoInstrument: true, maxTelemetryEvents: 50, scrubTelemetryInputs: true});

// Include previously logged items to Rollbar in the queue of telemetry events
Rollbar.configure({includeItemsInTelemetry: true});
```

For fine-grained control of the payload sent to the [Rollbar API](https://rollbar.com/docs/api/items_post/), you can override any keys by nesting them in the configuration under the payload key:

```javascript
Rollbar.configure({payload: {fingerprint: "custom fingerprint to override grouping algorithm"}}).error(err);
```

For convenience, the configure method also accepts a second parameter of data to be automatically nested under the payload key, for example:

```javascript
Rollbar.configure({enabled: true, payload: {somekey: 'somevalue'}}, {fingerprint: 'abc123'})
```

is equivalent to

```javascript
Rollbar.configure({enabled: true, payload: {somekey: 'somevalue', fingerprint: 'abc123'}})
```

Moreover, the values in the second parameter take precedence over any which have a duplicate key nested under the payload key in the first parameter. For example,

```javascript
Rollbar.configure(
  {
    enabled: true,
    payload: {
      a: 'b',
      somekey: 'somevalue'
    }
  },
  {
    somekey: 'other',
    fingerprint: 'abc123'
  }
)
```

is equivalent to

```javascript
Rollbar.configure(
  {
    enabled: true,
    payload: {
      a: 'b',
      somekey: 'other',
      fingerprint: 'abc123'
    }
  }
)
```

### Reference

Both global and context configuration have the following reserved key names that Rollbar uses to aggregate, notify and display.

#### Global

[block:parameters]
{
  "data": {
    "h-0": "Option",
    "h-1": "Description",
    "0-0": "itemsPerMinute",
    "0-1": "Max number of items to report per minute. The limit counts uncaught errors (reported through `window.onerror`) and any direct calls to `Rollbar.log/debug/info/warning/error/critical()`. This is intended as a sanity check against infinite loops, but if you're using Rollbar heavily for logging, you may want to increase this.  \n  \nIf you would like to remove this limit, set it to `undefined`.  \n  \nDefault: `60`",
    "1-0": "`maxItems`",
    "1-1": "Max number of items to report per page load. When this limit is reached, an additional item will be reported stating that the limit was reached. Like `itemsPerMinute`, this limit counts uncaught errors (reported through `window.onerror`) and any direct calls to `Rollbar.log/debug/info/warning/error/critical()`.  \n  \nDefault: `0` (no limit)"
  },
  "cols": 2,
  "rows": 2,
  "align": [
    "left",
    "left"
  ]
}
[/block]

### Context

[block:parameters]
{
  "data": {
    "h-0": "Option",
    "h-1": "Description",
    "0-0": "`accessToken`",
    "0-1": "Sets the access token used to send payloads to Rollbar.  \n  \nItems sent through a given access token arrive in that access token's project and respect the rate limits set on that access token.",
    "1-0": "`addErrorContext`",
    "1-1": "Enables adding error context to the payload. For exception payloads, the error context will be read from `error.rollbarContext`.  \n  \nDefault: `false`",
    "2-0": "`autoInstrument`",
    "2-1": "An object or boolean describing what events to automatically collect. If this value is false then we collect nothing, if it is true we collect everything, otherwise we do not collect events for the keys with a false value. The default structure for this object is:  \n  \n`json\n{\n  network: true,\n  log: true,\n  dom: true,\n  navigation: true,\n  connectivity: true\n}\n`  \nFor more information on the possible structure of this object, please see [here](https://docs.rollbar.com/v1.0.0/docs/rollbarjs-telemetry).",
    "3-0": "`captureIp`",
    "3-1": "For browser settings, this determines how we attempt to capture IP addresses from the client that submits items. For server settings, this determines how we capture IP addresses from requests.  \n  \nPossible values are: `true`, `false`, or `'anonymize'`.  \n  \nIf `true` then we will attempt to capture and store the full IP address of the client. If set to `'anonymize'` we will do a semi-anonymization on the captured IP address by masking out the least significant bits. If set to `false` we will not attempt to capture any IP address.  \n  \nDefault: `true`",
    "4-0": "`captureUsername`",
    "4-1": "Capture the user's username",
    "5-0": "`captureEmail`",
    "5-1": "Capture the user's email",
    "6-0": "`captureLambdaTimouts`",
    "6-1": "a configuration option that defaults to `true` and installs a watchdog to report potential timeouts one second before they occur based on the remaining time in the context. If you set this to `false` we will not install the timer. If you pass a second argument to `lambdaHandler` we will invoke that second argument as a function with the event, context, and callback with which the original function is called.  \nWhen captureLambdaTimeouts is set, the SDK sets a timer just a bit short of the timeout.   \n  \nA Rollbar error is sent to report the Lambda timeout when that timer expires. This succeeds since the function hasn't been killed quite yet. One of the possible failure modes for Lambda functions is the event that they hit their timeout threshold. In that case, the Lambda is killed. Since that happens instantly, a Rollbar error can't be sent to report this failure. Additionally, it's possible to have false positives. When the error is sent, the timeout will likely occur, but it's also possible the function will complete.",
    "7-0": "`captureUncaught`",
    "7-1": "This determines whether or not the client reports all uncaught exceptions to Rollbar by default.  \n  \nDefault: `false`",
    "8-0": "captureUnhandledRejections",
    "8-1": "This determines whether or not the client reports all uncaught rejections to Rollbar by default.  \n  \nDefault: `false`",
    "9-0": "`checkIgnore`",
    "9-1": "An optional function that will be used to ignore uncaught exceptions based on its return value. The function signature should be: `function checkIgnore(isUncaught, args, payload) { ... }` and should return `true` if the error should be ignored.  \n  \nDefault: `null`  \n  \n_ `isUncaught`: `true` if the error being reported is from the `window.onerror` hook.  \n_ `args`: The arguments to `Rollbar.log/debug/info/warning/error/critical()`.  In the case of unhandled rejections, the last parameter is originating `Promise`.  \n\\* `payload`: The javascript object that is about to be sent to Rollbar. This matches the contents of the `data` key described [here](https://docs.rollbar.com/reference/create-item). This parameter is useful for advanced ignore functionality.",
    "10-0": "`enabled`",
    "10-1": "If set to `false`, no data will be sent to Rollbar for this notifier.  \n  \nNote: callbacks for errors will not be called if this is set to `false`.  \n  \nDefault: `true`",
    "11-0": "`endpoint`",
    "11-1": "The url to which items get POSTed. This is mostly relevant to our enterprise customers. You will, however, need this if you're proxying the requests through your own server, or you're an enterprise customer.  \n  \nDefault: `'https://api.rollbar.com/api/1/item'`",
    "12-0": "`exitOnUncaughtException`",
    "12-1": "Node environment only. Exit the process after handling an uncaught exception. Requires `captureUncaught` to also be set.  \n  \nDefault: `false`",
    "13-0": "`hostBlockList`",
    "13-1": "Check payload frames for blocklisted URL patterns. This is an array of strings, each of which get compiled to a `RegExp`. If a file in the trace matches one of these URL patterns, the payload is ignored.",
    "14-0": "`hostSafeList`",
    "14-1": "Check payload frames for safelisted URL patterns. This is an array of strings, each of which get compiled to a `RegExp`. If a file in the trace matches one of these URL patterns, the payload is accepted. When you specify a domain, that will safelist all subdomains of that domain.",
    "15-0": "`ignoreDuplicateErrors`",
    "15-1": "When false, transmit all error events including consecutive duplicate errors. When true, only send the first error when identical consecutive errors are detected.  \n  \nDefault: `true`",
    "16-0": "`includeItemsInTelemetry`",
    "16-1": "This option determines if the client includes previously logged items to Rollbar in the queue of telemetry events. This includes both direct calls and indirect calls via uncaught exceptions.  \n  \nDefault: `true` in the browser and React Native targets, `false` for the server target.  \n  \n  \\* For more information on telemetry, please see [here](https://docs.rollbar.com/v1.0.0/docs/rollbarjs-telemetry).",
    "17-0": "`ignoredMessages`",
    "17-1": "The events that match the criteria of elements of the ignoredMessages array will not be transmitted.  \nThis option applies for exception messages only.  \n  \nThis option is an array of strings and regex expressions  \n  \nExample:  \n`ignoredMessages: ['Exception message to ignore',\n/Cannot read properties of undefined/i]`  \n  \nNote the 2nd element in the array (the regex expression) is not a string. It does not have quotes.",
    "18-0": "`locals`",
    "18-1": "Node.js only: Enables local variable capture with stack traces. For more information, see [here](https://docs.rollbar.com/docs/nodejs#enabling-local-variables-in-stack-traces).  \n  \nDefault: `undefined`",
    "19-0": "`logLevel`",
    "19-1": "The severity level used for calls to `Rollbar.log()`. One of `\"critical\"`, `\"error\"`, `\"warning\"`, `\"info\"`, `\"debug\"`.  \n  \nDefault: `\"debug\"`",
    "20-0": "`maxRetries`",
    "20-1": "Sets the per-payload maximum number of retries sending to the Rollbar API. Currently supported in browser only.  \n  \nDefault: `undefined` (No maximum is set)  \n  \nSee also: `timeout`, `retryInterval`",
    "21-0": "`maxTelemetryEvents`",
    "21-1": "This determines the size of the in-memory queue of telemetry events that gets built up over the lifecycle of a user interacting with your app.  The size of the queue is fixed to be in the interval [0, 100], so while you can lower the size of the queue from 100, currently you can not increase the size of the queue beyond 100.  \n  \nDefault: `100`  \n  \nFor more information on telemetry, please see [here](https://docs.rollbar.com/v1.0.0/docs/rollbarjs-telemetry).",
    "22-0": "nodeSourceMaps",
    "22-1": "This setting when `true` enables source mapping in the application environment before sending the payload to Rollbar. (This is most often used for Typescript mapping.). When using this feature, source maps don't need to be uploaded to Rollbar.  \n  \nDefault: `false`",
    "23-0": "`onSendCallback`",
    "23-1": "An optional function that will be called for every payload before it is sent to the API. The function signature is the same as that of the `checkIgnore` function, namely `function onSendCallback(isUncaught, args, payload)`. The return value is ignored.  \n  \nDefault: `null`  \n  \n_ `isUncaught`: `true` if the error being reported is from the `window.onerror` hook.  \n_ `args`: The arguments to `Rollbar.log/debug/info/warning/error/critical()`.  In the case of unhandled rejections, the last parameter is originating `Promise`.  \n\\* `payload`: The javascript object that is about to be sent to Rollbar. This will contain all of the context and payload information for this notifier and error. This parameter is useful for advanced ignore functionality.",
    "24-0": "`overwriteScrubFields`",
    "24-1": "If this is `true` then only the fields set in your configured `scrubFields` array will be used for scrubbing. If this is `false` or not present, then the value set in `scrubFields` will be appended to the default list of fields.  \n  \nDefault: `false`",
    "25-0": "`reportLevel`",
    "25-1": "Used to filter out which messages will get reported to Rollbar. If set to `\"error\"`, only `\"error\"` or higher serverity level items will be sent to Rollbar.  \n  \nDefault: `\"debug\"`",
    "26-0": "`retryInterval`",
    "26-1": "Number of milliseconds between retries. If set, errors will be queued up in the event of a connection failure where we are unable to push the errors to Rollbar. Once a connection has been re-established, the queue will be flushed. If null, then connection failure will not be detected and errors will not be queued.  \n  \nDefault: `null`  \n  \nSee also: `timeout`, `maxRetries`",
    "27-0": "`scrubFields`",
    "27-1": "A list containing names of keys/fields/query parameters to override the default scrubbing parameters. Scrubbed fields will be normalized to all `*` before being reported to Rollbar. This is useful for sensitive information that you do not want to send to Rollbar. e.g. User tokens  \n  \n**NOTE:**  \n_Setting scrubFields will append this value to the default set of fields.  If you wish to overwrite the defaults, then make sure to set `overwriteScrubFields` to `true`._  \n  \nDefault scrubbed fields for servers: `[\"pw\", \"pass\", \"passwd\", \"password\", \"password_confirmation\", \"passwordConfirmation\", \"confirm_password\", \"confirmPassword\", \"secret\", \"secret_token\", \"secretToken\", \"secret_key\", \"secretKey\", \"api_key\", \"access_token\", \"accessToken\", \"authenticity_token\", \"oauth_token\", \"token\", \"user_session_secret\", \"request.session.csrf\", \"request.session._csrf\", \"request.params._csrf\", \"request.cookie\", \"request.cookies\"]`  \n  \nDefault scrubbed fields for browsers: `[\"pw\", \"pass\", \"passwd\", \"password\", \"secret\", \"confirm_password\", \"confirmPassword\", \"password_confirmation\", \"passwordConfirmation\", \"access_token\", \"accessToken\", \"secret_key\", \"secretKey\", \"secretToken\", \"cc-number\",\n        \"card number\",\n        \"cardnumber\",\n        \"cardnum\",\n        \"ccnum\",\n        \"ccnumber\",\n        \"cc num\",\n        \"creditcardnumber\",\n        \"credit card number\",\n        \"newcreditcardnumber\",\n        \"new credit card\",\n        \"creditcardno\",\n        \"credit card no\",\n        \"card#\",\n        \"card #\",\n        \"cc-csc\",\n        \"cvc2\",\n        \"cvv2\",\n        \"ccv2\",\n        \"security code\",\n        \"card verification\",\n        \"name on credit card\",\n        \"name on card\",\n        \"nameoncard\",\n        \"cardholder\",\n        \"card holder\",\n        \"name des karteninhabers\",\n        \"card type\",\n        \"cardtype\",\n        \"cc type\",\n        \"cctype\",\n        \"payment type\",\n        \"expiration date\",\n        \"expirationdate\",\n        \"expdate\",\n        \"cc-exp\"]`",
    "28-0": "`scrubPaths`",
    "28-1": "A list of exact paths to scrub in the payload. The scrub location is described using dot notation.  \n  \nExample:  \n`scrubPaths: ['request.query_string',\n  'client.javascript.plugins']`  \n  \nDefault: `undefined`",
    "29-0": "`scrubRequestBody`",
    "29-1": "For Node.js/server environment only.  This flag is enabled by default and enables parsing of JSON request bodies and scrubbing specific keys within the parsed JSON. After scrubbing, the request is reserialized and the payload is updated at `data.request`. Disable this flag to prevent parsing and attempted scrubbing of the request.  \n  \nDefault: `true`",
    "30-0": "`scrubTelemetryInputs`",
    "30-1": "This is used for scrubbing telemetry-specific data related to inputs in the dom. If this is set to `true` then no input values will be included in the telemetry events.  \n  \nDefault: `false`  \n  \nFor more information on telemetry, please see [here](https://docs.rollbar.com/v1.0.0/docs/rollbarjs-telemetry).",
    "31-0": "`sendConfig`",
    "31-1": "Include the configuration for Rollbar with each item sent to Rollbar. This can aid in debugging configuration issues.  \n  \nDefault: `false`",
    "32-0": "`stackTraceLimit`",
    "32-1": "Node.js and some browsers, including Chrome and Safari, default to returning a maximum of 10 stack frames for any thrown `Error`. This option allows setting a larger maximum limit (e.g. 50).  \n  \nDefault: `undefined` (Uses the current default.)",
    "33-0": "`timeout`",
    "33-1": "Set the network timeout for Rollbar API requests in milliseconds. Currently supported in browser only.  \n  \nDefault: `undefined` (Does not set a timeout)  \n  \nSee also: `maxRetries`, `retryInterval`",
    "34-0": "`transform`",
    "34-1": "Optional function to modify the payload before sending to Rollbar. For more information on this user defined function, please see [here](https://docs.rollbar.com/v1.0.0/docs/javascript#transforming-the-payload).  \n  \nDefault: `null`",
    "35-0": "`transmit`",
    "35-1": "Determines whether to send Rollbar events to the Rollbar API. When unset, events will be fully processed, but not sent.  \n  \nDefault: `true`",
    "36-0": "`uncaughtErrorLevel`",
    "36-1": "The severity level used when uncaught errors are reported to Rollbar.  \n  \nDefault: `\"error\"`",
    "37-0": "`verbose`",
    "37-1": "This determines whether or not the client also logs to `console.log`, in addition to sending the item to Rollbar.  \n  \nDefault: `false`",
    "38-0": "`wrapGlobalEventHandlers`",
    "38-1": "In the browser environment, Rollbar wraps many global event handlers in order to provide more detailed information when an error occurs in one of these handlers. Set this flag false to disable these wrappers.  \n  \nDefault: `true`"
  },
  "cols": 2,
  "rows": 39,
  "align": [
    "left",
    "left"
  ]
}
[/block]

### Payload

These keys should all be within the `payload` key.

e.g.

```js
Rollbar.configure({
  payload: {
    person: ...,
    context: ...
  }
});
```

[block:parameters]
{
  "data": {
    "h-0": "Option",
    "h-1": "Description",
    "0-0": "`person`",
    "0-1": "An object identifying the logged-in user, containing an `id` (required), and optionally a `username` and `email` (all strings). Passing this will allow you to see which users were affected by particular errors, as well as all the errors that a particular user experienced.",
    "1-0": "`context`",
    "1-1": "Name of the page context -- i.e. route name, url, etc. Can be used in the Rollbar interface to search for items by context prefix.",
    "2-0": "`client`",
    "2-1": "An object describing properties of the client device reporting the error.  \n  \n  This object should have a key that points to another object, `javascript` which describes properties of the javascript code/environment to Rollbar.  \n  \n  `client.javascript` supports the properties in the following rows.  \n  \nExample:  \n`javascript\nRollbar.configure({\n  scrubFields: [\"creditCard\"],\n  payload: {\n    client: {\n      javascript: {\n        code_version: \"ce0227180bd7429fde128f6ef8fad77396d8fbd4\",  // Git SHA of your deployed code\n        source_map_enabled: true,\n        guess_uncaught_frames: true\n      }\n    }\n  }\n});\n`",
    "3-0": "`client\n.javascript\n.code_version`",
    "3-1": "Version control number (i.e. git SHA) of the current revision. Used for linking filenames in stacktraces to GitHub.  \n  \n  Note: for the purposes of nesting under the payload key, only `code_version` will correctly set the value in the final item. However, if you wish to set this code version at the top level of the configuration object rather than nested under the payload key, we will accept both `codeVersion` and `code_version` with `codeVersion` given preference if both happened to be defined. Furthermore, if `code_version` is nested under the payload key this will have the final preference over any value set at the top level.",
    "4-0": "`client\n.javascript\n.source_map_enabled`",
    "4-1": "When `true`, the Rollbar service will attempt to find and apply source maps to all frames in the stack trace.  \n  \nDefault: `false`",
    "5-0": "`client\n.javascript\n.guess_uncaught_frames`",
    "5-1": "When `true`, the Rollbar service will attempt to apply source maps to frames even if they are missing column numbers. Works best when the minified javascript file is generated using newlines instead of semicolons.  \n  \nDefault: `false`",
    "6-0": "`environment`",
    "6-1": "The environment that your code is running in.  \n  \nDefault: unspecified",
    "7-0": "`server`",
    "7-1": "An object describing properties of the server that was used to generate the page the notifier is reporting on.  \n  \n`server` supports the properties in the following rows.  \n  \nExample configuration:  \n\\`js  \nRollbar.configure({  \n  logLevel: \"warning\", // Rollbar.log() will be sent with a level = \"warning\"  \n  payload: {  \n    server: {  \n      branch: \"master\",  \n      host: \"web1.mysite.com\"  \n    }  \n  }  \n});  \n  \n\\`",
    "8-0": "`server.branch`",
    "8-1": "The name of the branch of the code that is running. Used for linking filenames in stacktraces to GitHub.  \n  \nDefault: `\"master\"`",
    "9-0": "`server.host`",
    "9-1": "The hostname of the machine that rendered the page.  \n  \ne.g. `\"web1.mysite.com\"`  \n  \ne.g. in Python, use `socket.gethostname()`",
    "10-0": "`server.root`",
    "10-1": "It is used in two different ways: source maps, and source control. If you are looking for more information on it please go to:  \n<https://docs.rollbar.com/docs/source-maps>  \n<https://docs.rollbar.com/docs/source-control>"
  },
  "cols": 2,
  "rows": 11,
  "align": [
    "left",
    "left"
  ]
}
[/block]

Check out the method reference below for more information on how to use `global/configure`.

## Method Reference

### Rollbar.global()

(See the configuration reference above.)

*Note*: This method will update any existing global configuration.

**Returns**: `undefined`

**Params**

1. options: `Object` - A javascript object that contains global configuration.

### Rollbar.configure()

(See the configuration reference above.)

*Note*: This method will update any existing configuration for the `Rollbar` instance used.

**Returns**: `undefined`

**Params**

1. options: `Object` - A javascript object that contains the notifier configuration.

### Rollbar.handleUncaughtException()

This method is used to record uncaught exceptions from `window.onerror`. The Rollbar snippet will set `window.onerror = Rollbar.uncaughtError` if it was configured to do so via the `captureUncaught` config parameter given to the constructor of this Rollbar instance.

**Returns**: `undefined`

**Params**

1. message: `String`: The error message.
2. url: `String`: url that the error occurred on.
3. lineNo: `Integer`: The line number, (if known) that the error occurred on.
4. colNo: `Integer`: The column number that the error occurred on.\
   *Note*: Only newer browsers provide this variable.
5. err: `Exception`: The exception that caused the `window.onerror` event to occur.\
   *Note*: Only newer browsers provide this variable.

### Rollbar.handleUnhandledRejection()

This method is used to record unhandled Promise rejections via the window event `unhandledrejection`.  See the [standard](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection)) for more information about when this is available.

To enable this handling, you should provide `captureUnhandledRejections` to the config given to this Rollbar constructor.

**Returns**: `undefined`

**Params**

1. message: `Exception`: The exception, or rejection being rejected.
2. promise: `Promise`: The originating promise object.

### Rollbar.log()

Log a message and potentially send it to Rollbar. The level that the message or error is logged at is determined by the `logLevel` config option.

In order for the message to be sent to Rollbar, the log level must be greater than or equal to the `reportLevel` config option.

See the configuration reference above for more information on configuring log levels.

**Returns**: `undefined`

**Params**

*Note*: order does not matter, except that message and err arguments must come first if present. The first string will be interpreted as message, and the first Error type argument will be interpreted as err. At least one of message or err must be present.

* message: `String` - The message to send to Rollbar.
* err: `Exception` - The exception object to send.
* custom: `Object` - The custom payload data to send to Rollbar.
* callback: `Function` - The function to call once the message has been sent to Rollbar.

#### Examples

##### Log a debug message

```javascript
// By default, the .log() method uses the
// "debug" log level and "warning" report level
// so this message will not be sent to Rollbar.
Rollbar.log("hello world!");
```

##### Log a warning along with custom data

```javascript
Rollbar.configure({logLevel: "warning"});
Rollbar.log("Uh oh! The user pressed the wrong button.", {buttonId: "redButton"});
```

#### Log a debug message along with an error

```javascript
try {
  foo();
} catch (e) {
  Rollbar.log("Caught an exception", e);
}
```

##### Log an error and call a function when the error is reported to Rollbar

```javascript
Rollbar.configure({logLevel: "error"});

function continueFormSubmission() {
  // ...
}

try {
  foo();
  continueFormSubmission();
} catch (e) {
  Rollbar.log(e, continueFormSubmission);
}
```

### Rollbar.debug/ info/ warn/ warning/ error/ critical()

These methods are all shorthand for `Rollbar.log()` with the appropriate log level set.

> 📘
>
> For more information on rollbar.js, see the docs [here](https://docs.rollbar.com/docs/javascript).