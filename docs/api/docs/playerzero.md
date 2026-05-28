<!-- source: https://docs.rollbar.com/docs/playerzero.md -->

# PlayerZero.app

PlayerZero packages user sessions into shareable, interactive reports so you have all the context from the start.

**What does this integration offer?**
Our <https://playerzero.app> integration connects errors in Rollbar to a PlayerZero session recording allowing a much easier way to connect the end users experience back to the error data located in Rollbar. This way, debugging issues becomes a lot easier.

**What is PlayerZero?**
PlayerZero brings full user context directly to the developer when an issue happens within a web application. By packaging user sessions into shareable, interactive reports, your engineering team can efficiently communicate and debug issues

**JavaScript Integration**
Make sure you're using both PlayerZero and Rollbar as JS modules within your application.

**Rollbar Configuration**
The key value that we need to use is the "playerzero.session()" and add this into the payload for the Rollbar item when it is created. To do this we use the "transform" function as shown in the JavaScript code example below.

This can be done in any SDK that PlayerZero and Rollbar supports. Review the supported SDK's for both solutions online.

[block:code]
{
  "codes": [
    {
      "code": "var _rollbarConfig = {\n    accessToken: \"<ROLLBARPROJECTACCESSTOKEN>\",\n    captureUncaught: true,\n    captureUnhandledRejections: true,\n    autoInstrument: true,\n    captureUsername: true,\n    captureEmail: true,\n    payload: {\n        environment: \"production\",\n        server: {\n            host: \"myapp.com\",\n            root: \"https://myapp.com/\",\n            branch: \"master\",\n        }\n    },\n    transform: function (payload) {\n\n        //PlayerZero.app - Session URL\n        payload.playerzerosession = playerzero.session();\n\n        return payload;\n\n    }\n};",
      "language": "text"
    }
  ]
}
[/block]

**Enabling a quick link back to PlayerZero from your Rollbar Item View**
When the data is sent to Rollbar as part of the item occurrence data we are able to utilize this data in various ways. This includes creating a service link on the item page in Rollbar or querying Rollbar using RQL for any issues that have this session URL from PlayerZero.

**Configure Rollbar Service Link**
Service links allows a quick and easy way to connect external system to a Rollbar issue.

**How to add the service link**
Navigate to the project you want to add the service link to. Add the new service link using the following example.

[block:code]
{
  "codes": [
    {
      "code": "{{playerzerosession}}",
      "language": "text"
    }
  ]
}
[/block]

This service link in Rollbar will now open the PlayerZero recording for you in a new browser tab allowing you to quickly view the users session and associated data from PlayerZero.