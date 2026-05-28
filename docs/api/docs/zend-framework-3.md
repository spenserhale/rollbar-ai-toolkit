<!-- source: https://docs.rollbar.com/docs/zend-framework-3.md -->

# Zend Framework 3

Using Rollbar PHP SDK with Zend Framework 3 applications

Rollbar PHP SDK can be used with Zend Framework 3 with little effort. All you have to do is install the `rollbar/rollbar` composer package, instruct your application module to initialize Rollbar and report on `dispatch.error` event.

# Installation

1. Run `composer require rollbar/rollbar` in CLI or add `"rollbar/rollbar": "^1"` to your `composer.json` as a dependency and run `composer update`.

2. Add your application-wide Rollbar configuration options (everything other than `access_token` and `environment`) to `config/autoload/global.php`:

```php
return [
    // other Zend Framework 3 global autoloaded configuration
    'rollbar' => [
        // application-wide Rollbar configuration options
    ]
];
```

3. Add your `access_token` and `environment` config options to `config/autoload/local.php` and / or `config/autoload/development.local.php` (the second file is only used in Zend's development mode):

```php
return [
    // other Zend Framework 3 local autoloaded configuration
    'rollbar' => [
        'access_token' => '[insert your access token here]',
        'environment' => 'production'
    ]
];
```

4. In your `module/Application/src/Module.php` add the following code to your `onBootstrap` method:

```php
public function onBootstrap(MvcEvent $event)
{
        $application = $event->getApplication();
        $config = $application->getConfig();
        
        Rollbar::init($config['rollbar']);
        
        $eventManager = $application->getEventManager();
        
        $eventManager->attach(MvcEvent::EVENT_DISPATCH_ERROR, [$this, 'onError']);
        $eventManager->attach(MvcEvent::EVENT_RENDER_ERROR, [$this, 'onError']);
}
```

5. Still in your `module/Application/src/Module.php` add the `onError` method:

```php
public function onError(MvcEvent $event)
{
    $exception = $event->getParam('exception');
        
    Rollbar::logger()->log(Level::ERROR, $exception, array(), true);
}
```

# Usage

Rollbar PHP SDK will now report all PHP errors and exceptions thrown in your Zend Framework 3 application to your Rollbar account.

If you want to trigger manual report to Rollbar anywhere in your application use the `Rollbar` facade's `error`, `warning`, `info` and `debug` methods:

```php
\Rollbar\Rollbar::error("Manual error message from a Zend3 app");
```