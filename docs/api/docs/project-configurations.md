<!-- source: https://docs.rollbar.com/docs/project-configurations.md -->

# Project Configurations

## Getting the Most out of your Projects

Rollbar's multi-project support allows your teams to set up their projects to best suit their needs. This is especially convenient for microservice architectures that have a large number of independent codebases. Each codebase will have its own range of settings and alerts, so each team can have lots of control over its Rollbar experience.

## Project Duplication

Projects that have been configured and properly setup can be used as a template when creating new Projects within Rollbar. New Projects can created quickly with important settings preconfigured including integrations, notifications, and user defined rate limits.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/241aac7ecd8a369487ffd8d89623bab873cd973e1942184f986d03b909515f62-Screenshot_2024-08-30_at_2.20.47_PM.png",
        null,
        ""
      ],
      "align": "center",
      "border": true
    }
  ]
}
[/block]

Duplicating Projects using the Rollbar REST API is supported by using the [Create Project Endpoint](https://docs.rollbar.com/reference/create-a-project) when the Project ID of the source Project is supplied as a parameter.

**Which settings are copied to a new Project?**

* Members/Teams
* Access Token Rate Limits (user defined rate limits)
* Environments
* Source Control Integration (except the repository name)
* Notifications (active and disabled)
* Service Links
* Auto-Resolve settings
* IP Blocklist

**Which settings are NOT copied to a new Project?**

* Source maps
* dSyms
* Flutter Symbols
* ProGuard

> 📘 Using the Rollbar [Terraform Provider ](https://registry.terraform.io/providers/rollbar/rollbar/latest/docs)is another way to define project configuration templates.

## Project Access Tokens

Each project has its own set of access tokens for various purposes such as reporting occurrences and using the Rollbar API. The `post_client_item` and `post_server_item` tokens are used to send occurrences for front-end and back-end frameworks, respectively. The `read` and `write` tokens are used for API calls.

Note - as of the introduction of encrypted access tokens, the scopes `post_client_item` and `post_server_item` can not be combined with other token scopes. `Read` and `write` scopes can be combined if required

### Encrypted Access Tokens

Access tokens are now stored safely in an encrypted format and once created are no longer accessible via the UI or API. The access token will be displayed once upon creation, and after that only the Public ID for the token will be visible in the access token table and in places where tokens would otherwise be displayed.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/5a73c607df221482b252e67cbdd72a299ccea619e8257b209f00db90e540ded0-image.png",
        null,
        "Token creation - this token will not be visible once created"
      ],
      "align": "center",
      "caption": "Token creation - this token will not be visible once created"
    }
  ]
}
[/block]

The public ID for new tokens will be shown in places that the full access token would previously have been displayed, but it cannot be used to create occurrences or make API calls (apart from specific API calls where the publicID is accepted)

### Legacy, V1 & V2 tokens

With the introduction of encrypted tokens, there are three forms of tokens in the system

* Legacy tokens - these are the access tokens created before the switch to encrypted tokens. These tokens will still be displayed in the access token table, can be seen in logs and can be returned via any API calls that return a token. We recommend for security that these tokens are encrypted - the access token will still work in the same way, no code changes are needed, but the access token will no longer be displayed, the publicID for the token will instead
* V1 / 128 bit tokens - these are encrypted tokens with a shorter length, the access tokens have same length as legacy access tokens, so they can be used in places where the newer, longer V2 tokens will be too long.
* V2 / 512 bit tokens - longer tokens with a higher level of encryption. The underlying token is longer in length than previous tokens; the publicID is still the same length as previous tokens.

By default, tokens will be created in the longer, V2 format. Users can create new tokens in the shorter format in the Advanced Options section.

![](https://files.readme.io/59c6e29d4b59fd03a89487e235ca2aae6278db2e51b7ccc591c7dea5d364e69a-image.png)

### Encrypting legacy access tokens

Existing legacy tokens can be encrypted individually using the row options, or as a group using the batch action menu. Once encrypted, the token will no longer be visible, only the publicID, so please make a copy of the token if needed.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/aa4be2b2efc9cc470372ef6b2d1d42c2bd6f97ef3674a253154978584a20ac7c-image.png",
        null,
        null
      ],
      "align": "center",
      "caption": "Encrypt legacy tokens via the batch actions or the row options"
    }
  ]
}
[/block]

