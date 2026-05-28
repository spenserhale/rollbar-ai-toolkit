<!-- source: https://docs.rollbar.com/docs/session-replay.md -->

# Session Replay

Session Replay helps developers see exactly what led to an error so they can find and fix problems faster. Each account includes **1,000 free replays every month**, giving you clear insight into what users experienced before an error occurred.

## Installation & Enabling Session Replay in Rollbar

To use Rollbar's new session replay feature and privacy controls, follow these steps:

1. **Install or upgrade to the latest Rollbar SDK:**

```jsx
   npm install rollbar@3.1.0

```

1. **Import and initialize Rollbar Replays with the replay option:**

<br />

**For existing Rollbar connected projects**

```jsx
//New Rollbar Imports 
import Rollbar from "rollbar/replay";

//Your current Rollbar config
config = {
  // ... your existing config
  replay: {
    enabled: true
  }
}

```

> ❗️ Beta 4  introduced a breaking change for the replay config.  If you were on the previous beta versions you will need to rename the `recorder` parameter in the config to the `replay` parameter

For React users using the Rollbar Provider:

```jsx
const rollbar = new Rollbar(config);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider instance={rollbar} >
    <ErrorBoundary level={LEVEL_WARN}>
      <App />
    </ErrorBoundary>
  </Provider>
);
```

**If loading the client from the CDN:**

```jsx
CDN_URL = <https://cdn.rollbar.com/rollbarjs/refs/tags/v3.1.0/rollbar.min.js>

```

<br />

**For new Rollbar connected projects.**

Follow the Quick Start guide that matches your application at <https://docs.rollbar.com/docs/javascript> and add the above configuration

***

<br />

## Replay Options

[block:parameters]
{
  "data": {
    "h-0": "Option",
    "h-1": "Description",
    "h-2": "Default",
    "0-0": "enabled",
    "0-1": "Enables or disables session replay",
    "0-2": "false",
    "1-0": "autoStart",
    "1-1": "Starts session recording during SDK initialization.Requires `enabled` to be `true`",
    "1-2": "true",
    "2-0": "triggers",
    "2-1": "Sets the item severity levels that can trigger a replay capture",
    "2-2": "['error', 'critical']",
    "3-0": "triggerDefaults",
    "3-1": "Updating the default values used for all triggers that do not set overrides. Review Triggers section for more information ",
    "3-2": " {  \n     samplingRatio: 1.0  \n     preDuration: 60  \n     postDuration: 5  \n} "
  },
  "cols": 3,
  "rows": 4,
  "align": [
    null,
    null,
    null
  ]
}
[/block]

<br />

***

## Trace Options

| Key           | Description                                                                                | Default                        |
| ------------- | ------------------------------------------------------------------------------------------ | ------------------------------ |
| endpoint      | API endpoint used to send tracing and replay payloads                                      | api.rollbar.com/api/1/session/ |
| transformSpan | Allows inspecting and overriding any part of the tracing span before being sent to the API | undefined                      |

‼️ Important: Additional options for tracing replays will be introduced as we expand capabilities

<br />

### Trace Example:

```jsx
config = {
  tracing: {
    endpoint: 'api.rollbar.com/api/1/session/',
    transformSpan: ({span}) => {
      // adds custom attribute to the span
      if (span.name === 'rrweb-replay-recording') {
        span.attributes['test-group'] = 'blue';
      }
  	}
  },
  replay: {
    enabled: true
  }
}
```

<br />

***

<br />

## Trigger Options

Rollbar is the only observability platform that lets you **customize your replay triggers** by error level, path, or direct event. You can also fine-tune **sampling, pre-duration, and post-duration** for each trigger so you capture only what matters most. Post-duration helps you see the user’s error state and how it affected their experience.

<br />

### Common Trigger Options

| Key           | Type                            | Description                                                                                                                            | Default                |
| ------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| type          | string                          | Trigger the sending of the recording to Rollbar on an occurrence options include: ‘occurrence’, ‘navigation’,‘direct’                  | occurrence             |
| level         | String\[]                       | Error levels that must match to fire the trigger.                                                                                      | \[“error”, “critical”] |
| samplingRatio | number                          | The sampling ratio of replays that are recorded when a trigger event happens.                                                          | 1.0                    |
| predicateFn   | (recordingData: any) => boolean | An optional user-defined function that will trigger or skip the replay based on a boolean return value. (true = trigger, false = skip) | null                   |
| preDuration   | number                          | The duration in seconds to send preceding the triggering event                                                                         | 300                    |
| postDuration  | number                          | The duration in seconds to send following the triggering event                                                                         | 5                      |

<br />

### Occurrence Trigger Options

Occurrence triggers start a replay when Rollbar detects an error or warning. You can choose which error levels activate a replay and even narrow it down by exception class. This is the default trigger type for Rollbar Replays.

| Key            | Type                            | Description                                                                                                                            | Default |
| -------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| exceptionClass | error constructor               | Exception class that must match to fire the trigger. Set to null to match all error classes.                                           | null    |
| predicateFn    | (recordingData: any) => boolean | An optional user-defined function that will trigger or skip the replay based on a boolean return value. (true = trigger, false = skip) | null    |

