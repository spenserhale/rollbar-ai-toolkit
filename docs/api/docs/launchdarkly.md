<!-- source: https://docs.rollbar.com/docs/launchdarkly.md -->

# LaunchDarkly

Rollbar and LaunchDarkly combine for faster, better bug diagnostics.

Utilizing feature flags is a great way to experiment and rollout features to users reducing the risk should things go wrong. As a developer you want to know the exact configuration when an issue appears and using features flags in your code can complicate this as different users may have different flags enabled or disabled.

Using this integration with Rollbar and LaunchDarkly you can easily identify the exact configuration and feature flags delivered to the user (client or server application) at the time of the error.

**LaunchDarkly Configuration**

In this example we have two features flags that are used and have been created in LaunchDarkly to control features on the account subscription page.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8e1bb2e-LaunchDarkly_Setup.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

The flags above target only a certain set of users. This will modify the page (DOM) and should an error occur the flags served will be very important to understand the exact experience the end user had during this interaction.

We are also adding some configuration and user context when the page loads using the LaunchDarkly SDK.

```
           
    //Create Org and User Context to be used
    const context = {
      kind: "multi",
      user: {
        key: "User X_ID",
        name: "User X",
        email: "UserX@company.com"
      },
      organization: {
        key: "Company X_ID",
        name: "Company X",
        address: {
          street: "Some Street",
          city: "Some City"
        }
      }
    }

    // Set clientSideID to your LaunchDarkly client-side ID
    const clientSideID = 'YOUR_LD_TOKEN';

    //Initialize Client
    const ldclient = LDClient.initialize(clientSideID, context);

```

The code above creates the context that is sent to the LaunchDarkly SDK and we can now use the LaunchDarkly Client.

Next we want to load the feature flags so we can use them in our page.

```
    // Set flagKey to the feature flag key you want to evaluate
    const flagKey = 'partner_accounts'; //This is the Flag we created in LaunchDarkly

    //Get Flag value for FLag Key
    const flagValue = ldclient.variation(flagKey, false);

    //Get All Flags and Settings
    let allFlagsResult = ldclient.allFlags();

```

<br />

**Rollbar Configuration**

In this example we are loading the Feature Flags on the subscription page and we want to ensure that the Rollbar configuration knows about the full flag list should an error occur.

Once the Rollbar SDK has been loaded we can add to the configuration at any time. In this example we will add the feature flags served once they are available from the LaunchDarkly Client.

In the example below we are adding 2 (two) custom properties to the Rollbar payload. The first is "LDFlags" which will contain all the flags served for this user and the second is called "subscriptionid" which is the subscriptionid for the end users account on my page.

```
    //Ensure we inset the flag status into the Payload
    Rollbar.configure({ payload: { custom: { LDFlags: allFlagsResult, subscriptionid: "MY CUSTOMERS SUBSCRIPTIONID" } } });

```

<br />

**Sample App Page Loading with the Flags Enabled**

We will see the section called "Your Subscription" shows the text "Complimentary Subscription" which is shown based on my feature flag serving true.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/94c8cd7-Screenshot_2024-05-03_at_9.46.33_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

When an error is generated on this page we will now know the exact setup and flags from the raw payload in Rollbar.

**Example Error in Rollbar with the Flags in the Payload**

Below we can see an item with an occurrence where the list of Flags are all false. We can also have service links that allow fast navigation from within Rollbar to the LaunchDarkly User or Organization context.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8efbac0-Screenshot_2024-05-03_at_9.48.40_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

> 📘 How to create service links for LaunchDarkly [click here](https://docs.rollbar.com/docs/service-links#launchdarkly---see-users-details-for-an-environment)