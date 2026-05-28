<!-- source: https://docs.rollbar.com/docs/starlette.md -->

# Starlette

Support Level: Community

There are several options for installing Rollbar in Starlette applications.

The following examples use the `async` handler that requires the HTTPX package to be installed. It's okay if you don't want to use/install it. In this case, a default sync handler is used.

You may also want to install the `python-multipart` package that is required for parsing request body content (this is the Starlette requirement).

Run the examples (saved as a `main.py` file) via ASGI server (e.g. Uvicorn, Hypercorn or Daphne):

```shell
uvicorn main:app
```

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

Check out Starlette examples in our [GitHub repository](https://github.com/rollbar/pyrollbar/tree/master/rollbar/examples/starlette).

## Integrate via middleware

```python
import rollbar
from rollbar.contrib.starlette import ReporterMiddleware as RollbarMiddleware
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse

# Initialize Rollbar SDK with your server-side access token
rollbar.init(
    'ACCESS_TOKEN',
    environment='staging',
    handler='async',
)

# Integrate Rollbar with Starlette application
app = Starlette()
app.add_middleware(RollbarMiddleware)  # should be added as the first middleware

# Add an /error endpoint to cause an uncaught exception
async def localfunc(arg1, arg2, arg3):
    # Both local variables and function arguments will be sent to Rollbar
    # and available in the UI
    localvar = 'local variable'
    cause_error_with_local_variables

@app.route('/error')
async def error(request):
    await localfunc('func_arg1', 'func_arg2', 1)
    return PlainTextResponse("You shouldn't be seeing this")
```

Please note that Starlette doesn't allow middleware to collect a streaming content like a request body.

## Integrate with `logging` handler

Starlette `LOGGING` handler reports log entries. For example errors that happen outside of the router/middleware, such as in Celery job queue tasks that run in the background separate from web requests.
Note that using `LoggerMiddleware` is optional, however it allows adding a request object to the payload. If you would like to use it in Python 3.6, you must to install the `aiocontextvars` package. For later versions of Python (3.7+), this package is not necessary.

```python
import logging

import rollbar

from rollbar.contrib.starlette import LoggerMiddleware
from rollbar.logger import RollbarHandler
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse

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

# Integrate Rollbar with Starlette application to add request objects to the payload
app = Starlette()
app.add_middleware(LoggerMiddleware)  # should be added as the last middleware

# Add an endpoint
@app.route('/')
async def root(request):
    # Report log entries
    logger.critical('Critical message sent to Rollbar')
    logger.error('Error message sent to Rollbar')

    # Ignore log entries
    logger.warning('Warning message is not sent to Rollbar')
    logger.info('Info message is not sent to Rollbar')
    logger.debug('Debug message is not sent to Rollbar')

    return PlainTextResponse('hello world')
```

## Global access for Starlette request objects

Starlette doesn't provide global access for request objects. However, if you are using any of the Rollbar integrations described above, you can access it via `rollbar.get_request()`.

The example below shows integration via `LoggerMiddleware` without reporting errors to Rollbar. This is minimal integration to have an access to request objects. Remember that you don't need to add `LoggerMiddleware` to your application if you already have integration enabled for catching errors by using other options described above.

If you would like to use this feature in Python 3.6, you must to install the `aiocontextvars` package. For later versions of Python (3.7+), this package is not necessary.

```python
import rollbar
from rollbar.contrib.starlette import LoggerMiddleware
from starlette.applications import Starlette
from starlette.responses import JSONResponse

# Integrate Rollbar with Starlette application
app = Starlette()
app.add_middleware(LoggerMiddleware)  # should be added as the last middleware

async def get_user_agent():
    # Global access to the current request object
    request = rollbar.get_request()

    user_agent = request.headers['User-Agent']
    return user_agent

@app.route('/')
async def root(request):
    user_agent = await get_user_agent()
    return JSONResponse({'user-agent': user_agent})
```

## Report a message

If you would like to report a message to Rollbar, you can use the function `rollbar.report_message()` or delegate awaitable task to your event loop:

```python
import rollbar
from rollbar.lib._async import report_message
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse

# Initialize Rollbar SDK with your server-side access token
rollbar.init(
    'ACCESS_TOKEN',
    environment='staging',
)

app = Starlette()

@app.route('/')
async def root(request):
    await report_message('This is a message')
    return PlainTextResponse('hello world')
```

This feature requires the HTTPX package to be installed.