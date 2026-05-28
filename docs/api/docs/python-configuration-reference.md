<!-- source: https://docs.rollbar.com/docs/python-configuration-reference.md -->

# Configuration Reference

This is the configuration reference table for the pyrollbar SDK. The source code itself can be found on the [Github repository](https://github.com/rollbar/pyrollbar).

[block:parameters]
{
  "data": {
    "h-0": "Option",
    "h-1": "Description",
    "0-0": "`access_token`",
    "0-1": "Access token from your Rollbar project",
    "1-0": "`agent.log_file`",
    "1-1": "If `handler` is `agent`, the path to the log file. Filename must end in `.rollbar`\n\nDefault: `log.rollbar",
    "2-0": "`branch`",
    "2-1": "Name of the checked-out branch.\n\nDefault: `None`",
    "3-0": "`code_version`",
    "3-1": "A string describing the current code revision/version (i.e. a git sha). Max 40 characters.\n\nDefault: `None`",
    "4-0": "`enabled`",
    "4-1": "Controls whether or not Rollbar will report any data\n\nDefault: `True`",
    "5-0": "`endpoint`",
    "5-1": "URL items are posted to.\n\nDefault: `https://api.rollbar.com/api/1/`",
    "6-0": "`environment`",
    "6-1": "Environment name. Any string up to 255 chars is OK. For best results, use `production` for your production environment.",
    "7-0": "`exception_level_filters`",
    "7-1": "List of tuples in the form `(class, level)` where `class` is an Exception class you want to always filter to the respective `level`. Any subclasses of the given `class` will also be matched.\n\nValid levels: `'critical'`, `'error'`, `'warning'`, `'info'`, `'debug'` and `'ignored'`.\n\nUse `'ignored'` if you want an Exception (sub)class to never be reported to Rollbar.\n\nAny exceptions not found in this configuration setting will default to `'error'`.\n\nDjango `settings.py` example (and Django default):\n\n```python\nfrom django.http import Http404\n\nROLLBAR = {\n    ...\n    'exception_level_filters': [\n        (Http404, 'warning')\n    ]\n}\n```\n\nIn a Pyramid `ini` file, define each tuple as an individual whitespace delimited line, for example:\n\n```\nrollbar.exception_level_filters =\n    pyramid.exceptions.ConfigurationError critical\n    #...\n```",
    "8-0": "`handler`",
    "8-1": "The method for reporting rollbar items to api.rollbar.com\n\nOne of:\n\n  - default -- uses default handler (`thread` for sync reporting and `async` for async reporting)\n  - blocking -- runs in main thread\n  - thread -- spawns a new thread\n  - async -- uses default (httpx) async handler to send the payload\n  - agent -- writes messages to a log file for consumption by rollbar-agent\n  - httpx -- uses the HTTPX async library to send the payload\n  - tornado -- uses the Tornado async library to send the payload\n  - gae -- uses the Google AppEngineFetch library to send the payload\n  - twisted -- uses the Twisted event-driven networking library to send the payload\n\nDefault: `default`",
    "9-0": "`locals`",
    "9-1": "Configuration for collecting local variables.  A dictionary:\n*  `enabled`\n   * If `True`, variable values will be collected for stack traces. Default `True`.\n* `safe_repr`\n   * If `True`, non-built-in objects will be serialized into just their class name. If `False` `repr(obj)` will be used for serialization. Default `True`.\n* `sizes`\n   * Dictionary of configuration describing the max size to repr() for each type.\n      * `maxdict`: Default 10\n      * `maxarray`: Default 10\n      * `maxlist`: Default 10\n      * `maxtuple`: Default 10\n      * `maxset`: Default 10\n      * `maxfrozenset`: Default 10\n      * `maxdeque`: Default 10\n      * `maxstring`: Default 100\n      * `maxlong`: Default 40\n      * `maxother`: Default 100\n* `safelisted_types`\n   * A list of `type` objects, (e.g. `type(my_class_instance)` or `MyClass`) that will be serialized using\n    `repr()`. Default `[]`\n* `scrub_varargs`\n  * If `True`, variable argument values will be scrubbed. Default `True`.",
    "10-0": "`root`",
    "10-1": "Absolute path to the root of your application, not including the final `/`.",
    "11-0": "`scrub_fields`",
    "11-1": "List of sensitive field names to scrub out of request params and locals. Values will be replaced with asterisks. If overriding, make sure to list all fields you want to scrub, not just fields you want to add to the default. Param names are converted to lowercase before comparing against the scrub list.\n\nDefault: `['pw', 'passwd', 'password', 'secret', 'confirm_password', 'confirmPassword', 'password_confirmation', 'passwordConfirmation', 'access_token', 'accessToken', 'auth', 'authentication', 'authorization']`",
    "12-0": "`timeout`",
    "12-1": "Timeout for any HTTP requests made to the Rollbar API (in seconds).\n\nDefault: `3`",
    "13-0": "`allow_logging_basic_config`",
    "13-1": "When True, `logging.basicConfig()` will be called to set up the logging system. Set to False to skip this call. If using Flask, you'll want to set to `False`. If using Pyramid or Django, `True` should be fine.\n\nDefault: `True`",
    "14-0": "`url_fields`",
    "14-1": "List of fields treated as URLs and scrubbed. \n\nDefault `['url', 'link', 'href']`",
    "15-0": "`verify_https`",
    "15-1": "If `True`, network requests will fail unless encountering a valid certificate. Default `True`.",
    "16-0": "`shortener_keys`",
    "16-1": "A list of key prefixes (as tuple) to apply our shortener transform to. Added to built-in list:\n\n```\n[\n    ('request', 'POST'),\n    ('request', 'json'),\n    ('body', 'request', 'POST'),\n    ('body', 'request', 'json')\n]\n```\n\nIf `locals.enabled` is `True`, extra keys are also automatically added:\n\n```\n[\n    ('body', 'trace', 'frames', '*', 'code'),\n    ('body', 'trace', 'frames', '*', 'args', '*'),\n    ('body', 'trace', 'frames', '*', 'kwargs', '*'),\n    ('body', 'trace', 'frames', '*', 'locals', '*')\n]\n```",
    "17-0": "`suppress_reinit_warning`",
    "17-1": "If `True`, suppresses the warning normally shown when `rollbar.init()` is called multiple times. \n\nDefault: `False`.",
    "18-0": "`capture_ip`",
    "18-1": "If equal to `True`, we will attempt to capture the full client IP address from a request.\n\nIf equal to the string `anonymize`, we will capture the client IP address, but then semi-anonymize it by masking out the least significant bits.\n\nIf equal to `False`, we will not capture the client IP address from a request.\n\nDefault: `True`",
    "19-0": "`capture_email`",
    "19-1": "If set to `True`, we will attempt to enrich person data with an email address if available.\n\nDefault: `False`",
    "20-0": "`capture_username`",
    "20-1": "If set to `True`, we will attempt to enrich person data with a username if available.\n\nDefault: `False`",
    "21-0": "`log_all_rate_limited_items`",
    "21-1": "Rollbar will log a warning if you have crossed your limit for logged items.\n\nDefault: `True`",
    "22-0": "`http_proxy`",
    "22-1": "The HTTP proxy host and optional port e.g. `'myhttpproxy.com:5000'`. This should not include the URL scheme. If set all reports to the Rollbar service will be sent through the proxy.\n\nDefault: `None`",
    "23-0": "`http_proxy_user`",
    "23-1": "The basic auth user to use with the HTTP proxy. \n\nDefault: `None`",
    "24-0": "`http_proxy_password`",
    "24-1": "The basic auth password to use with the HTTP proxy. Basic auth will only work if both `http_proxy_user` and `http_proxy_password` are present.\n\nDefault: `None`",
    "25-0": "`include_request_body`",
    "25-1": "Set to `True` to add the raw HTTP request body to the error report. Currently, works with Django, Starlette, and FastAPI.\n\nDefault: `False`",
    "26-0": "`request_pool_connections`",
    "26-1": "If not `None`, used by requests to set the number of urllib3 connection pools to cache.\n\nDefault: `None`",
    "27-0": "`request_pool_maxsize`",
    "27-1": "If not `None`, used by requests to set the maximum number of connections to save in the pool.\n\nDefault: `None`",
    "28-1": "If not `None`, used by requests to set the maximum number of retries each connection should attempt.\n\nDefault: `None`",
    "28-0": "`request_max_retries`"
  },
  "cols": 2,
  "rows": 29
}
[/block]

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/pyrollbar/issues/new).