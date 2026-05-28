<!-- source: https://docs.rollbar.com/docs/logrocket.md -->

# LogRocket

Rollbar and LogRocket combine for faster, better bug diagnostics.

**What does this integration offer?**\
Our LogRocket integration connects errors in Rollbar to a LogRocket session recording, allowing a much easier way to connect the end user's experience back to the error data located in Rollbar. This way, debugging issues becomes a lot easier, and you can also correlate error data with your session reply in LogRocket.

**JavaScript Integration**\
Make sure you're using both LogRocket and Rollbar as JS modules within your application.

**Rollbar Configuration**\
The data that Rollbar needs is for the URL returned by `window.LogRocket.getSessionURL()` to be added into the payload for the Rollbar item when it is created. To do this we use the "transform" function as shown in the JavaScript code example below.

This can be done in any SDK that LogRocket and Rollbar supports. Review the supported SDKs for both solutions online.

```text
var _rollbarConfig = {
    accessToken: "<ROLLBARPROJECTACCESSTOKEN>",
    captureUncaught: true,
    captureUnhandledRejections: true,
    autoInstrument: true,
    captureUsername: true,
    captureEmail: true,
    payload: {
        environment: "production",
        server: {
            host: "myapp.com",
            root: "https://myapp.com/",
            branch: "master",
        }
    },
    transform: function (payload) {
        // Ensure the LogRocket object exists.
        if (window.LogRocket) {
            // Add the LogRocket session URL to the Rollbar payload
            payload.logrocketsessionURL = LogRocket.getSessionURL();
        }
        return payload;
    }
};
```

**View the LogRocket session URL in Rollbar**

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/251a2fe-LogRocket_RollbarSession.png",
        "unnamed.png",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

**The link will open a new window to the LogRocket session replay screen**

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2f558c4-LogRocket_ReplySession.png",
        "68747470733a2f2f692e696d6775722e636f6d2f613236524274662e706e67.png",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

**How to add the Rollbar Service Link**\
Navigate to the project you want to add the Service Link to. Add the new Service Link using the following example.

```text
{{logrocketsessionURL}}
```

This service link in Rollbar will now open the LogRocket recording for you in a new browser tab allowing you to quickly view the users session and associated data from LogRocket.