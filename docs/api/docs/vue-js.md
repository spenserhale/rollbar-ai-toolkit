<!-- source: https://docs.rollbar.com/docs/vue-js.md -->

# Vue.js

Configuring Vue apps to use the Rollbar JavaScript SDK | Support Level: Supported

To set up a Vue app with Rollbar, there are two key steps.

1. Add Rollbar to the Vue object prototype before creating the first Vue instance. This ensures the Rollbar instance will be available in all Vue contexts.
2. Add Rollbar to Vue’s global error handler. Uncaught exceptions within the Vue app are sent to this handler, and appear in the browser console, but are not sent to the browser’s global error handler. Adding Rollbar here ensures that these errors are reported.

## Installation

First, install the Rollbar npm package.

```shell
npm install --save rollbar
```

Or if using yarn

```shell
yarn add rollbar
```

## Vue 3

### Configuration

Create a Rollbar configuration file (e.g, `rollbar.config.js`) in the root of your project and add the following content:

```javascript
// rollbar.config.js
export default {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'dev',
    client: {
      javascript: {
        code_version: '1.0.0',
      }
    }
  },
};
```

Create a Vue plugin for Rollbar (e.g., `rollbar.js`) in your project and add the following content:

```javascript
import Rollbar from 'rollbar';
import config from './rollbar.config';

const rollbar = new Rollbar(config);

export default {
  install(app) {
    app.config.errorHandler = (error, vm, info) => {
      rollbar.error(error, { info });
    };
    app.provide('rollbar', rollbar);
  },
};
```

Register the Rollbar plugin in your main app file. In your main app file (usually `main.js`or `app.js`), import and use the Rollbar plugin:

```javascript
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import RollbarPlugin from './rollbar'; // Path to your rollbar.js file

const app = createApp(App);

// Registering the Rollbar Error handler
app.use(RollbarPlugin);

createApp(App).mount('#app');
```

### Testing the integration

Create a new component for testing. Create a new file called `RollbarTest.vue` in your `components` folder (or any suitable location) and add the following content:

```html
<!-- RollbarTest.vue -->
<template>
  <div>
    <button @click="triggerError">Trigger Error</button>
  </div>
</template>

<script>
export default {
  methods: {
    triggerError() {
      // Simulate an error
      throw new Error('Testing Rollbar integration');
    },
  },
};
</script>
```

Add the `RollbarTest` component to the main app file:

```html
<script setup>
import RollbarTest from './components/RollbarTest.vue'
</script>

<template>
  <main>
    <RollbarTest />
  </main>
</template>
```

Register the testing component. In your main app file (usually `main.js` or `app.js`), import the `RollbarTest` component and add it to your app:

```javascript
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import RollbarPlugin from './rollbar'; // Path to your rollbar.js file
import RollbarTest from './components/RollbarTest.vue'; // Path to your RollbarTest.vue file

const app = createApp(App);

// Registering the Rollbar Error handler
app.use(RollbarPlugin);

// Registering the Rollbar tester component
app.component('RollbarTest', RollbarTest); 

createApp(App).mount('#app');
```

Run your application with the following command:

```bash
npm run dev
```

You should see a button labeled **Trigger Error** on the page. Clicking this button will simulate an error, and Rollbar should capture it and display it on your Rollbar dashboard.

Remember that this testing component (`RollbarTest`) is just for testing purposes. In a real-world scenario, errors would occur in your application naturally due to user interactions or other factors. The Rollbar integration, as configured in the previous steps, will capture and report those errors in your Vue 3 application.

## Vue 2

In your src/main.js (where your root Vue instance is created):

```javascript
import Rollbar from 'rollbar';

// Set the Rollbar instance in the Vue prototype
// before creating the first Vue instance.
// This ensures it is available in the same way for every
// instance in your app.
Vue.prototype.$rollbar = new Rollbar({
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    // Track your events to a specific version of code for better visibility into version health
    code_version: '1.0.0',
    // Add custom data to your events by adding custom key/value pairs like the one below
    custom_data: 'foo'
  }
});

// If you have already set up a global error handler,
// just add `vm.$rollbar.error(err)` to the top of it.
// If not, this simple example will preserve the app’s existing
// behavior while also reporting uncaught errors to Rollbar.
Vue.config.errorHandler = (err, vm, info) => {
  vm.$rollbar.error(err);
  throw err; // rethrow
};

// Create the Vue app instance after adding the Rollbar
// instance to the Vue prototype above. 
// Your app may pass different options here.
new Vue({
  render: h => h(App),
}).$mount('#app')
```

You can now use Rollbar logging in your Vue components:

```javascript
this.$rollbar.info('Hello world.');
```

## Usage

The above example enables logging, and reporting of uncaught errors. To learn more about Rollbar logging, and all available options, see the main [Rollbar.js documentation](https://docs.rollbar.com/docs/javascript).

## Upload source maps to Rollbar

To upload source maps, see the Rollbar [Source Maps](https://docs.rollbar.com/docs/source-maps) doc.

> 📘
>
> For help with importing or requiring Rollbar into your project with Typescript or a version of ECMAScript (ES5/ES6/ES7/ES8/ES9), please see this document [here](https://docs.rollbar.com/docs/importing-or-requiring-rollbar)

> 📘
>
> For more information on rollbar.js, please see the docs [here](https://docs.rollbar.com/v1.0.0/docs/javascript).

<br />

## Adblockers

Some users have reported issues with Rollbar while using browsers with adblockers, with the error reported:\
"Loading failed for the module with source".