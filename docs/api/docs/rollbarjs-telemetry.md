<!-- source: https://docs.rollbar.com/docs/rollbarjs-telemetry.md -->

# JavaScript Telemetry

Telemetry information for rollbar.js

When using Rollbar in client-side Javascript, Rollbar will track and report events that happen prior to an exception or message being reported, and display them in the **Telemetry** section of an occurrence.  The telemetry timeline provides 'breadcrumbs' that can help developers understand and fix problems in their client-side Javascript, including:

* Page load events (`DOMContentLoaded`, `load`)
* User actions (`input`, `click`, navigation between routes in a single-page app)
* Network activity (`xhr` and `fetch`) including method, URL and response code
* `Console` messages
* Other exceptions and messages sent to Rollbar

[block:image]{"images":[{"image":["https://files.readme.io/7512ad4e1375b6f6d9bae1868bff6830b4ce4a2f1ae9224eb9873593eb9efdbd-Screenshot_2024-08-30_at_12.59.34_PM.png","telemetry.png",null],"align":"center"}]}[/block]

The telemetry timeline for an occurrence can be viewed with oldest or newest entries displayed first, and each entry includes both an absolute timestamp (based on the project timezone) and a relative timestamp based on when the `DOMContentLoaded` event fired.

[block:image]{"images":[{"image":["https://files.readme.io/1a94211748ce15c41376935f4296b7b60276f122d60567008188dd475ba6f1f1-Screenshot_2024-08-30_at_1.10.18_PM.png","event_timestamp.png",null],"align":"center","sizing":"300px"}]}[/block]

The occurrence you are currently viewing is shown as the final entry in the telemetry timeline.

[block:image]{"images":[{"image":["https://files.readme.io/3d35604677b33a50fcdf18a31fd148ba53d999a14ed012cb9e70c4564847fd85-Screenshot_2024-08-30_at_1.11.22_PM.png","final_event.png",null],"align":"center"}]}[/block]

### Configuration

We provide a few configuration options to allow you to decide if and what to instrument for collecting telemetry events. The configuration option to pass along with the other configuration values is `autoInstrument`. This can have either a boolean value or be an object. The default value is `true`.

If you set `autoInstrument` to `false` then we will not collect any events automatically. If you set `autoInstrument` to an object, then the set of possible keys is `network`, `log`, `dom`, `navigation`, and `connectivity`. The values can be either `true` or `false`. If a key/value pair is omitted, then we use the default value for that key. Setting `autoInstrument` to `true` is equivalent to passing all of these keys with the values of `true`.

Hence,

```javascript
_rollbarConfig = {
  ...
  autoInstrument: true
  ...
}
```

is equivalent to

```javascript
_rollbarConfig = {
  ...
  autoInstrument: {
    network: true,
    log: true,
    dom: true,
    navigation: true,
    connectivity: true,
    contentSecurityPolicy: true,
    errorOnContentSecurityPolicy: false
  }
  ...
}
```

Likewise,

```javascript
_rollbarConfig = {
  ...
  autoInstrument: {
    dom: false,
    navigation: false
  }
  ...
}
```

is equivalent to

```javascript
_rollbarConfig = {
  ...
  autoInstrument: {
    network: true,
    log: true,
    dom: false,
    navigation: false,
    connectivity: true,
    contentSecurityPolicy: true,
    errorOnContentSecurityPolicy: false
  }
  ...
}
```

The different types of events that we automatically capture are: `network`, `log`, `dom`, `navigation`, and `connectivity`.

Network events are XHR and fetch requests. We store the status code, the url, and some timing events to determine how long requests take.

For network events, we also support the following keys in the `autoInstrument` object: `networkResponseHeaders`, `networkResponseBody`, and `networkRequestBody`. These are only relevant if `network` is set to `true`. By default they all take the value `false`.

`networkResponseHeaders` can be `true`, `false`, or an array of strings. If it is false then nothing extra is captured. If it is true, then we include all of the response headers in the logged telemetry object. Note, this is only visible in the telemetry section of the Rollbar dashboard for XHR requests. For fetch requests, navigate to the Raw JSON section of the occurrence view to see this data. If it is an array of strings, then we only include the response headers that match the strings in that array. The strings for these headers are used with the relevant header API, either [Web/API/XMLHttpRequest/getResponseHeader](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getResponseHeader) or [Web/API/Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) depending on whether you are using XHR or fetch based requests. See that documentation for how to specify the relevant header strings.

`networkResponseBody` and `networkRequestBody` specify whether to include the request/response body with the telemetry object. These are booleans.

For Content Security Policy errors, the following keys are available in the `autoInstrument` object:

