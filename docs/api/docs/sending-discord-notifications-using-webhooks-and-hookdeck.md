<!-- source: https://docs.rollbar.com/docs/sending-discord-notifications-using-webhooks-and-hookdeck.md -->

# Sending Rollbar Notifications to Discord

Using Hookdeck, you can transform a Rollbar Webhook to one that Discord can display

Rollbar's notification integrations are great ways to alert your team of error activity in your project - many teams use our Slack integration for real-time actionable alerts, but what if your team works together on Discord instead?

Using Rollbar's Webhooks integration, we can send alerts to Hookdeck, which then formats them for display in your team's Discord server. To follow this guide, you'll need both a Rollbar and Hookdeck account - both can be on the free plan, so you can try this integration free of charge.

## Create a webhook connection in your Discord server

To start with, in your Discord server, click your server's name in the top left, and then choose **Server Settings**:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/6db88fb-Screenshot_2024-03-29_at_2.23.41_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

From here, head to the **Integrations** heading on the left, and then click **Create Webhook**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/b5fd239-Screenshot_2024-03-29_at_2.24.04_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

Discord will create a webhook with a random name and profile picture. Click this new webhook, and change these, if you'd like - you don't have to follow my example below; anything will work. You can also change the channel in your server that it will post to here. When done, make sure to click **Copy Webhook URL**, before clicking **Save Changes**. We'll need this URL for the next step.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/b91a910-Screenshot_2024-03-29_at_2.25.09_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

## Setting up a Connection in Hookdeck

