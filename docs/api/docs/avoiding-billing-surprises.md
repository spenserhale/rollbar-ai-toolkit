<!-- source: https://docs.rollbar.com/docs/avoiding-billing-surprises.md -->

# Avoiding billing surprises

Rollbar provides tools to manage billing and avoid surprises by setting up usage alerts, configuring overage options, and establishing rate limits, allowing users to receive notifications via email or Slack and control how occurrences are processed when limits are reached. Here are a few suggested steps you can take to ensure you don't get any surprises.

## Get usage alerts

Rollbar automatically emails your account Owners whenever your current usage reaches set thresholds. These notifications will be sent when your account reaches 80%, 90%, 95%, and 100% of your occurrence limits. The alerts will be sent with the subject line of `Your account has used X% of its occurrence limit` to help you identify these alerts more easily.

### Set up additional usage alerts

We also offer the ability to send the same notifications to emails who are not part of the Owners team. For example, if you want these notifications sent to a department lead or finance department. They would not need a Rollbar user created, and can instead get these notifications directly. Here's how you set it up:

#### Configure additional emails

* Navigate to your Usage page by clicking on your user icon in the bottom left, then clicking on the `Usage` menu option

![](https://files.readme.io/a99b5bd640e91e7a086eb99bd42fb1777cd86cc7ba61f5e8afa88623f05f9a50-image.png)

* Click on the `Notifications` button at the top right of the Usage page.

![](https://files.readme.io/33ae89f8305cd7d8ff3e46a24fb160ecc4dba44aad8912d9bddca2ad04bc260d-image.png)

* A modal will appear which will allow you to add enable the additional notifications.
* You can then add up to 10 emails to get these usage notifications.

![](https://files.readme.io/89199a5565163477e0a76a412d6c6f276aa89b6dd45df8d93f6114aba7f64cad-image.png)

<br />

#### Configure additional Slack alerts

> 📘 You would need Slack connected in order to receive these alerts. If you have not set up Slack, refer to the guide [here](https://docs.rollbar.com/docs/slack).

* Navigate to your Usage page by clicking on your user icon in the bottom left, then clicking on the `Usage` menu option

![](https://files.readme.io/a99b5bd640e91e7a086eb99bd42fb1777cd86cc7ba61f5e8afa88623f05f9a50-image.png)

* Click on the `Notifications` button at the top right of the Usage page.

![](https://files.readme.io/33ae89f8305cd7d8ff3e46a24fb160ecc4dba44aad8912d9bddca2ad04bc260d-image.png)

* A modal will appear which will allow you to add enable the additional notifications.
* Click on the `Slack`  selector at the top of the modal.
* You can now Enable the Slack notifications and specify the channel where you would want to receive the notifications.

![](https://files.readme.io/0760ffe16c28a1a2c4969cca3a646b956d7c4cff2d3018220fdb3dbd6a9e53e5-image.png)

<br />

## Configure overage options

You can control what happens when you have reached the occurrence limit of your plan. To avoid losing valuable occurrences, you can enable on-demand occurrences and control how they are handled. Rollbar offers three different types of overage behaviors:

* Process all occurrences: This will allow Rollbar to process any occurrence when your quota is completely utilized. The pricing of additional occurrences depends upon your plan; and, this information will be displayed on this section.
* Process occurrences over your limit until a budget is reached: You can configure a set dollar amount for Rollbar to process in excess of your plan limit. Once the additional number of occurrences are used, Rollbar would then stop processing new occurrences until your plan resets. The pricing of additional occurrences depends upon your plan; and, this information will be displayed on this section. We do suggest setting a budget of 2X your plan's monthly cost to ensure you’re fully covered without surprises.
* Stop processing occurrences once the monthly limit is reached: Rollbar will not process any occurrences once you have hit your quota limit. Please be aware, you can lose valuable error information if your Rollbar account stops processing new data.

Here is how you can configure your overage options:

* Navigate to your plan page by clicking on your user icon in the bottom left, then clicking on the `Your Plan and Billing` menu option

![](https://files.readme.io/1fac83ed854cb63b7dc1cbf4791cbd58f2f79a4c04332db673c31ef36c87c3af-image.png)

* You will see an `On-demand occurrences` section displaying your current settings.
* Select whichever option suits your needs.
  * If you select `Process occurrences over your limit until a budget is reached`you can click on the `Change budget` button to set the additional budget allocation for your plan.

![](https://files.readme.io/661e3217d5d8f5c91c2f89f19415fd495551375c4fe4fc1379a23de615fcffb1-image.png)

## Configure rate limits

> 🚧 Please be aware that Rate Limits can reduce visibility into your errors

Rate limits allow you to configure the number of occurrences Rollbar can process. Refer to our rate limit documentation [here](https://docs.rollbar.com/docs/rate-limits) for full details about this feature. Rate limits can be set on a per-project scale. For example, you can set a rate limit one project while still allowing your other projects to fully capture your data. Here is how you configure rate limits:

* Click on the `Projects` tab in the sidebar
* Click on the project name of the project you wish to edit

![](https://files.readme.io/cacf516c4c6dc32d568488d32495fa4f1f3560a25190e51fad8e36ef984a9fbd-image.png)

* Click on the `Project Access Tokens` menu option

![](https://files.readme.io/a0915537a34ee03d9d7ca0a4807688a42a9bd1eef336d7f4fdef91bb2e79dd2a-image.png)

* Click on the `⋮` menu on the rightmost column of the token you want to modify.

  * In most cases this is the `post_server_item` or `post_client_item` token.

    ![](https://files.readme.io/2b0186a7d3a2085e33a8b217d71cf0ec25800c0715b39d9acdb82321c6f5c611-image.png)
* A modal will appear which will allow you to set custom rate limits for the token.
* Set the limits in the `Requests` and `Rate Limit Window Size` for whatever is necessary in your situation.
* Click the `Submit` button.

![](https://files.readme.io/aa23560518e09a6a6d1eeb468fff372ed249be12d255a4a85dfaf323aaf4f745-image.png)