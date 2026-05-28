<!-- source: https://docs.rollbar.com/docs/laravel.md -->

# Laravel

Rollbar SDK for Laravel | Support Level: Supported

Rollbar error monitoring integration for Laravel projects. This library adds a listener to Laravel's logging component. Laravel's session information will be sent into Rollbar, as well as some other helpful information such as `environment`, `server`, and `session`.

## Installation

### Laravel 6 through 10

1. Install using composer:

```php
composer require rollbar/rollbar-laravel
```

2. Add Project Access Token `post_server_item` from `Rollbar.com → Settings → Project Access Tokens` to `.env`:

```php
ROLLBAR_TOKEN={{YOUR_POST_SERVER_ITEM_TOKEN}}
```

3. Add the service provider to the `'providers'` array in `config/app.php`:

```php
Rollbar\Laravel\RollbarServiceProvider::class,
```

3. In `config/logging.php`, add the `rollbar` logging channel by adding the following under the `channels` key:

```php
    'rollbar' => [
        'driver' => 'monolog',
        'handler' => \Rollbar\Laravel\MonologHandler::class,
        'access_token' => env('ROLLBAR_TOKEN'),
        'level' => 'debug',
    ],
```

4. Also in config/logging.php, either set rollbar as the default log channel by changing the value of the default key or add rollbar to the `stack` channel:

```php PHP
'stack' => [
            'driver' => 'stack',
            'channels' => ['rollbar','single'],
            'ignore_exceptions' => false,
        ],
```

5. Send a test message

```php PHP
\Log::debug('Test debug message');
```

