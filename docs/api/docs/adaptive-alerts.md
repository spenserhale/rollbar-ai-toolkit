<!-- source: https://docs.rollbar.com/docs/adaptive-alerts.md -->

# Adaptive Alerts

> 📘 Advanced Feature
>
> Adaptive Alerts are available on Advanced and Enterprise plans.

Adaptive Alerts feature provides reliable, informative, and actionable notifications about unexpected issues in monitored applications and services. Adaptive Alerts uses anomaly detection to learn the standard behavior of your application and alerts you about atypical exception rates.

# How is it different from other triggers?

Adaptive Alerts is a new type of trigger aimed to reduce noise and increase awareness of new, potentially severe issues. The algorithm is continuously trained on your projects using 2 weeks of historical data with 1-hour increments. It provides near real-time notifications, triggering alerts with a maximum delay of 10 minutes.

Adaptive Alerts notifies of changes more broadly than Rollbar’s grouping algorithms, tracking raw exception types (crashes and errors) by environment and excluding log and debug messages. While you can tweak the parameters used to raise alerts,  there is zero required configuration, and it adapts the exception baseline rate to variations over time.

Key differences compared to other triggers include:

* Unlike `High Occurrence Rate`, `10^nth Occurrence`, `New Item`, and `Reactivated Item` triggers, **it is independent of grouping**: tracking exception rates by the root type and environment.
* Unlike the `10^nth Occurrence` trigger, it alerts about exception rates of **different magnitudes with the same sensitivity**

Are adaptive alerts available for all levels and message types?

* Adaptive Alerts works for **exceptions** only (not messages)
* Adaptive Alerts works for **all levels** (critical, error, warning, info, and debug)

# Enabling Adaptive Alerts for a notification rule

You can set it up as a new trigger in [Slack](https://docs.rollbar.com/docs/slack) and/or  [Email notifications](https://docs.rollbar.com/docs/notifications) following these steps:

1. On the Rollbar UI, go to **Settings → Projects**.
2. Select your project, then click **Notifications** under **Integrations** in the left side menu.
3. Select **Slack** or **Email** under **Available Channels** or reconfigure them under **Active Channels**
4. Select **Adaptive Alerts template** under **Add Rule** then click **Configure Rule**

## Adaptive Alerts Rule settings

Similar to other [Rollbar Notifications](https://docs.rollbar.com/docs/notifications), Adaptive Alerts accepts notification filters and configurations for teams, users, environments...  Additionally, the Adaptive Alerts rule can be tweaked with the following settings for the alerting algorithm:

1. *Minimum exception rate to alert*

Defines the minimum exception rate (exceptions/hour) required to generate an alert.\
Set a higher minimum exception rate (e.g. 100 exceptions/hour) to ignore small anomalies.

2. *Sensitivity*

Controls the level of statistical confidence required for a detected anomaly to generate an alert.\
Sensitivity can be adjusted to Low (fewer alerts), Medium, and High (more alerts).\
Set a higher sensitivity value to trigger more alerts.

This graphical representation helps to understand Adaptive Alerts settings in a time series of exceptions for a real project.

![](https://files.readme.io/65a5452-Graph.png "Graph.png")

Where:

* The minimum exception rate -in blue- sets the threshold to ignore lower exception rates.
* Sensitivity -in red- is set to high and generates alerts for all anomalies detected.