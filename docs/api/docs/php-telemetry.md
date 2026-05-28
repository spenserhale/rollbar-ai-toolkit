<!-- source: https://docs.rollbar.com/docs/php-telemetry.md -->

# PHP Telemetry

Starting with v4.1.0 of the PHP SDK, Rollbar supports sending telemetry data to Rollbar.

When telemetry is enabled, Rollbar will track and report events that happen prior to an exception or message being sent to Rollbar. The telemetry data is sent along with the exception or message data and can be viewed in the Rollbar UI under the *Telemetry* section of an occurrence.

The telemetry timeline provides useful 'breadcrumbs' that can help you understand what happened in your application leading up to an error or message.

## Configuration

Starting with v4.1.0, telemetry is enabled by default. You can disable it by setting the `telemetry` configuration\
option to `false`.

```php
<?php

\Rollbar\Rollbar::init([
    'access_token' => '***',
    'environment' => 'production',
    'telemetry' => false, // disable telemetry
]);
```

You can also change a number of options related to telemetry by setting the `telemetry` configuration option to an array:

```php
<?php

\Rollbar\Rollbar::init([
    'access_token' => '***',
    'environment' => 'production',
    'telemetry' => [
        'maxTelemetryEvents' => 100, // default is 100
        'filter' => null,
        'includeItemsInTelemetry' => true,
        'includeIgnoredItemsInTelemetry' => false,
    ],
]);
```

### Options

* `maxTelemetryEvents` - The maximum number of telemetry events to capture before discarding older events. Default is 100.
* `filter` - An instance of a class that implements the `Rollbar\Telemetry\TelemetryFilterInterface` interface. This can be used to filter out telemetry events based on custom criteria. The interface has comprehensive documentation for each method. Default is `null` which means no filtering is applied.
* `includeItemsInTelemetry` - Whether to include Rollbar captured exceptions and messages in the telemetry data of future exceptions and messages. Default is `true`.
* `includeIgnoredItemsInTelemetry` - Whether to include ignored exceptions and messages in the telemetry data of future exceptions and messages. Default is `false`. If set to `true` exceptions that are ignored because they are of a lower log level than the configured `minimum_level` will be included in the telemetry data. If you set this to `true` you will likely also want to set a `filter` to keep the telemetry data from getting too large.

Some frameworks will have additional configuration options for telemetry. For documentation on those options, please refer to the framework-specific documentation.

## Usage

Telemetry is mostly automatic and requires no additional setup. However, you can add custom telemetry events using the `Rollbar\Rollbar::captureTelemetryEvent()` method.

```php
<?php

use Rollbar\Rollbar;
use Rollbar\Telemetry\EventType;
use Rollbar\Telemetry\EventLevel;
use Rollbar\Payload\TelemetryBody;

Rollbar::captureTelemetryEvent(
    type: EventType::Log,
    level: EventLevel::Info,
    metadata: new TelemetryBody(
        message: 'This is my custom telemetry event',
    ),
);
```