Head to [hookdeck.com](https://hookdeck.com/) and sign up for an account if you don't already have one. Hookdeck connections contain 3 main components: a **source**, a **destination**, and a **transformation**. For our example, Rollbar would be the source, Discord would be the destination, and the transformation is something we'll create below to transform a Rollbar webhook payload to one that Discord can display.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/658f082-Screenshot_2024-03-29_at_2.53.48_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

Once you've signed in, under **Connections**, click **Create connection**. Here, we're going to define both our source and destination. Under Configure a Source, leave Create new source selected, and name your source  '*Rollbar*'. Now, do the same for the destination, naming it '*Discord*'. Under **Endpoint URL**, paste the Webhook URL that you copied from within Discord (it should start with something like *<https://discordapp.com/api/webhooks/>*).

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8972c6b-Screenshot_2024-03-29_at_3.07.19_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

We'll leave **Set Connection Rules** alone for now, though we'll need to create a transform later. Under **Set Connection Name**, we can call it something like '*rollbar-to-discord*'. Now, click the **Create+** button in the lower-right.

Now, we should see a 'Connection Created' popup, with a URL to copy and a notification that Hookdeck is waiting for our first Webhook notification from Rollbar. Copy this URL, as we're going to provide it to Rollbar in the next step.

## Configuring your Rollbar project to send to Hookdeck

Keeping Hookdeck open (so that we can see when it has received a request), head to your Rollbar account. Click Projects, and then click the plus (+) icon to the right of your project name, under the Integrations column. On this new page, under Available Channels, scroll down and click Webhook.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7381680-Screenshot_2024-03-29_at_3.15.41_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

On this new page, enter the Hookdeck URL from the previous step, and then click **Enable Webhook Integration**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7b8399e-Screenshot_2024-03-29_at_3.17.01_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

Now, the page should reload, and you'll notice a toggle to enable/disable the integration, as well as a **Send Test Notification** button - click that now, and then watch the Hookdeck window/tab in your browser to see it update.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/9beae2e-Screenshot_2024-03-29_at_3.19.31_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

You should see it update, but you won't see a notification in Discord. You may also see an error (such as 400). Not to worry! This is because Discord wasn't able to display the test message as-is. We'll correct this now.

In Hookdeck, click Connections in the upper-left, and then click your '*rollbar-to-discord*' connection in the middle. Under this, click the **Transform** button, followed by **Create New Transformation**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/64960b5-Screenshot_2024-03-29_at_3.27.19_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

## Creating a simple transform in Hookdeck

We're now presented with a basic JavaScript (ES6) IDE, allowing us to define a transform function. This applies to the request from Rollbar to Hookdeck, and this function's output will be what is sent to Discord's webhook endpoint.

In the left-hand column, you should see the request from when 'Send Test Notification' was clicked in Rollbar. If not, you can click '**Change Input**' to select it. This will appear under the **Input** tab, though you'll notice we also have an **Output** tab which is handy to ensure that our transform is doing what we want. In the right, there'll be a basic JS function that passes the input to the output. We'll modify this to allow the test notification to make it through Hookdeck, to Discord.

### What does Discord expect?

Let's write something to hone in on `request.body.data.message`, which contains the text that we want for this simple transform. Where does Discord expect this message to be? [Discord's API documentation](https://discord.com/developers/docs/resources/webhook#execute-webhook) goes over this, but a handy 'cheat sheet' with an example Discord webhook payload can be found [here](https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html). As the second link contains an example Discord Webhook payload, let's refer to that. Near the top, there's a `content` key that looks like a good destination for our test message.

The example payload JSON from that site corresponds to the `request.body` key in Hookdeck's editor, so let's write a small function to copy `request.body.data.message` to `request.body.content`:

```coffeescript JavaScript
addHandler('transform', (request, context) => {
  // Copy request.body.data.message to request.body.content for a Rollbar test notification
  // as we're only dealing with request.body, let's set that as payload
  const payload = request.body;
  payload.content = payload.data.message;
  return request;
});
```

Enter this code into the upper-right pane in Hookdeck's IDE, then click '**Run**' right above it. You should notice that the left-hand tab switches to Output, and shows the results of our function.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3f68f59-Screenshot_2024-03-29_at_3.58.57_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

Great! You can see that we've copied the test message from where Rollbar put it, to where Discord expects it. This is basic, but it should be enough to see the test notification in your server. Click **Confirm** here, then **Save** in the parent Connection page, then finally head back to Rollbar and **Send Test Notification** again.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/a9357aa-Screenshot_2024-03-29_at_4.01.12_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

Now, we've created a working pipeline from Rollbar to Discord, thanks to Hookdeck's transform function. However, Rollbar's notifications are much more complex than this test message - luckily, Discord has a great way to display complex data, which we'll go over in the next section.

## Creating a Discord Embed via a Hookdeck Transform

Discord embeds have the ability to display more data about the incoming Rollbar notification, as well as provide a link directly to the item in Rollbar. Here's a small example of a Hookdeck transform that will display item-based alerts (new item, reactivated item, resolved item, and similar). It'll display the item counter, name, last occurrence time, color code the embed based upon the event type, and provide a clickable link to the item in question:

```coffeescript JavaScript
const BLUE = 4944335;
const RED = 13594993;
const GREEN = 7458673;

addHandler('transform', (request, context) => {
  const payload = request.body;

  if (['reactivated_item', 'new_item'].includes(payload.event_name)) {
    color = RED;
  } else if (payload.event_name === 'resolved_item') {
    color = GREEN;
  } else {
    color = BLUE;
  }
  
  let ts = payload.data.item.last_occurrence_timestamp * 1000;
  let last_seen = new Date(ts).toISOString();
  
  let newPayload = {
    "embeds": [
      {
        "title": payload.event_name.replace(/_/g, ' ').concat(": #", payload.data.item.counter),
        "url": payload.data.url,
        "description": payload.data.item.title,
        "color": color,
        "timestamp": last_seen,
        "footer": {
          "text": "Last occurrence"
        }
      },
    ]
  }

  return { ...request, body: newPayload };
});
```

When you've updated your transform, you should begin receiving notifications similar to this:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/954f0a1-Screenshot_2024-04-02_at_3.36.32_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

This is just the tip of the iceberg in terms of types of notifications that you could display in Discord using Hookdeck - Rollbar also has other notification types such as New Deploy and High Occurrence Rate. In addition, Rollbar webhook notifications contain much more information, and this could be displayed in an embed as you'd like. Using the above information, you could inspect these notifications and create a transform that works for you!