<br />

### Navigation Trigger Options

Navigation triggers capture replays when users visit or interact with specific pages or paths. You can match by URL pattern and define how much time before and after the navigation to record. This helps you analyze issues tied to specific parts of your app or user flows.

| Key       | Type                  | Description                                                                       | Default |
| --------- | --------------------- | --------------------------------------------------------------------------------- | ------- |
| pathMatch | string or regex match | Matching paths will fire the trigger. Set to null to match all navigation events. | null    |

<br />

### Direct Trigger Options

Direct triggers let you start a replay from your own application code using `Rollbar.triggerReplay()`. They’re useful for custom workflows, capturing edge cases, or recording interactions that aren’t linked to errors or navigation events.

| Key  | Type  | Description                                                                                                                                                               | Default   |
| ---- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| tags | array | Allows the trigger config to match a `Rollbar.triggerDirectReplay()` call with any of the same tags set. When unset, matches any call to `Rollbar.triggerDirectReplay()`. | undefined |

<br />

### Trigger Example:

```jsx
replay: {
  triggers: [
      {
        type: 'occurrence',
        level: ['warning', 'error', 'critical', 'info'],
        samplingRatio: 1.0
      },
      {
        type: 'navigation',
        pathMatch: /app/, // matches any valid regex (as shown, will also match paths containing 'app')
        preDuration: 0,
        postDuration: 600,
      },
      {
        type: 'direct',
        tags: ['blue', 'green'],
      }
  ]
}

```

<br />

### Trigger Example to sample toward more severe occurrences

```jsx
replay: {
   triggers: [
      {
        type: 'occurrence',
        level: ['critical'],
        samplingRatio: 1.0,
      },
      {
        type: 'occurrence',
        level: ['error'],
        samplingRatio: 0.5,
      },
      {
        type: 'occurrence',
        level: ['warning'],
        samplingRatio: 0.1,
      },
  ]
}

```

<br />

### Direct Trigger Example:

```sql
Rollbar.triggerDirectReplay({ tags: ["beta test group"] })
```

Will match the trigger

```sql
{
  tags: ["beta test group"],
  samplingRatio: 0.1,
}
```

***

<br />

### **Troubleshooting: Enable Debug Logging**

If you want to debug your session replay settings and see what events are being emitted, you can enable debug logging in the replay config:

```jsx
   replay: {
     enabled: true,
     autoStart: true,
     debug: {
       logEmits: true,
       logErrors: true
     },
     // ...privacy options below
   }

```

With `debug.logEmits: true`,  Rollbar will log emitted session replay events and privacy actions to the browser console.  `debug.logErrors` is enabled by default

***

<br />

# Adding Privacy to your recording

This document explains how to use the blockSelector, ignoreSelector, and maskTextSelector options in the Rollbar session replay configuration:

```jsx
replay: {
  enabled: true,
  autoStart: true,
  blockClass: 'rb-block',
  blockSelector: '.my-blocked-class, #sensitive-section',
  ignoreClass: 'rb-ignore',
  ignoreSelector: '.my-ignore-class, #ignore-this-input',
  maskTextClass: 'rb-mask',
  maskTextSelector: '.my-mask-class, #mask-this',
  maskAllInputs: false,
  maskInputOptions: {
    password: true,
    email: true
  }
}

```

### Privacy Config Options Table

| Option           | Description                                                                                         | Defaults   |
| ---------------- | --------------------------------------------------------------------------------------------------- | ---------- |
| blockClass       | CSS class name (default: `rb-block`) to block elements from being recorded (wireframe placeholder). | .rb-block  |
| blockSelector    | CSS selector to block elements from being recorded, in addition to `blockClass`.                    | null       |
| ignoreClass      | CSS class name (default: `rb-ignore`) to ignore input events for elements.                          | .rb-ignore |
| ignoreSelector   | CSS selector to ignore input events for elements, in addition to `ignoreClass`.                     | null       |
| maskTextClass    | CSS class name (default: `rb-mask`) to mask text content and input values.                          | .rb-mask   |
| maskTextSelector | CSS selector to mask text content and input values, in addition to `maskTextClass`.                 | null       |
| maskAllInputs    | If true, masks all input values regardless of class or selector.                                    | null       |
| maskInputOptions | Object specifying which input types or selectors to mask (e.g., `{ password: true, email: true }`). | false      |
| maskInputFn      | Custom function to determine if an input should be masked.                                          | null       |
| maskTextFn       | Custom function to determine if text content should be masked.                                      | null       |

***

```jsx
replay: {
    blockClass: 'my-block'
    ignoreClass: 'my-ignore'
    maskTextClass: 'my-mask'
}

```

<br />

## What do these options do?

<br />

### Block

* **Purpose:** Lets you specify a CSS selector (string) to block elements from being recorded in session replay, in addition to the default blockClass (e.g., .rb-block).
* **How it works in Rollbar:** Any element matching this selector (and its children) will be replaced with a placeholder in the session replay. The content is not recorded at all.
* **Example:**