To the above array you can add any other Rollbar configuration options you would normally use in the [Rollbar PHP SDK](https://docs.rollbar.com/docs/php#section-configuration).

For example, to associate an error with the user that is currently logged in, add the configuration option `'person_fn'` and set it to `'Auth::user'`:

```php
        'rollbar' => [
            // ... rest of current config
            'person_fn' => 'Auth::user',
            'capture_email' => true,            //optional
            'capture_username' => true     //optional
        ],
```

### Laravel 5.6 to 5.8

1. Install using composer:

```
composer require rollbar/rollbar-laravel 4.*
```

2. Add Project Access Token `post_server_item` from `Rollbar.com → Settings → Project Access Tokens` to `.env`:

```
ROLLBAR_TOKEN={{YOUR_POST_SERVER_ITEM_TOKEN}}
```

3. In `config/logging.php`, add the `rollbar` logging channel by adding the following under the `channels` key:

```php
    'rollbar' => [
        'driver' => 'monolog',
        'handler' => \Rollbar\Laravel\MonologHandler::class,
        'access_token' => env('ROLLBAR_TOKEN'),
        'level' => 'debug',
    ],
```

To the above array you can add any other Rollbar configuration options you would normally use in the [Rollbar PHP SDK](https://docs.rollbar.com/docs/php#section-configuration).

For example, to associate an error with the user that is currently logged in, add the configuration option `'person_fn'` and set it to `'Auth::user'`:

```php
        'rollbar' => [
            // ... rest of current config
            'person_fn' => 'Auth::user',
            'capture_email' => true,            //optional
            'capture_username' => true     //optional
        ],
```

4. Also in `config/logging.php`, either set `rollbar` as the default log channel by changing the value of the `default` key or add `rollbar` to the `stack` channel:

```php
<?php
       'stack' => [
            'driver' => 'stack',
            'channels' => ['rollbar','single'],
        ],
```

### Laravel 5.5 and lower

1. Install using composer:

```
composer require rollbar/rollbar-laravel 2.*
```

2. Add Project Access Token `post_server_item` from `Rollbar.com → Settings → Project Access Tokens` to `.env`:

```
ROLLBAR_TOKEN={{YOUR_POST_SERVER_ITEM_TOKEN}}
```

### Send an Error and a Message

Add the following code to a file or function and execute to send an error message:

```Text PHP

 use Rollbar\Rollbar;
 use Rollbar\Payload\Level;
    
// installs global error and exception handlers
Rollbar::init(
    array(
        'access_token' => ROLLBAR_TEST_TOKEN,
        'environment' => 'production',
        'code_version' => '1.0.0'
    )
);
    
try {
    throw new \Exception('test exception');
} catch (\Exception $e) {
    Rollbar::log(Level::ERROR, $e);
}

// Message at level 'info'
Rollbar::log(Level::INFO, 'testing info level');

// With extra custom data (3rd arg)
Rollbar::log(
    Level::INFO,
    'testing extra data',
    array("some_key" => "some value") // key-value additional data
);
        
// If you want to check if logging with Rollbar was successful
$response = Rollbar::log(Level::INFO, 'testing wasSuccessful()');
if (!$response->wasSuccessful()) {
    throw new \Exception('logging with Rollbar failed');
}

// raises an E_NOTICE which will *not* be reported by the error handler
$foo = $bar;

// will be reported by the exception handler
throw new \Exception('testing exception handler');
```

## Usage

This package will automatically send to Rollbar every logged message whose level is at or higher than the `'level'` you have configured.

### Logging a Specific Message

You can log your own messages anywhere in your app. For example, to log a `debug` message:

```php
\Log::debug('Here is some debug information');
```

### Adding Context Information

You can pass user information as context like this:

```php
\Log::error('Something went wrong', [
    'person' => ['id' => (string) 123, 'username' => 'John Doe', 'email' => 'john@doe.com']
]);
```

Or pass some extra information:

```php
\Log::warning('Something went wrong', [
    'download_size' => 3432425235
]);
```

### Exception Logging

#### Laravel 5.6 and up

For Laravel 5.6, all errors which are normally handled by `\App\Exceptions\Handler` are going to be reported to Rollbar by default.

#### Laravel 5.5 and lower

*NOTE*: Fatal exceptions will always be sent to Rollbar.

Any exceptions that are not listed as `$dontReport` in your `app/Exceptions/Handler.php` or its parent will be sent to Rollbar automatically.

If you wish to override this to do more Rollbar reporting, you may do so using the `Log` facade in your error handler in `app/Exceptions/Handler.php`. For example, to log *every* exception add the following:

```php
<?php
public function report(Exception $exception)
{
    \Log::error($exception);
    return parent::report($exception);
}
```

#### Laravel 4

For Laravel 4 installations, this is located in `app/start/global.php`:

```php
<?php
App::error(function(Exception $exception, $code)
{
    Log::error($exception);
});
```

## Configuration

Setting up `ROLLBAR_TOKEN` in `.env` should be enough for basic configuration.

### Laravel 5.6 and up

This package supports configuration through the services configuration file located in `config/logging.php`. All rollbar configuration variables will be directly passed to Rollbar:

```php
    'rollbar' => [
        'driver' => 'monolog',
        'handler' => \Rollbar\Laravel\MonologHandler::class,
        'level' => 'info',
        'access_token' => env('ROLLBAR_TOKEN'),
        'environment' => 'special-environment'
    ],
```

The `level` setting defines the minimum log level at which log messages are sent to Rollbar. If not specified, the default is `debug`. For development, you could set this either to `debug` to send `all` log messages or to `none` to send no messages at all. For production, you could set this to `error` so that all `info` and `debug` messages are ignored.

### Laravel 5.5 and lower

This package supports configuration through the services configuration file located in `config/services.php`. All rollbar configuration variables will be directly passed to Rollbar:

```php
<?php
'rollbar' => [
    'access_token' => env('ROLLBAR_TOKEN'),
    'level' => env('ROLLBAR_LEVEL'),
],
```

### Conditional loading

If you wish to load the SDK conditionally:

1. Add the `dont-discover` clause in your app's `composer.json`:

```json
    "extra": {
        "laravel": {
            "dont-discover": [
                "rollbar/rollbar-laravel"
            ]
        }
    },
```

2. Instead of adding the service provider in the `providers` array in `config/app.php` as displayed above, load it in your `AppServiceProvider`:

```php
class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        if ($this->app->environment(['staging', 'production'])) {
             $this->app->register(\Rollbar\Laravel\RollbarServiceProvider::class);
        }
    }
}
```

### Asynchronous Reporting

By default, payloads (batched or not) are sent as part of script execution. This is easy to configure but may negatively impact performance. With some additional setup, payloads can be written to a local relay file instead; that file will be consumed by [rollbar-agent](https://github.com/rollbar/rollbar-agent) asynchronously. To turn this on, set the following config params:

```php
$config = [
  // ... rest of current config
  'handler' => 'agent',
  'agent_log_location' => '/var/www'  // not including final slash. must be writeable by the user php runs as.
];
```

You'll also need to run the agent. See the [rollbar-agent docs](https://github.com/rollbar/rollbar-agent) for setup instructions.

### Centralized Log Aggregation with fluentd

If you have a [fluentd](https://www.fluentd.org/) instance running available you can forward payloads to this instance. To turn this on, set the following config params.

```php
$config = [
  // ... rest of current config
  'handler' => 'fluent',
  'fluent_host' => 'localhost',  // localhost is the default setting but any other host IP or a unix socket is possible
  'fluent_port' => 24224, // 24224 is the default setting, please adapt it to your settings
  'fluent_tag' => 'rollbar', // rollbar is the default setting, you can adjust it to your needs
];
```

Also, you will have to install a suggested package [fluent/logger](https://packagist.org/packages/fluent/logger).

### Configuration Reference

See the [Rollbar-PHP Configuration Reference](https://docs.rollbar.com/docs/php-configuration-reference)

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-php-laravel/issues/new).

> 📘
>
> For more information on rollbar-php, please see the docs [here](https://docs.rollbar.com/docs/php).