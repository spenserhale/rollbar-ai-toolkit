<!-- source: https://docs.rollbar.com/docs/pagerduty.md -->

# PagerDuty

Connecting Rollbar to PagerDuty

Rollbar can create, update, and resolve Incidents in [PagerDuty](http://pagerduty.com/).

# Step 1: Enable Rollbar integration in PagerDuty

1. From the PagerDuty dashboard, click **Services → Services Directory** from the top navigation bar.
2. Open your Service and choose the **Integration** tab.
3. Click the **+ Add another integration** button.
4. Search for **Rollbar** and click the blue **Add** button.
5. Open the Rollbar Integration panel you added in the previous step.
6. Copy the **Integration Key**.\
   ![](https://files.readme.io/6b7e015-CleanShot_2023-11-06_at_15.21.02.png)

You can find more information on configuring PagerDuty integrations in their [documentation](https://support.pagerduty.com/docs/services-and-integrations#add-integrations-to-an-existing-service).

# Step 2: Configure PagerDuty integration in Rollbar

1. Navigate to the **Projects** settings for your account by selecting the Projects menu item in the left-hand menu.
2. Select the project you want to integrate with PagerDuty.
3. Click **Settings → Notifications → PagerDuty**.
4. Paste the Service API key from PagerDuty and click **Save Settings**\
   ***NOTE**:  You can override the default Integration key in each of your Rollbar notification rules to control which escalation policy is triggered in PagerDuty.*
5. Click **Send Test Notification** to ensure that your configuration is correct
6. Click **Enable**
7. Configure the notification rules.  See [Notifications](https://docs.rollbar.com/docs/notifications) for details of the available configuration options.