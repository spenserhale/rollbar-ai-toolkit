<!-- source: https://docs.rollbar.com/docs/custom-log-messages.md -->

# Send Log Messages to Rollbar

You can send any log message to Rollbar, not just exceptions. Log messages can have the same attached metadata as exceptions (request, server, person, etc.) and go through a similar de-duplication process as exceptions.

Log messages have:

* a level (`critical`, `error`, `warning`, `info`, or `debug`)
* a body (just a string)
* any arbitrary optional parameters you want to include.

## Platform-specific instructions

* [Ruby](#section-ruby)
* [Python](#section-python)
* [PHP](#section-php)
* [Javascript](#section-javascript)

### Ruby

```ruby
# log methods exist for each level, or pass as a param
Rollbar.critical("Crash while processing payment")
Rollbar.log("error", "Crash while checking order status")
Rollbar.warning("Facebook API unavailable")
Rollbar.info("User logged in")
Rollbar.debug("Cron job starting")

# can pass arbitrary params
Rollbar.info("User logged in", :login_type => "email+password")

# rich metadata will be included automatically, but if you want to override:
Rollbar.scope(:person => {:id => "123"}).info("User logged in")
```

### Python

```python
# default level is 'error'
rollbar.report_message('Got an IOError in the main loop')

# logs at the 'warning' level
rollbar.report_message('Got an IOError in the main loop', 'warning')

# can also include the request object
rollbar.report_message('Got an IOError in the main loop', 'warning', request)

# or extra context
rollbar.report_message('Got an IOError in the main loop', 'warning', extra_data={'job_id': job_id})
```

### PHP

```php
<?php
// default level is 'error'
Rollbar::report_message('Could not connect to database');

// logs as the 'warning' level
Rollbar::report_message('Could not connect to Facebook API', 'warning');
```

### Javascript

```javascript
// log methods exist for each level
Rollbar.critical("Crash while processing payment");
Rollbar.warning("Facebook API unavailable");
Rollbar.info("User logged in");
Rollbar.debug("Cron job starting");

// can pass arbitrary params
Rollbar.info("User logged in", {loginType: "email+password"});

// rich metadata will be included automatically, but if you want to override:
Rollbar.scope({person: {id: "123"}}).info("User logged in");
```