<!-- source: https://docs.rollbar.com/docs/monolog.md -->

# Monolog

How to use rollbar-php with Monolog

### Monolog 1.x

Here is an example of how to use Rollbar as a handler for Monolog 1.x:

```php
<?php

Rollbar::init($config);
$logger = new Logger('ExampleMonologLogger');
$logger->pushHandler(new PsrHandler(Rollbar::logger()));
$logger->error(new \Exception("Example exception logged by Monolog."));
```

You can see a full example here: <https://github.com/rollbar/rollbar-php-examples/tree/master/monolog>

### Monolog 2.x

For Monolog 2, there is a dedicated handler included in the Monolog package: <https://github.com/Seldaek/monolog/blob/master/src/Monolog/Handler/RollbarHandler.php>

```php
<?php
use Monolog\Handler\RollbarHandler;

Rollbar::init($config);
$log = new Logger('general');
$log->pushHandler(new RollbarHandler(Rollbar::logger()), Logger::DEBUG);
$log->error('Test');
```

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-php, please see the docs [here](https://docs.rollbar.com/docs/php)."
}
[/block]