<!-- source: https://docs.rollbar.com/docs/sending-rollbar-webhooks-nearly-anywhere.md -->

# Sending Rollbar Webhooks (Nearly) Anywhere

Rollbar's Webhooks notification channel operates much like our others (triggered by the same events, providing the same data, and more), however the destination URL and format (JSON, XML) can be customized, allowing for integration with either your own custom tool/stack, or a third-party service that may exist now or in the future.

Whether you currently/already have an endpoint or third party service you'd like to integrate, our main [Webhooks documentation page](https://docs.rollbar.com/docs/webhooks) is full of information about the supported formats, webhook request types, expected response codes, retry behavior, and more. If you'd like to develop one or would like some techniques for integration, the following information might be helpful, as well.

### Using webhook.site to test and examine your project's webhook notifications

[Webhook.site](https://webhook.site) is a great free way to view the actual payload of a webhook that Rollbar sends. Simply visit that site in your browser, and you'll be provided with a webhook destination/listener URL under **Your unique URL**. Enter this into your project's Webhook page's **URL** field, then click **Save Settings**.

As a quick test, you can press **Send Test Notification**, and then examine it back on webhook.site. Here, we can see that it was a POST request, the IP that it came from, and similar information. We can also see the actual payload under **Raw Content** below, which will be important for further tests.

You'll notice that even with this test message, Rollbar is following the basic format as specified [here](https://docs.rollbar.com/docs/webhooks#payload-format), with the `event_name` and `data` top level keys. The former key is helpful for triggering branching behavior (for example: a deploy event and an item event may have different desired destinations or display formatting at the destination), and the latter will contain the actual data about what triggered the event.

#### Further Testing

To get a better idea of typical events you watch for, you'll either need to trigger said event or wait for one to happen organically. It might also be handy to have similar filter rules setup to another [notification](https://docs.rollbar.com/docs/notifications) channel (such as [Slack](https://docs.rollbar.com/docs/slack)) that you're familiar with and can compare against. With this information, you should be able to hone in on any data from the payload that you'd like to record/display, or to translate for a third party destination, using the key name and location within the payload.

### Third party destinations

Many services can receive webhook notifications, and quite often they can be instructed to inspect the payload and make use of the keys you're interested in. A great example here would be Zapier, and we've written a guide for using it to integrate with something like Zendesk [here](https://docs.rollbar.com/docs/using-zapier-to-create-zendesk-tickets).

In some cases, the destination may be able to receive webhooks but doesn't understand Rollbar's payload format specifically, and instead may use another one. In cases like this, you could again use Zapier as above, or something like Hookdeck, which allows for translating the webhook payload into a format fit for the destination. We have an example of doing just this with Discord as the destination [here](https://docs.rollbar.com/docs/sending-discord-notifications-using-webhooks-and-hookdeck).

There are many great tools to create workflows that will allow you to receive Rollbar notifications exactly where they'd be most useful to you ([IFTTT](https://ifttt.com/maker_webhooks) is another very popular one). Hopefully this guide has helped you get started, whether with your own internal destination, or a third party service in your flow!