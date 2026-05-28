<!-- source: https://docs.rollbar.com/docs/growthbook.md -->

# GrowthBook

Rollbar integration with GrowthBook for faster, better bug diagnostics

Utilizing feature flags is a great way to experiment and rollout features to users and reduce the risk should things go wrong. As a developer you want to know the exact configuration when an issue appears and using features flags in your code can complicate this as different users may have different flags enabled or disabled.

Using this integration with Rollbar and GrowthBook you can easily identify the exact configuration and feature flags delivered to the user (client or server application) at the time of the error.

**Configuration**

You can find GrowthBook SDK integration documents here to setup GrowthBook with your project: <https://docs.growthbook.io/lib/>

In this example we have a feature in GrowthBook that is created to control certain features in our project.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/88c6a6bcf0ce54185cd2853d0f16d6aa31fad0294b640203d85d091a38d2b657-Screenshot_2024-11-18_at_10.06.03_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

The GrowthBook features can have variations served depending on the user. This will modify the page (DOM) and should an error occur the flags served will be very important to understand the exact experience the end user had during this interaction.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/0f41f3099a4db549f615c271b3efa97ba38c0f999ea18cbf3d4f5ea8a0af9cb3-Screenshot_2024-11-18_at_10.36.48_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

Here is an example configuring GrowthBook in conjunction with Rollbar in a React project, where we want to log all the GrowthBook features active in this session to a custom 'growthBookSettings' field to enrich our experience:

```javascript React
import { Provider, useRollbar } from '@rollbar/react
import { GrowthBook, GrowthBookProvider, useFeatureIsOn  } from "@growthbook/growthbook-react";
...
const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "growthbook_client_key",
  enableDevMode: true
});
gb.init({
  // Optional, enable streaming updates
  streaming: true
})

function MyComponent() {
  const rollbarConfig = {
    accessToken: 'YOUR_ROLLBAR_CLIENT_ACCESS_TOKEN',
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: 'production',
    payload: {
      custom: {
        growthBookSettings: {
          variables: gb.getDecryptedPayload().features // this will send all GrowthBook features in the error payload to Rollbar
        }
      }
    }
  }
  
  return (
    <Provider config={rollbarConfig} >
      <GrowthBookProvider growthbook={gb}>
        <TestError />
      </GrowthBookProvider>
    </Provider>
}

export default function App() {
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
```

**Feature-related Errors**

Suppose you want to test out a new feature in your application, and catch any errors related to the new feature.

You can set your code to send the GrowthBook feature information to Rollbar within a certain scope/only under certain conditions:

```javascript React
const rollbar = useRollbar();
// here, we are using a variable for our GrowthBook feature 'upload_enable'
const feature = 'upload_enable'
const uploadEnableValue = useFeatureIsOn(feature)

try {
  if (uploadEnableValue) {
    testNewBehavior()
  } else {
    oldBehavior()
  }
} catch(error) {
  if (uploadEnableValue) {
    // here we added a growthBookFeature custom field with name subfield
    rollbar.error(error, { growthBookFeature: { 
      name: feature
    }})
  }
}
```

Having a GrowthBook feature name in the custom payload to Rollbar will allow you to create a Rollbar service link that takes you directly to the related feature page.

**Service Links**

> 📘 How to create service links for GrowthBook [click here](https://docs.rollbar.com/docs/service-links#growthbook)

You can reference the GrowthBook documentation for additional details and features, and incorporate more information from GrowthBook with your Rollbar integration.

<br />

**Watch a demo of Growthbook and Rollbar:**

[block:embed]
{
  "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FrAo-bCzkNtI%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DrAo-bCzkNtI&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FrAo-bCzkNtI%2Fhqdefault.jpg&type=text%2Fhtml&schema=youtube\" width=\"640\" height=\"480\" scrolling=\"no\" title=\"YouTube embed\" frameborder=\"0\" allow=\"autoplay; fullscreen; encrypted-media; picture-in-picture;\" allowfullscreen=\"true\"></iframe>",
  "url": "https://www.youtube.com/watch?v=rAo-bCzkNtI",
  "title": "Growthbook Feature Flag Integration with Rollbar Error Monitoring",
  "favicon": "https://www.youtube.com/favicon.ico",
  "image": "https://i.ytimg.com/vi/rAo-bCzkNtI/hqdefault.jpg",
  "provider": "youtube.com",
  "href": "https://www.youtube.com/watch?v=rAo-bCzkNtI",
  "typeOfEmbed": "youtube"
}
[/block]