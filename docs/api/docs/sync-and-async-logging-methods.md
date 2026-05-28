<!-- source: https://docs.rollbar.com/docs/sync-and-async-logging-methods.md -->

# Sync and Async Logging Methods

Starting in version 2.0.0\*, Rollbar log statements in your code can either be performed via a Platform Event, a Future, or a synchronous callout. The Platform Event option is the default and is usually recommended.

* Earlier versions only allow synchronous callouts.

By using Platform Events, Rollbar log statements can be used virtually anywhere in your code where DML would be allowed. They are also configured to be delivered immediately, regardless of the state of any pending DML.

The Platform Event method is the default and requires no extra parameters:

```java
rollbar.Rollbar.log(‘info’, ‘hello’);
rollbar.Rollbar.log(exc);
```

To send using a Future or synchronous callout, specify the send method as the last argument:

```java
rollbar.Rollbar.log('info', 'hello', rollbar.SendMethod.FUTURE);
rollbar.Rollbar.log(exc, rollbar.SendMethod.FUTURE);

rollbar.Rollbar.log('info', 'hello', rollbar.SendMethod.SYNC);
rollbar.Rollbar.log(exc, rollbar.SendMethod.SYNC);
```

The synchronous method returns a HttpResponse:

```java
HttpResponse resp = rollbar.Rollbar.log('info', 'hello', rollbar.SendMethod.SYNC);
```

While the Platform Event method is the default, the send method can also be specified:

```java
rollbar.Rollbar.log('info', 'hello', rollbar.SendMethod.EVENT);
```