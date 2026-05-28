<!-- source: https://docs.rollbar.com/docs/gem-configuration-reference.md -->

# Configuration Reference

Configuration options for rollbar-gem

**Examples**

```ruby
# Set the access token, branch, code version, and project gems
Rollbar.configure do |config |
  config.access_token = '...'
  config.branch = 'master'
  config.code_version = '3da541559918a808c2402bba5012f6c60b27661c'
  config.project_gems = ['my_custom_gem', 'my_other_gem']
end

# Set an async_handler
config.use_async = true
config.async_handler = Proc.new { |payload|
  Thread.new { Rollbar.process_from_async_handler(payload) }
}
```

**Hooks**
You can configure the SDK to trigger your additional custom logic in selected situations through the `Rollbar::Configuration.hook` method.

```ruby
Rollbar.configure do |config|
  config.hook :on_error_response do |response|
    ...
  end
end
```

*:on\_error\_response*
Triggered when Rollbar API responds with any status code different than 200. Parameters: `response`.

*:on\_report\_internal\_error*
Triggered when the SDK throws an internal unexpected error. Parameters: `exception`.

**Configuration Reference**

[block:parameters]
{
  "data": {
    "0-0": "`access_token`",
    "0-1": "Sets the access token used to send payloads to Rollbar.\n\nItems sent through a given access token arrive in that access token's project and respect the rate limits set on that access token.",
    "1-1": "If `config.use_async = true` explicitly sets the function used to send asynchronous payloads to Rollbar. Should be an object that responds to `#call`. Not needed if using one of the built in async reporters:\n\n * girl_friday\n * sucker_punch\n * Sidekiq\n * Resque\n * threading",
    "1-0": "`async_handler`",
    "6-0": "`branch`",
    "6-1": "The name of the branch of the code that is running. Used for linking filenames in stacktraces to GitHub.\n\nDefault: `\"master\"`",
    "8-1": "A string up to 40 characters describing the version control number (i.e. git SHA) of the current revision. Used for linking filenames in stacktraces to GitHub. \n\nRollbar understands these formats:\n\n * semantic version (i.e. \"2.1.12\")\n * integer (i.e. \"45\")\n * git SHA (i.e. \"3da5415...\")",
    "8-0": "`code_version`",
    "10-1": "What logger to use for printing debugging and informational messages during operation.\n\nDefault: `Logger.new(STDERR)`  or `::Rails.logger` when using Rails",
    "10-0": "`default_logger`",
    "11-0": "`disable_core_monkey_patch`",
    "11-1": "Disables Rollbar's monkey patches in the Ruby core. One mandatory monkey patch is left. Be careful using this option as it may cause unexpected behavior in some situations.\n\nDefault: `false`",
    "13-1": "Disables monkey patches on Rack classes, `Rack::Builder`.\n\nDefault: `false`",
    "13-0": "`disable_rack_monkey_patch`",
    "14-0": "`delayed_job_enabled`",
    "14-1": "Set to false if you have `delayed_job`  but do not wish to wrap jobs with a Rollbar notifier.\n\nDefault: `true`",
    "15-0": "`dj_threshold`",
    "15-1": "The number of job failures before reporting the failure to Rollbar.\n\nDefault: `0` (Report *any* errors)",
    "16-0": "`enabled`",
    "17-0": "`environment`",
    "18-0": "`failover_handlers`",
    "19-0": "`filepath`",
    "20-0": "`framework`",
    "21-0": "`host`",
    "23-0": "`ignored_person_ids`",
    "26-0": "`logger`",
    "30-0": "`payload_options`",
    "9-0": "`custom_data_method`",
    "31-0": "`person_method`",
    "33-0": "`person_id_method`",
    "34-0": "`person_username_method`",
    "35-0": "`populate_empty_backtraces`",
    "39-0": "`report_dj_data`",
    "40-0": "`request_timeout`",
    "41-0": "`root`",
    "42-0": "`safely`",
    "43-0": "`scrub_fields`",
    "45-0": "`scrub_password`",
    "47-0": "`scrub_whitelist`",
    "55-0": "`user_ip_obfuscator_secret`",
    "56-0": "`uncaught_exception_level`",
    "57-0": "`verify_ssl_peer`",
    "58-0": "`web_base`",
    "44-0": "`scrub_headers`",
    "46-0": "`scrub_user`",
    "48-0": "`sidekiq_threshold`",
    "50-0": "`use_async`",
    "52-0": "`use_eventmachine`",
    "54-0": "use_exception_level_filters_default",
    "59-0": "`write_to_file`",
    "9-1": "The method to call to gather custom data to send with each rollbar request.\n\n```ruby\ndef custom_data\n  return {\n    :custom => {\n      :key1 => get_key_one,\n      :key2 => get_key_two\n    },\n    :server => {\n      :root => '/home/username/www/'\n    }\n  }\nend\n```",
    "12-0": "`disable_monkey_patch`",
    "12-1": "Disables monkey patching all non-core monkey patches and automatic reporting.\n\nIf you set this to true you will be responsible for rescuing and reporting all errors manually.\n\nDefault: `false`",
    "16-1": "If set to `false`, no data will be sent to Rollbar.\n\nDefault: `true`",
    "17-1": "The environment that your code is running in.\n\nDefault: unspecified",
    "18-1": "An array of backup handlers if the async handlers fails. Each should respond to `#call` and should receive a `payload`.",
    "19-1": "For use with `write_to_file`. Indicates location of the Rollbar log file being tracked by [rollbar-agent](https://github.com/rollbar/rollbar-agent).",
    "20-1": "Indicates which framework you're using. Common options include 'Rails', 'Sinatra', and 'Rack' to name a few.\n\nDefault: `'Plain'`",
    "21-1": "The hostname (reported to Rollbar as `server.host`). When nil, the value of `Socket.gethostname` will be used.\n\nDefault: `nil`",
    "23-1": "Ids of people whose reports you wish to ignore. Only works in conjunction with a properly defined `person_method` or `person_id_method`.\n\nDefault: `[]`",
    "26-1": "The logger to use *instead of* the default logger. Especially useful when you wish to send log messages elsewhere.",
    "30-1": "Extra data to send with the payload.",
    "31-1": "If not using Rails:\n\nPopulate the `rollbar.person_data` key with a hash containing `:id`, and optionally `:username` and `:email`.\n\nRails only: A string or symbol giving the name of the method on the controller. Should return an object with an `id` method, and optionally `username` and `email` methods. The names of the `id`, `username` and `email` methods can be overridden. See `person_id_method`, `person_username_method`, and `person_email_method`.",
    "33-1": "A string or symbol giving the name of the method on the user instance that returns the person's id. Gets called on the result of `person_method`. Ignored if `person_method` not present.",
    "34-1": "A string or symbol giving the name of the method on the user instance that returns the person's username. Gets called on the result of `person_method`. Ignored if `person_method` not present.",
    "35-1": "Raising an exception in Ruby is what populates the backtraces. If you report a manually initialized exception instead of a raised and rescued exception, the backtraces will be empty. Set `populate_empty_backtraces` to `true` to have Rollbar load the traces before sending them.",
    "39-1": "Set to `false` to skip automatic bundling of job metadata like queue, job class name, and job options.\n\nDefault: `true`",
    "29-0": "`open_timeout`",
    "29-1": "Default: `3`",
    "32-0": "`person_email_method`",
    "32-1": "A string or symbol giving the name of the method on the user instance that returns the person's email. Gets called on the result of `person_method`. Ignored if `person_method` not present.",
    "40-1": "Set the request timeout for sending POST data to Rollbar.\n\nDefault: `3`",
    "28-0": "`net_retries`",
    "28-1": "Sets the number of retries caused by timeouts on the POST request.\n\nDefault: `3`",
    "38-0": "`randomize_scrub_length`",
    "38-1": "When `true`, randomizes the number of asterisks used to display scrubbed fields.\n\nDefault: `true`",
    "41-1": "Sets the server root. All stack frames outside that root are considered 'non-project' frames. Also used to setup GitHub linking.",
    "42-1": "When `true`, evaluates `custom_data_method` and returns `{}` if an error, otherwise reports the error to Rollbar.\n\nDefault: `false`",
    "43-1": "Fields to scrub out of the parsed request data. Will scrub from `GET`, `POST`, url, and several other locations. Does not recurse into the full payload. If a request contains one of these fields, the value will be replaced with a `\"*\"` before being sent.\n\nDefault: `[:passwd, :password, :password_confirmation, :secret, :confirm_password, :secret_token]`",
    "44-1": "The headers to scrub. The value will be replaced with a `\"*\"` before being sent\n\nDefault: `[\"Authentication\"]`",
    "45-1": "Set to `false` to skip scrubbing the password out of the URL. The value will be replaced with a `\"*\"` before being sent.\n\nDefault: `true`",
    "46-1": "Set to `false` to skip scrubbing the user out of the URL. The value will be replaced with a `\"*\"` before being sent.\n\nDefault: `true`",
    "47-1": "An array of fields to **not** scrub, even if they also appear in `scrub_fields`.\n\nDefault: `[]`",
    "48-1": "The number of job re-tries before reporting an error to Rollbar via Sidekiq. Ignored unless you've called `use_sidekiq`.\n\nDefault: `0`",
    "50-1": "When `true`, indicates you wish to send data to Rollbar asynchronously. If installed, uses `girl_friday`, otherwise defaults to `Thread`.\n\nDefault: `false`",
    "52-1": "When `true`, indicates you wish to send data to Rollbar with `eventmachine`. Won't work unless `eventmachine` is installed.\n\nDefault: `false`",
    "54-1": "When `true`, the gem will use the `exception_level_filters` when reporting. It can be overriden via the `:use_exception_level_filters` option. See [Exception level filters](https://docs.rollbar.com/docs/ruby#section-exception-level-filters)",
    "55-1": "A string used to hash IP addresses when obfuscating them.",
    "56-1": "Use this field to select a different level for uncaught errors (like `critical`, or `warning`).\n\nDefault: `error`",
    "57-1": "By default, the gem uses `OpenSSL::SSL::VERIFY_PEER` for SSL. Although it isn't recommended to change it, you can disable peer verification in case you experience SSL connection problems.\n\nDefault: `true`",
    "58-1": "The root of the web app that serves your Rollbar data. Unless you're an Enterprise customer running Rollbar on-premise, this should never change.\n\nDefault: `'https://rollbar.com'`",
    "59-1": "If `true` writes all errors to a log file which can be sent with `rollbar-agent`.\n\nDefault: `false`",
    "36-0": "`project_gems`",
    "36-1": "In the Rollbar interface, stacktraces are shown with in-project code expanded and other code collapsed. Stack frames are counted as in-project if they occur in a file that is inside of the `configuration.root` (automatically set to Rails.root if you're using Rails). The collapsed sections can be expanded by clicking on them.\n\nIf you want code from some specific gems to start expanded as well, you can configure this in `config/initializers/rollbar.rb`:\n\n```ruby\nRollbar.configure do |config |\n  config.access_token = '...'\n  config.project_gems =  ['my_custom_gem', 'my_other_gem']\nend\n```",
    "27-0": "`logger_level`",
    "27-1": "Minimum level of logger messages to write to the log. Accepts `'debug'`, `'info'`, `'warn'` or `'error'`.\n\nDefault: `'info'`",
    "51-0": "`use_active_job`",
    "51-1": "Invoking this method will instruct the SDK to use your Rails' configured ActiveJob implementation to deliver items to Rollbar. This will automatically set `use_async` to `true` and `async_handler` to `Rollbar::Delay::ActiveJob`. Only available on Rails 4.2+.",
    "7-0": "`capture_uncaught`",
    "7-1": "Report uncaught exceptions to Rollbar. Set to `false` to ignore uncaught exceptions.\n\nDefault: `true`",
    "5-0": "`before_process`",
    "5-1": "Handlers to be called before processing data sent. The handlers should be `Proc` objects or objects responding to `#call` method.\n\nThe received argument is a Hash object with these keys:\n\n* `level`: the level used for the report.\n* `exception`: the exception that caused the report, if any.\n* `message`: the message to use for the report, if any.\n* `extra`: extra data passed to the report methods.\n* `scope`: the current Scope; see [Scope](https://docs.rollbar.com/docs/ruby#section-the-scope)\n\nIt supports [ignoring items](https://docs.rollbar.com/docs/ruby#section-ignoring-items)",
    "24-0": "`locals`",
    "24-1": "Enable capture of local variables in error stack traces. Enable by setting `config.locals = { :enabled => true }`. [More information](/docs/ruby#section-enabling-local-variables-in-stack-traces)\n\nDefault: disabled",
    "4-0": "`backtrace_cleaner`",
    "4-1": "Set with any instance of ActiveSupport::BacktraceCleaner or with any object that supports its interface. When set, it will be applied to all error stacks before sending to Rollbar.\n\nDefault: `nil`",
    "53-0": "`use_thread`",
    "53-1": "When enabled, sends Rollbar data on a separate Ruby thread. `use_thread` can either take no arguments, or can take a thread priority:\n`config.use_thread({ :priority => 2 })`\n\nDefault: `false`",
    "2-0": "`async_json_payload`",
    "2-1": "If `async_json_payload = true` it allows truncation to happen before the payload is added to queues, ensuring the payload is always under 500K bytes. This flag applies to any/all of the async handlers (Sidekiq, Resque, ActiveJob, AsyncJob, etc.)\n\nDefault: `false`",
    "3-0": "`async_skip_report_handler`",
    "3-1": "Handler to be called before sending via an async handler. The handler should be a `Proc` object or object responding to `#call` method.\n\nThe received argument is the current job being processed.\n\nThe handler should return `true` to skip the report, or a falsey value to send.\n\nDefault: `nil`",
    "37-0": "`raise_on_error`",
    "37-1": "When `true`, exceptions logged via the Rollbar logging methods will raise after reporting to Rollbar.\n\nDefault: `false`",
    "49-0": "`transmit`",
    "49-1": "When `false` items will be fully processed but not sent to Rollbar.\n\nDefault: `true`",
    "25-0": "`log_payload`",
    "25-1": "When `true`, payloads will be logged to the configured local logger.\n\nDefault: `false`",
    "22-0": "`ignore_internal_errors`",
    "22-1": "Specify error class names to ignore for internal errors from rollbar-gem. This shouldn't need to be updated unless there is an excess of unwanted internal error reports. Set `true` to ignore all internal errors.\n\nDefault: `['Net::ReadTimeout', 'Net::OpenTimeout', 'SocketError']`"
  },
  "cols": 2,
  "rows": 60
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]