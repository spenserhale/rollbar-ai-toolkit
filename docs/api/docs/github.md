<!-- source: https://docs.rollbar.com/docs/github.md -->

# GitHub

Rollbar is better with GitHub! Get single-sign on with GitHub, turn your Rollbar Items into GitHub Issues, link your Rollbar stack traces to the code where it happened, resolve items when a particular commit is deployed, and show the commits that were included with each deploy.

## GitHub.com Personal or Organization Account

Get started by going to your [account settings](https://www.rollbar.com/settings/integrations). Navigate to the GitHub tab and click **Connect with GitHub**.

This enables single sign on (you can log in with the **Log in with GitHub** button), and enables the GitHub integration settings for all your projects.

## Github Enterprise Server

### In Github

In order to connect Rollbar to Github Enterprise, you must first configure Rollbar as an OAuth App in Github.

*Note*: you may need to alter your firewall settings to allow connections from rollbar.com as [documented on GitHub](https://docs.github.com/en/enterprise-server/admin/configuration/network-ports) to allow [Rollbar IP addresses](https://docs.rollbar.com/docs/rollbar-ip-addresses).

1. Navigate to Github → Settings → Developer Settings → OAuth Apps → New OAuth App.

2. In the form that appears, enter the following values:
   * Application name: `Rollbar`
   * Homepage URL: `https://rollbar.com`
   * Authorization callback URL: `https://rollbar.com/callback/github_oauth_connect/`

3. Click Update application

4. Generate a new client secret and save the secret. Copy the access token, because it will be hidden in the future within Github.

### In Rollbar

1. Go to Projects → Select Project → Source Control → Github Enterprise
2. In the form that appears, enter the following values:
   * Server root: Enter the server root of your Github Enterprise instance
   * Client ID: Enter the Client ID which can be found in the Rollbar OAuth app just created.
   * Client Secret: Enter the Client Secret just generated and saved.
3. Click Save Server Settings

## Set up Linking

> 📘
>
> For general information about Rollbar's Git integration, check out the [Source Control guide](/docs/source-control/).

Each line in your stack trace can be linked to your code in GitHub if it's hosted in a single repository. This has to be done once per project.

### Link to GitHub

1. Go to **Projects → Select Project → Source Control → Github**
2. Click **Connect to GitHub** (or **Connect to GitHub Enterprise**)
3. Select a repository from the list of available repositories, enter the branch (default is 'master') and a project root within the repository (usually this can be left blank - [click here](/docs/source-control#section-server-root) for more details), then save the settings.
4. Ensure you are sending the `server.root` key with your items. [More details](/docs/source-control#section-server-root)

## Issue Tracking

> 📘
>
> For general information about Rollbar's issue tracking features, check out the [Issue Tracking guide](/docs/issue-tracking/).

After connecting with GitHub you can integrate GitHub issues to automatically create issues when Rollbar items arrive, or to add a 'Create GitHub Issue' button to the item page. You should do this for each project you want integrated with GitHub issues.

To do this, navigate to your project notification settings (**Settings** in Rollbar top nav then **Notifications** on the side nav). Click **GitHub Issues** link and continue to set up the GitHub Issues integration.

Issue tracking with Rollbar is not supported with GitHub Enterprise.

## Resolving Items

With the GitHub integration, you can resolve Rollbar items using git commit messages. See docs at [Resolving Items via Commits](/docs/resolve-via-commits/).

## Code Context

Rollbar can show additional lines of context for each entry in a traceback, saving you the trouble of jumping to your source code to figure out where exactly an exception occurred. [View more detailed documentation.](https://docs.rollbar.com/docs/code-context)

[block:image]{"images":[{"image":["https://files.readme.io/e52235f76719911007321b86382ba4090c32e102bfba072c7b4c10a8e00460f9-Screenshot_2024-09-05_at_9.56.14_AM.png",null,null],"align":"center"}]}[/block]

## Git Blame

Within each frame, Rollbar will attempt to retrieve `git blame` information. You will be able to see the the User Avatar of the person who last touched the code. After hovering over the avatar, you are able to view the associated Commit or Pull Request, and navigate to their respective locations in GitHub.

![](https://files.readme.io/c626848-small-Screenshot_2023-05-04_at_3.13.54_PM.png)

### Auto-suggest owner based on Git Blame information

Advanced and Enterprise customers have the option to have user identified by git-blame auto-suggested in the owner field. For GitHub enabled projects, the auto-suggestion featured can be enabled in the Settings / Integrations / Source Control screen.

![](https://files.readme.io/d800c85-image.png)

When enabled, if git-blame identifies a GitHub user with a related account in Rollbar, that user will be displayed in the Suggested owner section of the owner field in both the item list and item detail pages:

[block:image]{"images":[{"image":["https://files.readme.io/4d5277a7fe12389bce958e018bf48e57ccd401bb162241daabd92ee0073de27f-Screenshot_2024-09-05_at_9.57.55_AM.png",null,null],"align":"center"}]}[/block]

[block:image]{"images":[{"image":["https://files.readme.io/b5edfd3fa1fbe80797292864f53fd8bd360d1bc8d00f7a6187cdb297ffa50f39-Screenshot_2024-09-05_at_9.58.46_AM.png",null,null],"align":"center"}]}[/block]

Once an owner has been assigned to an item, the Suggested Owner section will no longer be displayed

## Troubleshooting

If you encounter authorization problems related to your organization, make sure that you have granted Rollbar access to the org by going to: <https://github.com/settings/applications>