<!-- source: https://docs.rollbar.com/docs/upgrading-to-v4.md -->

# Upgrading to v4

Types are good, M'key?

Rollbar SDK v4 incorporated a major refactor to add better typing and interoperability with the latest packages and standards in the PHP ecosystem that are not supported by PHP 8.2 onwards.

The main changes of v4 are:

* Supporting `psr/log` v3 and `monolog/monolog` v3.
* Eliminated deprecation warnings in PHP 8.2.

# Return value of the `Rollbar\Rollbar::log()` function

In v3, `Rollbar\Rollbar::log()` returned a `Rollbar\Response` object. In v4, `Rollbar\Rollbar::log()` returns `void` to comply with the `psr/log` interface.

If you need to access the response, use the `Rollbar\Rollbar::report()` method instead. It accepts the same arguments as `Rollbar\Rollbar::log()` but returns a `Rollbar\Response` object.

# Updated Interfaces

Rollbar PHP SDK users can implement several interfaces. We dramatically simplified their usage and made them less error-prone by setting return and argument types.

* `Rollbar\DataBuilderInterface`
* `Rollbar\FilterInterface`
* `Rollbar\ResponseHandlerInterface`
* `Rollbar\ScrubberInterface`
* `Rollbar\Senders\SenderInterface`
* `Rollbar\TransformerInterface`

If you have implemented any of these to customize the behavior of the library, you will need to update your implementation to match the new interface.

The interface `Rollbar\Truncation\IStrategy` was replaced with the updated `Rollbar\Truncation\StrategyInterface`. If you extended `Rollbar\Truncation\AbstractStrategy`, the interface name change is automatic. However, you may still need to update your class to match the updated interface.

The `Rollbar\Senders\SenderInterface` was updated in v4 to include the brand-new `requireAccessToken()` method. It returns a boolean indicating whether the sender requires an access token. This determines if the access token is required when configuring the Rollbar instance. If `false` is returned, the access token is not required. This is designed for senders that use an intermediate service to send data to Rollbar. (e.g., `AgentSender` etc.)

[block:callout]
{
  "type": "warning",
  "body": "Custom senders that don't require an access token must update the payload with the access token before sending it to Rollbar.",
  "title": "Note"
}
[/block]

# Class changes in `Rollbar\LevelFactory`

The `LevelFactory` class was changed in v4 to use static methods instead of instantiating an object. Because of this, the `LevelFactory::init()` method was replaced with `LevelFactory::getLevels()`, which returns an array of valid log levels.

`LevelFactory::fromName()` and `LevelFactory::isValidLevel()` were changed to static methods. This simplifies the use of the class.

```php
// Before
$error = Rollbar::logger()->getConfig()->getLevelFactory()->fromName('error');

// After
$error = LevelFactory::fromName('error');
```

The `Rollbar\Config::getLevelFactory()` method was removed.

The unused `$levelFactory` property was removed from the

* `Rollbar\DataBuilder`,
* `Rollbar\Config`, and
* `Rollbar\RollbarLogger`
  classes.

# The following items were removed by v4

* `Rollbar\Payload\Level::IGNORE` constant
* `Rollbar\Payload\Level::IGNORED` constant
* `Rollbar\Payload\Level::__callStatic()`
  * This means you can no longer call `Level::debug()` or `Level::info()`, etc. You must use the constants `Level::DEBUG` and `Level::INFO`, etc.
* `Rollbar\Rollbar::report_exception()`
  * use `Rollbar\Rollbar::log()` instead
* `Rollbar\Rollbar::report_message()`
  * use `Rollbar\Rollbar::log()` instead
* `Rollbar\Rollbar::report_fatal_error()`
  * use `Rollbar\Rollbar::log()` instead
* `Rollbar\Rollbar::report_php_error()`
  * use `Rollbar\Rollbar::log()` instead
* `Rollbar\Config::getAllowedCircularReferenceTypes()`
* `Rollbar\Config::getLevelFactory()`
* `Rollbar\Senders\AgentSender::toString()`
* `Rollbar\Senders\CurlSender::toString()`
* `Rollbar\Senders\FluentSender::toString()`