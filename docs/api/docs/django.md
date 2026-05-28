<!-- source: https://docs.rollbar.com/docs/django.md -->

# Django

How to setup pyrollbar with Django | Support Level: Supported

### Django

There are two options for installing the Rollbar middleware. Both options
require modifying your `settings.py` file.

The first option is to use
`'rollbar.contrib.django.middleware.RollbarNotifierMiddleware'` which will
report all exceptions to Rollbar including 404s. This middlware should be
placed as the last item in your middleware list which is:

* `MIDDLEWARE_CLASSES` in Django 1.9 and earlier:

  ```python
  MIDDLEWARE_CLASSES = [
      # ... other middleware classes ...
      'rollbar.contrib.django.middleware.RollbarNotifierMiddleware',
  ]
  ```

* `MIDDLEWARE` in Django 1.10 and up:

  ```python
  MIDDLEWARE = [
      # ... other middleware classes ...
      'rollbar.contrib.django.middleware.RollbarNotifierMiddleware',
  ]
  ```

The other option is to use the two separate middlewares:

* `'rollbar.contrib.django.middleware.RollbarNotifierMiddlewareExcluding404'`

* `'rollbar.contrib.django.middleware.RollbarNotifierMiddlewareOnly404'`

The `Excluding404` middleware should be placed as the last item in your middleware
list, and the `Only404` middleware should be placed as the first item in your
middleware list. This allows 404s to be processed by your other middlewares
before sendind an item to Rollbar. Therefore if you handle the 404 differently
in a way that returns a response early you won't end up with a Rollbar item.

Regardless of which method you use, you also should add a section to `settings.py`
with configuration data such as:

```python
ROLLBAR = {
    'access_token': 'POST_SERVER_ITEM_ACCESS_TOKEN',
    'environment': 'development' if DEBUG else 'production',
    'branch': 'master',
    'root': '/absolute/path/to/code/root',
}
```

Additionally, you can use the key `'ignorable_404_urls'` to set an iterable of regular expression
patterns to use to determine whether a 404 exception should be ignored based
on the full url path for the request. For example,

```python
import re
ROLLBAR = {
    'access_token': 'POST_SERVER_ITEM_ACCESS_TOKEN',
    'environment': 'development' if DEBUG else 'production',
    'branch': 'master',
    'root': '/absolute/path/to/code/root',
    'ignorable_404_urls': (
        re.compile('/index\.php'),
        re.compile('/foobar'),
    ),
}
```

If you're using Django REST Framework and would like to have parsed POST variables placed in your output for exception handling, then add these configuration variables in `settings.py`:

```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'rollbar.contrib.django_rest_framework.post_exception_handler'
}
```

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

Check out the [Django example](https://github.com/rollbar/pyrollbar/tree/master/rollbar/examples/django).

If you'd like to be able to use a Django `LOGGING` handler that could catch errors that happen outside of the middleware and ship them to Rollbar, such as in celery job queue tasks that run in the background separate from web requests, do the following:

Add this to the `handlers` key:

```
    'rollbar': {
        'filters': ['require_debug_false'],
        'access_token': 'POST_SERVER_ITEM_ACCESS_TOKEN',
        'environment': 'production',
        'class': 'rollbar.logger.RollbarHandler'
    },
```

Then add the handler to the `loggers` key values where you want it to fire off.

```
    'myappwithtasks': {
        'handlers': ['console', 'logfile', 'rollbar'],
        'level': 'DEBUG',
        'propagate': True,
    },
```

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/pyrollbar/issues/new).