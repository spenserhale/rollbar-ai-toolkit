<!-- source: https://docs.rollbar.com/docs/shoryuken-integration.md -->

# Shoryuken Integration

How to configure rollbar-gem to work with Shoryuken

Add the following in `config/initializers/rollbar.rb`

```ruby
config.environment = Rails.env # necessary for building proper SQS name.
config.use_shoryuken
```

You also need to have the configuration for shoryuken in you project `shoryuken.yml` and AWS settings, or, at least:

```ruby
ENV['AWS_ACCESS_KEY_ID'] = 'xxx'
ENV['AWS_SECRET_ACCESS_KEY'] = 'xxx'
ENV['AWS_REGION'] = 'xxx'
```

Read more about [Shoryuken configuration](https://github.com/phstc/shoryuken/wiki/Shoryuken-options).

Also create the SQS channels equals to your environments, as follows:
The queues to report will be equal to `rollbar_{CURRENT_ENVIRONMENT}` ex: if the project runs in staging environment the SQS to throw messages to will be equal to `rollbar_staging`
At this stage, you are unable to set custom SQS name to use.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]