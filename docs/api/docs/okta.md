<!-- source: https://docs.rollbar.com/docs/okta.md -->

# Okta

SAML auth and SCIM provisioning with Okta

[block:callout]
{
  "type": "info",
  "body": "In order to complete the instructions in this document, you must be an administrator in your Okta account and an owner in your Rollbar account."
}
[/block]

# Features

Okta can be used for both SAML-based authentication and SCIM-based team and user provisioning in Rollbar.

# Requirements

* You must be an administrator in your Okta account and an Owner in your Rollbar account
* To use SCIM provisioning, you must first have the feature enabled in your Rollbar account.  Contact <sales@rollbar.com> for more information.

# Configuration Steps

## Step 1: Add Rollbar as an application in Okta

**In Okta:**

* Go to **Admin > Applications**.
* Click on **Add Application**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7c83b26-okta-add-rollbar.png",
        "okta-add-rollbar.png",
        1192,
        350,
        "#f5f6f6"
      ]
    }
  ]
}
[/block]

* Search for `Rollbar` and click **Add**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/4005168-okta-general-settings.png",
        "okta-general-settings.png",
        731,
        249,
        "#f7f7f7"
      ]
    }
  ]
}
[/block]

* In the **General Settings** screen, enter `Rollbar` as the application label, your Rollbar account name (found at `https://rollbar.com/{accountname}`), and then click **Next**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/35b5011-okta-sign-on-options.png",
        "okta-sign-on-options.png",
        672,
        457,
        "#f8f8f4"
      ]
    }
  ]
}
[/block]

* In the **Sign-On Options screen**, select `SAML 2.0` as the Sign-On Method, set **Application username format** to `Email`, click **Identity Provider Metadata** to download your SAML metadata, then click `Done`.

**In Rollbar:**

* Go to **{account name} Settings > Identity Providers**

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/778e948-rollbar-okta-idp.png",
        "rollbar-okta-idp.png",
        1776,
        656,
        "#f6f6f7"
      ]
    }
  ]
}
[/block]

* Select `Okta` as your identity provider, paste your XML metadata, and click **Save**

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d7eb99a-rollbar-idp-required.png",
        "rollbar-idp-required.png",
        1758,
        320,
        "#f7f9fb"
      ]
    }
  ]
}
[/block]

* Optionally, you may require all Rollbar users to authenticate via Okta to access your account.

**In Okta:**

* Assign groups and users to the Rollbar application.

[block:callout]
{
  "type": "info",
  "body": "After following these steps, Okta users with an existing Rollbar user may log in via Okta.  To enable provisioning of Rollbar users and teams from Okta, follow the instructions in the next section."
}
[/block]

## Step 2: Enable provisioning of Rollbar teams and users

[block:callout]
{
  "type": "info",
  "body": "Provisioning is currently available on **enterprise plans only**.  To learn more or request to have it enabled, please contact [sales@rollbar.com](mailto:sales@rollbar.com)."
}
[/block]

**In Rollbar:**

* Go to **{account name} Settings > Identity Providers**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/c95176a-rollbar-provisioning-options.png",
        "rollbar-provisioning-options.png",
        1762,
        540,
        "#ecf2f6"
      ]
    }
  ]
}
[/block]

* In the **Provisioning Options** section, copy the access token, select **Enable user and team provisioning** and click **Save**.

**In Okta:**

* Go to **Admin >Applications** and select **Rollbar**.

* Click on the **Provisioning** tab then click **Configure API Integration**.

* Select **Enable API Integration**, paste your access token into the **API Token** field, click **Test API Credentials**, and then click **Save**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/24b1267-okta-provisioning-to-app.png",
        "okta-provisioning-to-app.png",
        1011,
        698,
        "#f4f6f6"
      ]
    }
  ]
}
[/block]

* In the Provisioning settings, click on **To App**, then click **Edit**, enable all the options, and click **Save**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/bdf151d-okta-add-push-group.png",
        "okta-add-push-group.png",
        1017,
        388,
        "#f3f4f5"
      ]
    }
  ]
}
[/block]

* Go to the **Push Groups** tab, Click on the **Push Groups** button, and select \*\* Add select **Find Groups by Name**.  Add each of the groups that you'd like to add as teams to your Rollbar account, choosing to push group membership immediately and create the team.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/77e6596-rollbar-teams.png",
        "rollbar-teams.png",
        1195,
        277,
        "#fafafc"
      ]
    }
  ]
}
[/block]

Once your Push group has been added, it will automatically appear as a team in Rollbar, where it can be assigned to projects.  Membership in the team is controlled entirely via your Okta groups.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/05a9635-okta-push-groups.png",
        "okta-push-groups.png",
        1020,
        248,
        "#eff3f4"
      ]
    }
  ]
}
[/block]

Push groups are managed via the **Push Groups** tab in Okta.  To remove a group from Rollbar, select **Unlink push group**, and then **Delete the group in the target app**.

# Known Issues/Troubleshooting and Tips

* For SAML authentication to work correctly, you must set **Application username format** to `Email`.  Other username formats will not work.
* Users cannot be removed from provisioned teams via Rollbar.  This must be done via Okta group membership.