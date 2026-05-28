<!-- source: https://docs.rollbar.com/docs/basic-php-installation-setup.md -->

# Basic PHP Installation & Setup

### Using Composer (recommended)

See [PHP Quick Start](https://docs.rollbar.com/docs/php#quick-start) for information on the Rollbar SDK for PHP and PHP version compatibility.

Add `rollbar/rollbar` to your `composer.json`:

```json
{
    "require": {
        "rollbar/rollbar": "^4"
    }
}
```

### Manual installation if you are not using composer.json for your project

Keep in mind, that even if you're not using composer for your project (using `composer.json`), you will still need the Composer package to install `rollbar-php` dependencies.

1. If you don't have Composer yet, follow these instructions to get the package: [install composer](https://getcomposer.org/doc/00-intro.md). It will be needed to install dependencies.
2. Clone git repository [rollbar/rollbar-php](https://github.com/rollbar/rollbar-php) into a your external libraries path: `git clone https://github.com/rollbar/rollbar-php`
3. Install `rollbar-php` dependencies: `cd rollbar-php && composer install && cd ..`
4. Require `rollbar-php` in your PHP scripts: `require_once YOUR_LIBS_PATH . '/rollbar-php/vendor/autoload.php';`

## Setup

Add the following code at your application's entry point:

```php
<?php
use Rollbar\Rollbar;

$config = array(
    // required
    'access_token' => 'POST_SERVER_ITEM_ACCESS_TOKEN',
    // optional - environment name. any string will do.
    'environment' => 'production',
    // optional - path to directory your code is in. used for linking stack traces.
    'root' => '/var/www/myapp',
    // optional - the code version. e.g. git commit SHA or release tag
    'code_version' => '27f47021038a159c5aa9bbb9f98ce47e55914404'
);
Rollbar::init($config);    
```

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

This will install an exception handler (with `set_exception_handler`) and an error handler (with `set_error_handler`). If you'd rather not do that:

```php
<?php
$set_exception_handler = false;
$set_error_handler = false;
Rollbar::init($config, $set_exception_handler, $set_error_handler);    
```

### Send an Error and a Message

```php
<?php
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