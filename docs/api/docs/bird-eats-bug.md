<!-- source: https://docs.rollbar.com/docs/bird-eats-bug.md -->

# Bird Eats Bug

Connect errors in Rollbar to Bird Eats Bug recordings

**What does the Bird and Rollbar integration do?**

[Bird Eats Bug](https://birdeatsbug.com?utm_source=rollbar) is a screen capture tool for Product Managers, QA Testers, and end users to easily report bugs as they see them.

Integration with Bird Eats Bug connects errors in Rollbar to a Bird Eats Bug recording, allowing a much easier way to understand the user's experience when reviewing error data in Rollbar. There's a clear correlation between error data in Rollbar and issues reported from internal and external users with Bird Eats Bug.

**Prerequisites**

For the integration to work, you need to use both Rollbar and either Bird Eats Bug SDK or the browser extension.

**Rollbar configuration**

The data that Rollbar needs is for the URL returned by `window.birdeatsbug?.session?.link || window.birdeatsbugExtension?.session?.link` to be added into the payload for the Rollbar item when it is created. We use the `transform` function, as shown in the JavaScript code example below.

This can be done in any SDK that Bird Eats Bug and Rollbar support. Review the supported SDKs for both solutions online.

```javascript JavaScript
var const rollbarConfig = {  
    // ...otherConfig  
    transform: function (payload) {  
        // Add the Bird Eats Bug session link to the payload, if it exists.  
        const sessionLink = window.birdeatsbug?.session?.link || window.birdeatsbugExtension?.session?.link  
        if (sessionLink) {  
            payload.birdeatsbugSessionURL = sessionLink;  
        }  
        return payload;  
    }  
};
```

View the Bird Eats Bug URL in Rollbar

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f1c98e3-image3.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

The link will open a new window with the Bird Eats Bug session

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/b43516d-image1.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

**How to add the Rollbar Service Link**

Navigate to the project you want to add the Service Link to. Add the new Service Link using the following example.

```javascript
{{birdeatsbugSessionURL}}
```

This service link in Rollbar will now open the Bird Eats Bug recording in a new browser tab, allowing you to quickly view the user-reported recording and associated data in Bird Eats Bug.

**Limitations**

Bird Eats Bug does not auto-upload recordings. The user has to take a submit action to upload the recording. This means that in the moment in time when an error occurs and is sent to Rollbar, it is only known whether there's an ongoing recording with Bird Eats Bug and under which URL the recording will be accessible if the user uploads it. However, the user might choose to not upload the Bird Eats Bug recording. In this case, Rollbar will link to a Bird Eats Bug recording that is not accessible. Bird Eats Bug sessions recorded with the Instant Replay feature created with the browser extension will not be linked on Rollbar.

**What does it cost?**

In Bird: available to all paid customers (plans start at $10 / user / per month)\
In Rollbar: available on all plans - uses 1 Service Link slot

**What if I need support?**

Bird support: <support@birdeatsbug.com>\
Rollbar support: <support@rollbar.com>