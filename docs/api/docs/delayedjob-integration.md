<!-- source: https://docs.rollbar.com/docs/delayedjob-integration.md -->

# DelayedJob Integration

How to configure rollbar-gem to work with DelayedJob

Add the following in `config/initializers/rollbar.rb`:

```ruby
config.use_delayed_job
```

By default, an unnamed queue is used for processing jobs. If you wish to use a named queue, as
[described here](https://github.com/collectiveidea/delayed_job#named-queues), pass the name of the queue as an option in the configuraton:

```ruby
config.use_delayed_job :queue => 'my_queue'
```

If `delayed_job` is defined, Rollbar will automatically install a plugin that reports any uncaught exceptions that occur in jobs.

By default, the job's data will be included in the report. If you want to disable this functionality to prevent sensitive data from possibly being sent, use the following configuration option:

```ruby
config.report_dj_data = false # default is true
```

You can also change the threshold of job retries that must occur before a job is reported to Rollbar:

```ruby
config.dj_threshold = 2 # default is 0
```

If you use [custom jobs](https://github.com/collectiveidea/delayed_job#custom-jobs) that define their own hooks to report exceptions, please consider disabling our plugin. Not doing so will result in duplicate exceptions being reported as well as lack of control when exceptions should be reported. To disable our Delayed::Job plugin, add the following line after the `Rollbar.configure` block.

```ruby
config.delayed_job_enabled = false
```

Only versions >= 3.0 of delayed\_job are supported.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]