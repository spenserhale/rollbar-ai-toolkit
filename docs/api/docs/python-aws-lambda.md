<!-- source: https://docs.rollbar.com/docs/python-aws-lambda.md -->

# AWS Lambda

How to setup pyrollbar with AWS Lambda

### AWS Lambda

The biggest issue with the Lambda execution environment is that as soon as you return from your handler function, any work executing in other threads will stop executing as the process is frozen. This is true also of any child processes that one may spawn. Furthermore, the Lambda environment implements multithreading via a hypervisor on a single CPU core. Therefore, using separate threads to do additional work will not necessarily lead to better performance.

In order to ensure that the Rollbar library works correctly, meaning that items are transmitted to the Rollbar API, one must not return from the main handler function before all of this work completes. In order to ensure this, one can either use the `blocking` handler by specifying this value in the configuration,

```python
rollbar.init(token, environment='production', handler='blocking')
```

or use the Rollbar function wait to delay the return from your function until all Rollbar threads have finished. Note that we use threads for the handler if otherwise unspecified, therefore you must use wait if you do not set the handler.

`wait` is a function which takes an optional function as an argument. It waits for all currently running Rollbar created threads to stop processing, meaning it waits for any items to be sent over the network, then it returns the result of calling the function passed as an argument or `None` if no function was given. Hence, one can use it via

```python
def lambda_handler(event, context):
    try:
        result = ...
        return rollbar.wait(lambda: result)
    except:
        rollbar.report_exc_info()
        rollbar.wait()
        raise
```

We provide a decorator for your handler functions which takes care of calling wait properly as well as catching any exceptions, namely `rollbar.lambda_function`:

```python
import os
import rollbar

token = os.getenv('ROLLBAR_KEY', 'missing_api_key')
rollbar.init(token, 'production')

@rollbar.lambda_function
def lambda_handler(event, context):
    return some_other_function('Hello from Lambda')

## Help / Support

If you run into any issues, please email us at [support@rollbar.com](mailto:support@rollbar.com)

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/pyrollbar/issues/new).
```