<!-- source: https://docs.rollbar.com/docs/react.md -->

# React

This Rollbar React SDK | Support Level: Supported

## Setup Instructions

This guide will help you understand the new structure of the rollbar-react library. It is designed to be more aligned with React development best practices.

### Prerequisites

You will need an active Rollbar account and a post\_server\_item access token from a new project - you can create a new project by doing one of the following:

* Select + create new project from the dropdown list in the upper left of the Rollbar app.
* Go to Account Settings → Projects. The url here is: <https://rollbar.com/settings/accounts/{account_name}/projects>.

You need to install the [rollbar.js](https://github.com/rollbar/rollbar.js/#setup-instructions) library, it is used by the react library. [Browser setup instructions](https://docs.rollbar.com/docs/javascript#section-quick-start-browser) and [Server setup instructions](https://docs.rollbar.com/docs/javascript#section-quick-start-server) are both available in the docs.

### Install Rollbar React SDK

To install with `npm`:

```shell
npm install @rollbar/react rollbar
```

To install with `yarn`:

```shell
yarn add @rollbar/react rollbar
```

To install by adding to `package.json`, add the following to your project's\
`package.json` file:

```json
  …
  "dependencies": {
    "@rollbar/react": "^0.11.1",
    "rollbar": "^2.26.1"
    …
  }
  …
```

then run either using `npm` or `yarn` (or other package manager):

```shell
npm install
# OR
yarn install
```

## Usage and Reference

Below is a simplified code example with a `Provider` and an `ErrorBoundary`. This is the most rudimentary implementation of the new library:

```javascript
import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react'; // <-- Provider imports 'rollbar' for us

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: 'production',
  server: {
    root: "http://example.com/",
    branch: "main"
  },
  code_version: "0.13.7",
  payload: {
    person: {
      id: 117,
      email: "chief@unsc.gov",
      username: "john-halo"
    }
  }
};

export default function App() {
  return (
    {/* Provider instantiates Rollbar client instance handling any uncaught errors or unhandled promises in the browser */}
    <Provider config={rollbarConfig}>
      {/* ErrorBoundary catches all React errors in the tree below and logs them to Rollbar */}
      <ErrorBoundary>
        // all other app providers and components - Rollbar will just work
        …
      </ErrorBoundary>
    </Provider>
  );
};
```

## Components

The following components are available as named imports from `@rollbar/react`.

### `Provider` Component

The `Provider` component is used to wrap your React App so an instance of Rollbar will be made available within your React tree. This is a common pattern in React using a custom [React Context] that is available to the `Components` and `hooks` from this SDK library.

#### Configuration Only Usage

The simplest way to use the `Provider` is to provide a configuration as the `config` prop which will instantiate an instance of Rollbar for you and provide that to its child tree:

```javascript
import React from 'react';
import { Provider } from '@rollbar/react';

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
};

export function App(props) {
  return (
    <Provider config={rollbarConfig}>
      …
    </Provider>
  );
}
```

#### Instance Usage

Sometimes you may need to instantiate an instance of Rollbar before adding it to your App tree. In that case use the `instance` prop to pass it to the `Provider` like this:

```javascript
import React from 'react';
import Rollbar from 'rollbar';
import { Provider } from '@rollbar/react';

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
};

const rollbar = new Rollbar(rollbarConfig);

export function App(props) {
  return (
    <Provider instance={rollbar}>
      …
    </Provider>
  );
}
```

This method will also work with the global Rollbar instance when using the `Rollbar.init(…)` method.

#### React Native Usage

Rollbar provides a [React Native SDK] which also wraps the [Rollbar.js] to provide React Native capabilities based on that specific environment.

To use the Rollbar React SDK with the [React Native SDK], pass the instance that it generates to the `Provider`'s `instance` prop, like this:

```javascript
import React from 'react';
import { Client } from 'rollbar-react-native';
import { Provider } from '@rollbar/react';

const rollbarClient = new Client('POST_CLIENT_ITEM_ACCESS_TOKEN');

export function App(props) {
  return (
    <Provider instance={rollbarClient.rollbar}>
      …
    </Provider>
  );
}
```

### `ErrorBoundary` Component

Rollbar's React SDK provides a new `ErrorBoundary` component which implements the interface for React's [Error Boundaries] introduced in React 16. The `ErrorBoundary` is used to wrap any tree or subtree in your React App to catch React Errors and log them to Rollbar automatically.

The `ErrorBoundary` relies on the [`Provider`] above for the instance of Rollbar, so it will utilize\
whatever configuration has been provided.

> 📘 Rendering `undefined`
>
> In React 17.x and lower, if the component wrapped by `ErrorBoundary` renders `undefined`, React may raise an error outside the ErrorBoundary. In React 18, this issue is resolved and `undefined` is a valid return type. If a grandchild of `ErrorBoundary` renders `undefined`, this will either produce no error or will produce an error that the `ErrorBoundary` can catch and report.

#### Simple Usage

You can add an `ErrorBoundary` component to the top of your tree right after the [`Provider`] with no additional props:

```javascript
import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
};

export function App(props) {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        …
      </ErrorBoundary>
    </Provider>
  );
}
```

#### Pass `prop`s to control behavior

The `ErrorBoundary` provides several `prop`s that allow customizing the behavior of how it will report errors to [Rollbar]. These `prop`s take either a value or a function that will be invoked with the `error` and `info` from the [Error Boundaries] API's `componentDidCatch` method (i.e. signature is `(error, info)`).

```javascript
import React from 'react';
import { Provider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react';

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
};

export function App(props) {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary level={LEVEL_WARN} errorMessage="Error in React render" extra={(error, info) => info.componentStack.includes('Experimental') ? { experiment: true } : {} }>
        …
      </ErrorBoundary>
    </Provider>
  );
}
```

#### Pass a Fallback UI

You may also include a Fallback UI to render when the error occurs so that the User does not experience a broken/blank UI caused during the render cycle of React. Like the other `prop`s it can accept a value that is a React Component or a function that returns a React Component with the same signature `(error, info)`.

```javascript
import React from 'react';
import { Provider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react';

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
};

const ErrorDisplay = ({ error, resetError }) => ( // <-- props passed to fallbackUI component
  <div>…</div>
);

export function App(props) {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary level={LEVEL_WARN} fallbackUI={ErrorDisplay}>
        …
      </ErrorBoundary>
    </Provider>
  );
}
```

### `RollbarContext` Component

Use the `RollbarContext` component to declaratively set the `context` value used by [Rollbar.js] when sending any messages to [Rollbar]. This works for your `ErrorBoundary` from above or any other log or message sent to [Rollbar] while the `RollbarContext` is mounted on the tree.

Like `ErrorBoundary` above, `RollbarContext` relies on a [`Provider`] for an instance of a [Rollbar.js] client.

#### Basic Usage

To use the `RollbarContext` component you must provide the `context` prop. This prop is a String value, and it will be used by [Rollbar.js] to set the context for Rollbar occurrences reported from this part of your code.

```javascript
import React from 'react';
import { RollbarContext } from '@rollbar/react';

function HomePage() {
  return (
    <RollbarContext context="home">
      …
    </RollbarContext>
  )
}
```

#### Using with React Router

It's useful to set the `context` in [Rollbar] associated with areas of your application. On the server it's usually set when a specific page is requested. For single-page applications (SPAs) like React Apps, using `RollbarContext` with your Router is one way to achieve the same result.

Below is an example of using `RollbarContext` with \[React Router] if you have a top level set of routes:

```javascript
import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { RollbarContext } from '@rollbar/react';
import { About, ContactDetails, ContactsList } from './pages';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/about">
        <RollbarContext context="/about">
          <About />
        </RollbarContext>
      </Route>
      <Route path="/contacts/:id">
        <RollbarContext context="contacts/details">
          <ContactDetails />
        </RollbarContext>
      </Route>
      <Route path="/contacts">
        <RollbarContext context="contacts">
          <ContactsList />
        </RollbarContext>
      </Route>
    </Switch>
  </Router>
)

export default Routes;
```

And another example of using `RollbarContext` within a component that manages its own route:

```javascript
import React from 'react';
import { Route } from 'react-router-dom';
import { RollbarContext } from '@rollbar/react';

export default function About(props) {
  return (
    <Route path="/about">
      <RollbarContext context="/about">
        …
      </RollbarContext>
    </Route>
  )
}
```

## Functions

The following functions are available as named imports from `@rollbar/react`.

### `historyContext` to create `history.listener`

Many SPAs and React Apps will use the [history] package to handle browser history. The\
`historyContext` function is a helper that creates a valid listener function to receive history changes and use those to change the [Rollbar.js] context.

`historyContext` is a factory function used to create a proper `history.listen` callback that will work for v4 and v5 of the [history] package.

#### Basic `historyContext` usage

The `historyContext` factory function requires an instance of [Rollbar.js] to wrap in order to create the listener callback function.

By default, if no options (see below) are provided, all history updates will update the `context` for [Rollbar] using the `location.pathname` as the value.

```javascript
import Rollbar from 'rollbar';
import { createBrowserHistory } from 'history';
import { Provider } from '@rollbar/react';

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
};

const rollbar = new Rollbar(rollbarConfig);

const history = createBrowserHistory();

history.listen(historyContext(rollbar));
```

#### Controlling `historyContext` behavior with options

The `historyContext` factory function accepts `options` as a 2nd argument that allow you to control the behavior of how and when the `context` will be set for the [Rollbar.js] client. Use the `formatter` option to provide a function that will receive the `history` change event and return a `String` that you would like to be set as the `context` for [Rollbar].

The signature is `formatter(location, action): String` where `location` is [history.location] and `action` is [history.action].

The other option is `filter` which you can provide to tell the `historyContext` listener you create to control which history updates will change the `context` for [Rollbar]. All truthy values will tell the listener to make the change. Any falsy values will skip the update.

The signature is `filter(location, action): Boolean` where `location` is [history.location] and `action` is [history.action].

Here's an example using both:

```javascript
import Rollbar from 'rollbar';
import { createBrowserHistory } from 'history';
import { Provider } from '@rollbar/react';

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
};

const rollbar = new Rollbar(rollbarConfig);

const ROUTE_PARAMS_RE = /\/\d+/g;

const historyListener = historyContext(rollbar, {
  // optional: default uses location.pathname
  formatter: (location, action) => location.pathname.replace(ROUTE_PARAMS_RE, ''),
  // optional: true return sets Rollbar context
  filter: (location, action) => !location.pathname.includes('admin'),
});
const unlisten = history.listen(historyListener);
```

## Hooks

The following hooks are available as named imports from `@rollbar/react` for use in [Functional Components] making use of the [React Hooks API] introduced in React 16.8.

### Reliance on `Provider`

All of these hooks below require there to be a [`Provider`] in the React Tree as an ancestor to the component using the hook.

### `useRollbar` hook

To consume the [Rollbar.js] instance directly from the [`Provider`] in your React Tree and make use of the client API within your \[Functional Component], use the `useRollbar` hook which will return the instance from the currently scoped [React Context].

Below is a basic example:

```javascript
import { useRollbar } from '@rollbar/react';

function ContactDetails({ contactId }) {
  const rollbar = useRollbar(); // <-- must have parent Provider
  const [contact, setContact] = useState();

  useEffect(async () => {
    try {
      const { data } = await getContactFromApi(contactId);
      setContact(data.contact);
    } catch (error) {
      rollbar.error('Error fetching contact', error, { contactId });
    }
  }, [contactId]);

  return (
    <div>
      …
    </div>
  );
}
```

### `useRollbarContext` hook

As an alternative to the [`RollbarContext`] component, you can use the `useRollbarContext` hook in your \[Functional Component] to set the `context` in the [Rollbar.js] client provided by the [`Provider`] above in the React Tree.

Here's an example showing its use in several components:

```javascript
// src/pages/HomePage.js
import { useRollbarContext } from '@rollbar/react';

function HomePage(props) {
  useRollbarContext('home#index');

  return (
    <div>
      …
    </div>
  );
}

// src/pages/UsersPage.js
import { useRollbarContext } from '@rollbar/react';
import UserTable from '../components/users/UserTable';

function UsersPage(props) {
  useRollbarContext('users#list');

  return (
    <UserTable data={props.users} />
  );
}

// src/pages/UserDetailsPage.js
import { useRollbarContext } from '@rollbar/react';
import UserDetails from '../components/users/UserDetails';

function UserDetailsPage(props) {
  useRollbarContext('users#details');

  return (
    <UserDetails user={props.user} />
  );
}
```

### `useRollbarPerson` hook

In Rollbar, it's very useful to log the identity of a person or user using your App for 2 major reasons:

1. It allows you to know exactly who has been affected by an item or error in your App
2. It allows Rollbar to tell you the impact a given item or error is having on your users

To make it convenient and easy to set the identity of a person in your React App, the `@rollbar/react` package has the `useRollbarPerson` hook.

To use it, simply pass an `Object` that has keys and values used to identify an individual user of your App, and for any future events or messages logged to [Rollbar] will include that person data attached to the log.

Below is a simple example of using it once the current user has been determined:

```javascript
import { useState, useEffect } from 'react';
import { useRollbarPerson } from '@rollbar/react';
import LoggedInHome  from './LoggedInHome';
import LoggedOutHome from './LoggedOutHome';

function Home() {
  const [currentUser, setCurrentUser] = useState();

  useRollbarPerson(currentUser);

  useEffect(async () => {
    const user = await Auth.getCurrentUser();

    setCurrentUser(user);
  }, []);

  if (currentUser != null) {
    return <LoggedInHome />;
  }

  return <LoggedOutHome />;
}
```

### `useRollbarCaptureEvent` hook

[Rollbar.js] already provides automated [Telemetry] with the default configuration `autoInstrument: true` in the client which will capture useful telemetry events and data for you.

To provide more breadcrumbs that are useful for identifying the cause of an item or error, you can add your own capture events that will be included in the [Telemetry] of a Rollbar item with the `useRollbarCaptureEvent` hook.

The `useRollbarCaptureEvent` hook is designed to capture a new event in your \[Functional Component] any time the `metadata` or `level` you provide to the hook changes. On re-renders, no event is captured if there is not a change to the references provided to those 2 arguments (utilizing the `dependencies` array arg underneath within the call to the built-in React `useEffect` hook).

Below is an example showing use of `useRollbarCaptureEvent` in the render cycle of a \[Functional Component] to send a telemetry event related to the data that will be rendered in the component:

```javascript
import { useEffect, useState } from 'react';
import { useRollbar, useRollbarCaptureEvent, LEVEL_INFO } from '@rollbar/react';

function BookDetails({ bookId }) {
  const rollbar = useRollbar(); // <-- must have ancestor Provider, same with useRollbarCaptureEvent
  const [book, setBook] = useState();

  useEffect(async () => {
    try {
      const { data } = await getBook(bookId);
      setBook(data.book);
    } catch (error) {
      rollbar.error('Error fetching book', error, { bookId }); // <-- use rollbar to log errors as normal
    }
  }, [bookId]);

  useRollbarCaptureEvent(book, LEVEL_INFO); // <-- only fires when book changes

  return (
    <div>
      …
    </div>
  )
}
```

## Using Rollbar With Class Components

When using the Provider component, the Rollbar instance is stored in a React Context. There are several ways to make the Rollbar instance available to class components. Each may be best in different situations.

### 1. Get the instance from the Context

This technique should be preferred for projects that are migrating to function components, or have a mix of class and function components. It requires using the Rollbar Provider component to wrap any parts of the app that will use Rollbar.

```javascript
import React from 'react';
import { Context, getRollbarFromContext } from '@rollbar/react';

export default class ClassComponent extends React.Component {
  // This must always be named `contextType`. It's a special React property.
  static contextType = Context;

  componentDidMount() {
    // This will be set when the component is mounted.
    this.rollbar = getRollbarFromContext(this.context);

    this.rollbar.info('message from class component');
  }

  render() {
    // Rollbar is also available during render.
    const rollbar = getRollbarFromContext(this.context);

    return <div>Class component</div>
  }
}

```

The previous pattern only works when your class consumes a single context. If your class consumes multiple Contexts, you have to wrap the class component instead:

```javascript
   <OtherContext.Consumer>
      {other => (
        <RollbarContext.Consumer>
          {rollbarContext => (
            <ClassComponent other={other} rollbarContext={rollbarContext} />
          )}
        </RollbarContext.Consumer>
      )}
    </OtherContext.Consumer>
```

Note that in the class component, you still need to get the instance out of the context:

```javascript
this.rollbar = getRollbarFromContext(this.props.rollbarContext);
```

### 2. Store the instance in whatever state management you use.

If your project uses a state management solution, e.g. redux or mobx, you can instantiate the rollbar instance and store it in your global state. This example uses Rollbar.js and doesn’t rely on @rollbar/react.

```javascript
import Rollbar from 'rollbar';

// Put this in your global state
const rollbar = new Rollbar(config);

```

### 3. Attach the instance to the window object

If your project doesn’t use state management, and you don't plan to migrate to function components, you can attach it to the window object. That's what Rollbar.js does by default, and it will work fine to do it here as well.

```javascript
window.rollbar = new Rollbar(config);

// You can now use it from anywhere in your app.
rollbar.info('It works!');
```

[Rollbar]: https://rollbar.com

[Rollbar Docs]: https://docs.rollbar.com

[Rollbar.js]: https://github.com/rollbar/rollbar.js

[Rollbar.js Setup Instructions]: https://github.com/rollbar/rollbar.js/#setup-instructions

[React Native SDK]: https://github.com/rollbar/rollbar-react-native

[Telemetry]: https://docs.rollbar.com/docs/rollbarjs-telemetry

[`Provider`]: #provider-component

[`ErrorBoundary`]: #errorboundary-component

[`RollbarContext`]: #rollbarcontext-component

[Functional Components]: https://reactjs.org/docs/components-and-props.html#function-and-class-components

[React Context]: https://reactjs.org/docs/context.html

[Error Boundaries]: https://reactjs.org/docs/error-boundaries.html

[React Hooks API]: https://reactjs.org/docs/hooks-intro.html

[history]: https://www.npmjs.com/package/history

[history.location]: https://github.com/ReactTraining/history/blob/master/docs/api-reference.md#location

[history.action]: https://github.com/ReactTraining/history/blob/master/docs/api-reference.md#action

[1]: https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#installing-a-package