<!-- source: https://docs.rollbar.com/docs/reduce-noise-with-the-help-of-slack-notifications-integration.md -->

# Reduce noise with the help of Slack notifications integration

Rollbar supports multiple messaging tools, where your team can get notified about errors and significant events. Integrating a messaging tool with your Rollbar projects helps you manage the incoming alerts, so you won’t overlook any essential event in your projects while you are not overloaded with messages. This way, you can focus on the important things: fixing bugs.

<p>In this article, we will focus on the most popular notification integration: Slack. We will cover:</p>
<ul>
<li>the benefits of using Slack integration in your projects,</li>
<li>the perks of using Slack Actions, and</li>
<li>tips and tricks to get the most out of using Slack (or other) notifications.</li>
</ul>
<p>So let’s get to it then!</p>
<iframe width="720" height="405" src="https://www.youtube.com/embed/6bDKYqA10QM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p><strong>Slack notifications</strong></p>
<p>Slack is one of the most commonly used options for notification integration for Rollbar projects. Once Slack is <a href="https://docs.rollbar.com/docs/slack#setup">integrated</a> with Rollbar, default rules will have been created for your projects, ready to be used. You can also customize these rules and set them up to make sure they serve your team the best (and least annoying) way. </p>
<p>With the help of notifications, you can:</p>
<ul>
<li>set-up the <a href="https://docs.rollbar.com/docs/notifications#notification-types">types of notifications</a> you are interested in,</li>
<li>add <a href="https://docs.rollbar.com/docs/notifications#notification-filters">notification filters</a>, to keep the messages relevant and limit the number of alerts,</li>
<li>include <a href="https://docs.rollbar.com/docs/notifications#notification-variables">notification variable values</a> to customize the content of the messages based on the type of event that triggers the notification.</li>
</ul>
<p>With these set-ups, you can make sure that notifications are only triggered in specific conditions, with tailored messaging that fits your needs. For example, you can set-up an alert for new items happening in the production environment, with severity level ‘Error’ or higher. Neat right?</p>
<p>Moreover, you can act on these notifications without having to leave Slack.</p>

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3df8e96-SlackMessage.png",
        "SlackMessage.png",
        2196,
        388,
        "#000000"
      ]
    }
  ]
}
[/block]

<p><strong>All about Slack Actions</strong></p>
<p><a href="https://docs.rollbar.com/docs/slack#slack-actions">Slack Actions</a> makes managing your items more comfortable without leaving Slack. When Slack notifies you about an event, you will have the action options available right under the notifications, so you can quickly and conveniently act upon them. With the help of Slack Actions, you will be able to:</p>
<ul>
<li>edit the status of an item, e.g., you can quickly resolve, mute, or reopen items,</li>
<li>change the severity level of an item,</li>
<li>assign items to teammates.</li>
</ul>
<p>When a new alert pops-up in Slack, you can easily assign it to your relevant teammate, mark its severity level, and set the status depending on how you want to handle it.</p>
<img src="https://rollbar.wpengine.com/wp-content/uploads/2021/05/Screen_Shot_2020-09-16_at_9.39.53_AM.png" alt="Slack - New Critical Message">
<p><strong>Reduce noise with these tips &amp; tricks</strong></p>
<p>Here are 5+1 quick tips to take your notifications to the next level!</p>
<ol>
<li>Make sure to configure which messages go to which channel, as some might only be relevant to a specific group of users. You can set-it up on the individual rules, making sure that each notification only pops up at the appropriate channel.</li>
<li>In case you want to mention specific users in the Slack message, you can use the &lt;@username&gt; syntax.</li>
<li>To make sure that the right group or team receives the relevant notifications, you can use Slacks default @here @channel @group @everyone mentions as well, you simply have to use the appropriate syntaxes: &lt;!here&gt; &lt;!channel&gt; &lt;!group&gt; &lt;!everyone&gt;.</li>
<li>Use any data value sent in the JSON payload of an item or occurrence as a variable, including custom data to customize your message. (additional explanation??)</li>
<li><a href="https://explorer.docs.rollbar.com/#tag/Notifications">Notifications API</a> is available at Rollbar! You can update notification settings and rules programmatically for all of your projects all at once. You can also check our <a href="https://rollbar.com/blog/introducing-notifications-api-to-automate-notification-settings-across/">blog post on Notifications API</a> for more details.</li>
</ol>
<p>+1. Not a fan of API? You can easily replicate notification settings and rules from one project to another with just the click of a button at the bottom of the Notification Settings page of the project. Just select the project with the preferred notification settings and hit Replace!</p>
<p><strong>Learn more</strong></p>
<p>Read our technical Docs for more details on <a href="https://docs.rollbar.com/docs/slack">Slack notifications</a> and <a href="https://docs.rollbar.com/docs/notifications">other notification integrations</a>.</p>