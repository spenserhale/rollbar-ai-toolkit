<!-- source: https://docs.rollbar.com/docs/react-ts.md -->

# React (Typescript)

Rollbar SDK for Typescript React applications | Support Level: Supported

How to configure @rollbar/react and Rollbar.js for Typescript React projects.

### Install

Rollbar.js is a peer dependency of @rollbar/react, and both must be installed.

To install with npm:

```
npm install rollbar @rollbar/react
```

To install with yarn:

```
yarn add rollbar @rollbar/react
```

### Quick Start

For the quickest start to get up and running, wrap the Rollbar Provider component around your app and any existing providers.

```javascript
import { Provider } from '@rollbar/react';

function App() {
 const rollbarConfig = {
   accessToken: ’POST_CLIENT_ITEM_ACCESS_TOKEN’,
   captureUncaught: true,
   captureUnhandledRejections: true,
   payload: {
     client: {
       javascript: {
         code_version: '1.0.0',
         source_map_enabled: true
       }
     }
   }
 };

 return (
   <Provider config={rollbarConfig}>
    <OtherProviders>
      //… App components
    </OtherProviders>
   </Provider>
 );
}
```

The above config will configure and enable Rollbar, will detect and report uncaught exceptions and promise rejections, and will make the Rollbar interface available to all components wrapped in the Provider via a React Context.

The configuration object is used to initialize Rollbar.js inside the Provider. See the configuration reference for a description of all options.

Type definitions from Rollbar.js may be imported whenever they are needed.

```javascript
import Rollbar from ‘rollbar’;

const rollbarConfig: Rollbar.Configuration = {};
```

### Error Boundaries

If your project uses Error Boundaries, or you plan to add them, @rollbar/react provides an ErrorBoundary component that is already Rollbar enabled.

```javascript
import { ErrorBoundary } from '@rollbar/react';
 
const Component = () => {
  const FallbackUI = () => <div>Oops, something went wrong</div>;
 
  return (
    <ErrorBoundary fallbackUI={FallbackUI} >
      <ChildComponents/>
    </ErrorBoundary>
  )
}
```

[block:callout]
{
  "type": "info",
  "body": "To learn more about React Error Boundaries, [read here](https://reactjs.org/docs/error-boundaries.html). To learn more about Rollbar Error Boundaries, [read here](https://docs.rollbar.com/docs/react#errorboundary-component)."
}
[/block]

### Accessing Rollbar from React components

The useRollbar hook can be used in any function component to access the Rollbar interface.

```javascript
function Example(props: Props): ReactElement {
  const rollbar = useRollbar();
 
  rollbar.info(‘message text’);
 
  render null;
}
```

[block:callout]
{
  "type": "info",
  "body": "To learn more about Rollbar hooks, see the main [@rollbar/react doc](https://docs.rollbar.com/docs/react#hooks)."
}
[/block]

React Hooks are only available in React function components. To access Rollbar from class components, use the React Context initialized by the Rollbar Provider.

```javascript
import Rollbar from 'rollbar';
import { Context, getRollbarFromContext } from '@rollbar/react';
 
export class ClassComponent extends Component {
 static contextType = Context;
 rollbar: Rollbar | undefined;
 
 componentDidMount(): void {
   this.rollbar = getRollbarFromContext(this.context);
 
   this.rollbar.info('message from class component');
 }
}
```

[block:callout]
{
  "type": "info",
  "body": "To learn more about using Rollbar in class components, see the main [@rollbar/react doc](https://docs.rollbar.com/docs/react)."
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar.js, please see the docs [here](https://docs.rollbar.com/v1.0.0/docs/javascript)."
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "For help with importing or requiring Rollbar into your project with different Typescript compiler options, please see this document [here](https://docs.rollbar.com/docs/importing-or-requiring-rollbar)"
}
[/block]