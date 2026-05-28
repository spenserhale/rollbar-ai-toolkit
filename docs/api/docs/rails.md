<!-- source: https://docs.rollbar.com/docs/rails.md -->

# Rails

How to configure rollbar-gem to work with your Rails app | Support Level: Supported

## Quick Start

Run the following command from your Rails root:

```bash
$ rails generate rollbar POST_SERVER_ITEM_ACCESS_TOKEN
```

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

That will create the file `config/initializers/rollbar.rb`, which initializes Rollbar and holds your access token and other configuration values.

If you want to learn more about how to configure this file, you can refer to the [Configuration Reference](https://docs.rollbar.com/docs/gem-configuration-reference).

If you want to store your access token outside of your repo, run the same command without arguments and create an environment variable `ROLLBAR_ACCESS_TOKEN` that holds your server-side access token:

```bash
$ rails generate rollbar
$ export ROLLBAR_ACCESS_TOKEN=POST_SERVER_ITEM_ACCESS_TOKEN
```

For Heroku users:

If you're on Heroku, you can store the access token in your Heroku config:

```bash
$ heroku config:add ROLLBAR_ACCESS_TOKEN=POST_SERVER_ITEM_ACCESS_TOKEN
```

That's all you need to use Rollbar with Rails.

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

## Rails booting process

Rails doesn't provide a way to hook into its booting process, so we can't catch errors during boot out of the box. To report these errors to Rollbar, make the following changes to your project files.

First, move your `config/initializers/rollbar.rb` file to `config/rollbar.rb`. Then be sure your `config/environment.rb` looks similar to this:

```ruby
# config/environment.rb

require File.expand_path('../application', __FILE__)
require File.expand_path('../rollbar', __FILE__)

notify = ->(e) do
  begin
    Rollbar.with_config(use_async: false) do
      Rollbar.error(e)
    end
  rescue
    Rails.logger.error "Synchronous Rollbar notification failed.  Sending async to preserve info"
    Rollbar.error(e)
  end
end

begin
  Rails.application.initialize!
rescue Exception => e
  notify.(e)
  raise
end
```

How this works: first, Rollbar config (which is now at `config/rollbar.rb` is required). Later, `Rails.application/initialize` statement is wrapped with a `begin/rescue` and any exceptions within will be reported to Rollbar.  We first try to send the notification synchronously since, with our app failing to boot, it is likely the async handler relies on the app booting, and will not process the notification.

## Rails runner command

We aren't able to instrument `rails runner` directly, but we do provide a wrapper, `rollbar-rails-runner`, which you can use to capture errors when running commands in a `rails runner`-like way. For example:

```shell
$ bundle exec rollbar-rails-runner 'puts User.count'
45
```

If an error occurs during that command, the exception will be reported to Rollbar.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]