<br />

### Occurrence Volume

One of the more important concerns for a Rollbar account administrator is occurrence volume. Since billing and overages are dictated by occurrences, it's crucial to maintain responsible consumption of your allotment. Project access tokens have built-in rate limiting; the rate limit is editable for each token.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e155c2a4481b4dd49201466a38822b2a6afa9098794e8f0172313e7d6b47caae-Screenshot_2024-08-30_at_2.23.03_PM.png",
        "Screen Shot 2021-07-09 at 11.01.42 AM.png",
        2416
      ],
      "align": "center",
      "caption": "A view of some active project access tokens, with the first having a user-defined rate limit of 2000 requests/day"
    }
  ]
}
[/block]

## Source Control

Each project will have its own source control integration since projects usually have their own repositories. You will need to follow the instructions in [this guide](code-context) to get the full benefit of the integration, and this process will also enable the Versions feature for Advanced and Enterprise accounts. By completing this integration, you will have detailed information about the code in the stack traces of your items.

## Notifications

[Notification rules](notifications) control all of your alerting and [issue tracking](issue-tracking) integrations, so it is very important to configure these responsibly and iterate on them as your project evolves. [This article](https://rollbar.com/knowledge-base/intelligent-alerting-helps-you-stay-on-top-of-critical-errors-and-reduce-noise-in-your-notification-channels/) from the Rollbar Knowledge base reviews some best practices for configuring your notification rules.

## Service Links

Service links allow users to quickly navigate from an item detail menu to other tools and services without losing context. By creating templated links using project fields, users will have dynamically generated URLs for quick navigation to other Rollbar menus and external addresses.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/527abe4-Screen_Shot_2021-06-14_at_8.23.10_AM.png",
        "Screen Shot 2021-06-14 at 8.23.10 AM.png",
        2120
      ],
      "align": "center",
      "caption": "A handful of service links"
    }
  ]
}
[/block]

There are 3 different service links in the screenshot above, each one pointing to a different website. The first link does a simple Google search for the item's exception message. The second link executes an RQL query to retrieve all occurrences with the same exception message as the item. The third link opens a Datadog APM search around the request URL from the item.

## Auto-Resolve

One easy way to reduce the amount of housekeeping efforts required for an account is to configure one or both of the auto-resolve options for items in your project. There are two options for auto-resolve, auto-resolving whenever there is a new deploy and auto-resolving inactive items after a certain time window. Each one is configurable by environment, giving you more control and allowing you to prioritize your higher environments.

### Auto-Resolve on Deploy

This option essentially gives you a clean slate for a given project/environment whenever a new version of code is deployed. Any item that does not resurface after the deploy will stay resolved, regardless of whether or not it was actually fixed. This keeps users focused on the more frequent/impactful issues and reduces clutter caused by undergrouping.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/63ffe19-Screen_Shot_2021-07-09_at_1.11.58_PM.png",
        "Screen Shot 2021-07-09 at 1.11.58 PM.png",
        2174
      ],
      "align": "center",
      "caption": "Auto-resolve on deploy"
    }
  ]
}
[/block]

### Auto-Resolve Inactive Items

The other option for auto-resolving in a Rollbar project is through a timer on inactive items. This essentially gives your items an expiration window, and all issues that fall out of that window are automatically resolved. You can set different time ranges for different environments, allowing you to focus more heavily on production issues.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/b54c513-Screen_Shot_2021-07-09_at_1.13.34_PM.png",
        "Screen Shot 2021-07-09 at 1.13.34 PM.png",
        2112
      ],
      "align": "center",
      "caption": "Auto-resolve settings for a sample project. The development environment has a substantially lower timeout window to make sure production issues are prioritized."
    }
  ]
}
[/block]