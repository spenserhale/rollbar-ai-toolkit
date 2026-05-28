<!-- source: https://docs.rollbar.com/docs/php-heroku.md -->

# Heroku

How to set up rollbar-php with Heroku

First, add the addon:

```bash
heroku addons:create rollbar:trial-5k
```

The `access_token` and `root` config variables will be automatically detected, so the config is simply:

```php
<?php
use Rollbar\Rollbar;
  
Rollbar::init(array(
    'environment' => 'production'
));    
```

> 📘
>
> For more information on rollbar-php, please see the docs [here](https://docs.rollbar.com/docs/php).