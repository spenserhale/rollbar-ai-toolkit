<!-- source: https://docs.rollbar.com/docs/php.md -->

# PHP

Rollbar SDK for PHP | Support Level: Supported

[Rollbar-PHP](https://github.com/rollbar/rollbar-php) detects errors and exceptions in your application and reports them to [Rollbar](https://rollbar.com) for alerts, reporting, and analysis.

## Quick Start

Rollbar supports PHP 8 with `rollbar-php` version 4.0.0 and greater. PHP 7 and below will continue to be supported through the 2.x versions. More information on version compatibility can be found [here](https://github.com/rollbar/rollbar-php#releases-versions-and-php-compatibility).

`Rollbar-php` 2.x supported PHP versions: 5.3, 5.4, 5.5, 5.6, 7, 7.1, 7.2, 7.3, 7.4 and HHVM (currently tested on 3.6.6).

For PHP 5.3, make sure you install `packfire/php5.3-compat` as outlined in the suggested dependencies in `composer.json`.

The docs linked below will help you get Rollbar up and running quickly in various PHP platforms and toolchains.

> 🚧 CA Certificates
>
> The Rollbar API is secured via SSL, make sure to include the appropriate CA files to support the cURL commands used in the PHP library. Learn more: <https://curl.se/docs/sslcerts.html>

|                                                                    |                                                               |                            |
| :----------------------------------------------------------------- | :------------------------------------------------------------ | :------------------------- |
| [Basic PHP Installation & Setup](https://docs.rollbar.com/docs/basic-php-installation-setup) | [CodeIgniter](https://docs.rollbar.com/docs/codeigniter)                                | [Heroku](https://docs.rollbar.com/docs/php-heroku)   |
| [Monolog](https://docs.rollbar.com/docs/monolog)                                             | [Integration with rollbar.js](https://docs.rollbar.com/docs/integration-with-rollbarjs) | [WordPress](https://docs.rollbar.com/docs/wordpress) |
| [Laravel 5.6 and up](https://docs.rollbar.com/docs/laravel)                                  | [Laravel 5.5 and lower](https://docs.rollbar.com/docs/laravel-55)                       | [Symfony](https://docs.rollbar.com/docs/symfony)     |
| [Magento 2](https://docs.rollbar.com/docs/magento-2)                                         |                                                               |                            |

## Usage

If you'd like to report exceptions that you catch yourself:

```php
<?php
use Rollbar\Rollbar;
use Rollbar\Payload\Level;
    
try {
    do_something();
} catch (\Exception $e) {
    Rollbar::log(Level::ERROR, $e);
    // or
    Rollbar::log(Level::ERROR, $e, array("my" => "extra", "data" => 42));
}   
```

You can also send Rollbar log-like messages:

```php
<?php
use Rollbar\Rollbar;
use Rollbar\Payload\Level;
    
Rollbar::log(Level::WARNING, 'could not connect to mysql server');
Rollbar::log(
    Level::INFO, 
    'Here is a message with some additional data',
    array('x' => 10, 'code' => 'blue')
);    
```

## Using dependency injection

If you're using dependency injection containers, you can create and get a `RollbarLogger` from the container and use it to initialize Rollbar error logging.

It's up to the container to properly create and configure the logger.

```php
<?php
use Rollbar\Rollbar;
use Rollbar\RollbarLogger;
    
$logger = $container->get(RollbarLogger::class);
    
// installs global error and exception handlers
Rollbar::init($logger);
```

## Configuration

### Asynchronous Reporting

By default, payloads (batched or not) are sent as part of script execution. This is easy to configure but may negatively impact performance. With some additional setup, payloads can be written to a local relay file instead; that file will be consumed by [rollbar-agent](https://github.com/rollbar/rollbar-agent) asynchronously. To turn this on, set the following config params:

```php
<?php
$config = array(
    // ... rest of current config
    'handler' => 'agent',
    'agent_log_location' => '/var/www'  // not including final slash. must be writeable by the user php runs as.
);
```

You'll also need to run the agent. See the [rollbar-agent docs](https://github.com/rollbar/rollbar-agent) for setup instructions.

NOTE:  The access\_token is populated in the SDK to be passed to the rollbar-agent. If the access\_token is missing then the rollbar-agent will create this access\_token. The payload delivered to the rollbar-agent should be self-sufficient and that is why the SDK requires the access\_token.

### [UUIDs](https://docs.rollbar.com/docs/uuids)

Most Rollbar SDKs automatically generate a [UUID](https://docs.rollbar.com/docs/uuids) for each event reported from the notifier to the platform. This UUID can be used to track customer issues, correlate exceptions to automated test sessions, and more. In PHP, the UUID is returned by the `report_exception()` and `report_message()` functions of the [`Rollbar.php`](https://github.com/rollbar/rollbar-php/blob/master/src/Rollbar.php) file. The actual value of the UUID is assigned by the `uuid4()` function, defined in the [`Utilities.php`](https://github.com/rollbar/rollbar-php/blob/master/src/Utilities.php) file.

### Centralized Log Aggregation with fluentd

If you have a [fluentd](https://www.fluentd.org/) instance running available you can forward payloads to this instance. To turn this on, set the following config params.

```php
<?php
$config = array(
    // ... rest of current config
    'handler' => 'fluent',
    'fluent_host' => 'localhost',  // localhost is the default setting but any other host IP or a unix socket is possible
    'fluent_port' => 24224, // 24224 is the default setting, please adapt it to your settings
    'fluent_tag' => 'rollbar', // rollbar is the default setting, you can adjust it to your needs
);
```

Also you will have to install a suggested package `fluent/logger`.

### Uncaught exceptions and errors

Rollbar.js provides a configuration option `captureUncaught` which allows you to control if uncaught exceptions should automatically reported to Rollbar. Rollbar PHP SDK allows you the same, but in a slightly different way. `Rollbar::init` takes the 2nd, 3rd and 4th argument which control if exceptions, errors and fatal errors are going to be reported to Rollbar. The default behavior is to report everything to Rollbar automatically. But if you want to change that, check out the following code:

```php
<?php

\Rollbar\Rollbar::init(
	array('access_token' => '***', 'environment' => 'development'),
	false, // handle exceptions
	false, // handle errors
	false // handle fatal errors
);
```

The above example turns off the automatic reporting of uncaught exceptions, errors and fatal errors.

### Performance optimization

If performance is an important factor for you, we recommend following [the Composer's autoloading optimization guide](https://getcomposer.org/doc/articles/autoloader-optimization.md).

To further increase performance of your application, we suggest to consider using the HHVM instead of the PHP interpreter with [the hhvm-autoload plugin](https://github.com/hhvm/hhvm-autoload).

### Configuration Options

For a listing of all configuration options available, see [Configuration Reference](https://docs.rollbar.com/docs/php-configuration-reference)

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-php/issues/new).