<!-- source: https://docs.rollbar.com/docs/electron.md -->

# Electron

Support Level: Community

Electron apps include a back end that runs on Node.js and a front end that runs on Chrome.

First install the Rollbar npm package once, to be used by both the front and back end.

```
npm install --save rollbar
```

Or if using yarn

```
yarn add rollbar
```

## Node back end

The back end entry point is named in the  `main` key of package.json and calls `BrowserWindow` and `loadURL`. It is usually main.js or src/main.js.

Require and initialize Rollbar.

```javascript
var Rollbar = require('rollbar');

var rollbar = Rollbar.init({
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    platform: ‘client’,
    code_version: '1.0.0',
    custom_data: 'foo'
  }
});

// log a generic message and send to rollbar
rollbar.log('Hello world!');
```

The `payload.platform` key allows using the Rollbar client token instead of the server token, since Electron apps are distributed and the key can be discovered by third parties. See <https://help.rollbar.com/en/articles/1326743-preventing-client-side-access-token-abuse> for more information.

The above configuration will allow Rollbar logging and will report uncaught errors from anywhere in your Node.js code. See [Node.js](https://docs.rollbar.com/docs/nodejs) for more information.

## Chrome front end

Generally, your front end entry point is what gets loaded by your HTML file and contains the code for your choice of front end framework. For example,

* For React React this is usually src/App.js
* For Vue this is usually src/renderer/main.js
* For Angular this is usually src/main.ts

Once the entry point is identified, consult the setup doc for each framework:

* [React](https://docs.rollbar.com/docs/react)
* [Vue](https://docs.rollbar.com/docs/vue-js)
* [Angular](https://docs.rollbar.com/docs/angular)