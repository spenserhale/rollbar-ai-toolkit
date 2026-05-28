<!-- source: https://docs.rollbar.com/docs/ruby.md -->

# Ruby

Rollbar SDK for Ruby | Support Level: Supported

Add the [Rollbar-gem](https://github.com/rollbar/rollbar-gem) to your Ruby projects to automatically capture and report errors in your applications.

## Quick Start

Add this line to your application's Gemfile:

```ruby
gem 'rollbar'
```

And then execute:

```bash
bundle install
# Or if you don't use bundler:
gem install rollbar
```

Further instructions can be found per framework or integration:

|                              |                                                               |
| :--------------------------- | :------------------------------------------------------------ |
| [Plain Ruby](https://docs.rollbar.com/docs/plain-ruby) | [Rails](https://docs.rollbar.com/docs/rails)                                            |
| [Grape](https://docs.rollbar.com/docs/grape)           | [Sinatra](https://docs.rollbar.com/docs/sinatra)                                        |
| [Rack](https://docs.rollbar.com/docs/rack)             | [Integration with rollbar.js](https://docs.rollbar.com/docs/integration-with-rollbarjs) |
| [Goalie](https://docs.rollbar.com/docs/goalie)         | [Using with Zeus](https://docs.rollbar.com/docs/using-with-zeus)                        |

Rollbar-gem supports  Ruby >= 1.8.7 and Rails >= 3.0.

## Usage

Uncaught exceptions in Rails controllers will be automatically reported to Rollbar. You can use one of `Rollbar.log(level, ...)`, `Rollbar.debug()`, `Rollbar.info()`, `Rollbar.warning()`, `Rollbar.error()` and `Rollbar.critical()` to report caught exceptions and messages.

The methods accept any number of arguments. The last exception is used as the reported exception, the last string is used as the message/description, and the last hash is used as the extra data.

For example:

```ruby
begin
  result = user_info[:key1][:key2][:key3]
rescue NoMethodError => e
  # simple exception report (level can be 'debug', 'info', 'warning', 'error' and 'critical')
  Rollbar.log('error', e)

  # same functionality as above
  Rollbar.error(e)

  # with a description
  Rollbar.error(e, 'The user info hash doesn\'t contain the correct data')

  # with extra data giving more insight about the exception
  Rollbar.error(e, :user_info => user_info, :job_id => job_id)
end
```

You can also log individual messages:

```ruby
Rollbar.warning('Unexpected input')

# can also include extra data
Rollbar.info("Login successful", :username => @username)

Rollbar.log('debug', 'Settings saved', :account_id => account.id)
```

### Reporting form validation errors

To get form validation errors automatically reported to Rollbar just add the following `after_validation` callback to your models:

```ruby
after_validation :report_validation_errors_to_rollbar
```

### The Scope

The scope is an object, an instance of `Rollbar::LazyStore` that stores the current context data for a certain moment or situation. For example, the Rails middleware defines the scope in a way similar to this:

```ruby
scope = {request: request_data,
         person: person_data,
         context: context_data
}
Rollbar.scoped(scope) do
  begin
    @app.call(env)
  rescue Exception => exception
    # ...
  end
end

```

You can access the scope on the [before\_process](#section-ignoring-items) and [transform](#section-transforming-the-payload) hooks like this:

```ruby
your_handler = proc do |options|
  scope = options[:scope]

  request_data = scope[:request]
  person_data = scope[:person]
  context_data = scope[:context]
end
```

You can use `Rollbar.scope()` to copy a notifier instance and customize the payload data for one-off reporting. The hash argument to `scope()` will be merged into the copied notifier's "payload options", a hash that will be merged into the final payload just before it is reported to Rollbar.

For example:

```ruby
while job
  user = job.user

  # Overwrites any existing person data
  notifier = Rollbar.scope({
    :person => {:id => user.id, :username => user.username, :email => user.email}
  })

  begin
    job.do_work
  rescue => e
    # Sends a report with the above person data
    notifier.critical(e)
  end

  job = next_job
end

# Wipe person data
notifier = notifier.scope({
  :person => nil
})

# No associated person data
notifier.info('Jobs processed')
```

If you don't want to work with a new `Notifier` instance `.scoped` will do it for you:

```ruby
while job
  user = job.user

  # Overwrites any existing person data
  scope = {
    :person => {:id => user.id, :username => user.username, :email => user.email}
  }

  Rollbar.scoped(scope) do
    begin
      job.do_work
    rescue => e
      # Sends a report with the above person data
      Rollbar.critical(e)
    end
  end

  job = next_job
end
```

To modify the current scope (rather than creating a new one), use `Rollbar.scope!`. You can use this to add additional context data from inside a web request, background job, etc.

```ruby
class NotificationJob
  include Sidekiq::Worker

  def perform(user_id)
    Rollbar.scope!(:person => { :id => user_id })

    # If this next line causes an exception, the reported exception (which will
    # be reported by Rollbar's standard Sidekiq instrumentation) will also
    # include the above person information.
    Notification.send_to_user(user_id)
  end
end
```

> 📘
>
> If you are using `Rollbar.scope!` within a scoped block, your context will only apply within that scoped block because of how Rollbar gets shadowed.

### Error contexts

Scopes allow augmenting the payload with context information while within specific code paths. In some cases, it is more useful to add context information to an exception while still allowing the exception to bubble up to outer layers of execution. When an outer layer reports the exception or when the uncaught exception handler reports it, the context information already added to the exception object will be added to the Rollbar payload.

By default,exception objects have an accessor `exception.rollbar_context` that can be set with any custom data.

```ruby
exception.rollbar_context = { foo: 'bar' }
```

When the error is later reported to Rollbar, the context will be added to the `trace.extra` key for the error.

```
"data": {
  "body":
    "trace": {
      "extra": { "foo": "bar" }
      }
    }
  }
}
```

A common example where this is useful is when an exception must be handled by the caller. If the error is reported with context and re-raised, this usually causes duplicate errors to be reported. If the error is not caught, the relevant context is no longer available when it is caught and reported later.

Example:

```ruby
class ExampleClass
  def any_method(params)
    // do work…
  rescue ArgumentError => e
    // Let the uncaught exception handler or other application code
    // report this later with the context set here.
    e.rollbar_context = { foo: ‘bar’ }
    raise
  end
end
```

In this example, the caller is allowed to handle the ArgumentError, and when it is reported to Rollbar, the report will include the added context.

### Code and context

By default we send the following values for each backtrace frame: `filename`, `lineno` and `method`. You can configure Rollbar to additionally send `code` (the actual line of code) and `context` (lines before and after) for each frame.

Since the backtrace can be very long, you can configure to send this data for all the frames or only your in-project frames. There are three levels: `:none` (default), `:app` (only your project files) and `:all`. Example:

```ruby
Rollbar.configure do |config|
   config.send_extra_frame_data = :app
end
```

### Enabling local variables in stack traces

Collection of local variables is disabled by default. To enable:

```ruby
config.send_extra_frame_data = :app # or :all
config.locals = { :enabled => true }
```

`send_extra_frame_data` must be enabled in order to send locals.

Reporting of local variables can both impact performance and payload size. This is because, especially in Rails environments, the size and number of objects the framework puts on the stack are significant. **Testing for performance impact is recommended before enabling in production or other performance sensitive environments.** Here are ways to mitigate this when enabling locals.

```ruby
config.send_extra_frame_data = :app
```

`send_extra_frame_data` must be enabled for locals capture to work, but setting its value to `:app` instead of `:all` will only capture locals for your application frames.

```ruby
config.backtrace_cleaner = ActiveSupport::BacktraceCleaner.new
```

In ActiveSupport environments like Rails, `ActiveSupport::BacktraceCleaner` is a useful way to clean up stack traces before they are added to the payload. The default settings are reasonable, and custom filters and silencers can be added easily.

### Scrubbing sensitive data in locals

Any keys that are configured as scrub fields will be applied to the keys of locals data. Locals capture is off by default, and when enabled, it is the user’s responsibility to ensure all necessary scrub keys are configured. Variables that appear on the stack, and the names of those variables, may change as your application code changes. The scrub list should be updated to match the stack data your app generates.

Additionally, other customizations such as the backtrace cleaner and custom transform functions can be used to manage what data is removed or modified in the stack locals data.

### Upgrading from Previous Versions

You can find upgrading notes in [UPGRADING.md](https://github.com/rollbar/rollbar-gem/blob/master/UPGRADING.md).

## Managing Sensitive Data

### GDPR & HIPAA

If you are required to comply with [GDPR](https://www.eugdpr.org/) or HIPAA, we have a few recommendations for how to manage the sensitive data you may be sending to Rollbar. We recommend setting up person tracking, customizing your data retention period (more info on this [here](https://docs.rollbar.com/docs/data-retention)), anonymizing or not capturing IP addresses, and [scrubbing sensitive data](https://docs.rollbar.com/docs/ruby#section-scrubbing-items) before sending Rollbar items. For HIPAA compliance, we additionally recommend [transforming the payload](https://docs.rollbar.com/docs/ruby#section-transforming-the-payload) before sending Rollbar items, as sometimes sensitive data may be found in stack traces.

For information on setting up person tracking, please see [here](https://docs.rollbar.com/docs/ruby#section-person-tracking). You can simply send only the `person.id` and no other identifying information, such as an email address. If you have already sent Rollbar sensitive person data and wish to delete it, please see our documentation on deleting person data [here](https://explorer.docs.rollbar.com/#operation/delete-a-person).

You may also configure whether or not to capture IP addresses (by setting `collect_user_ip` to `true` or `false`) or have the SDK do a semi-anonymization on the captured IP address by masking out the least significant bits (by setting `anonymize_user_ip` to `true`). Additionally, you may obfuscate the user IP by configuring a secret to do so by using `user_ip_obfuscator_secret`, and a different IP address from the original will be reported.

```ruby
# collect the full user IP address
Rollbar.configure do |config|
   config.collect_user_ip = true
end

# or anonymize the IP address
Rollbar.configure do |config|
   config.anonymize_user_ip = true
end

# or obfuscate the user IP
Rollbar.configuration.user_ip_obfuscator_secret = "a-private-secret-here"
```

### Scrubbing Items

By default, the notifier will "scrub" the following fields from payloads before sending to Rollbar

```
:passwd
:password
:password_confirmation
:secret
:confirm_password
:secret_token
```

And the following http header

```
"Authorization"
```

If a request contains one of these fields, the value will be replaced with a `"*"` before being sent.

Additional params can be scrubbed by updating `config.scrub_fields`:

```ruby
# scrub out the "user_password" field
config.scrub_fields |= [:user_password]
```

And `config.scrub_headers`:

```ruby
# scrub out the "X-Access-Token" http header
config.scrub_headers |= ["X-Access-Token"]
```

The fields in `scrub_fields` will be used to scrub the values for the matching keys in the GET, POST, raw body and route params and also in cookies and session, but not the entire GET, POST, raw body, route params, cookies, or session. If you want to customize better exactly which part of the request data is scrubbed you can use the [transform hook](#section-transforming-the-payload).

Example:

```
config.transform << proc do |options|
  data = options[:payload]['data']
  data[:request][:session][:key] = Rollbar::Scrubbers.scrub_value(data[:request][:session][:key])
end
```

In the previous example we are scrubbing the `key` value inside the session data.

If you would simply like to scrub all params, you can use `:scrub_all` like so:

```
config.scrub_fields = :scrub_all
```

### Transforming the Payload

After the payload is built but before it is sent to our API, the gem will call the handlers defined in `configuration.transform`. To include extra data in your payload, see [Including additional runtime data](#section-including-additional-runtime-data). The handlers should be `Proc` objects or objects responding to `#call` method. The received argument is a `Hash` object with these keys:

* `level`: the level used for the report.
* `exception`: the exception that caused the report, if any.
* `message`: the message to use for the report, if any.
* `extra`: extra data passed to the report methods.
* `scope`: the current Scope; see [Scope](#section-the-scope)
* `payload`: the built payload that will be sent to the API

Handlers may mutate the payload. For example:

```ruby
handler = proc do |options|
  payload = options[:payload]

  payload['data'][:environment] = 'foo'
end

Rollbar.configure do |config|
  config.transform << handler
end
```

### Ignoring Items

Before we process data sent to `Rollbar.log` (or `Rollbar.error/info` etc.) to build and send the payload, the gem will call the handlers defined in `configuration.before_process`. The handlers should be `Proc` objects or objects responding to `#call` method. The received argument is a `Hash` object with these keys:

* `level`: the level used for the report.
* `exception`: the exception instance that caused the report, if any.
* `message`: the message, when the item is from `report_message`.
* `extra`: extra data passed to the report methods.
* `scope`: the current Scope; see [Scope](#section-the-scope)

There are two ways to ignore or discard the current item in the handler.

If the exception `Rollbar::Ignore` is raised inside any of the handlers defined for `configuration.before_process`, we'll ignore the report and not send the error data to Rollbar. For example:

```ruby
handler = proc do |options|
  raise Rollbar::Ignore if any_smart_method(options)
end

Rollbar.configure do |config|
  config.before_process << handler
end
```

Alternately, the handler may return the string 'ignored'.

```ruby
handler = proc do |options|
  next 'ignored' if any_smart_method(options)
end
```

## Features

### Disable sending error data to Rollbar

If you don't want to send error data to Rollbar, just set the `enabled` flag to `false`.

```ruby
Rollbar.configure do |config|
  config.enabled = false
end
```

### Person Tracking

Rollbar will send information about the current user (called a "person" in Rollbar parlance) along with each error report, when available. This works by calling the `current_user` controller method. The return value should be an object with an `id` method and, optionally, `username` and `email` methods.

This will happen automatically for uncaught Rails exceptions and for any manual exception or log reporting done within a Rails request.

If the gem should call a controller method besides `current_user`, add the following in `config/initializers/rollbar.rb`:

```ruby
Rollbar.configure do |config|
  config.person_method = "my_current_user"
end
```

If the methods to extract the `id`, `username`, and `email` from the object returned by the `person_method` have other names, configure like so in `config/initializers/rollbar.rb`:

```ruby
Rollbar.configure do |config|
  config.person_id_method = "user_id"  # default is "id"
  config.person_username_method = "user_name"  # default is `nil`
  config.person_email_method = "email_address"  # default is `nil`
end
```

Information on person tracking with Rack applications can be found in [Rack](https://docs.rollbar.com/docs/rack).

### [UUIDs](https://docs.rollbar.com/docs/uuids)

The rollbar-gem SDK generates a [UUID](https://docs.rollbar.com/docs/uuids)  for each event reported from the notifier to the platform. The UUID is written to the logs in the [`notifier.rb`](https://github.com/rollbar/rollbar-gem/blob/master/lib/rollbar/notifier.rb) file. This UUID can be used to track customer issues, correlate exceptions to automated test sessions, and more.

### Including additional runtime data

> ❗️ Adding custom data via the custom data method does not currently allow the custom data to be searchable on the Items list page. Instead, you can utilize Rollbar.scoped() to add a 'custom' parameter with sub-parameters.

You can provide a callable that will be called for each exception or message report.  `custom_data_method` should be a lambda that either takes no arguments or takes three arguments (message, exception, context) and returns a hash.

Add the following in `config/initializers/rollbar.rb`:

```ruby
config.custom_data_method = lambda {
  { :some_key => :some_value, :complex_key => {:a => 1, :b => [2, 3, 4]} }
}
```

Or

```ruby
config.custom_data_method = lambda{ |message, exception, context|
  { :some_key => :some_value, :complex_key => {:a => 1, :b => [2, 3, 4]} }
}
```

This data will appear in the Occurrences tab and on the Occurrence Detail pages in the Rollbar interface.

If your `custom_data_method` crashes while reporting an error, Rollbar will report that new error and will attach its uuid URL to the parent error report.

`context` for your `custom_data_method` is the value passed in the `:custom_data_method_context` key of your `log` method's `extra_data` argument. Note that once the value is passed as `context` it is removed from your `extra_data` and will be not be included in your `extra` by default.

```ruby
config.custom_data_method = lambda { |message, exception, context|
  {
    fully_qualified_controller_name: "MyApp::" + context[:controller_name]
  }
}

Rollbar.log(
  "error", 
  "Simple message", 
  { 
    extra_data_1: "some value",
    custom_data_method_context: { 
      controller_name: "ExampleController"
    }
  }
)
```

The above example will result in the following `extra`:

```ruby
  { 
    extra_data_1: "some value",
    fully_qualified_controller_name: "MyApp::ExampleController"
  }
```

As you can see, the `custom_data_method_context` will not be directly included in your `extra`.

Below is an example usage in a Rails application:

```ruby
# config/initializers/rollbar.rb
Rollbar.configure do |config|
  ...
  
  config.custom_data_method = lambda do |message, exception, context|
    { controller_name: context[:controller].controller_name }
  end
end
```

```ruby
# app/controller/welcome_controller.rb
class WelcomeController < ApplicationController
  def check_context
    Rollbar.log(
      'info', 
      'This is a message from Welcome#check_context',
      {
        custom_data_method_context: {
          controller: self
        }
      }
    )
  end
end
```

### Exception level filters

By default, all uncaught exceptions are reported at the "error" level, except for the following, which are reported at "warning" level:

* `ActiveRecord::RecordNotFound`
* `AbstractController::ActionNotFound`
* `ActionController::RoutingError`

If you'd like to customize this list, modify the example code in `config/initializers/rollbar.rb`. Supported levels: "critical", "error", "warning", "info", "debug", "ignore". Set to "ignore" to cause the exception not to be reported at all. For example, to ignore 404s and treat `NoMethodError`s as critical bugs, you can use the following code:

```ruby
config.exception_level_filters.merge!({
  'ActionController::RoutingError' => 'ignore',
  'NoMethodError' => 'critical'
})
```

This behavior applies to uncaught exceptions, not direct calls to `Rollbar.error()`, `Rollbar.warning()`, etc. If you are making a direct call to one of the log methods and want exception level filters to apply, pass an extra keyword argument:

```ruby
Rollbar.error(exception, :use_exception_level_filters => true)
```

### Dynamic levels

You can also specify a callable object (any object that responds to `call`) which will be called with the exception instance. For example, you can have a single error reported at different levels using the following code:

```ruby
config.exception_level_filters.merge!({
  'SomeError' => lambda { |error| error.to_s.include?('not serious enough') ? 'info' : 'error' }
})
```

### Overriding the Configuration

There are some cases where you would need to change the Rollbar configuration for a specific block of code so a new configuration is used on the reported errors in that block. You can use `Rollbar.with_config` to do this. It receives a `Hash` object with the configuration overrides you want to use for the given block. The configuration options to use can be found in the [Configuration Reference](https://docs.rollbar.com/docs/gem-configuration-reference). So the `Hash` passed to `with_config` can be like `{environment: 'specific-environment'}`.

```ruby
Rollbar.with_config(use_async: false) do
  begin
    # do work that may crash
  rescue => e
    Rollbar.error(e)
  end
end
```

This method looks similar to `Rollbar.scoped` and internally `Rollbar.with_config` uses it. Now `Rollbar.scoped` can receive a second argument with the config overrides for the given block of code. So if you need to set a new payload scope and new config for a code block, you can:

```ruby
scope = {context: 'foo'}
new_config = {framework: 'Sinatra'}

Rollbar.scoped(scope, new_config) do
  begin
    # do work that may crash
  rescue => e
    Rollbar.error(e)
  end
end
```

In the example from above we are defining a new payload scope and overriding the `framework` configuration for the reported errors inside the given block.

### Silencing Exceptions at Runtime

If you just want to disable exception reporting for a single block, use `Rollbar.silenced`:

```ruby
Rollbar.silenced {
  foo = bar  # will not be reported
}
```

### Sending A Backtrace Without Rescued Exceptions

If you use the gem in this way:

```ruby
exception = MyException.new('this is a message')
Rollbar.error(exception)
```

You will notice a backtrace doesn't appear in your Rollbar dashboard. This is because `exception.backtrace` is `nil` in these cases. We can send the current backtrace for you even if your exception doesn't have it. In order to enable this feature you should configure Rollbar in this way:

```ruby
Rollbar.configure do |config|
  config.populate_empty_backtraces = true
end
```

### Asynchronous reporting

By default, all messages are reported synchronously. You can enable asynchronous reporting with [girl\_friday](https://github.com/mperham/girl_friday), [sucker\_punch](https://github.com/brandonhilkert/sucker_punch), [Sidekiq](https://github.com/mperham/sidekiq), [Resque](https://github.com/resque/resque), [DelayedJob](https://github.com/collectiveidea/delayed_job), using threading, using with rollbar-agent, or other handlers.

|                                                         |                                                           |
| :------------------------------------------------------ | :-------------------------------------------------------- |
| [girl\_friday Integration](https://docs.rollbar.com/docs/girl_friday-integration) | [sucker\_punch Integration](https://docs.rollbar.com/docs/sucker_punch-integration) |
| [Sidekiq Integration](https://docs.rollbar.com/docs/sidekiq-integration)          | [Resque Integration](https://docs.rollbar.com/docs/resque-integration)              |
| [DelayedJob Integration](https://docs.rollbar.com/docs/delayedjob-integration)    | [Using with rollbar-agent](https://docs.rollbar.com/docs/using-with-rollbar-agent)  |

#### Threading

Add the following in `config/initializers/rollbar.rb`:

```ruby
config.use_thread
```

To set the thread priority:

```ruby
config.use_thread({ :priority => 2 })
```

#### Other handlers

You can supply your own handler using `config.async_handler`. The object to set for `async_handler` should respond to `#call` and receive the payload. The handler should schedule the payload for later processing (i.e. with a delayed\_job, in a resque queue, etc.) and should itself return immediately. For example:

```ruby
config.use_async = true
config.async_handler = Proc.new { |payload|
  Thread.new { Rollbar.process_from_async_handler(payload) }
}
```

Make sure you pass `payload` to `Rollbar.process_from_async_handler` in your own implementation.

#### Failover handlers

If you are using `async_handler` to process asynchronous the error it's possible that the handler fails before it calls `Rollbar.process_payload`. For example, for the Resque handler, the Redis connection could fail so the job is finally not processed.

To ensure that the error is sent you can define a chain of failover handlers that Rollbar will use to send the payload in case that the primary handler fails. The failover handlers, as for `async_handler`, are just objects responding to `#call`.

To configure the failover handlers you can add the following:

```ruby
config.use_resque
config.failover_handlers = [Rollbar::Delay::GirlFriday, Rollbar::Delay::Thread]
```

With the configuration above, Resque will be your primary asynchronous handler, but if it fails queueing the job, Rollbar will use GirlFriday at first, and just a thread in case that GirlFriday fails too.

### Logger Interface

The gem provides a class `Rollbar::Logger` that inherits from `Logger` so you can use Rollbar to log your application messages. The basic usage is:

```ruby
require 'rollbar/logger'

logger = Rollbar::Logger.new
logger.info('Purchase failed!')
```

If you are using Rails, you can extend your `Rails.logger` so the log messages are sent to both outputs. You can use this snippet in one initializer (for example, `config/initializers/rollbar.rb`):

```ruby
require 'rollbar/logger'

Rails.logger.extend(ActiveSupport::Logger.broadcast(Rollbar::Logger.new))
```

### Deploy Tracking with Capistrano

#### Capistrano 3

Add to your `Capfile`:

```ruby
require 'rollbar/capistrano3'
```

And then, to your `deploy.rb`:

```ruby
set :rollbar_token, 'POST_SERVER_ITEM_ACCESS_TOKEN'
set :rollbar_env, Proc.new { fetch :stage }
set :rollbar_role, Proc.new { :app }
```

Optionally, you can add a comment to your deploy with `rollbar_comment`. E.g.:

```ruby
# Example: Interactively ask the user for a deploy comment.
#   Alternativeely, you could generate a comment by (e.g.) querying your SCM repo
set :rollbar_comment, Proc.new {
  ask :comment, "Describing this deploy"
  fetch(:comment)
}
```

> 🚧
>
> We've seen problems with Capistrano version `3.0.x` where the revision reported is incorrect. Version `3.1.0` and higher works correctly.

#### Capistrano 2

Add the following to `deploy.rb`:

```ruby
require 'rollbar/capistrano'
set :rollbar_token, 'POST_SERVER_ITEM_ACCESS_TOKEN'
```

Available options:

* `rollbar_token`:  The same project access token as you used for the `rails generate rollbar` command; find it in `config/initializers/rollbar.rb`. (It's repeated here for performance reasons, so the rails environment doesn't have to be initialized.)
* `rollbar_env`: Deploy environment name . (Default: `rails_env`)

For `capistrano/multistage`, try:

```ruby
set(:rollbar_env) { stage }
```

### Counting specific gems as in-project code

In the Rollbar interface, stacktraces are shown with in-project code expanded and other code collapsed. Stack frames are counted as in-project if they occur in a file that is inside of the `configuration.root` (automatically set to `Rails.root` if you're using Rails). The collapsed sections can be expanded by clicking on them.

If you want code from some specific gems to start expanded as well, you can configure this in `config/initializers/rollbar.rb`:

```ruby
Rollbar.configure do |config |
  config.access_token = '...'
  config.project_gems = ['my_custom_gem', 'my_other_gem']
end
```

### SSL

By default we use `OpenSSL::SSL::VERIFY_PEER` for SSL very mode. Although we don't recommend changing it, you can disable peer verification in case you experience SSL connection problems:

```ruby
Rollbar.configure do |config|
  config.verify_ssl_peer = false
end
```

### Web Proxies

If your application is deployed behind a proxy server, you can set the `https_proxy` (note the 's') environment variable and it will be honored, including username and password, if any.

```shell
export https_proxy='http://some_user:some_password@some.proxy.com:80'
```

Alternately, you can configure the proxy settings in  `config/initializers/rollbar.rb`.  If used, `host` is mandatory and must include the URL scheme (e.g. `http://`), all other fields are optional:

```ruby
config.proxy = {
  host: 'http://some.proxy.server',
  port: 80,
  user: 'username_if_auth_required',
  password: 'password_if_auth_required'
}
```

## Configuration Options

For a listing of all configuration options available, see [Configuration Reference](https://docs.rollbar.com/docs/gem-configuration-reference).

## Plugins

The support for the different frameworks and libraries is organized into different plugin definitions. The plugins architecture documentation can be found in [Plugins](https://docs.rollbar.com/docs/gem-plugins) .

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-gem/issues/new).

### Known Issues

If you are using jRuby with Oracle and JDK7, you may be expecting some errors sending reports to our API. This is caused by a bug in that JDK and the primer number used in the SSL algorithm. In order to fix this you can set the next configuration:

```ruby
Rollbar.configure do|config|
  config.endpoint = 'https://api-alt.rollbar.com/api/1/item/'
end
```