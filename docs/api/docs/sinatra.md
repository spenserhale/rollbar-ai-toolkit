<!-- source: https://docs.rollbar.com/docs/sinatra.md -->

# Sinatra

How to configure rollbar-gem to work with your Sinatra app | Support Level: Community

## Quick Start

Initialize Rollbar with your access token somewhere during startup:

```ruby
Rollbar.configure do |config|
  config.access_token = 'POST_SERVER_ITEM_ACCESS_TOKEN'
  # other configuration settings
  # ...
end
```

Then mount the middleware in your app, like:

```ruby
require 'rollbar/middleware/sinatra'

class MyApp < Sinatra::Base
  use Rollbar::Middleware::Sinatra
  # other middleware/etc
  # ...
end
```

#### Note

There is a known conflict between Sinatra and other gems where Sinatra's top-level-binded methods get overriden by other gems (more details here: <https://github.com/sinatra/sinatra-contrib/issues/111> and <https://github.com/rollbar/rollbar-gem/issues/663>). This came to attention when using `sinatra/namespace` and `Rollbar.configure`. If your top-level-binded methods get overshadowed by other gems, like `Rake::DSL.namespace`, you will need to redefine the method manually as intended by Sinatra.

Here is an example if you want to use `sinatra/namespace`:

```ruby
configure do
  Rollbar.configure do |config|
    ...
  end
  
  # Redefine :namespace to use Sinatra's :namespace method
  self.instance_eval do 
    undef :namespace
    
    define_singleton_method(:namespace) do |*args, &block|
      Sinatra::Delegator.target.send(:namespace, *args, &block)
    end
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

### Catching errors when streaming content

Thanks to [@troex](https://github.com/troex) for reporting this [issue and solution](https://github.com/rollbar/rollbar-gem/issues/683) to us.

When using a `stream`, make sure to configure it's `errback` as follows:

```ruby
get '/test_stream_error' do
  stream do |out|
    out.errback do
      Rollbar.error($!)
    end

    raise 'OMG!'
  end
end
```

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]