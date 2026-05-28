<!-- source: https://docs.rollbar.com/docs/aws-lambda.md -->

# AWS Lambda

Using rollbar.js with AWS Lambda

Rollbar provides a wrapper for your Lambda function. This wrapper works with both\
async and non-async function types. Simply pass your handler to `rollbar.lambdaHandler()`.

### Async Lambda Handler

```javascript
// require and initialize Rollbar
const Rollbar = require('rollbar');
const rollbar = new Rollbar({accessToken: 'server-access-token'});

exports.handler = rollbar.lambdaHandler(async (event, context) => {
  // log a message and send it to Rollbar
  rollbar.log('Hello, Lambda');
  return 'ok';
});
```

### Callback Lambda Handler

```javascript
// require and initialize Rollbar
const Rollbar = require('rollbar');
const rollbar = new Rollbar({accessToken: 'server_access_token'});

exports.handler = rollbar.lambdaHandler((event, context, callback) => {
  // log a message and send it to Rollbar
  rollbar.log('Hello, Lambda');
  callback(null, 'ok');
});
```

The `lambdaHandler` wrapper function takes one argument which is your lambda function and returns a semantically equivalent function with all of the details of interacting with Rollbar abstracted away. If you call your callback with an error, it will automatically be sent to Rollbar. Additionally, extra information will be added to the Rollbar item that is gathered from the Lambda environment. The `uncaughtException` event does not work in the Lambda environment, therefore this helper also wraps your code in a try/catch block, reports any uncaught exception if there is one, and then rethrows to match the normal behaviour. For example,

```javascript
exports.handler = rollbar.lambdaHandler((event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('Received event:', JSON.stringify(event, null, 2));
  var err = new Error('bork bork');
  callback(err, null);
});
```

is roughly equivalent to

```javascript
exports.handler = (event, context, callback) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('Received event:', JSON.stringify(event, null, 2));
    var err = new Error('bork bork');
    rollbar.error(err);
    rollbar.wait(function() {
      callback(err, null);
    });
  } catch (err) {
    rollbar.error(err);
    rollbar.wait(function() {
      throw err;
    });
  }
};
```

When using some frameworks. like Serverless for example, there may not be access to the Lambda handler function itself and therefore `rollbar.lambdaHandler` can't be used. To ensure errors are sent to Rollbar, wrap your worker code in a try/catch block, call `rollbar.error()` with caught errors, and call `rollbar.wait` before exiting your worker. This ensures that the API calls to Rollbar complete before the Lambda handler exits.

Currently, Rollbar.js only provides a callback version of `rollbar.wait`. To convert this to return a Promise:

```javascript
function wait() {
  return new Promise(resolve => {
    rollbar.wait(resolve);
  });
}
```

And now this can be called with await syntax before your worker exits:

```javascript
await wait();
```

There are often questions about the property `callbackWaitsForEmptyEventLoop`. The AWS docs on this value state:

> The default value is true. This property is useful only to modify the default behavior of the callback. By default, the callback will wait until the Node.js runtime event loop is empty before freezing the process and returning the results to the caller. You can set this property to false to request AWS Lambda to freeze the process soon after the callback is called, even if there are events in the event loop.

If you want to set this value to `false` for some reason, our handler will still work to report items to Rollbar by using the associated `wait` method before calling your callback. If we did not do this and you set the value to `false` it is possible for the process to get frozen before the network requests to Rollbar have completed. There are some suggestions to set this to `false` so that you do not pay for extra time spent if a rogue library keeps the event loop spinning. For that effect this is a strange band-aid and we don't recommend using this value for that purpose. Nonetheless, reports will be sent to Rollbar regardless of the value of this property provided you use our wrapper or you call `wait` yourself.

We provide the configuration option, `captureLambdaTimeouts` which defaults to `true` which installs a watchdog to report potential timeouts one second before it would occur based on the remaining time in the context. If you set this to `false` we will not install the timer. If you pass a second argument to `lambdaHandler` we will invoke that second argument as a function with the event, context, and callback that the original function is called with. In this case we will not automatically report anything to Rollbar because this second function is where you have full control over what you want to do in the case of a timeout. Note that this method of reporting timeouts is not perfect for two reasons. First, if your function finishes within one second of the timeout time then the timeout report will be a false positive. Second, the report might not send within the one second time window before the timeout occurs. The most fool-proof way to handle timeouts is to use a step function with the AWS infrastructure to respond to timeouts by calling a separate lambda function which can report the problem. However, if you want to return a custom response to the invoker of the lambda function before the timeout occurs, you can use the second argument to `lambdaHandler` to call the callback with that error.

> 📘
>
> For more information on rollbar.js, please see the docs [here](https://docs.rollbar.com/v1.0.0/docs/javascript).