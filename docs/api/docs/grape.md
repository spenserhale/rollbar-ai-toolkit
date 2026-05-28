<!-- source: https://docs.rollbar.com/docs/grape.md -->

# Grape

How to configure rollbar-gem to work with your Grape app | Support Level: Community

## Quick Start

To capture 500s inside the API gem "Grape" for Rails applications, add the following as a global exception handler:

```ruby
rescue_from :all do |e|
  if Rails.env.development?
    raise e
  else
    Rollbar.error(e)
    error_response(message: "Internal server error", status: 500)
  end
end
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

> 📘
>
> For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby).