<!-- source: https://docs.rollbar.com/docs/integration-with-rollbarjs.md -->

# Integration with rollbar.js

In case you want to report your JavaScript errors using [Rollbar.js](https://github.com/rollbar/rollbar.js), you can configure the gem to enable Rollbar.js on your site. Example:

```ruby
Rollbar.configure do |config|
  # common gem configuration
  # ...
  config.js_enabled = true
  config.js_options = {
    accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
    captureUncaught: true,
    payload: {
      environment: "production"
    }
  }
end
```

The `Hash` passed to `#js_options=` should have the same available options that you can find in [Rollbar.js](https://github.com/rollbar/rollbar.js), using symbols or strings for the keys.

Options that take a function, such as `checkIgnore` or `transform`, can be wrapped using `Rollbar::JSON::Value`. Example:

```ruby
Rollbar.configure do |config|
  config.js_enabled = true
  config.js_options = {
    accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
    checkIgnore: Rollbar::JSON::Value.new('function(isUncaught, args, payload){}')
  }
end
```

[block:callout]
{
  "type": "warning",
  "body": "If you use `Rollbar::JSON::Value`, you will probably have to require it using:\n\n```\nrequire 'rollbar/middleware/js/json_value'\n```"
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]