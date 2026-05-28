<!-- source: https://docs.rollbar.com/docs/jira-integration-best-practices.md -->

# Jira integration best practices

<h3>Perks of an issue tracking integration</h3>

Save time and debug faster by integrating an issue tracking tool with your Rollbar projects so that you can streamline workflows and issue monitoring. Rollbar can integrate with many [popular issue tracking softwares](https://docs.rollbar.com/docs/issue-tracking), making it easy to track Rollbar detected errors in your already existing workflow.

<h3>Integrating an issue tracker allows you to</h3>

Manually:

* Create an issue to track a Rollbar error
* Link a Rollbar error to an already created issue

Automatically:

* Create an issue for new or frequent occurrences
* Reopen a linked issue when a Rollbar error is reactivated or reopened by a user
* Resolve a linked issue when a Rollbar error is resolved

In this article, we will focus on [Jira](https://docs.rollbar.com/docs/jira), one of the most popular issue tracking tool for teams. Please continue reading to learn how to best leverage it with your Rollbar projects.

<h3>Tracking Rollbar detected errors with Jira</h3>

[Setting up Jira](https://docs.rollbar.com/docs/jira) with your Rollbar projects allows you to create issues instantly with rich contextual data and error analytics. Moreover, you can track all these in your already existing issue tracker workflow.

Once you connect Rollbar with Jira, you can significantly improve your monitoring workflow with:

* Link and display root cause exception data in issues
* Set notification rules to open new issues automatically
* Create and assign Jira issues with a few clicks
* Bidirectional syncing, update statuses in both Rollbar and Jira

Detailed error data will be conveniently and easily accessible within Jira, including:

* stack traces,
* error status,
* number total occurrences,
* affected unique IPs,
* first seen date
* last seen date
* when has it reoccurred and regressed

With these data, you can speed up the process of triaging and assigning errors.

<h3>Create unique rules</h3>

You can automate issue creation easily by setting up rules for your project. You have the chance to customize what should trigger the creation or reopening of issues. For example:

* when an item is reactivated, reopen the associated issue
* when an item is resolved, resolve the related issue
* create an issue after 10 occurrences of the same item
* create an issue for each new item
* create issues for certain severity levels

This way, you can make sure that the important things won’t go unnoticed, and your team will get notified of relevant new issues in Jira.

![Jira](https://rollbar.com/wp-content/uploads/2021/05/Screenshot_2020-09-17_at_13.30.26.png)

<h3>Assign issues in Jira</h3>

An error has occurred, and an issue has been created in Jira. You examined and triaged the bug with all the data visible in Jira, and now want to assign it to a teammate. You can easily add a teammate to the Jira issue and call it a day. Or we have a pro tip for you! In Rollbar Notification Settings for Jira, you can add an assignee id, making sure all new errors are assigned automatically to the relevant person in Jira.

This can easily be accomplished by using our Custom Fields options. First, let’s find the User ID by logging into Jira and clicking on the user. It will be displayed in the URL:

![Jira](https://rollbar.com/wp-content/uploads/2021/05/JIRA2.png)

Now, in Rollbar’s Jira settings, paste the following snippet, and add in that User ID.

```
{assignee: {id: USER_ID}}
```

Save it, and all your future Jira tickets will automatically be assigned to this user!

![Jira](https://rollbar.com/wp-content/uploads/2021/05/JIRA.png)

<h3>Automation of workflow</h3>

Make your job easier by setting up what should happen to an item when the item status is changed.

You can set-up that:

* the Jira tickets of resolved items are automatically moved to ‘Done’, or
* reopened items are marked as ‘To-Do’, hence keeping your Jira board organized, even when new and reopening items are creating new tickets or updating your existing issues.

![Jira](https://rollbar.com/wp-content/uploads/2021/05/Screen_Shot_2020-09-16_at_9.34.18_AM.png)

<h3>Learn more</h3>

Are you interested in Jira integration? Read our docs on [how to set-up Jira with your Rollbar project](https://docs.rollbar.com/docs/jira) and enjoy the improved monitoring workflow. For additional issue trackers, check [our docs](https://docs.rollbar.com/docs/issue-tracking) and see what else is available.