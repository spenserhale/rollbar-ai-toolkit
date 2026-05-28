<!-- source: https://docs.rollbar.com/docs/resolved-in-version.md -->

# Resolve in version

You can track which versions or revisions your errors are resolved in. When resolving items within Rollbar, you have the option of entering a revision or version number. If one is entered, it will appear in the item’s status history to let anyone looking at the item better understand specifically when it was fixed.

This version can be combined with a new code\_version parameter set in the configuration options of the latest versions of our Rollbar SDKs. This can be set to either a numerical value (eg. 1, 24, 300), a Git revision SHA or a semantic version value (eg. 1.0.3, 2.9). \*\*As we use [SemVer](https://semver.org/#semantic-versioning-specification-semver), semantic version should have a maximum of 3 parts (eg. 1.0.3), that SemVer will read as a Major version,  a Patch version and a Minor version. Any semantic versioning beyond the Minor version will be ignored.\
\*\*

Here are examples on how to set this parameter in our JavaScript and Ruby SDKs:

In the JavaScript snippet:

```javascript
var _rollbarConfig = {
    # ... other configuration
    payload: {
        environment: "production",
        client: {
            javascript: {
                code_version: "3da541559918a808c2402bba5012f6c60b27661c"
            }
        }
    }
};
```

In your rollbar-gem configuration:

```ruby
Rollbar.configure do |config|
    # ... other configuration
    config.code_version = 'bdd2b9241f791fc9f134fb3244b40d452d2d7e35'
end
```

The other SDKs have very similar top-level code\_version configuration settings. See the docs for your SDK for more info.

If you resolve an item within Rollbar in a certain version and also specify a code\_version, we use both of these values to decide whether or not to reactivate the item.

![](https://files.readme.io/38dc954-small-Screenshot_2023-05-04_at_2.43.04_PM.png)

For example: Let's say you have a bug in version 0.1.0 of your app. The bug is fixed and will be deployed to users in version 1.0.0, but that won’t happen for a few days. You can just resolve the Rollbar item associated with this bug now, but also specify that the resolved version is 1.0.0 You will no longer get reactivation notifications for this item until occurrences of this item with a code\_version >= 1.0.0 come in.