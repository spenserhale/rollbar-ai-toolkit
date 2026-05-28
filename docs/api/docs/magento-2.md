<!-- source: https://docs.rollbar.com/docs/magento-2.md -->

# Magento 2

Rollbar error monitoring integration for Magento projects | Support Level: Not Supported

## Quick Start

[block:callout]
{
  "type": "danger",
  "body": "Before installing the Rollbar module, make sure that you can run `bin/magento setup:upgrade` in your Magento app without problems."
}
[/block]

1. Add `rollbar/rollbar-magento2` as a dependency in `composer.json` of your project and run `composer update`.
2. Add your Rollbar post server access token to `app/etc/env.php` under `rollbar` key, ie:

```php
'rollbar' => [
        'access_token' => '[YOUR ACCESS TOKEN]'
    ]
```

3. Add any additional Rollbar configuration in `app/etc/env.php` under the `rollbar` key.
4. `bin/magento module:enable Rollbar_Magento2`.
5. `bin/magento setup:upgrade`.

## Usage and Reference

The module should automatically report all PHP errors and exceptions in your Magento2 app. If you wish to add any manual logging in your app's code, use the standard Rollbar PHP `\Rollbar\Rollbar::log` method. `\Rollbar\Rollbar::init` has been invoked automatically already with settings from `app/etc/env.php`.

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-php-magento2/issues/new).

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-php, please see the docs [here](https://docs.rollbar.com/docs/php)."
}
[/block]