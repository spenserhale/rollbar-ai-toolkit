<!-- source: https://docs.rollbar.com/docs/rack.md -->

# Rack

How to configure rollbar-gem to work with your Rack app | Support Level: Community

## Quick Start

Initialize Rollbar with your access token somewhere during startup:

```ruby
Rollbar.configure do |config|
  config.access_token = 'POST_SERVER_ITEM_ACCESS_TOKEN'
  # other configuration settings
  # ...
end
```

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

The gem monkey patches `Rack::Builder` so Rollbar reports will be sent automatically without any other action. If you prefer to disable the monkey patch apply this change to your config:

```ruby
Rollbar.configure do |config|
  config.disable_rack_monkey_patch = true
  # other configuration settings
  # ...
end
```

If you disabled the `Rack::Builder` monkey patch or it doesn't work for the Rack framework you are using, then add our Rack middleware to your app:

```ruby
require 'rollbar/middleware/rack'

use Rollbar::Middleware::Rack
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

## Person tracking with Rack applications

To track information about the current user in non-Rails applications, you can populate the `rollbar.person_data` key in the Rack environment with the desired data. Its value should be a hash like:

```ruby
{
  :id => "123",  # required; string up to 40 characters
  :username => "adalovelace",  # optional; string up to 255 characters
  :email => "ada@lovelace.net"  # optional; string up to 255 characters
}
```

Because Rack applications can vary so widely, we don't provide a default implementation in the gem, but here is an example middleware:

```ruby
class RollbarPersonData
  def initialize(app)
    @app = app
  end

  def call(env)
    token = Rack::Request.new(env).params['token']
    user = User.find_by_token(token)

    if user
      env['rollbar.person_data'] = extract_person_data(user)
    end

    @app.call(env)
  end

  def extract_person_data(user)
    {
      id: user.id,
      username: user.username,
      email: user.email
    }
  end
end

# You can add the middleware to your application, for example:

require 'rollbar/middleware/sinatra'

class App < Sinatra::Base
  use Rollbar::Middleware::Sinatra
  use RollbarPersonData

  # ...
  # ...
end
```

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]