<!-- source: https://docs.rollbar.com/docs/posthog.md -->

# PostHog

The Rollbar PostHog integration requires either PostHog Cloud, or a self-hosted PostHog instance.

**What does this integration offer?**
Our PostHog integration connects errors in Rollbar to a PostHog session recording allowing a much easier way to connect the end users experience back to the error data located in Rollbar. This way, debugging issues becomes a lot easier, and you can also correlate error data with your product usage metrics in PostHog.

**JavaScript Integration**
Make sure you're using both PostHog and Rollbar as JS modules within your application.

**Rollbar Configuration**
The key value that we need to use is the "posthog.sessionRecording.sessionId" and add this into the payload for the Rollbar item when it is created. To do this we use the "transform" function as shown in the JavaScript code example below.

This can be done in any SDK that PostHog and Rollbar supports. Review the supported SDK's for both solutions online.

[block:code]
{
  "codes": [
    {
      "code": "var _rollbarConfig = {\n    accessToken: \"<ROLLBARPROJECTACCESSTOKEN>\",\n    captureUncaught: true,\n    captureUnhandledRejections: true,\n    autoInstrument: true,\n    captureUsername: true,\n    captureEmail: true,\n    payload: {\n        environment: \"production\",\n        server: {\n            host: \"myapp.com\",\n            root: \"https://myapp.com/\",\n            branch: \"master\",\n        }\n    },\n    transform: function (payload) {\n\n        //PostHog - Recording Session Id\n        payload.posthogsessionrecordingId = posthog.sessionRecording.sessionId;\n\n        return payload;\n\n    }\n};",
      "language": "text"
    }
  ]
}
[/block]

**Enabling a quick link back to PostHog from your Rollbar Item View**
When the data is sent to Rollbar as part of the item occurrence data we are able to utilize this data in various ways. This includes creating a service link on the item page in Rollbar or querying Rollbar using RQL for any issues that have this sessionid from PostHog.

**Configure Rollbar Service Link**
Service links allows a quick and easy way to connect external system to a Rollbar issue. The example below shows the error in Rollbar with a Service Link to PostHog.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/685b60c-Screen_Shot_2022-05-24_at_10.20.33_AM.png",
        "Screen Shot 2022-05-24 at 10.20.33 AM.png",
        1185,
        324,
        "#f5f7f7"
      ],
      "sizing": "original",
      "caption": "Rollbar PostHog Service Link Example."
    }
  ]
}
[/block]

**How to add the service link**
Navigate to the project you want to add the service link to. Add the new service link using the following example.

**Note:** This will change if you are using a self-hosted PostHog instance.

[block:code]
{
  "codes": [
    {
      "code": "https://app.posthog.com/recordings?source=rollbar#sessionRecordingId={{posthogsessionrecordingId}}",
      "language": "text"
    }
  ]
}
[/block]

This service link in Rollbar will now open the PostHog recording for you in a new browser tab allowing you to quickly view the users session and associated data from PostHog.