```javascript
config.autoInstrument = {
  contentSecurityPolicy: true, // enables telemetry tracking, enabled by default
  errorOnContentSecurityPolicy: true // send a Rollbar error message, disabled by default
}
```

Log events are calls to `console` and we simply store which console method was called and the arguments.

DOM events are roughly clicks and inputs that are user generated. We store what element was interacted with and values for certain types of inputs. We do not store the values of inputs of password type.

Navigation events use the information from `pushState` on browsers that allow for this and gathers to and from information.

Connectivity events try to capture changes in network connectivity status when this is exposed by the browser.

In addition to automatically captured events, it is possible to manually add events to the list of telemetry events via the `captureEvent` method:

```javascript
var metadata = {somekey: 'somevalue'}; // Any object that gets stored with the event
var level = 'info'; // Possible values: 'debug', 'info', 'warning', 'error', 'critical'
rollbar.captureEvent(metadata, level);
```

We also provide the configuration option `includeItemsInTelemetry` which lives at the top level of the configuration object. This is set to `true` by default in the browser and React Native targets and to `false` for the server target. When this is true, we include previously logged items to Rollbar in the queue of telemetry events. This includes both direct calls and indirect calls via uncaught exceptions.

There is an in-memory queue of telemetry events that gets built up over the lifecycle of a user interacting with your app. This queue is FIFO and has a fixed size. By default, we store the last 100 events and send these as part of the item with each manual call to a rollbar method (log/info/warning/error) or with calls caused by an uncaught exception. You can configure the size of this queue using the option `maxTelemetryEvents`, however note that the size of the queue is fixed to be in the interval \[0, 100], so while you can lower the size of the queue from 100, currently you can not increase the size of the queue beyond 100.

Each event is stored as an object of the form

```json
{
  level: "debug" | "info" | "warning" | "error" | "critical"
  type: string
  timestamp_ms: number
  body: object
  source: string
  uuid?: string
}
```

The size of each of these events is mostly determined by the `body` field, however we attempt to store only the smallest amount of information necessary to aid in understanding. Therefore, if you have concerns about memory usage, you can turn the collection of some or all events off, or limit the size of the queue of events that we store.

Also you can filter out telemetry events with an optional test function `filterTelemetry`. Telemetry event gets passed as the first argument and boolean return value is expected. Any event that matches the test is not added to the queue. One common use case is to filter out spammy XHR requests:

```javascript
_rollbarConfig = {
  ...
  filterTelemetry: function(e) {
    return e.type === 'network'
      && (e.body.subtype === 'xhr' || e.body.subtype === 'fetch')
      && e.body.url.indexOf('https://spammer.com') === 0;
  }
}
```

The data that is collected is included in the payload and also goes through the same scrubbing process described elsewhere. However, we also provide two additional options for scrubbing of telemetry specific data related to inputs in the dom. The first options is `scrubTelemetryInputs`. If this is set to `true` then no input values will be included in the telemetry events. This is a coarse-grained on/off switch which you can use to ensure that no input data is leaked.

```json
_rollbarConfig = {
  ...
  scrubTelemetryInputs: true
}
```

The second options is a function `telemetryScrubber`. This function should take one argument which is a description of a dom node of the form:

```json
{
  tagName: string
  id: string | undefined
  classes: [string] | undefined
  attributes: [
    {
      key: "type" | "name" | "title" | "alt"
      value: string
    }
  ]
}
```

Each time an input event is captured, your function will be called with the description of the node in the form above. If your function returns a truthy value then the value of the input will be scrubbed and not included in the event, otherwise the value will be included.

If `telemetryScrubber` is not set and `scrubTelemetryInputs` is not set or `false` then we will include the values of input elements in telemetry events. However, if the name on the dom element matches one of the strings in the scrub fields configuration setting, we will scrub out the value. For example, by default `cardnumber` is in scrub fields, so if you have an input element with a name attribute equal to `cardnumber` we will record a telemetry event when someone edits that input field, but the value will be stored as `[scrubbed]` rather than the real value that is typed in. We do this also for all inputs with type equal to password.

The implementation requires us to wrap certain function calls as well as to setup some event listeners on the top level object. Because of this, there must necessarily be a performance impact as more code will be running in response to certain user interactions as well as interactions with your code. There is thus a tradeoff between gathering extra information for debugging purposes and execution time and memory footprint. Our suggestion is to benchmark and instrument your code and decide what is an acceptable tradeoff for your application. The configuration options to turn off some or all of the different instrumentation is provided to help you make these fine-grained decisions.

> 📘
>
> For more information on rollbar.js, see the docs [here](https://docs.rollbar.com/v1.0.0/docs/javascript).