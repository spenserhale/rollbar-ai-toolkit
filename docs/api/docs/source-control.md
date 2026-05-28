<!-- source: https://docs.rollbar.com/docs/source-control.md -->

# Source Control Integration

Connect to Github, Gitlab, and Bitbucket

*Note: This guide will help you complete the source control integration. To enable code context, follow the instructions in [this guide](code-context)*

[block:callout]
{
  "type": "info",
  "body": "For specific setup instructions, see the links to the left."
}
[/block]

## View source from stack traces

When a Rollbar project is connected to a git repository, stack traces will include links to each file in the code version where the error was most recently activated.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/eb2c19a-stacktrace-bitbucket-linked.png",
        "stacktrace-bitbucket-linked.png",
        1228,
        628,
        "#b5b7b9"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "To ensure that stack traces will link to the correct code version in your git repository, make sure to send the full git SHA in the `code_version` attribute when reporting exceptions to Rollbar.  See the instructions for your Rollbar SDKs for specific instructions on using `code_version`."
}
[/block]

## View commits in each deploy

When a Rollbar project is connected to a git repository, the list of commits included in each deploy will include URLs so you can view the diff for each commit as well as the entire deployed code version.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/fcbb451-deploy-source-links.png",
        "deploy-source-links.png",
        832,
        225,
        "#f5f5f6"
      ]
    }
  ]
}
[/block]

## View undeployed commits

When a Rollbar project is connected to a git repository, any commit that has been merged to your master branch but not yet deployed will be highlighted at the top of the Deploys screen.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e7023d4-undeployed_changes.png",
        "undeployed_changes.png",
        527,
        162,
        "#f5f5f5"
      ]
    }
  ]
}
[/block]

## Resolve via commits

By adding an appropriately formatted message when committing a code change, you can tell Rollbar to automatically mark an item as resolved as soon as the commit is deployed to production.

```bash
git commit -m 'resolves rb#12345'
```

To learn more, check out [Resolving Items via commit](/docs/resolve-via-commits/)

## Advanced options

### `server.root`

In order to let our servers know that you want to try linking your stack trace to the files on your git repository, you should send the `server.root` key. A lot of the time that can be `/`, to indicate that all files can be linked to a file in your repository. Other times, you can set it to directories or package name your source files are prefixed by.

If you have source maps enabled and your stack trace is prefixed by `webpack:///./`, you may have to set `server.root = webpack:///./` to complete source linking.

All official Rollbar SDKs can send this key. See the documentation for your Rollbar SDKs to learn exactly how.

An additional benefit of correctly setting `server.root` is that vendor code in your stack trace, portions that don't come from a subdirectory of `server.root`, will be collapsed. It also improves how Rollbar groups that error. We strip off `server.root` from your code where possible before using the filenames as part of the [fingerprint](/docs/grouping-algorithm/#exception-fingerprinting). This means you can host the code from varying locations on your servers, and still correctly see otherwise identical errors as part of a single group.

Code that is considered in-project because of the `project_package_paths` key will not be linked to your repository at this time.