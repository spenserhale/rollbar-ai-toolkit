<!-- source: https://docs.rollbar.com/docs/using-rollbarjs-inside-an-embedded-component.md -->

# Using Rollbar.js inside an embedded component

Sometimes you want to include Rollbar inside a component that is intended to be used on someone else's site. To do this, you do not want to interfere with an existing Rollbar integration on the containing site. Moreover, you would like unhandled exceptions to be available to both Rollbar instances with the ability to use the configuration options to filter out exceptions you might not be interested in.

The way that Rollbar typically operates is to load a shimmed version of the library via the snippet listed above in the head of your page. This allows us to capture errors as soon as possible rather than other libraries which only can start catching exceptions once their full library has loaded asynchronously. This shimmed version of the library assumes the global `_rollbarConfig` variable and uses this to configure things and handle setup after the full library has downloaded. In order for multiple independent components to load Rollbar, only one can effectively use this snippet plus global variable approach. Therefore, we provide the bundles: `/dist/rollbar.noconflict.umd.js` and `/dist/rollbar.noconflict.umd.min.js`. To use these, you most likely want to use something like Webpack to bundle your code, and then use:

```javascript
var rollbar = require('rollbar/dist/rollbar.noconflict.umd');
var Rollbar = new rollbar({
    accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: "some-embedded-component"
    }
});
```

The require will not have side effects on globals (unless it is the first instance of a Rollbar library being loaded which will then set up an initial timestamp on the window if possible). The construction of the Rollbar object with the `captureUncaught` and/or `captureUnhandledRejections` configuration options set to true will cause handlers to be added to the global error handling mechanisms on the window. Note that this will cause errors to be delivered to your instance of Rollbar as well as any other instances on the page (so you might get errors for someone else's code).

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar.js, see the docs [here](https://docs.rollbar.com/docs/javascript)."
}
[/block]