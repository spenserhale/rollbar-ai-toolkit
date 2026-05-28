<!-- source: https://docs.rollbar.com/docs/account-configurations.md -->

# Account Configurations

## Configuring your Rollbar Account

Your Rollbar account does not require much configuration on the web app side to get started; once you have successfully reported your first event from your inaugural project, you are free to begin using Rollbar without any further overhead.

However, there are some best practices for configuring your account and projects that may be more helpful if you set them up from the start. We will review some of these changes at the account level, as well as at the project level.

## Account Settings versus Project Settings

There are two levels of settings in Rollbar, the account-level settings and the project-level settings. Account-level settings are mostly administrative: things like Project, User, and Team management plus account-wide security settings like SSO. Project-level settings are more operational: each project has its own settings menu for configurations like custom fingerprinting, notifications, source control integration, and rate limiting.

Only users that belong to the Owners team can manage account settings; make sure you have the appropriate users added to this team for easy account management. Project ownership can be managed by assigning teams to projects (more on this later).

## Safelist your Domain

One early best practice for Owners is to safelist your company domain to allows users to sign up without waiting on an invitation. This can help prevent snags during user onboarding.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/20604d1-Screen_Shot_2021-07-01_at_12.22.41_PM.png",
        "Screen Shot 2021-07-01 at 12.22.41 PM.png",
        2068
      ],
      "align": "center",
      "caption": "An example of the domain whitelist option configured to allow signups for users with a rollbar.com email address"
    }
  ]
}
[/block]

## Identity Provider Services

Rollbar supports a number of IdP services to allow better management of user accounts and their authentication for login. You will need your SAML metadata in order to configure this for your Rollbar account.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8e876ab-Screen_Shot_2021-07-07_at_4.56.38_PM.png",
        "Screen Shot 2021-07-07 at 4.56.38 PM.png",
        2588
      ],
      "align": "center",
      "caption": "Overview of a fully configured Identity Provider Service"
    }
  ]
}
[/block]

## Rollbar Access Control

Rollbar supports access control through Users, Teams, and Projects; the relationships between these items can help to prevent users from seeing data or making changes where they should not be doing so.

### Users

It is best for each person to have their own Rollbar user account rather than any type of shared service account. Items are assigned by user in Rollbar, and different people have different teams (and thus projects) as well.

### Teams

Users can be members of multiple teams simultaneously. They will have a combination of all permissions from the teams they are assigned.

It is usually best to create teams that mimic your development team setup, but you may need to create additional teams to better separate Rollbar duties.

Creating one team for each Rollbar project is the best way to create data access boundaries. Non-owner teams cannot see any data for projects they have not been assigned through their team assignments. For projects to which they have been assigned, users can see data and (by default) make changes to the project settings. Restricting these permissions can be accomplished by creating new teams wit the Teams API.

The [Rollbar Teams API](https://docs.rollbar.com/reference/create-a-team) offers one additional configuration when creating teams: the `light` and `view` options for access level. A team with the `light` access level will have read and write access for items, but not for all settings. A team with the `view` access level has read-only access to Rollbar and cannot make any changes.

### Projects

Projects are the different functional groups of your code that are tracked by the Rollbar agent. Each project usually represents a single application or service (accounts used to monitor monolithic software may have only 1 project).

Project structure is important to overall account health/performance, and allows each project to be managed and configured independently of the others. Keep the following in mind when designing your project structure:

* 1 deployable/releasable app or service \~ 1 Rollbar project
* 1 git repo \~ 1 Rollbar project

Administrators can also provision projects in a Rollbar account without configuring them, and then assign the projects to the correct teams to allow the Rollbar users on that team to configure the project to their specifications.

## Terraform

Rollbar has a [Terraform provider](https://docs.rollbar.com/docs/terraform) that simplifies all of the aforementioned administrative duties - you can create your desired structure in a TF file and let the provider do the work. The provider requires an **account access token**, not a project access token, with read and write permissions to function.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d1fae42-Screen_Shot_2021-07-08_at_6.40.32_PM.png",
        "Screen Shot 2021-07-08 at 6.40.32 PM.png",
        1556
      ],
      "align": "center",
      "caption": "An example of the `terraform apply` command being executed on a small number of sample resources"
    }
  ]
}
[/block]