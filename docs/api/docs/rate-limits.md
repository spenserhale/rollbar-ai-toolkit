<!-- source: https://docs.rollbar.com/docs/rate-limits.md -->

# Rate Limits

Rate limits allow you to control how many occurrences are saved and processed. In turn, this gives you control over how many occurrences count towards your monthly bill.

Each project access token can be individually configured with a different rate limit. Once the limit is reached, all calls to POST items will return HTTP status code `429 Too Many Requests` until the next rate limit window begins.

When you hit a rate limit, Rollbar notifies you via an event in your Rollbar project. It will appear on your Items list with the framework "System Message" and can trigger notifications just like any other Rollbar item. (Note: these events are free and are not counted toward your bill.)

In addition to the user-defined rate limit, there is a system rate limit which is always active and is tracked independently from the user-defined rate limit. The default system limit is referred to as the "default rate limit".

As a safeguard, the system rate limit for all tokens is initially set at a dynamic value that you can see under Settings->Projects->Access Tokens. If you'd like to set a higher rate limit on any of your access tokens, you can do so by contacting <support@rollbar.com>. You can set a lower limit by configuring a user-defined rate limit through the Project Access Tokens UI (see instructions below).

When both a user-defined rate limit and the system rate limit are active, both are tracked independently and whichever is hit first will take effect. For example, suppose you have a user-defined limit of 100,000 per day. If your token receives 1000 events per minute, then your user-defined limit will be hit after 100 minutes and the system limit will not be hit. If your token receives 1000 events per second, then the system limit would be hit 5.5 seconds into the first minute (for a total of 5,500 events); this would repeat for each of the next \~19 minutes, for a total of 100,000 events, at which point the user-defined limit would be hit.

## Rate limits reset

Your rate limits get reset automatically. We start the rate limit counter when we first receive an occurrence, and it resets after however long the rate limit is (so if your rate limit is 100 calls per minute, we start the counter when we receive the first occurrence, then it resets after a minute). The counter starts up again the next time we receive an occurrence.

The following response headers give you more information about the rate limits affecting you:

X-Rate-Limit-Limit
X-Rate-Limit-Remaining
X-Rate-Limit-Remaining-Seconds
X-Rate-Limit-Reset

## Configuring a user-defined rate limit

Starting from a project, Go to **Settings → Project Access Tokens** and click on the pencil icon to edit.

Next, choose a time window from the rate limit dropdown menu. Choices are:

* Default rate limit (no user-defined limit)
* 1 minute
* 5 minutes
* 30 minutes
* 1 hour
* 1 day
* 1 week
* 30 days

Finally, enter the rate limit value in the text box to the left of the dropdown menu, and click the checkmark to save.

[block:callout]
{
  "type": "warning",
  "body": "Changes to rate limits (including adding, modifying, or removing a rate limit) take effect immediately."
}
[/block]

## API Response Codes

If your access token has a rate limit and has reached it, all successful API calls will result in an HTTP 429 (Too Many Requests) response code. Once the limit is reached, there can be a short delay before our servers begin to reply with a 429. This does not mean that these items will count towards your bill. These items will not be processed and will not appear on your dashboard.

[block:callout]
{
  "type": "warning",
  "body": "If you're using a custom script or library to POST items you should make sure it can\nhandle the 429 response code."
}
[/block]

## Notifications

When a rate limit is hit in a project, Rollbar automatically generates a `System Message` error with the title `Your rate limit has been reached for access_token TOKEN_NAME`.

You can configure a special *Every Occurrence* notification rule to detect these messages and notify the appropriate team members via any notifications channel.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f39fd06-Screen_Shot_2020-01-03_at_9.18.17_AM.png",
        "Screen Shot 2020-01-03 at 9.18.17 AM.png",
        1146,
        188,
        "#f4f5f6"
      ]
    }
  ]
}
[/block]

To identify rate limit notifications, use the following filters:

* **Framework:** `System Message`
* **Title** *contains* `Your rate limit has been reached`

## Billing

At the end of your billing cycle, the total charge is calculated based on all events saved and processed. This will not include events that were not processed due to your rate limits.