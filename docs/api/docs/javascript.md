<!-- source: https://docs.rollbar.com/docs/javascript.md -->

# Javascript (Browser & Node.js)

Rollbar SDK for client-side Javascript | Support Level: Supported

Add [Rollbar.js](https://github.com/rollbar/rollbar.js) to your Node.js or browser-based JavaScript projects to automatically capture and report errors in your applications.

## Quick Start

The docs linked below will help you get Rollbar up and running quickly in various JS platforms and toolchains.

|                                                                           |                                                                                                                                                              |
| :------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Browser JS](https://docs.rollbar.com/docs/browser-js) quick start                                  | [Node.js](https://docs.rollbar.com/docs/nodejs) quick start                                                                                                                            |
| [React](https://docs.rollbar.com/docs/react) quick start                                            | [Angular](https://docs.rollbar.com/docs/angular) quick start                                                                                                                           |
| [Vue.js](https://docs.rollbar.com/docs/vue-js) quick start                                          | [Requirejs](https://docs.rollbar.com/docs/requirejs) information                                                                                                                       |
| [UMD](https://docs.rollbar.com/docs/umd) information                                                | [Browserify](https://docs.rollbar.com/docs/browserify) information                                                                                                                     |
| Rollbar.js supports Backbone.js with no additional configuration required | Community maintained Ember library: [ember-rollbar-client](https://github.com/Exelord/ember-rollbar-client) by [Maciej Kwaśniak](https://github.com/Exelord) |
| [AWS Lambda](https://docs.rollbar.com/docs/aws-lambda) information                                  | \[[Svelte](https://docs.rollbar.com/docs/svelte)] quick start                                                                                                |

The following browser versions are supported on all major desktop and mobile operating systems:

|          |             |            |
| :------- | :---------- | :--------- |
| IE 8+    | Firefox 40+ | Chrome 44+ |
| Edge 10+ | Opera 12+   | Safari 8+  |

## Source Maps

If you minify your JavaScript in production, you'll want to configure source maps so you get meaningful stack traces. See the [source maps guide](https://rollbar.com/docs/source-maps/) for instructions.

## Usage

In addition to catching top-level errors, you can send caught errors or custom log messages. All of the following methods are fully-asynchronous and safe to call anywhere in your code after the `<script>` tag.

```javascript
// Caught errors
try {
  doSomething();
} catch (e) {
  Rollbar.error("Something went wrong", e);
}

// Arbitrary log messages. 'critical' is most severe; 'debug' is least.
Rollbar.critical("Connection error from remote Payments API");
Rollbar.error("Some unexpected condition");
Rollbar.warning("Connection error from Twitter API");
Rollbar.info("User opened the purchase dialog");
Rollbar.debug("Purchase dialog finished rendering");

// Can include custom data with any of the above.
// It will appear as `message.extra.postId` in the Occurrences tab
Rollbar.info("Post published", {postId: 123});

// Callback functions
Rollbar.error(e, function(err, data) {
  if (err) {
    console.log("Error while reporting error to Rollbar: ", e);
  } else {
    console.log("Error successfully reported to Rollbar. UUID:", data.result.uuid);
  }
});
```

To set configuration options at runtime, use `Rollbar.configure`:

```javascript
// Set the person data and custom data to be sent with all errors for this notifier.
Rollbar.configure({
  payload: {
    person: {
      id: 456,
      username: "foo",
      email: "foo@example.com"
    },
    custom: {
       customertype: "premium"
    }
  }
});
// Unset the person data to be sent with all errors for this notifier.
Rollbar.configure({
  payload: {
    person: {
      id: null
    }
  }
});
```

There are configuration changes needed to [use Rollbar.js with Segment](https://docs.rollbar.com/docs/using-rollbarjs-with-segment), [use Rollbar.js in a Chrome Extension](https://docs.rollbar.com/docs/using-rollbarjs-in-a-chrome-extension), or  [use Rollbar.js inside an embedded component](https://docs.rollbar.com/docs/using-rollbarjs-inside-an-embedded-component).

### Upgrading from Previous Versions

If you are upgrading from node\_rollbar, please see [here](https://docs.rollbar.com/docs/upgrading-from-node_rollbar).

The simplest approach to upgrading from one version of to the next is to replace the snippet with the one in this document. The URL in the snippet is of the form:

Rollbar.js 2.15.0 and later

```
https://cdn.rollbar.com/rollbarjs/refs/tags/vX.X.X/rollbar.min.js
```

Rollbar.js earlier than 2.15.0

```
https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/X.X.X/rollbar.min.js
```

where `X.X.X` would be replaced with the version number of the latest release.

## Managing Sensitive Data

### GDPR & HIPAA

If you are required to comply with [GDPR](https://www.eugdpr.org/) or HIPAA, we have a few recommendations for how to manage the sensitive data you may be sending to Rollbar. We recommend setting up person tracking, customizing your data retention period (more info on this [here](https://docs.rollbar.com/docs/data-retention)), anonymizing or not capturing IP addresses, and [scrubbing sensitive data](https://docs.rollbar.com/docs/javascript#section-scrubbing-items) before sending Rollbar items. For HIPAA compliance, we additionally recommend [transforming the payload](https://docs.rollbar.com/docs/javascript#section-transforming-the-payload) before sending Rollbar items, as sometimes sensitive data may be found in stack traces.

For information on setting up person tracking, please see [here](https://docs.rollbar.com/docs/javascript#section-person-tracking). You can simply send only the `person.id` and no other identifying information, such as an email address. If you have already sent Rollbar sensitive person data and wish to delete it, please see our documentation on deleting person data [here](https://explorer.docs.rollbar.com/#operation/delete-a-person).

You may also configure the `captureIp` setting in your config to either not capture IP addresses (by setting `captureIp` to `false`) or have the SDK do a semi-anonymization on the captured IP address by masking out the least significant bits (by setting `captureIp` to `'anonymize'`).

```js
Rollbar.configure(
  {
    enabled: true, 
    captureIp: 'anonymize', 
    payload: {
      person: {
      id: 12345
      }
    }
  }
);
```

### Scrubbing Items

If you need to scrub certain data in the payload before sending it to Rollbar, there are a few options for how to go about doing so. To scrub telemetry data, please see [here](https://docs.rollbar.com/docs/rollbarjs-telemetry). To scrub other keys/fields/query parameters in the payload, you can use the `scrubFields` and `scrubPaths` configuration options. For more detailed information about scrubFields, scrubPaths, and what keys in the payload are scrubbed by default, please see the [Configuration Reference](https://docs.rollbar.com/docs/rollbarjs-configuration-reference#section-context).

```js
Rollbar.configure({
  scrubFields: ['creditCardNumber'],
  scrubPaths: ['request.query_string']
});
```

### Transforming the Payload

If you would like to change some of the data in the payload before sending an item to Rollbar, you may do so via the `transform` function.

```js
// For example, to change the environment:
var transformer = function(payload) {
  payload.environment = 'backend-2';
};

Rollbar.configure({transform: transformer});
```

Starting in v2.23.0, async transform functions are also supported by returning a Promise or thenable from your transform function.

### Ignoring Items

If you would like to have the client ignore an item and not send it to Rollbar, you can use the `checkIgnore` function. It may be used to ignore uncaught exceptions based on its return value. For more detailed information on `checkIgnore`, please see the [Configuration Reference](https://docs.rollbar.com/docs/rollbarjs-configuration-reference#section-context).

```js
Rollbar.configure({checkIgnore: function(isUncaught, args, payload) {
    // ignore all uncaught errors and all 'debug' items
    return isUncaught === true || payload.level === 'debug';
}});
```

You may also ignore items with specific exception messages using the `ignoredMessages` configuration option. For more information on that, please see [here](https://docs.rollbar.com/docs/javascript#section-ignoring-specific-exception-messages).

## Features

### Telemetry

We can capture a sequence of events leading up to an error/log message to enhance your visibility into the state of your application when something happens as a default. For information on how to configure and disable this, see [Telemetry](https://docs.rollbar.com/docs/rollbarjs-telemetry).

### Disable sending error data to Rollbar

If you don't want to send error data to Rollbar, just set the `enabled` flag to `false` for each notifier instance.

```js
Rollbar.error("This will be reported to Rollbar");
Rollbar.configure({enabled: false});
Rollbar.error("This will *not* be reported to Rollbar");
```

### Reporting CSP (Content Security Policy) error data to Rollbar

Browsers use Content Security Policy directives (provided in the HTTP response header, or in a meta tag) to govern what resources can and can't be loaded. When an attempt to load a resource is blocked, an error is written to the dev console, but no exception is thrown. Instead, the browser sends a contentsecuritypolicy event.

Rollbar listens for these events and records the error as a telemetry event, and if errorOnContentSecurityPolicy is set, sends a Rollbar error occurrence.

To enable/disable the feature, use these autoInstrument flags:

```javascript JavaScript
config.autoInstrument = {
  contentSecurityPolicy: true, // enables telemetry tracking, enabled by default
  errorOnContentSecurityPolicy: true // send a Rollbar error message, disabled by default
}
```

### Ignoring specific exception messages

If you want to ignore a specific exception message, say for a third-party browser plugin that is throwing errors, you can add the message to the `ignoredMessages` array, and Rollbar will ignore exceptions matching those messages.

```javascript
Rollbar.configure({ignoredMessages: ["Can't find Clippy.bmp. The end is nigh."]});
```

`ignoredMessages` must be an array of strings and/or regular expression objects. Both strings and regular expression objects are treated as case insensitive regular expressions.

Given the message:

```javascript
Rollbar.info("This is an ignored message")
```

Any of the following examples will match successfully.

```javascript
[
  "This". // substring match
  "this", // case insensitive match
  "^This is an .{7} message$", // valid regular expression syntax
  /^This is an .{7} message$/  // valid regular expression object (no string quotation marks)
]
```

Because ignoredMessages matchers are actually regular expressions, when matching a literal string, some characters must  be escaped. Characters that may need to be escaped include: `^`, `$`, `.`, `|`, `?`, `*`, `+`, `()`, `[]`, and `{}`. In order for these to remain escaped in the regex matcher, they should be doubled escaped when passed in the config.

Note: When passing a valid regular expression object there are no quotation marks.

Example:

```javascript
Rollbar.info("Match these characters: (*+?)")
```

This will match successfully:

```javascript
Rollbar.configure({ignoredMessages: ["\\(\\*\\+\\?\\)"]}); // Substring match. All literals are double escaped.
```

### Person Tracking

If your application has authenticated users, you can track which user ("person" in Rollbar parlance) was associated with each event.

```
// To track the current user in Javascript you can alter your `_rollbarConfig`
// like so:

var _rollbarConfig = {
  // The usual
  payload: {
    // The usual
    person: {
      id: 42, // required 
      username: 'dadams',
      email: 'dadams@example.com'
    }
  }
}

// If you've already initialized Rollbar and need to set the user *after*
// initialization has already occurred you can use the `configure` method:

Rollbar.configure({
  payload: {
    person: {
      id: 456, // required
      username: "foo",
      email: "foo@example.com"
    }
  }
});
```

Note: in Rollbar, the id is used to uniquely identify a person; email and username are supplemental and will be overwritten whenever a new value is received for an existing id. The id is a string up to 40 characters long.

By default we only attempt to capture the id for a user. Use the boolean configuration options captureEmail and captureUsername to change this behavior.

### [UUIDs](https://docs.rollbar.com/docs/uuids)

The Rollbar.js SDK generates a [UUID](https://docs.rollbar.com/docs/uuids) for every event reported back to the Rollbar platform. This UUID can be used to track customer issues, correlate exceptions to automated test sessions, and more. In Javascript, when the item/occurrence object is created, it will have a property called `uuid` with the value for that given object. The value is set in the [`utility.js`](https://github.com/rollbar/rollbar.js/blob/master/src/utility.js) file.

### Handling uncaught rejections

Rollbar.js supports the ability to catch and report unhandled Promise rejections, that is, Promise failures that do not have a corresponding `.then(null, function(e) {})` handler.  This support is best used for handling rejected `exceptions`, although rejected primitives will report (without a stack trace).

If you decide to use this option, you may also want to combine it with the `checkIgnore` [configuration](https://docs.rollbar.com/docs/rollbarjs-configuration-reference) option to filter 'noisy' rejections, depending on the extent to which your application handles Promise failures, or rejects with a lot of primitives.

### Verbose option

If you would like to see what is being sent to Rollbar in your console, use the `verbose` option.

```javascript
Rollbar.configure({verbose: true, // This will now log to console.log, as well as Rollbar});
```

### Synchronous option

By default, the snippet loads the full Rollbar source **asynchronously**. You can disable this, which will cause the browser to download and evaluate the full Rollbar source before evaluating the rest of the page.

More information can be found [here](http://www.w3schools.com/tags/att_script_async.asp) and [here](https://www.w3schools.com/tags/att_script_defer.asp).

```javascript
Rollbar.configure({async: false});
```

### Dealing with adblocker / browser extension exceptions

Unfortunately, some very popular browser extensions may modify a user's copy of your website in such a way as to break its functionality.  This can result in Rollbar reporting exceptions that are not a direct result of your own code.  There are multiple approaches to dealing with this issue, the simplest of which is covered [in related documentation](https://github.com/rollbar/rollbar.js/tree/master/docs/extension-exceptions.md).

Some users have reported issues with Rollbar for Vue while using browsers with adblockers, with the error reported:\
"Loading failed for the module with source".

## Configuration Options

For a listing of all configuration options available, see [Configuration and Method Reference](https://docs.rollbar.com/docs/rollbarjs-configuration-reference).

## Plugins

The support for the different frameworks and libraries is organized into different plugin definitions. The plugins architecture documentation can be found in [Plugins](https://docs.rollbar.com/docs/rollbarjs-plugins).

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar.js/issues/new).