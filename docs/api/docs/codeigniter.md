<!-- source: https://docs.rollbar.com/docs/codeigniter.md -->

# CodeIgniter

How to setup rollbar-php with CodeIgniter

First, make sure that Rollbar is required in `composer.json` and it has been installed through `composer install` or `composer update`. Next, make sure you require your Composer-generated autoload file (typically `vendor/autoload.php`) when you bootstrap your application.

If you are using CodeIgniter you can place `Rollbar::init` in either of the two places:

* inside the Controller's constructor

```php
<?php
public function __construct()
{
    Rollbar::init(array(
        'access_token' => config_item('rollbar_access_token'),
        'environment' => ENVIRONMENT
    ));
    parent::__construct();
}
```

* `pre_system` hook

```php
<?php
$hook['pre_system'] = function () {
    Rollbar::init([
        'access_token' => config_item('rollbar_access_token'),
        'environment' => ENVIRONMENT,
        'root' => APPPATH . '../'
    ]);
};  
```

[block:callout]
{
  "type": "warning",
  "body": "If you wish to log `E_NOTICE` errors make sure to pass `'included_errno' => E_ALL` to `Rollbar::init`."
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "",
  "body": "For more information on rollbar-php, please see the docs [here](https://docs.rollbar.com/docs/php)."
}
[/block]