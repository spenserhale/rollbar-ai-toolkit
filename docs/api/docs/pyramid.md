<!-- source: https://docs.rollbar.com/docs/pyramid.md -->

# Pyramid

How to setup pyrollbar with Pyramid | Support Level: Supported

In your `ini` file (e.g. `production.ini`), add `rollbar.contrib.pyramid` to the end of your `pyramid.includes`:

```ini
[app:main]
pyramid.includes =
    rollbar.contrib.pyramid
```

And add these rollbar configuration variables:

```ini
[app:main]
rollbar.access_token = POST_SERVER_ITEM_ACCESS_TOKEN
rollbar.environment = production
rollbar.branch = master
rollbar.root = %(here)s
```

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

The above will configure Rollbar to catch and report all exceptions that occur inside your Pyramid app. However, in order to catch exceptions in middlewares or in Pyramid itself, you will also need to wrap your app inside a `pipeline` with Rollbar as a `filter`.

To do this, first change your `ini` file to use a `pipeline`. Change this:

```ini
[app:main]
#...
```

To:

```ini
[pipeline:main]
pipeline =
    rollbar
    YOUR_APP_NAME

[app:YOUR_APP_NAME]
pyramid.includes =
    rollbar.contrib.pyramid

rollbar.access_token = POST_SERVER_ITEM_ACCESS_TOKEN
rollbar.environment = production
rollbar.branch = master
rollbar.root = %(here)s

[filter:rollbar]
use = egg:rollbar#pyramid
access_token = POST_SERVER_ITEM_ACCESS_TOKEN
environment = production
branch = master
root = %(here)s
```

Note that the access\_token, environment, and other Rollbar config params do need to be present in both the `app` section and the `filter` section.

Additionally, note that because Pyramid uses INI files for configuration, any changes to nested settings, like the `locals` dictionary, will need to be handled in code.

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/pyrollbar/issues/new).