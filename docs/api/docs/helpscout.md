<!-- source: https://docs.rollbar.com/docs/helpscout.md -->

# Help Scout

Using Rollbar inside Help Scout

If you use [Help Scout](https://www.helpscout.com/) for support, you can integrate it with Rollbar to see recent errors that affected your users who write in to support.

The Rollbar app will appear on the right sidebar in the Conversation view. It looks like this:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/00c8d2a-rollbar-app.png",
        "rollbar-app.png",
        226,
        529,
        "#e3e5e8"
      ]
    }
  ]
}
[/block]

## Setup Instructions

Note that this requires a paid Help Scout account.

1. In Help Scout, click **Apps** in the top bar
2. Click **Build a Custom App**
3. Click **Create App**
4. Fill out the form as follows. Make sure to replace PROJECT\_READ\_ACCESS\_TOKEN with a `read` scope access token for the relevant project.
   * App Name: Rollbar
   * Content Type: Dynamic Content
   * Callback URL: https//rollbar.com/callback/helpscout/PROJECT\_READ\_ACCESS\_TOKEN
   * Secret Key: PROJECT\_READ\_ACCESS\_TOKEN
   * Debug Mode: Off
   * Mailboxes: check all
5. Click **Save**

Now when you navigate to a conversation in Help Scout, you'll see the Rollbar app showing the most recent 10 occurrences that affected the user who started the conversation.