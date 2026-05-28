<!-- source: https://docs.rollbar.com/docs/wordpress.md -->

# WordPress

Rollbar SDK for WordPress | Support Level: Supported

This plugin integrates Rollbar into your WordPress installation.

## Installation

### Through [WordPress Plugin directory](https://wordpress.org/plugins/rollbar/)

The easiest way to install the plugin is from the WordPress Plugin directory. If you have an existing WordPress installation and you want to add Rollbar:

1. In your WordPress administration panel go to `Plugins` → `Add New`.
2. Search for "Rollbar" and find `Rollbar` by Rollbar in the search results.
3. Click `Install Now` next to the `Rollbar` plugin.
4. In `Plugins` → `Installed plugins` find `Rollbar` and click `activate` underneath.
5. Log into your [Rollbar account dashboard](https://rollbar.com/login/).
6. Go to `Settings` → `Project Access Tokens`.
7. Copy the token value under `post_client_item` and `post_server_item`.
8. Navigate to `Settings` → `Rollbar`.
9. Enable `PHP error logging` and/or `Javascript error logging` depending on your needs.
10. Paste the tokens you copied in step 7 in `Access Token` section.
11. Provide the name of your environment in `Environment`. By default, the environment will be taken from `WP_ENV` environment variable if it's set otherwise it's blank. We recommend to fill this out either with `development` or `production`.
12. Pick a minimum logging level. Only errors at that or higher level will be reported. For reference: [PHP Manual: Predefined Error Constants](http://php.net/manual/en/errorfunc.constants.php).
13. Click `Save Changes`.

**Warning**: This installation method might not be suitable for complex WordPress projects. The plugin installed this way will be self-contained and include all of the required dependencies for itself and `rollbar/rollbar-php` library. In complex projects, this might lead to version conflicts between dependencies and other plugins/packages. If this is an issue in your project, we recommend the "Advanced" installation method. For more information why this might be important for you, read [Composer + WordPress Resources](https://roots.io/composer-wordpress-resources/).

### Through [WP Packages](https://wp-packages.org/) (if you manage your project with Composer) *recommended*

This is a recommended way to install Rollbar plugin for advanced projects. This way ensures the plugin and all of its' dependencies are managed by Composer.

1. If your WordPress project is not managed with Composer yet, we suggest looking into upgrading your WordPress: [Composer + WordPress Resources](https://roots.io/composer-wordpress-resources/).
2. In your `composer.json` add `wp-plugin/rollbar` to your `require` section, i.e.:

```json
  "require": {
    "php": ">=5.5",
    "wp-plugin/rollbar": "*"
  }
```

3. Issue command `composer install` in the root directory of your WordPress project.
4. In `Plugins` → `Installed plugins` find `Rollbar` and click `Activate` underneath.
5. Log into your [Rollbar account dashboard](https://rollbar.com/login/).
6. Go to `Settings` → `Project Access Tokens`.
7. Copy the token value under `post_client_item` and `post_server_item`.
8. Navigate to `Tools` → `Rollbar`.
9. Enable `PHP error logging` and/or `Javascript error logging` depending on your needs.
10. Paste the tokens you copied in step 7 in `Access Token` section.
11. Provide the name of your environment in `Environment`. By default, the environment will be taken from `WP_ENV` environment variable if it's set otherwise it's blank.
12. Pick a minimum logging level. Only errors at that or higher level will be reported. For reference: [PHP Manual: Predefined Error Constants](http://php.net/manual/en/errorfunc.constants.php).
13. Click `Save Changes`.

## Configuration

### `rollbar_js_config` filter

Allows a plugin to modify the JS config passed to Rollbar.

You can use this e.g. to add the currently logged in user to the `person` field of the payload. With this change, you could have this plugin:

```php
<?php
class RollbarWPUser {

  public function __construct(){
    add_filter( 'rollbar_js_config', array($this, 'rollbar_js_config') );
  }

  function rollbar_js_config($config) {
    if(is_user_logged_in()) {
      $user = wp_get_current_user();  
      
      if(empty($config['payload']['person'])) {
        $config['payload']['person'] = array(
          'id' => $user->ID,
          'username' => $user->user_login,
          'email' => $user->user_email
        );
      }
    }

    return $config;
  }
  
}
```

### `rollbar_plugin_settings` filter

Allows you to manually adjust the settings of the plugin, in case you want to add additional processing after the settings get fetched from the database.

```php
<?php
function adjust_rollbar_settings($settings)
{
  // ...
}

add_filter( 'rollbar_plugin_settings', 'adjust_rollbar_settings' );
```

### Setting the access token in your source code or server configuration

It's possible to set up your access token in your `wp-config.php` file:

```php
define('ROLLBAR_ACCESS_TOKEN', '...');
```

Or you can set the `ROLLBAR_ACCESS_TOKEN` environment variable.

If you set those up, the plugin will automatically fetch the access token accordingly.

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-php-wordpress/issues/new).

> 📘
>
> For more information on rollbar-php, please see the docs [here](https://docs.rollbar.com/docs/php).