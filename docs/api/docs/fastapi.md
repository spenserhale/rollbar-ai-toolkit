<!-- source: https://docs.rollbar.com/docs/fastapi.md -->

# FastAPI

Support Level: Supported

There are several options for installing Rollbar in FastAPI applications.

The following examples use the `async` handler that requires the HTTPX package to be installed. It's okay if you don't want to use/install it. In this case, a default sync handler is used.

You may also want to install the `python-multipart` package that is required for parsing request body content (this is the FastAPI requirement).

Run the examples (saved as a `main.py` file) via ASGI server (e.g. Uvicorn, Hypercorn or Daphne):

```shell
uvicorn main:app
```

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

Check out FastAPI examples in our [GitHub repository](https://github.com/rollbar/pyrollbar/tree/master/rollbar/examples/fastapi).

## Integrate via middleware

It is also possible to report errors via middleware. This integration should work with all versions of FastAPI.\
Please note that FastAPI doesn't allow middleware to collect a streaming content like a request body.

```python
import fastapi
import rollbar
from rollbar.contrib.fastapi import ReporterMiddleware as RollbarMiddleware

# Initialize Rollbar SDK with your server-side access token
rollbar.init(
  'POST_SERVER_ITEM_ACCESS_TOKEN',
  environment='production',
  handler='async',
)

# Integrate Rollbar with FastAPI application
app = fastapi.FastAPI()
app.add_middleware(RollbarMiddleware)  # should be added as the first middleware

# Add an /error endpoint to cause an uncaught exception
async def localfunc(arg1, arg2, arg3):
    # Both local variables and function arguments will be sent to Rollbar
    # and available in the UI
    localvar = 'local variable'
    cause_error_with_local_variables

@app.get('/error')
async def read_error():
    await localfunc('func_arg1', 'func_arg2', 1)
    return {'result': "You shouldn't be seeing this"}
```

## Integrate via FastAPI Router

Integration via the router allows to send payload with more data (e.g. a request body content).\
This is recommended option for reporting uncaught errors. It requires FastAPI version 0.41.0 or later.

```python
import fastapi
import rollbar
from rollbar.contrib.fastapi import add_to as rollbar_add_to

# Initialize Rollbar SDK with your server-side access token
rollbar.init(
  'POST_SERVER_ITEM_ACCESS_TOKEN',
  environment='production',
  handler='async',
  include_request_body=True
)

# Integrate Rollbar with FastAPI application before adding routes to the app
app = fastapi.FastAPI()
rollbar_add_to(app)

# Alternatively, you can integrate with any APIRouter
# router = fastapi.APIRouter()
# rollbar_add_to(router)

# Add an /error endpoint to cause an uncaught exception
async def localfunc(arg1, arg2, arg3):
    # Both local variables and function arguments will be sent to Rollbar
    # and available in the UI
    localvar = 'local variable'
    cause_error_with_local_variables

@app.get('/error')
async def read_error():
    await localfunc('func_arg1', 'func_arg2', 1)
    return {'result': "You shouldn't be seeing this"}
```

**NOTE:** If you are using multiple routers, you will need to call `rollbar_add_to(router)` directly after creating each new router. This needs to be done before adding routes to the router. This will also replace any custom `APIRouter.route_class`. Because of this, it is recommended that you use the middleware integration for most cases.

NOTE: By default, this integration allows to report some user errors (e.g. `RequestValidationError` or` HTTPException`). You can ignore the reporting any errors by using [payload handler](https://docs.rollbar.com/docs/python#ignoring-items) feature.

## Integrate with `logging` handler

FastAPI `LOGGING` handler reports log entries. For example errors that happen outside of the router/middleware, such as in Celery job queue tasks that run in the background separate from web requests.\
Note that using `LoggerMiddleware` is optional, however it allows adding a request object to the payload. If you would like to use it in Python 3.6, you must to install the `aiocontextvars` package. For later versions of Python (3.7+), this package is not necessary.

```python
import logging

import fastapi
import rollbar

from rollbar.contrib.fastapi import LoggerMiddleware
from rollbar.logger import RollbarHandler

# Initialize Rollbar SDK with your server-side access token
rollbar.init(
    'ACCESS_TOKEN',
    environment='staging',
    handler='async',
)

# Set root logger to log DEBUG and above
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Report ERROR and above to Rollbar
rollbar_handler = RollbarHandler()
rollbar_handler.setLevel(logging.ERROR)

# Attach Rollbar handler to the root logger
logger.addHandler(rollbar_handler)

# Integrate Rollbar with FastAPI application to add request objects to the payload
app = fastapi.FastAPI()
app.add_middleware(LoggerMiddleware)  # should be added as the last middleware

# Add an endpoint
@app.get('/')
async def read_root():
    # Report log entries
    logger.critical('Critical message sent to Rollbar')
    logger.error('Error message sent to Rollbar')

    # Ignore log entries
    logger.warning('Warning message is not sent to Rollbar')
    logger.info('Info message is not sent to Rollbar')
    logger.debug('Debug message is not sent to Rollbar')

    return {'hello': 'world'}
```

## Global access for FastAPI request objects

FastAPI doesn't provide global access for request objects. However, if you are using any of the Rollbar integrations described above, you can access it via `rollbar.get_request()`.

The example below shows integration via `LoggerMiddleware` without reporting errors to Rollbar. This is minimal integration to have an access to request objects. Remember that you don't need to add `LoggerMiddleware` to your application if you already have integration enabled for catching errors by using other options described above.

If you would like to use this feature in Python 3.6, you must to install the `aiocontextvars` package. For later versions of Python (3.7+), this package is not necessary.

```python
import fastapi
import rollbar
from rollbar.contrib.fastapi import LoggerMiddleware

# Integrate Rollbar with FastAPI application
app = fastapi.FastAPI()
app.add_middleware(LoggerMiddleware)  # should be added as the last middleware

async def get_user_agent():
    # Global access to the current request object
    request = rollbar.get_request()

    user_agent = request.headers['User-Agent']
    return user_agent

@app.get('/')
async def read_root():
    user_agent = await get_user_agent()
    return {'user-agent': user_agent}
```

## Report a message

If you would like to report a message to Rollbar, you can use the function `rollbar.report_message()` or delegate awaitable task to your event loop:

```python
import fastapi
import rollbar
from rollbar.lib._async import report_message

# Initialize Rollbar SDK with your server-side access token
rollbar.init(
    'ACCESS_TOKEN',
    environment='staging',
)

app = fastapi.FastAPI()

@app.get('/)
async def read_root():
    await report_message('This is a message')
    return {'hello': 'world'}
```

This feature requires the HTTPX package to be installed.

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/pyrollbar/issues/new).