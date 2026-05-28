<!-- source: https://docs.rollbar.com/docs/users-teams-accounts.md -->

# Users, Teams, and Accounts

How to organize and control access to Rollbar

# Users

Each person who logs in to Rollbar should have their own user.

Similar to Github, Rollbar users are intended to be owned by individuals instead of companies.

Rollbar users can belong to multiple accounts, e.g. for work as well as personal projects.

# Accounts

Accounts are meant to represent organizations or can belong to individual users.  Each account has it's own subscription and can contain multiple [projects](projects) and teams.

There are two different types of accounts:

## Personal Accounts

Personal accounts belong to an individual, and have the same name as the user.  When a user named `myrollbaruser` signs up, we automatically create a personal account `https://rollbar.com/myrollbaruser`.

If a Rollbar user changes their username (e.g. to `mynewusername`) and they have a personal account, then the name of the personal account will change too (e.g. to `https://rollbar.com/mynewusername`).

## Organization Accounts

Organization accounts typically represent a company and have a URL like `https://rollbar.com/mycompany`.  Feature-wise, they work the same as personal accounts, except that the name can be changed by any member of the owner team within the account.

## Convert a Personal Account to an Organization Account

To transfer ownership of an account from an individual user to an organization, go to **Account Settings → General → Convert to Organization**, enter a new name for the account, and then convert the account.

# Teams

Users are given access to accounts by inviting them to teams.  Teams are assigned to [projects](projects) to control which error data can be accessed by whom.

Teams exist per account, and can be managed by going to **Account Settings → Teams**.

All Rollbar accounts contain the following built-in teams which cannot be removed nor renamed:

## Owners

The `Owners` team is able to manage projects, teams, and other settings within an account.

## Everyone

The Everyone team automatically includes every user that belongs to any team within the account.  Users can be invited to only the Everyone team, or they may be added to additional teams.

The `Everyone` team is a convenient way to grant access to a project or configure email notifications to all users in an account.

## Team Access Levels

When [creating teams via the API](https://docs.rollbar.com/reference/create-a-team) (this setting is not currently available in the UI), you have the ability to set the `access_level` field as a form of RBAC. There are three access levels:

* **Standard** - default setting. The team will have all permissions for assigned projects, including edit permissions for both items and all project settings.
* **Light** - this access level allows the team to control items and notification settings for all assigned projects. This access level allows users to control what information they receive from the notification system without allowing control over mission-critical project settings like access token rate limiting.
* **View** - this is a read-only access level; users can make changes to the items in the projects but cannot make any changes to project settings.

## Assigning Teams to Projects

To assign a team to a project, go to **Account Settings → Teams → {Team Name} → Add to Project**.

# Signup Mode

By default, users must be invited to Rollbar accounts in order to join them.  You can safelist specific email domains to allow users with verified email addresses to automatically join your account.  This option is available at **Account Settings -> General**.

[block:image]{"images":[{"image":["https://files.readme.io/89d214b-Screenshot_2024-04-25_at_10.25.50_AM.png","Screen Shot 2018-11-27 at 10.25.05.png",null],"align":"center"}]}[/block]

When new users verify an email address that matches your safelisted email domains, they will have the option to join your account.

![](https://files.readme.io/1198eaf-Screen_Shot_2018-11-27_at_10.38.51.png "Screen Shot 2018-11-27 at 10.38.51.png")

# User Invitations

By default, only members of the [Owners](https://docs.rollbar.com/docs/users-teams-accounts#owners) team can invite users into an account. You can allow non-Owners to invite users into teams they belong to, by updating the **User Invitations** setting on the **Account Settings → General** page.

# Removing Users

User removal is accomplished using the delete button on the Users menu.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f81a7ec-small-rollbar-delete-user.png",
        null,
        "Just click the trash can to remove a user from your account."
      ],
      "align": "center",
      "caption": "Just click the trash can to remove a user from your account."
    }
  ]
}
[/block]

For API user removal, use the ["Remove a User from a Team"](https://explorer.docs.rollbar.com/#operation/remove-a-user-from-a-team) endpoint to remove the user from all teams. When a user has been removed from all teams, the user will be automatically removed. This can be accomplished using <a href="https://github.com/rollbar/terraform-provider-rollbar" target="_blank">Rollbar's Terraform provider on Github</a>