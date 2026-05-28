<!-- source: https://docs.rollbar.com/docs/devcycle.md -->

# DevCycle

Rollbar integration with DevCycle for faster, better bug diagnostics

Utilizing feature flags is a great way to experiment and rollout features to users and reduce the risk should things go wrong. As a developer you want to know the exact configuration when an issue appears and using features flags in your code can complicate this as different users may have different flags enabled or disabled.

Using this integration with Rollbar and DevCycle you can easily identify the exact configuration and feature flags delivered to the user (client or server application) at the time of the error.

**Configuration**

You can find DevCycle SDK integration documents here to setup DevCycle with your project: <https://docs.devcycle.com/sdk/>

In this example we have a feature in DevCycle that is created to control certain features in our project.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/c21c23f03a310f940f7c3d7b5cf30b8c0019b1d8994a19a101466cea059f6562-Screenshot_2024-11-04_at_3.04.24_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

The DevCycle features can have variations served depending on the user. This will modify the page (DOM) and should an error occur the flags served will be very important to understand the exact experience the end user had during this interaction.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f93919cbc48763a21c23d08c9023986ba16697dc1ed8dffbccc2ca0e4c8d19c8-Screenshot_2024-11-04_at_3.08.11_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

Here is an example configuring DevCycle in conjunction with Rollbar in a React project, where we want to log all the DevCycle features and variables applicable to this user in a custom 'devCycleSettings' field to enrich our experience:

```javascript React
import { Provider, useRollbar } from '@rollbar/react
import { 
  useDevCycleClient, useIsDevCycleInitialized, useVariableValue, withDevCycleProvider 
} from '@devcycle/react-client-sdk'
...
function MyComponent() {
  const devCycleClient = useDevCycleClient()
  const devCycleFeatures = devCycleClient.allFeatures()
  const devCycleVariables = devCycleClient.allVariables()
  const rollbarConfig = {
    accessToken: 'YOUR_ROLLBAR_CLIENT_ACCESS_TOKEN',
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: 'production',
    payload: {
      custom: {
        devCycleSettings: {
          features: devCycleFeatures, // this will send all DevCycle features in the error payload to Rollbar
          variables: devCycleVariables // this will send all DevCycle variables in the error payload to Rollbar
        }
      }
    }
  }
  
  return (
    <Provider config={rollbarConfig} >
      <TestError />
    </Provider>
}

function App() {
  const devcycleReady = useIsDevCycleInitialized()

  if (!devcycleReady) return <div><h1>DevCycle is not ready! Loading State...</h1></div>
  
  return (
    <>
      <div>
        <Router>
          <Routes>
              <Route path="/" element={<MyComponent />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default withDevCycleProvider({
  sdkKey: 'YOUR_DEVCYCLE_SDK_KEY', 
  user: { user_id: 'USER_ID', isAnonymous: false } 
})(App)
  
```

**Feature-related Errors**

Suppose you want to test out a new feature in your application, and catch any errors related to the new feature.

You can set your code to send the DevCycle feature information to Rollbar within a certain scope/only under certain conditions:

```javascript React
const rollbar = useRollbar();
// here, we are using a variable inside our DevCycle feature 'test-react', labeled 'upload_enable'
const uploadEnableValue = useVariableValue('upload_enable', false)

try {
  if (uploadEnableValue) {
    testNewBehavior()
  } else {
    oldBehavior()
  }
} catch(error) {
  if (uploadEnableValue) {
    // here we added a devCycleFeature custom field with name and id subfields
      const devcycleClient = useDevCycleClient()
      const features = devcycleClient.allFeatures()

      rollbar.error(error, { devCycleFeature: { 
        name: 'test-react',
        id: features['test-react']['_id']
      }})
  }
}
```

Having a DevCycle feature id in the custom payload to Rollbar will allow you to create a Rollbar service link that takes you directly to the related feature page.

**Service Links**

> 📘 How to create service links for DevCycle [click here](https://docs.rollbar.com/docs/service-links#devcycle)

**Disabling Feature on Error**

Currently, inbound webhooks to DevCycle to turn on/off features is not yet supported, and is pending future development per the [DevCycle page](https://docs.devcycle.com/platform/extras/webhooks#inbound-webhooks-coming-soon).

However, you can reference the [DevCycle  Management API ](https://docs.devcycle.com/management-api/) to develop your own script to handle DevCycle feature-related errors.