```jsx
  blockSelector: '.my-blocked-class, #sensitive-section'

```

This would block all elements with the class .**my-blocked-class** and the element with the id #**sensitive-section** from being recorded in Rollbar session replay.

<br />

### Ignore

* **Purpose:** Let's you specify a CSS selector to ignore input events for elements, in addition to the default ignoreClass (e.g., .rb-ignore).
* **How it works in Rollbar:** Any element matching this selector will not have its input events (such as typing, changes, etc.) recorded. The element itself is still present in the replay, but user interactions are not.
* **Example:**

```jsx
  ignoreSelector: '.my-ignore-class, #ignore-this-input'

```

This would ignore input events for all elements with class .**my-ignore-class** and the element with id #**ignore-this-input** in Rollbar session replay.

* **Beta Notes:**  The ignoreClass and ignoreSelector work via an input event handler and do not work when the value on the input is set programatically. Instead, the blockSelector and blockClass should be used to achieve the desired outcome.

### Mask Text

* Purpose: Let’s you specify a CSS selector to mask text content for elements, in addition to the default maskTextClass (e.g., .rb-mask).
* **How it works in Rollbar:** Any element matching this selector will have its text content (and input values) masked in the replay, even if it doesn't have the .rr-mask class.
* **Example:**

```jsx
  maskTextSelector: '.my-mask-class, #mask-this'

```

This would mask all text content and input values for elements with class .my-mask-class and the element with id #**mask-this** in Rollbar session replay.

* **Beta Notes:** This feature is not currently implemented for individual inputs. As a work around will need to use maskAllInputs:true if you are worried about PII inside your inputs.

### Default \`maskInputOptions\\\`

```jsx
{
  "password": true,
  "email": false,
  "tel": false,
  "text": false,
  "color": false,
  "date": false,
  "datetime-local": false,
  "month": false,
  "number": false,
  "range": false,
  "search": false,
  "time": false,
  "url": false,
  "week": false
}

```

**Why use selectors in Rollbar?**

* Selectors enable you to apply privacy controls to elements without needing to add classes directly in your code, or to target elements that are generated dynamically or by third-party libraries.
* You can use both the class-based and selector-based options together. If an element matches either, the privacy rule applies.

**Best Practices**

* Always test your selectors in your app to ensure the correct elements are masked, blocked, or ignored in Rollbar session replay.
* Use selectors for dynamic or third-party content where you can't easily add classes.
* Combine class and selector options for maximum flexibility.

<br />

# Advanced Options

***

## Replay Size and Accuracy Options

| Option                   | Description                                            | Default   |
| ------------------------ | ------------------------------------------------------ | --------- |
| inlineStylesheet         | Inlines stylesheets for more accurate replay rendering | true      |
| inlineImages             | Captures and records image content                     | false     |
| collectFonts             | Records fonts used on the page                         | true      |
| slimDOMOptions           | Removes unnecessary DOM parts to reduce replay size    | See Below |
| recordCrossOriginIframes | Removes unnecessary DOM parts to reduce replay size    | false     |

### Default \`slimDOMOptions\\\`

```jsx
{
  "script": true,
  "comment": true,
  "headFavicon": true,
  "headWhitespace": true,
  "headMetaDescKeywords": true,
  "headMetaSocial": true,
  "headMetaRobots": true,
  "headMetaHttpEquiv": true,
  "headMetaAuthorship": true,
  "headMetaVerification": true
}

```

***

## Dynamic Environment Considerations

Session replay relies on the environment parameter in a Rollbar configuration. If you set the environment dynamically, for example, based on other page/user elements after the initial configuration, you will need to reflect the same logic with the `transformSpan` parameter under `tracing`.

### transformSpan Example:

```jsx
     
var transformer = function(payload) {
    payload['environment'] = env == 'pr' ? 'prod' : 'development';
};     

config = {
  // config...
  transform: transformer,
  tracing: {
    transformSpan: ({span}) => {
      // Example to set rollbar environment dynamically for session replay. 
      // Needed if you set the environment post-configuration
      span.resource.attributes['rollbar.environment'] = env === 'pr' ? 'prod' : 'development';
    }
  },
  replay: {
    enabled: true
  }
} 

```

***

## Common Questions

### Will adding Session Replay impact the performance of my application?

Our replay recorded increases the over-the-wire page load by 124kb

### Does Session Replay meet GDPR compliance?

Yes, our current implementation will meet GDPR compliance requirements.  Please be aware that you will need to update your website's compliance if you add session replay.

### Where are the replays stored?

Replays are stored on our secure servers

### What is the data retention on sessions ?

Replays are connected to occurrences and will share the same data-retention periods as your occurrences.

### Can I rate limit session replays?

Rate limiting for replays can be done at the token level in the Project Access Tokens settings. You can learn more by visiting our [rate limiting documentation](https://docs.rollbar.com/docs/rate-limits). This feature is only available on paid plans.