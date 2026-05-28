<!-- source: https://docs.rollbar.com/docs/plain-ruby.md -->

# Plain Ruby

How to configure a basic rollbar-gem integration | Support Level: Supported

## Quick Start

Rollbar isn't dependent on Rack or Rails for most of its functionality. In a regular script, assuming you've installed the rollbar gem:

1. Require rollbar
2. Configure rollbar
3. Send Rollbar data

```ruby
require 'rollbar'

Rollbar.configure do |config|
  config.access_token = 'POST_SERVER_ITEM_ACCESS_TOKEN'
  config.environment = 'production'
  config.code_version = 'a9ee83ce' # typically git commit SHA

  # Other Configuration Settings
end

Rollbar.debug("Running Script")

begin
  run_script ARGV
rescue Exception => e # Never rescue Exception *unless* you re-raise in rescue body
  Rollbar.error(e)
  raise e
end

Rollbar.info("Script ran successfully")
```

## Test your installation

If you're not using Rails, you may first need to add the following to your Rakefile:

```ruby
require 'rollbar/rake_tasks'
```

You may also need to add an `:environment` task to your Rakefile if you haven't already defined one. At a bare minimum, this task should call `Rollbar.configure()` and set your access token.

```ruby
task :environment do
  Rollbar.configure do |config |
    config.access_token = '...'
  end
end
```

To confirm that it worked, run:

```bash
$ rake rollbar:test
```

This will raise an exception within a test request; if it works, you'll see a stacktrace in the console, and the exception will appear in the Rollbar dashboard.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]