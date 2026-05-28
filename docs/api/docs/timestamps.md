<!-- source: https://docs.rollbar.com/docs/timestamps.md -->

# Timestamps

Every occurrence in Rollbar has a timestamp. The timestamps that you see throughout the Rollbar UI and API are the time according to Rollbar's servers. We use and continuously monitor [ntpd](http://en.wikipedia.org/wiki/Ntpd) to keep our clocks in sync.

Timestamps are stored internally as unix timestamps, at second-level precision.

Timestamps in the UI are displayed using the timezone defined by the users browser.

Timestamps returned from the [API](https://explorer.docs.rollbar.com/) are unix timestamps, as are timestamps in [RQL](https://docs.rollbar.com/docs/rql) queries.

The original timestamp reported to Rollbar by your application is available in the field `metadata.customer_timestamp`. It will normally be a unix timestamp as well. You can see this in two places:

1. On the occurrence detail page, the Raw JSON section will include a `metadata` section. If there was a timestamp in the original report, it will be presented under `Notifier Timestamp` and it will also be present as the key `customer_timestamp`.
2. Via RQL, you can select it as the column name `metadata.customer_timestamp`