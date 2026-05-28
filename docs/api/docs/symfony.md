<!-- source: https://docs.rollbar.com/docs/symfony.md -->

# Symfony

Rollbar SDK for Symfony | Support Level: Not Supported

This plugin integrates Rollbar into your Symfony installation.

## Requirements

This bundle depends on [symfony/monolog-bundle](https://github.com/symfony/monolog-bundle).

## Installation

### Symfony 4 and later

1. Add `Rollbar for Symfony` with composer: `composer require rollbar/rollbar-php-symfony-bundle`.
2. Register `Rollbar\Symfony\RollbarBundle\RollbarBundle` in `config/bundles.php` by adding the following entry at the end of your bundle array:

```php
<?php
  Rollbar\Symfony\RollbarBundle\RollbarBundle::class => ['all' => true]
?>
```

3. Add RollbarHandler for appropriate environments in `config/packages/dev/monolog.yaml`, `config/packages/test/monolog.yaml` and `config/packages/prod/monolog.yaml` by adding the following in the `handlers` section:

```yaml
          rollbar:
            type: service
            id: Rollbar\Monolog\Handler\RollbarHandler
```

4. Configure your Rollbar setup in `config/packages/rollbar.yaml` or in any of the environment subdirectories (i.e.,`config/packages/prod/rollbar.yaml`:

```yaml
rollbar:
    enabled: true
    access_token: [your access token]
    environment: [environment name]
    [other Rollbar config options]
```

### Symfony 3

1. Add `Rollbar for Symfony` with composer: `composer require rollbar/rollbar-php-symfony-bundle`
2. Register `Rollbar\Symfony\RollbarBundle\RollbarBundle` in `AppKernel::registerBundles()` **after** registering the `MonologBundle` (`new Symfony\Bundle\MonologBundle\MonologBundle()`).

```php

    public function registerBundles()
    {
        $bundles = [
            // ...
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            // ...
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            // ...
            new Rollbar\Symfony\RollbarBundle\RollbarBundle(),
            // ...
        ];

        return $bundles;
    }
    
```

3. Configure Rollbar and Monolog in your `app/config/config.yml` or `app/config/config_*.yml`.

```yaml

rollbar:
  access_token: YourAccessToken
  environment: YourEnvironmentName
    
monolog:
  handlers:
    rollbar:
      type: service
      id: Rollbar\Monolog\Handler\RollbarHandler
    
```

## Usage

### Exception reporting

Exceptions will be reported to Rollbar automatically after you install and configure the bundle.

### Manual reporting

This bundle injects itself into the Monolog loggers. Thanks to this, all of the Monolog logs will also be automatically passed to Rollbar.

All you need to do is obtain the `LoggerInterface` implementation from the service container.

```php
<?php

  namespace AppBundle\Controller;
  
  use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
  use Symfony\Bundle\FrameworkBundle\Controller\Controller;
  use Symfony\Component\HttpFoundation\Request;
  use Psr\Log\LoggerInterface;
  
  class DefaultController extends Controller
  {
      /**
       * @Route("/", name="homepage")
       */
      public function indexAction(Request $request, LoggerInterface $logger)
      {
          $logger->error('Test info with person data');
          
          // replace this example code with whatever you need
          return $this->render('default/index.html.twig', [
              'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
          ]);
      }
  }

```

## Configuration

You can see the Rollbar configuration options [here](https://docs.rollbar.com/docs/php-configuration-reference).

All of them can be configured by nesting them in the `rollbar` array, i.e.:

```yaml

rollbar:
  access_token: YourAccessToken
  environment: YourEnvironmentName
  scrub_fields: [password, password_confirmation, credit_card_number]
    
```

### `person` configuration option

By default, this bundle fetches the user data with `$container->get('security.token_storage')->getToken()->getUser()`. However, you can hardcode your own person data here. Although this might be used rarely, if you want to pass user data to Rollbar, you probably want to set up `person_fn` (see below).

### `person_fn` configuration option

*Note:* data returned by the `person_fn` callable will overwrite any data provided in `person` config or fetched from Symfony's `$container->get('security.token_storage')->getToken()->getUser()`.

You can provide your own logic for retrieving user data with the `person_fn` configuration option. The value should be a PHP callable returning an array of data in the `person` format, i.e.:

```yaml

rollbar:
  access_token: YourAccessToken
  environment: YourEnvironmentName
  person_fn: '\Example\UserData::personFn'
        
```

```php
<?php

namespace Example;

class UserData
{
  
  public static function personFn()
  {
    return array(
      'id' => '444'
    );
  }
}
```

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-php-symfony3-bundle/issues/new).

> 📘
>
> For more information on rollbar-php, please see the docs [here](https://docs.rollbar.com/docs/php).