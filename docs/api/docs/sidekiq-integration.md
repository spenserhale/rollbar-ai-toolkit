<!-- source: https://docs.rollbar.com/docs/sidekiq-integration.md -->

# Sidekiq Integration

How to configure rollbar-gem to work with Sidekiq | Support Level: Supported

Add the following in `config/initializers/rollbar.rb`:

```ruby
config.use_sidekiq
```

[block:callout]
{
  "type": "info",
  "title": "Sidekiq 6.4 and later",
  "body": "For current versions of Sidekiq, `async_json_payload` must be set in the Rollbar config. In the next major version release of Rollbar-gem, this will become the default.\n```ruby\nconfig.async_json_payload = true\n```"
}
[/block]

The default Sidekiq queue will be `rollbar` but you can also supply custom Sidekiq options:

```ruby
config.use_sidekiq 'queue' => 'default'
```

You also need to add the name of the queue to your `sidekiq.yml`

```
:queues:
- default
- rollbar
```

Start the redis server:

```bash
$ redis-server
```

Start Sidekiq from the root directory of your Rails app and declare the name of your queue. Unless you've configured otherwise, the queue name is "rollbar":

```bash
$ bundle exec sidekiq -q rollbar
```

For every errored job a new report will be sent to Rollbar API, also for errored retried jobs. You can configure the retries threshold to start reporting to rollbar:

```ruby
config.sidekiq_threshold = 3 # Start reporting from 3 retries jobs
```

## Running Sidekiq jobs with a different Rollbar config

Most setups will run the Sidekiq job processes using the same Rollbar config as the main app processes. However, if using a different config, and if that config uses a different Rollbar access token, the token in the Sidekiq Rollbar config will be used to send Rollbar occurrences.

To send using the access token that was originally set for each occurrence, set `config.use_payload_access_token = true` in the Rollbar config for the Sidekiq job process.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]