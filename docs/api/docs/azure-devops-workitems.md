<!-- source: https://docs.rollbar.com/docs/azure-devops-workitems.md -->

# Azure DevOps

[block:callout]
{
  "type": "info",
  "body": "[Azure DevOps](https://azure.microsoft.com/en-us/services/devops/) (formerly VSTS) is a project management tool for software development teams that can be used to track Rollbar items."
}
[/block]

Example of what a Rollbar item looks like within Azure DevOps.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/82f9532-Screen_Shot_2019-07-09_at_2.32.27_PM.png",
        "Screen Shot 2019-07-09 at 2.32.27 PM.png",
        2178,
        1070,
        "#f6f6f6"
      ]
    }
  ]
}
[/block]

For general information about Rollbar's issue tracking features, check out the [Issue Tracking guide](/docs/issue-tracking/).

## Authorize Rollbar

In order to create work items in your Azure DevOps account, at least one user in your Rollbar account must authorize Rollbar to access Azure DevOps.

* Click on your avatar and select **User Settings**.
* Click on **Connected Accounts** and select 'Azure DevOps'.
* Click on **Connect to Azure DevOps** and then complete the authorization flow.  Once you've successfully connected to your Azure DevOps account, you will see a message `Your Azure DevOps account is now connected.`
* By default, all of your accounts will be granted access to this integration. Deselect any accounts you don't want to have this Azure DevOps integration.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e885e71-azd.jpg",
        "azd.jpg",
        1742,
        880,
        "#e8eaec"
      ]
    }
  ]
}
[/block]

## Configure Project Settings

Azure DevOps integration is configured on a per-project basis in Rollbar.

* Click on **Settings** then **Notifications**
* Click on **Azure DevOps**.
* Select the authorization token you want to use for the Azure DevOps integration, and then update the Account/Organization, Project, and other settings to your liking, then click **Save Settings**
* Specify the rules you'd like to have for automatically creating and updating Azure DevOps work items.  For more details on the available options, see our [issue tracking guide](/docs/issue-tracking/#automatic-issue-tracking).
* To ensure that your account is correctly configured, click **Send Test Notification**.  If successful, you'll see a link that allows you to view the test task which was created.
* Make sure that you have projects created in Azure DevOps when trying to send a test notification.
* To activate the Azure DevOps integration, set the toggle to **Enabled**.

## Rules & Notifications

This integration also comes with the ability to **create Rules**. These are automatic actions that happen when you set specific triggers. For example, you can create a **new Work Item** when an **Error** occurs for the **100th time**. You can read more [here](https://docs.rollbar.com/docs/notifications).

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/af00059-Screen_Shot_2019-07-09_at_2.23.26_PM.png",
        "Screen Shot 2019-07-09 at 2.23.26 PM.png",
        1630,
        932,
        "#f6f5f7"
      ]
    }
  ]
}
[/block]