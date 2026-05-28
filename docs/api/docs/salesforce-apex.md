<!-- source: https://docs.rollbar.com/docs/salesforce-apex.md -->

# Salesforce Apex

Error monitoring for your Salesforce organizations and apps | Support Level: Not Supported

Rollbar Salesforce Apex GitHub Repo: [GitHub Apex Repo](https://github.com/rollbar/rollbar-sf-apex)

## Installation

1. Navigate to the Salesforce Apex installation page(s).

   \[Rollbar for Salesforce Apex package installation V2.6 - Latest]\
   (<https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3h000004bh06AAA>).

   \[Rollbar for Salesforce Apex package installation V2.5]\
   (<https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3h000004jqcUAAQ>).

   \[Rollbar for Salesforce Apex package installation V2.4]\
   (<https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3h000004jqcPAAQ>).

2. Select the group of users you want to install Rollbar for Apex for. **We recommend selecting *Install for All Users*.**

3. Click *Install*.

4. Wait until the package downloads into your organization. You will see the message *Installing and granting access to all Users...* with a loader. Wait several seconds. (Note: Sometimes Salesforce won't proceed directly to the next step, and will send a status email instead. In that case, to continue setup navigate to Installed Packages -> Rollbar -> Post Install Instructions -> View and continue with the next steps.)

![](https://files.readme.io/91b9be7-postinstallView.png "postinstallView.png")

5. Click *Continue Install* and *Setup Forwarding* when prompted. Wait for the Rollbar package components to be configured.

![](https://files.readme.io/963c27c-setupForwarding.png "setupForwarding.png")

6. Save and Verify the Rollbar Token

   i. When the component configuration is finished you will be presented with the package's configuration page.

   ii. Provide your Rollbar project's `post_server_item` access token.

   ```
   a. If you are creating a new project:

       a. You can select *Apex* under *Backend* in Rollbar project creation flow as the framework of your choice.
      
       b. The project onboarding instructions will include your project access token while your project displays the Rollbar's *Waiting for data...* page.

   b. If you already have an existing project:

       a. Go to _Settings_ in your Rollbar account.

       b. Click the name of the project you want to connect with your organization.

       c. Navigate to _Project Access Tokens_ (it should be default section).

       d. Copy the `post_server_item` access token.

       e. Paste the copied access token in the text input in the package's installer.
   ```

   iii. Click *Save and Verify*.

![](https://files.readme.io/046266e-SFSaveverify.png "SFSave\&verify.png")

```
iv. The SDK will send a welcome message to your Rollbar project right away. You should be able to find it in your items view in Rollbar.
```

![](https://files.readme.io/05705d6-update.png "update.png")

7. Configure Rollbar for Apex/Salesforce\
   The configuration page provides access to these settings:

**ReportUncaughtExceptions**\
Report uncaught exceptions that occur in Apex code. When this setting is enabled, uncaught exceptions will be reported automatically. No other code is required.

**ReportFlowErrors**\
Report errors in Flow and Process execution. When this setting is enabled, all Flow/Process errors will be reported automatically. **Note: this feature also requires setting Setup/Process Automation Settings/Send Process or Flow Error Email to Apex Exception Email Recipients.**

**ReportUnknownEmailType**\
The email handler may also receive email types besides Exception and Flow/Process emails. This option allows sending these to Rollbar as generic messages.

**SendReports**\
This enables/disables sending occurrences to Rollbar, allowing sending to be fully disabled without needing to uninstall the package.

**Capture User ID**\
Include the current user's ID with Rollbar reports.

**Capture Username**\
Include the current user's username with Rollbar reports.

**Capture User Email**\
Include the current user's email address with Rollbar reports.

**Environment**\
Allows setting the environment string sent to Rollbar with each report. This setting is global, and works for all occurrences including uncaught exceptions and Flow/Process errors.

8. You can now use Rollbar for Apex in your organization.

## Usage

### Uncaught exceptions and Flow/Process errors

Rollbar requires no additional code to handle uncaught errors once the above configuration is complete.

### Sending arbitrary messages

As a managed package, all calls to Rollbar should be prefixed with the `rollbar` namespace.

Sending a message to Rollbar is as simple as:

```
rollbar.Rollbar.log('info', 'Hello World');
```

### Sending exceptions

```
try {
    // some code here raises exception
} catch (Exception exc) {
    rollbar.Rollbar.log(exc);
}
```

You can copy and paste the above Apex code either to your Developer Console and execute it anonymously (`Developer Console` → `Debug` → `Open Execute Anonymous Window`).

Or just start using Rollbar in your Apex classes.

## Configuration

If you need to change the access token or other configuration of your Rollbar project to which your organization is connected, navigate to Installed Packages -> Rollbar -> Post Install Instructions -> View.

You can also go back to the Rollbar for Apex installer VisualForce page: `RollbarConfigure`.

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>