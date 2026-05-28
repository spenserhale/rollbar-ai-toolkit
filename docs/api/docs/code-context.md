<!-- source: https://docs.rollbar.com/docs/code-context.md -->

# Enable Code Context in a Traceback

Rollbar can show additional lines of context for each entry in a traceback, saving your trouble of jumping to your source code to figure out where exactly an exception occurred.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3678a33-small-Screenshot_2023-05-04_at_2.04.34_PM.png",
        null,
        "Expanded stack frame with 5 lines before and after"
      ],
      "align": "center",
      "caption": "Expanded stack frame with 5 lines before and after"
    }
  ]
}
[/block]

This guide will walk you through the necessary steps to enable this feature.

## Enable Git Integration

Rollbar relies on retrieving data from your Git repository in order to show context around each stack frame.  Each Rollbar project should be connected to a Git repository (typically a 1:1 mapping).  To set up this integration, please see one of the following guides:

* [GitHub](https://docs.rollbar.com/docs/github)
* [Bitbucket](https://docs.rollbar.com/docs/bitbucket)
* [GitLab](https://docs.rollbar.com/docs/gitlab)

## Set `root`/`server.root` and `code_version` in error payloads

*NOTE: the field referenced in this section is called `root` in some libraries, but is referred to as `server.root` for this Javascript example.*

In order for Rollbar to retrieve data from your Git repository, it needs to know:

* What part of the stack frame path includes code from your source repository?
* What is the SHA of the version of the code where the exception occurred?

The first is specified by including a `server.root` property in the JSON payload configuration which is sent back to Rollbar:

```json json
payload: {
  environment: "production",
  code_version: "79b2071e3350a8779d43f203bdd698ae7f34f3e6",
  server: {
    root: "file:///Users/david/Documents/dev-stuff/js-demo/",
    branch: optional
  }
}
```

The `server.root` value should match the file path reported by the items in Rollbar. In this case, we tell Rollbar that everything after `file:///Users/david/Documents/dev-stuff/js-demo/` is our code. This also matches the home directory for the github repo: in this case, <https://github.com/dbw0011/js-demo/> is the home repo and it has `index.html` as a file in the top-level folder. This is an example of a web page being opened from a local drive, so in most cases a web app will have a URL for the path.

By default, Rollbar will retrieve code from your main branch, but you can use the `server.branch` property to tell Rollbar that the code lives in a different branch, or you can specify a different default branch for the project in **Settings → Source Control**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/66cb860-Screen_Shot_2021-05-12_at_9.06.38_AM.png",
        "Screen Shot 2021-05-12 at 9.06.38 AM.png",
        1242
      ],
      "align": "center",
      "caption": "The \"Project Root\" field should be used if there are sub-folders between the home repo and the file."
    }
  ]
}
[/block]

Make sure to set the "Project Root" field when applicable. This field is used to point to folders within the specified repo where the code can be found.

The code version where the error occurred is also required. Add the Git SHA of the deployed version in your JSON payload:

```json
//...
"code_version": "aaaaaabbbbbbccccccddddddeeeeeeffffff"
//...
```

With this configuration set properly, Rollbar knows to retrieve the code context from\
`aaaaaabbbbbbccccccddddddeeeeeeffffff/index.html` within your repository.

Setting `code_version` correctly will also ensure that the Git link in each stack frame points to the correct version of your code:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/4e359c6-small-Screenshot_2023-05-04_at_2.06.15_PM.png",
        null,
        "The Github link in each stack frame goes to the line of code in the version in which the exception occurred."
      ],
      "align": "center",
      "caption": "The Github link in each stack frame goes to the line of code in the version in which the exception occurred."
    }
  ]
}
[/block]

You should now be able to see a stacktrace like this:

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/623f164-small-Screenshot_2023-05-04_at_2.06.57_PM.png",
        null,
        "A javascript stacktrace with Github integration shows code context in  each frame."
      ],
      "align": "center",
      "caption": "A javascript stacktrace with Github integration shows code context in  each frame."
    }
  ]
}
[/block]

## Troubleshooting Tips

## I can't expand the stack frames in my project

This is likely because:

* Git integration is not properly configured in your project.  Rollbar needs read to be able to read from your repository in order to grab context.  You can tell if Rollbar is properly connected by checking for the name of a Github user whose credentials are used to access the repository. Also, make sure you've entered the correct repo name and default branch:

![](https://files.readme.io/654f62f-Screen_Shot_2021-05-12_at_9.06.38_AM.png "Screen Shot 2021-05-12 at 9.06.38 AM.png")

* Rollbar does not have access to your SCM repo - Check your SCM settings and make sure Rollbar has access. For example, in Github, check **Settings → Applications**

![](https://files.readme.io/9983ad1-Screen_Shot_2021-05-11_at_11.57.05_AM.png "Screen Shot 2021-05-11 at 11.57.05 AM.png")

* or your JSON payloads don't contain `server.root` or you've set up an incorrect value for `server.root`.

## I can expand the stack frames, but I see one of the following error messages:

* **Update your credentials** - Check user and/or project Source control credentials in **User Settings** and **Project - Settings - Source Control Manager**

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/53179c5-Screen_Shot_2021-05-12_at_8.51.22_AM.png",
        "Screen Shot 2021-05-12 at 8.51.22 AM.png",
        1167
      ],
      "align": "center",
      "caption": "User Settings - connected accounts"
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d29af22-Screen_Shot_2021-05-12_at_9.06.48_AM.png",
        "Screen Shot 2021-05-12 at 9.06.48 AM.png",
        1528
      ],
      "align": "center",
      "caption": "Project Settings - Integrations"
    }
  ]
}
[/block]

* **Bad Request** - Verify Source Control manager credentials are correct and you've set up the correct repo name in the Source control settings (as seen in the Project Settings - Integrations image above)

* **API Unavailable** - Something is wrong with the external API (GitHub, GitLab or BitBucket). Check the direct link to the source code file.

* **Could not retrieve data from repository** - Your repository is not accessible to Rollbar. Please check your repo settings in your Source control manager's settings.

* **Could not match line with provided code version** or **No data in file** - We are likely gathering file contents from an outdated code version. Please send `code_version` in your item payload for the most accurate results.

If you're still experiencing issues setting up code context for your projects, please contact support!