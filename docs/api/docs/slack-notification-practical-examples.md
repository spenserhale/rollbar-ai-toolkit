<!-- source: https://docs.rollbar.com/docs/slack-notification-practical-examples.md -->

# Slack Notification Practical Examples

Rollbar's Slack notification integration has quite a few powerful features, and some may not be immediately obvious - here's a list of some simple to advanced setups to give you some ideas!

## Message Templates and Filter Rules

When adding a Slack integration for a project, Rollbar provides a set of default Filter Rules, and you can modify them or add any that you'd like. While doing so, you may have noticed that you're able to add filters based upon the timeframe/frequency of the incoming occurrences, or details about the occurrences.

In the following example, I want to be notified of every occurrence that happens where the framework matches Rails version 7.1.1 - maybe I'm testing a new framework version in my development environment, and I want to be really sure that things are good before deploying to production. I also want to take this opportunity to add some more information to the messages that Rollbar posts to Slack, so that I can see this is a Rails 7.1.1 error, and it's in my development environment.

First, I'll head to the project's Slack notification page by going to Projects in the left sidebar, then clicking the Slack icon under the Integrations column next to the project's name. From here, I'll create a new Filter Rule by choosing 'Every Occurrence -> Post Message' under the 'Add Rule' header.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/c751576ae12d7313726b757b2beaf3ede942f3d8aebc4688326909ba65c5b5d9-Screenshot_2024-11-25_at_10.55.04_AM.png",
        "",
        ""
      ],
      "align": "center",
      "sizing": "600px",
      "border": true
    }
  ]
}
[/block]

> 📘 Noise Alert:
>
> Without any filter rules, the 'Every Occurrence' rule used in this example can be very noisy, so please make sure to set up some good filters if you'd like to use it, as well!

Now, we're presented with a modal to setup the rule, such as destination channel, message template, and any filters.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/4895e59427e1e9cb59a901493719832ad4d69350e6db59520e1e0c06cf3692c0-Screenshot_2024-11-25_at_10.56.07_AM.png",
        "",
        ""
      ],
      "align": "center",
      "sizing": "600px",
      "border": true
    }
  ]
}
[/block]

First, I'll choose 'Add New Filter', and then 'Path'. I'm not choosing 'Framework' here, because that would simply show that I'm using Rails, and not the particular version. Rollbar's Path filter rule allows you to check ANY data within the occurrence payload, and by looking at my item in Rollbar, I can see that the version is displayed, as well as some other information I might like to use:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/48231aa4b515fba028c03d41e356b77c7b18498d57fae855267ee2c0b2b6a26a-Screenshot_2024-11-25_at_11.06.54_AM.png",
        "",
        ""
      ],
      "align": "center",
      "sizing": "600px",
      "border": true
    }
  ]
}
[/block]

By choosing 'Path', we're able to hone in on any aspect of the occurrence payload, by using JSON paths. In this case, we're looking for *body.framework*, and we want it to match '*Rails: 7.1.1*' exactly. While here, I also want to add the framework version, environment, and context for good measure to the Slack notification, so I'm going to modify the template in the message box above. I'm keeping the link to the item, as well as the item number and occurrence title (though I've moved that below in this example):

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/c01007dd0ff7f1ef202e24e9bbb15aa17a583c3bd7a03128b6af0cf49cbc9b0a-Screenshot_2024-11-25_at_10.48.42_AM.png",
        "",
        ""
      ],
      "align": "center",
      "sizing": "600px"
    }
  ]
}
[/block]

We've added the filter rule **body.framework == Rails: 7.1.1**, and modified the message template to show some more information. When this rule triggers, we'll see a message in Slack:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7dd5a853e22ecda81a2e09423e2a694381600150834c3fbe199516692d8ec3a5-Screenshot_2024-11-25_at_10.49.46_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

This rule will only trigger if body.framework matches the Rails version we're interested in, and we can see the error level, environment, and context - as well as the Rails version. This could be made a bit prettier, and you may have noticed that some of this information is available elsewhere in the notification, but hopefully this serves as a good example of some of the customization options to help Rollbar's Slack integration work for your use case!

In addition to prettying this up and removing duplicate information, I could have also added an additional filter to this same rule, to only trigger when the environment equaled development - you can easily have multiple filters on the same rule, which is especially handy for 'Every Occurrence' notifications.