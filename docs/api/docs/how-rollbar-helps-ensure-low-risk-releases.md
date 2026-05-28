<!-- source: https://docs.rollbar.com/docs/how-rollbar-helps-ensure-low-risk-releases.md -->

# How Rollbar helps ensure Low-Risk Releases

### Pain points

You need to get ideas out quickly and with confidence, but releases are inherently risky. The first minutes or hours after release are when errors often first occur. New deploys are a high-risk environment for errors with a high potential impact on user experience.

Companies are usually hesitant to deploy code to production, as they are concerned about:

* Downtime due to a new release in production,
* Bad user experience when a bug is accidentally released into production

Reducing Mean Time To Acknowledge (MTTA) and remediating issues before users notice them is critical to your business. Here's how Rollbar helps make your releases low risk.

### Customizable notifications help you stay alert and reduce noise

Sometimes folks overlook Rollbar’s powerful customizable notification engine. Notifications can be triggered in specific conditions using filters, and the message format can be customized using variables. This ensures that you are notifying people or teams only when it is important. Rollbar supports several messaging tools, including [email, Slack, PagerDuty, and many more](https://docs.rollbar.com/docs/notifications "email, Slack, PagerDuty, and many more").

Using Rollbar’s customizable notifications can help reduce MTTA (Mean Time To Acknowledge) by taking on the identification and tracking steps. This reduces the manual effort required to notify the right person or team responsible for the affected code.

Thanks to Rollbar’s real-time reporting agent and grouping engine, the right people are notified more quickly and can begin to address the issue without spending valuable time gathering information. These notifications are delivered so quickly that they can also be used to trigger LaunchDarkly feature flags. This allows you to roll out new features with automated kill switches in place to safeguard against unexpected issues.

The most popular notification integration is Slack. We have several [Slack best practices](https://rollbar.com/knowledge-base/reduce-noise-with-the-help-of-slack-notifications-integration/ "Slack best practices"), but one of its many benefits is the Slack Actions feature. Setting up [Slack Actions](https://docs.rollbar.com/docs/slack#slack-actions "Slack Actions") makes managing your items more comfortable without leaving Slack and carrying out actions directly from the Slack notification, like editing the status of an item, change the severity level, and quickly assign it to teammates.

![](https://files.readme.io/efca3a0-small-Screenshot_2023-05-04_at_2.52.26_PM.png)

[Learn how intelligent alerting can help you stay on top of your critical errors and reduce noise in your team’s notification channels.](https://rollbar.com/knowledge-base/intelligent-alerting-helps-you-stay-on-top-of-critical-errors-and-reduce/ "Learn how intelligent alerting can help you stay on top of your critical errors and reduce noise in your team’s notification channels.")\
If you do not yet have notifications set up for your projects, now is the time to do it with our [setup guides](https://docs.rollbar.com/docs/notifications "setup guides").

### Additional context around your errors

When an error occurs it is essential to locate and fix the piece of code causing the issues. By integrating a Git repository with your Rollbar project, you will get additional visibility and context around your errors with the help of [source control](https://docs.rollbar.com/docs/source-control "source control") and code context.

[Code context](https://docs.rollbar.com/docs/code-context "Code context") presents the 5 lines of code before and after the place where the error has most recently activated, saving you time from having to dig into the source code and manually locating the piece of code throwing exceptions. Additionally, Git blame information will mark the last person who worked on that piece of code, and the time of the last edits, thus making sure you can assign the error to the developer who has the most context around the error to follow up on it.

[block:image]{"images":[{"image":["https://files.readme.io/4aa95d429ba2c7de4f7c66d4200907493a9d7d64cabf5e7cee0757cc523f2fee-Screenshot_2024-09-03_at_10.48.28_AM.png",null,null],"align":"center"}]}[/block]

### ML-trained grouping algorithm

Rollbar’s real-time error grouping is powered by machine learning. Our grouping engine is trained regularly against customer errors to identify new error types and patterns and address error mutations.

Our ML-powered grouping engine helps you:

* Eliminate noise caused by missed or false alarms
* Get trustworthy alerts when a bug happens for the first time
* Know which errors are new vs. reoccurring

Real-time ML-powered grouping lays the foundation for future automation as we go from noise to signals to actionable alerts.

Watch our on-demand webinar discussing Automation Grade Grouping for a better understanding of our grouping engine.

<iframe width="560" height="315" src="https://www.youtube.com/embed/HWhpqIJQRT0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Automate your workflows with the help of API

Automations can be built using the [Rollbar API](https://explorer.docs.rollbar.com/ "Rollbar API") for different logic or workflows you might have for various tools. For example, Rollbar provides granular item statistics for each version of code reported to the platform. The item stats info can be queried and used as a thresholding tool for deployment rollbacks. While a deploy is in progress, the Versions API is queried to count the number of new errors incurred by the new code version. If a specific threshold is reached, the user is notified to rollback the given deployment.

Additionally, the API functionality extends into a wide range of features. API calls can be used to update Items without logging into the web app, and the best way to supply de-symbolification maps like JavaScript Source Maps or Apple dSYM maps is to upload them using API calls.

### Deploys and Versions

Rapid releasing leads to a higher number of deployments and code versions. To more effectively track code problems back to their origin, Rollbar offers [deploy tracking](https://docs.rollbar.com/docs/deploy-tracking "deploy tracking") and [version](https://docs.rollbar.com/docs/versions "version") stats.

Deployments are reported to the Rollbar platform using an API call, and the status of the deploy is shown in the Rollbar menu. The deployments will be shown on the Item list for a given project, so you can see if recent deployments may have coincided with new items. You can also see undeployed changes on the Deploy Tracking menu if you select a single project and environment.

Detailed version data is available through the UI as well as through API endpoints. This makes it easy to see when new code revisions cause new errors, allowing you to roll back changes that are causing problems. The Versions menu shows a list of each version detected in Rollbar (either through deployments or item occurrences) with its aggregate stats: the number of new items, reactivated items, and resolved items for each version. Querying this data through the API allows you to automate deployment rollbacks based on newly detected items in a given version.

With the help of Rollbar, developers have more confidence to release more often knowing that they'll be alerted about new or reactivated errors in real-time, have automated workflows to remediate issues before users are affected, and get all the context they need to resolve them quickly.