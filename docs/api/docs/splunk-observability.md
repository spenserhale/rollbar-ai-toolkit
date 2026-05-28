<!-- source: https://docs.rollbar.com/docs/splunk-observability.md -->

# Splunk Observability

The Rollbar Splunk Observability (SignalFX) integration requires a Splunk Cloud account and Rollbar account.

**What does this integration offer?**\
Our Splunk Observability (SignalFX) integration connects errors in Rollbar to a Splunk RUM session allowing a much easier way to connect the end users experience back to the error data located in Rollbar. This way, debugging issues becomes a lot easier, and you can also correlate error data with your real user monitoring data in Splunk.

**JavaScript Integration**\
Make sure you're using both Splunk RUM SKD and Rollbar JS SDK modules within your application.

**Rollbar Configuration**\
The key value that we need to use is the "SplunkRum.getSessionId()" and add this into the payload for the Rollbar item when it is created. To do this we use the "transform" function as shown in the JavaScript code example below.

This can be done in any SDK that Splunk RUM and Rollbar supports. Review the supported SDK's for both solutions online.

```
 
//Splunk RUM SDK - We need this SDK to get the sessionId
    SplunkRum.init({
          beaconUrl: "https://rum-ingest.us1.signalfx.com/v1/rum",
          rumAuth: "RUM_AUTH_TOKEN",
          app: "myapp",
          environment: "production"
        });

//Rollbar JS SDK
     var _rollbarConfig = {
        accessToken: 'YOUR_ACCESS_TOKEN',
        captureUncaught: true,
        captureUnhandledRejections: true,
        payload: {
            environment: 'production',
            context: window.location.pathname,
            client: {
              javascript: {
                code_version: 'GIT_SHA',
                // source_map_enabled: true,
                guess_uncaught_frames: true
              }
            },
            server: {
                host: "https://myapp.com/",
                root: "https://myapp.com/",
                //branch: "master",
            },
            person: {
              id: 001, // required 
              username: 'Bond.Kurt',
              email: 'kurtbond@mi5.org'
            }
        },
        transform: function (payload) {

          //Splunk RUM - Recording Session Id
          payload.rumSessionId = SplunkRum.getSessionId();

          return payload;

        }
    };
```

**Enabling a quick link back to Splunk Observability from your Rollbar Item View**\
When the data is sent to Rollbar as part of the item occurrence data we are able to utilize this data in various ways. This includes creating a service link on the item page in Rollbar or querying Rollbar using RQL for any issues that have this sessionid from Splunk RUM (APM).

**Configure Rollbar Service Link**\
Service links allows a quick and easy way to connect external system to a Rollbar issue. The example below shows the error in Rollbar with a Service Link to Splunk RUM (APM).

[block:image]{"images":[{"image":["https://files.readme.io/b03d211f0e53e1ece4c21f1c62c67ad6b3d364edc04b034e830da49b419e369a-Screenshot_2024-09-06_at_9.39.56_AM.png",null,null],"align":"center"}]}[/block]

**How to add the service link**\
Navigate to the project you want to add the service link to. Add the new service link using the following example.

```text
https://app.us1.signalfx.com/#/rum/sessions/{{rumSessionId}}?startTime={{timestamp}}
```

This service link in Rollbar will now open the Splunk APM (RUM) session for you in a new browser tab allowing you to quickly view the users session and associated data from the Splunk Observability platform.