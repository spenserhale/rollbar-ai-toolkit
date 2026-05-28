<!-- source: https://docs.rollbar.com/docs/php-integration-with-rollbarjs.md -->

# Integration with rollbar.js

How integrate rollbar-php and rollbar.js

In case you want to report your JavaScript errors using [Rollbar.js](https://github.com/rollbar/rollbar.js), you can configure the SDK to enable Rollbar.js on your site. Example:

```php
<?php
$rollbarJs = Rollbar\RollbarJsHelper::buildJs(
    array(
        "accessToken" => "POST_CLIENT_ITEM_ACCESS_TOKEN",
        "captureUncaught" => true,
        "payload" => array(
            "environment" => "production"
        ),
        /* other configuration you want to pass to RollbarJS */
    )
);    
```

Or if you are using Content-Security-Policy: script-src 'unsafe-inline'

```php
<?php
$rollbarJs = Rollbar\RollbarJsHelper::buildJs(
    array(
        "accessToken" => "POST_CLIENT_ITEM_ACCESS_TOKEN",
        "captureUncaught" => true,
        "payload" => array(
            "environment" => "production"
        ),
        /* other configuration you want to pass to RollbarJS */
    ),
    headers_list(),
    $yourNonceString
);
```

That's it! Uncaught errors and exceptions will now be reported to Rollbar.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-php, please see the docs [here](https://docs.rollbar.com/docs/php)."
}
[/block]