<!-- source: https://docs.rollbar.com/docs/resque-integration.md -->

# Resque Integration

How to configure rollbar-gem to work with Resque

Add the following in `config/initializers/rollbar.rb`:

```ruby
config.use_resque
```

You can also supply a custom Resque queue:

```ruby
config.use_resque :queue => 'my_queue'
```

Now you can just start a new Resque worker processing jobs in that queue:

```bash
$ QUEUE=my_queue bundle exec resque:work
```

From a time ago, Resque errors reporting was supported by the gem [resque-rollbar](https://github.com/dimko/resque-rollbar). Now that functionality is built-in in the own gem. All you need to do is use `Resque::Failure::Rollbar` as the failure backend for Resque.

In your resque configuration add next lines:

```ruby
require 'resque/failure/multiple'
require 'resque/failure/redis'
require 'rollbar'

Resque::Failure::Multiple.classes = [ Resque::Failure::Redis, Resque::Failure::Rollbar ]
Resque::Failure.backend = Resque::Failure::Multiple
```

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]