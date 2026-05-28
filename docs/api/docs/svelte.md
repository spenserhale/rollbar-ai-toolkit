<!-- source: https://docs.rollbar.com/docs/svelte.md -->

# Svelte

Installing Rollbar SDK in the Svelte Framework | Support Level:  Community

## Integrating Rollbar into a Svelte Application

Setting up Rollbar in your Svelte application involves three main steps:

1. Installing the Rollbar SDK
2. Configuring Rollbar
3. Capturing errors in your components

<br />

### Installation

First, install the Rollbar npm package:

```shell
npm install rollbar
```

Or if using yarn:

```shell
yarn add rollbar
```

<br />

### Configuration

Create a Rollbar configuration within your main entry file (e.g., `main.js`, `main.ts`, or a dedicated Svelte store):

```javascript
// src/main.js
import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    client: {
      javascript: {
        code_version: '1.0.0',
      }
    }
  }
});

// Expose Rollbar globally for use in Svelte components
window.rollbar = rollbar;
```

<br />

### Testing the Integration

Create a new Svelte component to test error capturing. For example, `RollbarTest.svelte`:

```svelte HTML
<!-- RollbarTest.svelte -->
<script>
  function triggerHandledError() {
    try {
      throw new Error("This is a handled error triggered by a button.");
    } catch (err) {
      window.rollbar.error("Handled error occurred in RollbarTest.svelte", err);
    }
  }

  function triggerUnhandledError() {
    setTimeout(() => {
      throw new Error("This is an unhandled error triggered by a button.");
    }, 0);
  }

  function triggerUnhandledPromiseRejection() {
    new Promise((resolve, reject) => {
      reject("This is an unhandled promise rejection triggered by a button.");
    });
  }
</script>

<p>Click the buttons below to trigger errors.</p>

<button on:click={triggerHandledError}>Trigger Handled Error</button>
<button on:click={triggerUnhandledError}>Trigger Unhandled Error</button>
<button on:click={triggerUnhandledPromiseRejection}>Trigger Unhandled Promise Rejection</button>
```

Include the `RollbarTest` component in your main application file (`App.svelte`):

```svelte HTML
<!-- App.svelte -->
<script>
  import RollbarTest from './RollbarTest.svelte';
</script>

<main>
  <RollbarTest />
</main>
```

### Run and Verify

Start your application:

```powershell
npm run dev
```

You will see buttons to trigger various error types. Clicking these buttons will send errors to Rollbar, and you can verify this integration by checking your Rollbar dashboard.

***

## Additional Resources

* For uploading source maps, visit the [Source Maps documentation](https://docs.rollbar.com/docs/source-maps).
* For issues importing Rollbar with TypeScript or various ECMAScript versions, refer to [this guide](https://docs.rollbar.com/docs/importing-or-requiring-rollbar).

## Adblocker Notice

Some users report Rollbar issues when using browsers with adblockers, typically shown as the error:

```
Loading failed for the module with source.
```