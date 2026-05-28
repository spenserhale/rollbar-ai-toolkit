<!-- source: https://docs.rollbar.com/docs/activejob-integration.md -->

# ActiveJob Integration

How to configure rollbar-gem to work with ActiveJob

Include the module `Rollbar::ActiveJob` in your jobs to report any uncaught errors in a job to Rollbar.

```ruby
class YourAwesomeJob < ActiveJob::Base
  include Rollbar::ActiveJob
end
```

If you need to customize the reporting write your own `rescue_from` handler instead of using the `Rollbar::ActiveJob` module.

Note: If you're using Sidekiq and integrate ActiveJob, you may get double reports of background job errors in Rollbar. The way to avoid this is to rely on the Sidekiq error handling, not ActiveJob in this case.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]