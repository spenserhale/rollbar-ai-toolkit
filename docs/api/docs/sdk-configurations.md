<!-- source: https://docs.rollbar.com/docs/sdk-configurations.md -->

# SDK Configurations

Best practices for code changes to the Rollbar library

## Intro

The Rollbar library is available for a large variety of languages and frameworks, and each one is configured differently. This guide is intended to familiarize you with SDK configuration best practices across all languages; the different language guides have their own specific documentation.

## Default Configurations

The Rollbar SDK provides a few configurations during your initial project setup. The minimum configuration required for the Rollbar agent is the access token, and most libraries also include the environment tag by default. The rest of the configurations are omitted to ensure your project onboarding goes smoothly; however, the extra configurations mentioned below enable a range of features and extra visibility. It is recommended that you implement these configurations during or immediately after your initial Rollbar installation.

## Additional Configurations

There are extra configs offered to support specific Rollbar features. They will be introduced and explained below.

### `code_version`

The `code_version` field is used to enable the Versions feature as well as the source control-integrated code context display in the item detail menu. It will usually be a semantic versioning value or a git SHA value, but all String values will be accepted.

```ruby ruby
ROLLBAR = {
  'access_token': 'token',
  'environment': 'development' if DEBUG else 'production',
  'root': "http://127.0.0.1:8000/age_verification/",
  'branch': 'master',
  'code_version': '0.13.7', # A string describing the current code revision/version (i.e. a git SHA). Max 40 characters.
  "key1": "value1"
}
```

By having the version attached to the occurrence payload, your Rollbar items will be correlated to different versions. This is helpful for determining version-by-version code health and tracking new issues back to their origin.

### Context

The `context` field is a reserved field within the Rollbar configs, it is unique in that it is a [searchable field](https://docs.rollbar.com/docs/search-items#context). By adding this field, you can more accurately search for items based on their context. For example, in a Rails app, this could be `controller#action`. In a single-page javascript app, it could be the name of the current screen or route. The javascript code snippet in the "Additional Data Fields" section below has an example of the context field.

### Root / Server.Root + Branch

*NOTE: The fields referred to in this section are named `root` and `branch` in most libraries, but some languages (Javascript) use a `server` object with both root and branch as nested fields. See the code example at the bottom of the page for a server.root example.*

In order to correctly map the item code to a project's source control repository, Rollbar will need both the version and the root of your code. The root is the file path in your deployed code that maps to the same home directory as your git repo's root or home path. In the code\_version screenshot above, the `root` value is assigned to `127.0.0.1` (localhost) with the assigned port, with the `/age_verification/` suffix to point to the correct directory on the host/port combination.

The `branch` field is optional, but must be set whenever the value is not master or main.

For a more detailed breakdown of these settings, refer to the [Code Context](https://docs.rollbar.com/docs/code-context) docs page for an example.

### People Tracking

Rollbar offers a convenient way to track people and other entities through their experience with your software. The Rollbar agent will capture information about the "person" experiencing the occurrences reported to the platform (for b2b software, the "person" may be a business entity). The [People Tracking](person-tracking) docs page reviews this feature in detail.

You are free to assign any values to the people tracking data fields. The ID field is the minimum amount of data required, it allows you to capture information about your users without reporting any PII.

### Additional Data Fields

Rollbar will accept and report any additional data fields that you choose to configure, allowing you to send extra data with each occurrence payload. This extra data can be used for things like analytics, custom grouping, and alert routing.

```javascript
var _rollbarConfig = {
    accessToken: "31edaefe06424154b53688d621e63959",
    captureUncaught: true,
    captureUnhandledRejections: true,
	autoInstrument: true,
    payload: {
        environment: "production",
		code_version: "f65649707c6c9d9a5a0d1f547d76b9dd9044d728",
		context: "home#index",
		team: "donations",
		foo: "bar",
		customGroupingData: {
			key1: "001",
			key2: "FF",
		},
		server: {
			root: "file:///Users/david/Documents/dev-stuff/js-demo/",
			branch: "david-test-1"
		},
		person: {
			id: 117,
			email: "chief@unsc.gov",
			username: "john-halo"
		}
    }
};
```

In the snippet above, there are a total of 4 custom fields being added to the basic configuration. The `team`, `foo`, and `customGroupingData` key/value pairs are all custom data fields. Custom data fields can be used to route [Rollbar Notifications](notifications) to the appropriate recipients. These fields can also be used to create [Custom Fingerprinting Rules](https://docs.rollbar.com/docs/custom-grouping).

## Note about Code Examples

In the screenshots and snippets on this page, the key/value pairs have hard-coded values for clarity. In real world situations, it is usually more effective to take advantage of environment variables and other dynamic values when configuring Rollbar. Notable examples include setting the root value with the output of a `pwd` method, and setting the people data using session information. The python screenshot in the `code_version` field also shows conditional assignment of the environment field.