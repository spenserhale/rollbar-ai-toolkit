<!-- source: https://docs.rollbar.com/docs/data-retention.md -->

# Data Retention

Control how long data is retained in your Rollbar account

> 📘
>
> Rollbar data retention period can be customized on all [paid plans](https://rollbar.com/pricing).

Rollbar's Data Retention settings control how long your data is accessible to view or access. Occurrence exception data is permanently deleted or redacted as soon as this data is older than your data retention period. You will not be able to access any data that is older than your data retention period.

By default, Rollbar retains exception occurrence data for up to **180 days** in accounts with a paid plan (please note that the data retention days are dependent on the plan type you select and will be different for Essentials vs Advanced and Enterprise plans) and **30 days** in accounts with a free plan.

> 🚧 The allowed data retention period you can select depends on your plan type (Essentials, Advanced or Enterprise)

If your account has a paid plan and you are an owner on the account, you can choose to retain your occurrence data for a shorter period via the following steps:

* Go to **Account Settings → Security → Data Retention**
* De-select the option to use your plan's default data retention, then enter the number of days you'd like to retain occurrence data (an integer 7–180). The number of days you are allowed is controlled by your plan type.
* Optionally, choose whether you'd like to delete people and IP data along with occurrences.  If selected, person and IP address data will be deleted when there are no more occurrences associated with a given person/IP address.  Future occurrences from the same person/IP will not be recognized as coming from the same person/IP.
  * If you are required to comply with [GDPR](https://gdpr.eu/), then we recommend enabling this setting.
* Click **Save Settings**

If you reduce your data retention period (e.g from 180 to 30 days), it may take some time for Rollbar to delete all the occurrences that should no longer be retained.

# What data is deleted?

The data retention policy deletes or permanently redacts the following data:

* Individual [occurrences](https://docs.rollbar.com/docs/rollbar-terminology#section-occurrence) of items
* Summarization of Occurrences\*
* *(Optional)* [People Tracking](https://docs.rollbar.com/docs/person-tracking) data for individuals for whom all occurrences have been deleted.\*
* *(Optional)* IP Addresses for which all occurrences have been deleted.

Metrics for IPs affected by a given item are not decremented when IP data is deleted, however future occurrences from a deleted IP address will be counted as if they came from a new IP address.

\* Summarization data and rollups of People data are deleted in a process run weekly on Saturday at 13:00 UTC which takes approximately 24 hours to complete.

# Symbol Map Files

The data retention process for symbol map files (Source Maps, Proguard files, iOS dSYM files, and Flutter symbol files) is that files which are unused for 90 days, as determined by not having any occurrences on their code\_version, will be automatically deleted.