<!-- source: https://docs.rollbar.com/docs/using-rollbarjs-in-a-chrome-extension.md -->

# Browser Extensions

Rollbar.js supports both manifest v2 and manifest v3 browser extensions.

For both versions, rollbar.js must be included in the extension package. Add rollbar.min.js from the [dist directory](https://github.com/rollbar/rollbar.js/tree/master/dist/) to your extension folder. When updating the version of rollbar.js, this file will need to be updated to the new version.

[block:api-header]
{
  "title": "Manifest v3"
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "Look here for a [full working manifest v3 example](https://github.com/rollbar/rollbar.js/tree/master/examples/browser_extension_v3)."
}
[/block]

### Requirements for integrating Rollbar in a manifest v3 extension.

1. In your extension's manifest.json, the host permissions must include "<https://api.rollbar.com/>".

```json
"host_permissions": ["https://api.rollbar.com/"]
```

2. The `content_scripts` key must include a config.js and rollbar.min.js in the correct order:

```json
"content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["config.js", "rollbar.min.js", "content_script.js"]
    }
  ]
```

The config.js will include your Rollbar config and must load before rollbar.min.js, which must load before your other content script files.

3. The config.js contains the Rollbar config. This must be assigned to `window._rollbarConfig`.

```javascript
window._rollbarConfig = {
  accessToken: 'ROLLBAR_CLIENT_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true
};
```

After the above steps, Rollbar is ready to use in your content scripts:

```javascript
Rollbar.info('Content script message');
```

4. To import Rollbar into your service worker, add the Rollbar config in the service worker script:

```javascript
const _rollbarConfig = {
  accessToken: 'ROLLBAR_CLIENT_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true
};
```

5. Then for es6 modules, import:

```javascript
import './rollbar.min.js';
```

Or for non-es6, use importScripts:

```javascript
self.importScripts('./rollbar.min.js');
```

6. Then use the config to initialize Rollbar. Note that the default Rollbar object is lowercase `rollbar`.

```javascript
rollbar.init(_rollbarConfig);
```

7. After the above steps, Rollbar is ready to use in your service worker script.

```javascript
rollbar.info('Service worker message');
```

[block:api-header]
{
  "title": "Manifest v2"
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "Look here for a [full working manifest v2 example](https://github.com/rollbar/rollbar.js/tree/master/examples/browser_extension_v2)."
}
[/block]

### Requirements for integrating Rollbar in a manifest v3 extension.

1. In your extension's manifest.json, the `permissions` key must include "<https://api.rollbar.com/>".

```json
"permissions": ["https://api.rollbar.com/"]
```

2. The `content_security_policy` key must include <https://cdn.rollbar.com> in `script-src ` and `object-src`. (This ensures Firefox compatibility, which doesn't accept `default-src`.

```json
"content_security_policy": "script-src 'self' https://cdn.rollbar.com; object-src 'self' https://cdn.rollbar.com;"
```

3. The `content_scripts` key must include a config.js and rollbar.min.js in the correct order:

```json
"content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["config.js", "rollbar.min.js", "content_script.js"]
    }
  ]
```

The config.js will include your Rollbar config and must load before rollbar.min.js, which must load before your other content script files.

4. The config.js contains the Rollbar config. This must be assigned to `window._rollbarConfig`.

```javascript
window._rollbarConfig = {
  accessToken: 'ROLLBAR_CLIENT_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true
};
```

After the above steps, Rollbar is ready to use in your content scripts:

```javascript
Rollbar.info('Content script message');
```

5. To import Rollbar into your service worker, add the Rollbar config in the background script:

```javascript
const _rollbarConfig = {
  accessToken: 'ROLLBAR_CLIENT_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true
};
```

6. Add the Rollbar snippet inline in the background script. The latest version can always be found [here](https://github.com/rollbar/rollbar.js/blob/master/dist/rollbar.snippet.js).

7. After the above steps, Rollbar is ready to use in your background script.

```javascript
Rollbar.info('Background script message');
```

[block:api-header]
{
  "title": "Firefox compatibility"
}
[/block]

This guide and the [complete example](https://github.com/rollbar/rollbar.js/tree/master/examples/browser_extension_v2) are written to be Firefox compatible.

Firefox has slightly different manifest.json requirements. The example is written
so that the same manifest.json can be used across all browsers.

### content\_security\_policy

According to the browser extension spec, it should be OK to only set `default-src`.
This won't work for Firefox, which requires setting both `script-src` and `object-src`.
The example uses the Firefox compatible content security policy, since it also
works fine on Chrome and Edge.

### background.persistent

Firefox emits a warning when the `background.persistent` key is set false.
The example sets the key true, as this setting works across all browsers.

### Rollbar configuration

There are some limitations on Firefox in the content script. The background script
is not affected by these limitations.

Firefox requires setting `captureUncaught` false in the content script, because it doesn't allow
Rollbar.js to wrap `window.onerror`.

Firefox requires setting `autoInstrument.network` false in the content script,
because it doesn't allow Rollbar.js to wrap `window.fetch`.

The content script config is in ./config.js in the example, and is configured
with Firefox compatible settings.

```javascript
{
  accessToken: 'ROLLBAR_CLIENT_TOKEN',
  captureUncaught: false, // Only required for Firefox, other browser targets
                          // may set true.
  captureUnhandledRejections: true,
  autoInstrument: {
    network: false // Only required for Firefox, other browser targets
                   // may set true.
  }
}
```

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar.js, see the docs [here](https://docs.rollbar.com/docs/javascript)."
}
[/block]