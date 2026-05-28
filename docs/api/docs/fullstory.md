<!-- source: https://docs.rollbar.com/docs/fullstory.md -->

# FullStory

Rollbar and FullStory combine for faster, better bug diagnostics.

**What does this integration offer?**\
Our FullStory integration connects errors in Rollbar to a FullStory session recording, allowing a much easier way to connect the end user's experience back to the error data located in Rollbar. This way, debugging issues becomes a lot easier, and you can also correlate error data with your product usage metrics in FullStory.

> 📘 Read the thredUP Customer Use Case for Rollbar and FullStory
>
> How thredUP increases engineer productivity through session capture and error tracking.
>
> <https://www.fullstory.com/blog/how-thredup-increases-engineer-productivity-through-session-capture-and-error-tracking/>

> 👍 Open Source 3rd Party Integration
>
> <https://www.npmjs.com/package/@bharathvaj/fullstory-rollbar>
>
> The FullStory-Rollbar integration seamlessly integrates the FullStory and Rollbar platforms. When you look at a browser error in Rollbar, you will see a link to the FullStory session replay at that exact moment in time. When you are watching a FullStory replay and your user experiences an error, you will see a custom error with the basic error details.

**JavaScript Integration**\
Make sure you're using both FullStory and Rollbar as JS modules within your application.

**Rollbar Configuration**\
The data that Rollbar needs is for the URL returned by `window.FS.getCurrentSessionURL(true)` to be added into the payload for the Rollbar item when it is created. To do this we use the "transform" function as shown in the JavaScript code example below.

This can be done in any SDK that FullStory and Rollbar supports. Review the supported SDKs for both solutions online.

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
        // Ensure the FullStory object exists.
        if (window.FS && window.FS.getCurrentSessionURL) {
            // Add the FullStory session URL to the Rollbar payload
            payload.fullstorysessionURL = window.FS.getCurrentSessionURL(true);
        }
        return payload;
    }
};
```

**View the FullStory session URL in Rollbar**

![](https://files.readme.io/cdbfc70-unnamed.png "unnamed.png")

**The link will open a new window to the FullStory session replay**

![](https://files.readme.io/b701d40-68747470733a2f2f692e696d6775722e636f6d2f613236524274662e706e67.png "68747470733a2f2f692e696d6775722e636f6d2f613236524274662e706e67.png")

**How to add the Rollbar Service Link**\
Navigate to the project you want to add the Service Link to. Add the new Service Link using the following example.

```text
{{fullstorysessionURL}}
```

This service link in Rollbar will now open the Fullstory recording for you in a new browser tab allowing you to quickly view the users session and associated data from Fullstory.