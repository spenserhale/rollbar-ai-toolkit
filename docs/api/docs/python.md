<!-- source: https://docs.rollbar.com/docs/python.md -->

# Python

Support Level: Supported

[pyrollbar](https://github.com/rollbar/pyrollbar) is a Python SDK for reporting exceptions, errors, and log messages to [Rollbar](https://rollbar.com).

## Quick start

Install using pip:

```bash
pip install rollbar
```

```python
import rollbar
# access_token, environment, code_version
rollbar.init('POST_SERVER_ITEM_ACCESS_TOKEN', 'production', code_version='COMMIT_SHA')  

try:
    main_app_loop()
except IOError:
    rollbar.report_message('Got an IOError in the main loop', 'warning')
except:
    # catch-all
    rollbar.report_exc_info()
    # equivalent to rollbar.report_exc_info(sys.exc_info())
```

## Configuration

### · [Django](https://docs.rollbar.com/docs/django)

### · [Celery](https://docs.rollbar.com/docs/celery)

### · [Pyramid](https://docs.rollbar.com/docs/pyramid)

### · [Flask](https://docs.rollbar.com/docs/flask)

### · [Bottle](https://docs.rollbar.com/docs/bottle)

### · [Twisted](https://docs.rollbar.com/docs/twisted)

### · [AWS Lambda](https://docs.rollbar.com/docs/python-aws-lambda)

### · [FastAPI](https://docs.rollbar.com/docs/fastapi)

### · [Starlette](https://docs.rollbar.com/docs/starlette)

### Other

For generic Python or a non-Django/non-Pyramid framework just initialize the Rollbar library with your access token and environment.

```python
rollbar.init('POST_SERVER_ITEM_ACCESS_TOKEN', 
                  environment='production', 
                 code_version='COMMIT_SHA', 
                 **other_config_params)
```

Other options can be passed as keyword arguments. See the reference below for all options.

### Command-line usage

pyrollbar comes with a command-line tool that can be used with other UNIX utilities to create an ad-hoc monitoring solution.

e.g. Report all 5xx haproxy requests as `warning`

```bash
tail -f /var/log/haproxy.log | awk '{print $11,$0}' | grep '^5' | awk '{$1="";print "warning",$0}' | rollbar -t POST_SERVER_ITEM_ACCESS_TOKEN -e production -v
```

e.g. Test an access token

```bash
rollbar -t POST_SERVER_ITEM_ACCESS_TOKEN -e test debug testing access token
```

#### Reference

```
$ rollbar --help
Usage: rollbar [options]

Options:
  --version             show program's version number and exit
  -h, --help            show this help message and exit
  -t ACCESS_TOKEN, --access_token=ACCESS_TOKEN
                        You project's access token from rollbar.com.
  -e ENVIRONMENT, --environment=ENVIRONMENT
                        The environment to report errors and messages to.
  -u ENDPOINT_URL, --url=ENDPOINT_URL
                        The Rollbar API endpoint url to send data to.
  -m HANDLER, --handler=HANDLER
                        The method in which to report errors.
  -v, --verbose         Print verbose output.
```

## Usage

The Django, Pyramid, Flask, and Bottle integrations will automatically report uncaught exceptions to Rollbar.

### Exceptions

To report a caught exception to Rollbar, use `rollbar.report_exc_info()`:

```python
try:
    do_something()
except:
    rollbar.report_exc_info(sys.exc_info())
    # or if you have a webob-like request object, pass that as well:
    # rollbar.report_exc_info(sys.exc_info(), request)
```

### Logging

You can also send any other log messages you want, using `rollbar.report_message()`:

```python
try:
    do_something()
except IOError:
    rollbar.report_message('Got an IOError while trying to do_something()', 'warning')
    # report_message() also accepts a request object:
    #rollbar.report_message('message here', 'warning', request)
```

### Ignoring items

To ignore an item and not send to Rollbar, add a payload handler. The payload handler will be called for each payload, and your custom logic can be applied to determine whether to send or ignore. To send, return the payload object. To ignore, return False.

Note: Payload handlers must be added after `Rollbar.init()`, as `init()` will reset the list of handlers.

Example:

```python
import rollbar
 
rollbar.init(ACCESS_TOKEN, 'production')
 
def ignore_handler(payload, **kw): # kw is currently unused
   if payload['data']['environment'] == 'test':
       return False
   else:
       return payload
 
rollbar.events.add_payload_handler(ignore_handler)
```

### Transforming the payload

To add, remove or modify data in the payload before sending, add a payload handler. The payload handler will be called for each payload, and any part of the payload can be modified before returning. Any changes to the payload must comply with the Rollbar API schema, or the payload will be rejected at the API.

Note: Payload handlers must be added after `Rollbar.init()`, as `init()` will reset the list of handlers.

Example:

```python
import rollbar
 
rollbar.init(ACCESS_TOKEN, 'production')
 
def payload_handler(payload, **kw): # kw is currently unused
   payload['data']['foo'] = 'bar' # Add new key/value to the payload
   return payload
 
rollbar.events.add_payload_handler(payload_handler)
```

### Custom object serialization with `__rollbar_repr__()`

By default, most objects are serialized using the builtin `repr()` function. However, if you would like to modify how an object is serialized for Rollbar you can add a `__rollbar_repr__()` method to the object which will be used to serialize the object in the report payload.

*Note: a `__rollbar_repr__()` method must return a `str` type, and is not passed any arguments.*

Example:

```python
class MyObject:
    name: str
    
    def __rollbar_repr__() -> str:
        return f"MyObject(name='{self.name}')"

```

### [UUIDs](https://docs.rollbar.com/docs/uuids)

The pyrollbar SDK supplies a [UUID](https://docs.rollbar.com/docs/uuids)  during the occurrence creation process in `report_message()` and `report_exc_info()` method calls of the [`__init__.py`](https://github.com/rollbar/pyrollbar/blob/master/rollbar/__init__.py) file. This UUID can be used to track customer issues, correlate exceptions to automated test sessions, and more.

> 📘 UUIDs
>
> To learn more about the UUID feature and its usage, visit [this guide](https://docs.rollbar.com/docs/uuids).

### Examples

Here's a full example, integrating into a simple Gevent app.

```python
"""
Sample Gevent application with Rollbar integration.
"""
import sys
import logging

from gevent.pywsgi import WSGIServer
import rollbar
import webob

# configure logging so that rollbar's log messages will appear
logging.basicConfig()

def application(environ, start_response):
    request = webob.Request(environ)
    status = '200 OK'
    headers = [('Content-Type', 'text/html')]
    start_response(status, headers)

    yield '<p>Hello world</p>'

    # extra fields we'd like to send along to rollbar (optional)
    extra_data = {'datacenter': 'us1', 'app' : {'version': '1.1'}}

    try:
        # will raise a NameError about 'bar' not being defined
        foo = bar
    except:
        # report full exception info
        rollbar.report_exc_info(sys.exc_info(), request, extra_data=extra_data)

        # and/or, just send a string message with a level
        rollbar.report_message("Here's a message", 'info', request, extra_data=extra_data)

        yield '<p>Caught an exception</p>'

# initialize rollbar with an access token and environment name
rollbar.init('POST_SERVER_ITEM_ACCESS_TOKEN', 'development')

# now start the wsgi server
WSGIServer(('', 8000), application).serve_forever()
```

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/pyrollbar/issues/new).