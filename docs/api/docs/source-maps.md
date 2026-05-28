<!-- source: https://docs.rollbar.com/docs/source-maps.md -->

# Source Maps

> ❗️
>
> If you minify your JavaScript code, you need to provide Rollbar with access to your source maps to understand your items' stack traces.

Benefits of providing your source maps to Rollbar include:

* Stack traces will contain the original source filename, line number, method name, and code coordinates
* Error grouping will be more resilient to code changes

***

# Getting started

To successfully upload source maps, we will walk through the following steps.

1. Raise descriptive JavaScript errors
2. Configure \_rollbarConfig to support source maps
3. Upload your source map to Rollbar
4. Verify source maps work!

## **1. Raise descriptive errors from JavaScript**

To make sure you can view the full details of the stack trace, ensure that your errors are being raised correctly. For the full details of stack traces to appear we need to have information about column numbers in the error object. You'll get one of these if you give Rollbar an Error, in a browser that provides column numbers.

```javascript
// Make sure you raise error object like this
try {
  throw new Error("Something went wrong");
} catch (e) {
  Rollbar.error(e);
}


// This will not send an error object with some browsers
Rollbar.error('Something went wrong');
```
```coffeescript
# Make sure you raise error object like this
try
  throw new Error('Something went wrong')
catch e
  Rollbar.error e

# This will not send an error object with some browsers
Rollbar.error 'Something went wrong'
```

> 📘
>
> In more recent versions of Chrome and Firefox, uncaught errors (reported by the browser's top-level error handler, 'window\.onerror') will have column numbers. The HTML5 Spec has been updated to require this, so other browsers may add this support in the future.

Uncaught errors (reported by the browser's top-level error handler, `window.onerror`) will have column numbers in recent versions of Chrome and Firefox. The HTML5 Spec has been updated to require this, so other browsers may add this support in the future.

## **2. Configure the rollbar.js SDK to support source maps**

Source maps are automatically enabled in your project, but you still need to add the `code_version` parameter to the `_rollbarConfig` object:

```javascript
var _rollbarConfig = {
  accessToken: "{YOUR ROLLBAR ACCESS TOKEN}",
  captureUncaught: true,
  captureUnhandledRejections: true,
  
  payload: {
    environment: "{YOUR ENVIRONMENT}",
    client: {
      javascript: {
        source_map_enabled: true, // false by default
        
        // -- Add this into your configuration ---
        code_version: "{CODE VERSION}",
        // ---------------------------------------
        
        // Optionally have Rollbar guess which frames the error was 
        // thrown from when the browser does not provide line 
        // and column numbers.
        guess_uncaught_frames: true
      }
    }
  }
};
```
```coffeescript
_rollbarConfig = 
  accessToken: '{YOUR ROLLBAR ACCESS TOKEN}'
  captureUncaught: true
  captureUnhandledRejections: true
  payload:
    environment: '{YOUR ENVIRONMENT}'
    client: javascript:
      source_map_enabled: true
      code_version: '{CODE VERSION}'
      guess_uncaught_frames: true
```

**\_rollbarConfig reference**

[block:parameters]
{
  "data": {
    "h-0": "",
    "h-1": "",
    "0-0": "`accessToken`",
    "0-1": "Items sent through a given access token arrive in that access token's project and respect the rate limits set on that access token.",
    "1-0": "`source_map_enabled`",
    "1-1": "For source maps to work, this needs to be true. This property is a boolean.  \n  \nDefault: false",
    "2-0": "`environment`",
    "2-1": "The environment that your code is running in.  \n  \nDefault: unspecified",
    "3-0": "`code_version`",
    "3-1": "A string up to 40 characters describing the version control number (i.e. git SHA) of the current revision. Used for linking filenames in stack traces to your source control.  \n  \nRollbar understands these formats:  \n  \n _ semantic version (i.e. \"2.1.12\")  \n _ integer (i.e. \"45\")  \n \\* git SHA (i.e. \"3da5415...\")"
  },
  "cols": 2,
  "rows": 4,
  "align": [
    "left",
    "left"
  ]
}
[/block]

> 📘
>
> For reactive JS applications, you might need to call `Rollbar.configure()` again after the Rollbar library has been initialized.

## **3. Upload your source map file(s)**

> 📘
>
> There are multiple ways of generating source maps with various tools. We found that using [UglifyJS2](https://github.com/mishoo/UglifyJS2) has been the most reliable way of generating source maps.  Here is a simple example of using uglify to generate a source map with sources included: `uglifyjs script.js --source-map "includeSources=true" --output script.min.js`. For advanced functionality refer to UglifyJS2's technical docs.

> ❗️
>
> You need to use your post\_server\_item access token to send us your source map found here: **Settings → Project Access Tokens** and copy the token from `post_server_item`

> ❗️
>
> If you generated your source maps without sources, then you need to make sure to follow the 'Uploading a source map with sources not included' step

**Source map upload cURL command reference**

[block:parameters]
{
  "data": {
    "h-0": "",
    "h-1": "",
    "0-0": "`access_token`",
    "0-1": "You need to use your `post_server_item` found in your project access tokens settings page found here: **Settings → Project Access Tokens**",
    "1-0": "`code_version`",
    "1-1": "payload.client.javascript.code_version from your \\_rollbarConfig",
    "2-0": "`minified_url`",
    "2-1": "URL to your minified file **without schema **(e.g., //[www.example.com/js/script.min.js](http://www.example.com/js/script.min.js)).  \n  \nFor local file path if the URL is e.g. `file://absolute/path/to/script.min.js`, you will need to use `//absolute/path/to/script.min.js`",
    "3-0": "` source_map`",
    "3-1": "(optional) Location to your local source map file, e.g, script.min.js.map"
  },
  "cols": 2,
  "rows": 4,
  "align": [
    "left",
    "left"
  ]
}
[/block]

Depending on how your application is designed, your source files, maps and properties may vary. You have three options, and for each option, we will provide a simple example.

1. Let Rollbar automatically download your source map file
2. Uploading a source map with sources included
3. Uploading a source map with sources not included

**Upload Option 1: Uploading a source map with sources included**

Note that you will need to provide the source map with sources to upload if the `sourceMappingURL` is not provided in the minified JS file.

```shell
curl https://api.rollbar.com/api/1/sourcemap \
-F access_token={accessToken} \
-F version={code_version} \
-F minified_url={minified_url} \
-F source_map=@{source_map}
```

It is best to add the cURL command to your deploy script so you do not have to manually add all of your source maps.

**Upload Option 2: Let Rollbar automatically download your source map file**

As specified in the [Source Map Specification](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit), you should place a comment like the following at the bottom of your minified JavaScript files. Please reference the Source Map Specification for additional details:

```javascript
//# sourceMappingURL=URL_TO_SOURCE_MAP
```

This is the easiest method, but not suitable for all cases (e.g. if you don't want to expose your source map or code to the public web). It is also less reliable than the upload method, since the source map won't be downloaded yet when the first few errors come in. We recommend the upload method for production use.

> ❗️
>
> If Rollbar fails downloading the Source Map file (i.e., the response code is not 200), then Rollbar won’t try to fetch it again if another occurrence comes in within a 10 minute window.
>
> After the 10 minute window passes and another occurrence comes in, then Rollbar will try again.

You can disable auto-download by removing the `sourceMappingURL` comment from the file.

If you're using the Automatic Download method, you can notify our API to trigger a download for each of your minified files. Doing this will reduce the number of errors that the source map isn't applied to (since we'll have a greater chance of downloading the source map before the first error after a deploy occurs).

Here is a sample command:

```shell Shell
curl https://api.rollbar.com/api/1/sourcemap/download
  -F access_token=aaaabbbbccccddddeeeeffff00001111 \  
  -F version=92429d82a41e930486c6de5ebda9602d55c39986 \  
  -F minified_url=https://example.com/static/js/example.min.js
```

**Upload Option 3: Uploading a source map with sources not included**

> ❗️
>
> You will need to use this option if your source map does not have sources included

If you did not include sources in your source maps then you can include sources through the cURL command by appending multiple files. For example, if you want to add a `site.js` and `util.js`, you can do so using this example.

```shell
curl https://api.rollbar.com/api/1/sourcemap \
-F access_token={accessToken} \
-F version={code_version} \
-F minified_url={minified_url} \
-F source_map=@{source_map}
-F static/js/site.js=@static/js/site.js \
-F static/js/util.js=@static/js/util.js
```

**Upload Option 4: Uploading your source maps via the Rollbar-CLI**

With the use of our CLI tool, you can upload source maps to our servers just by specifying the path to the minified JS file, the code version, and the Server-Side Access Token for your project. For more detailed information on installing and using, check out the [docs](https://github.com/rollbar/rollbar-cli#rollbar-cli).

## **4. Verify source maps work!**

After the `cURL` command completes successfully, new exceptions from minified code should be rendered in your items detail page! Additionally, you can view and manage your source map files here **Settings → Source Maps** .

> 🚧 Source Maps are not backwards compatible
>
> Exceptions from minified code prior to uploading a source map will not be processed. Only new exceptions will be processed with the source maps.

***

# How to manage and configure Source Maps

## React Native

Rollbar uses the filename part of each stack frame to determine the correct source map to load. Some React Native build environments and tool chains generate dynamic paths in these filenames, containing for example, UUIDs or other IDs that change dynamically. This makes it impossible to know the full and correct path and filename when uploading source maps.

Rollbar.js works around this by rewriting the original filename to only include the static component of the filename needed to match the correct source map. Rollbar.js rewrites the most common filename patterns this way, and also allows configuring custom patterns.

Here are typical file names after being rewritten.

Android:\
'http\://reactnativehost/index.android.bundle'

iOS:\
'http\://reactnativehost/main.jsbundle'

After matching the static part of the filename, Rollbar.js always prepends ‘http\://reactnativehost/’.

The default patterns supported in the current version of the Rollbar.js SDK are:

```javascript
"^.*/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/[^/]*.app/(.*)$",
"^.*/[0-9A-Fa-f]{64}/codepush_ios/(.*)$",
"^.*/[0-9A-Fa-f]{64}/codepush_android/(.*)$"
```

To enable Rollbar.js to use a different rewrite pattern, use the rewriteFilenamePatterns configuration key.

```javascript
var _rollbarConfig = {
  rewriteFilenamePatterns: [
    "regex with one capturing group"
  ]
}
```

The patterns added via rewriteFilenamePatterns replace the default patterns and should include one capturing group, which contains the intended static filename.

**Example:**

The Hermes JS engine for React Native generates stack trace paths such as `//reactnativehost/address at index.android.bundle` - here's an example for `rewriteFilenamePatterns` that should format these correctly for Rollbar's Source Maps feature:

```coffeescript JavaScript
// ...  
rewriteFilenamePatterns: [
    "^address at (.*)$"
  ]
```

<br />

## Webpack plugin

There is a community-maintained [Rollbar Sourcemap Plugin for Webpack](https://github.com/thredup/rollbar-sourcemap-webpack-plugin).  Please check the [Readme doc](https://github.com/thredup/rollbar-sourcemap-webpack-plugin/blob/master/README.md) for details on the project and usage instructions.

## Vite plugin

There is a community-maintained [Rollbar Sourcemap Plugin for Vite](https://github.com/clinggroup/vite-plugin-rollbar).  Please check the [Readme doc](https://github.com/clinggroup/vite-plugin-rollbar/blob/main/README.md) for details on the project and usage instructions.

## Using Source Maps On Many Domains

If your minified source code is deployed on many domains, use the following code to apply source maps:

```javascript
var _rollbarConfig = {
  // ...
  transform: function(payload) {
    var trace = payload.body.trace;
    // Change 'yourdomainhere' to your domain.
    var locRegex = /^(https?):\/\/[a-zA-Z0-9._-]+\.yourdomainhere\.com(.*)/;
    if (trace && trace.frames) {
      for (var i = 0; i < trace.frames.length; i++) {
        var filename = trace.frames[i].filename;
        if (filename) {
          var m = filename.match(locRegex);
          // Be sure that the minified_url when uploading includes 'dynamichost'
          trace.frames[i].filename = m[1] + '://dynamichost' + m[2];          
        }
      }
    }
  }
}
```
```coffeescript
_rollbarConfig = transform: (payload) ->
  trace = payload.body.trace
  # Change 'yourdomainhere' to your domain.
  locRegex = /^(https?):\/\/[a-zA-Z0-9._-]+\.yourdomainhere\.com(.*)/
  if trace and trace.frames
    i = 0
    while i < trace.frames.length
      filename = trace.frames[i].filename
      if filename
        m = filename.match(locRegex)
        # Be sure that the minified_url when uploading includes 'dynamichost'
        trace.frames[i].filename = m[1] + '://dynamichost' + m[2]
      i++
  return
```

Be sure to change your hostname in the `minified_url` parameter to `dynamichost` when uploading your source map files:

```shell
curl https://api.rollbar.com/api/1/sourcemap \
  -F access_token=aaaabbbbccccddddeeeeffff00001111 \
  -F version={code_version} \
  -F minified_url=http://dynamichost/static/js/example.min.js \
  -F source_map=@static/js/example.min.map \
  -F static/js/site.js=@static/js/site.js \
  -F static/js/util.js=@static/js/util.js
```

## Manage Project Source Maps

Source maps are stored per project and are accessible in your **Project Settings --> Source Maps**

Within the source maps view for a project, you can:

* View all attempts to download and upload source maps
* Download source maps.
* Delete source maps.
* Search for source maps based on `code_version` or the name of the associated Javascript file.

***

# Resources

## Video Tutorial

This short video shows a process of uploading source maps when a new code version is deployed to an environment.\
It also illustrates some common problems such as

* Source map not uploaded for a given code\_version
* Uploaded source map does not match the URL of the minified JS file

[Rollbar Video Tutorial](https://www.youtube.com/watch?v=vs3ovG7RpQs)

## Community contributions

Members of the Rollbar community have created some plugins to integrate the source map upload step into their build process. The Rollbar team does not maintain them, but we are happy to provide support to maintainers.

| Build System | Link                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------- |
| Gulp         | [gulp-rollbar](https://github.com/ismriv/gulp-rollbar)                                          |
| Webpack      | [rollbar-sourcemap-webpack-plugin](https://github.com/thredup/rollbar-sourcemap-webpack-plugin) |
| Vite         | [vite-plugin-rollbar](https://github.com/clinggroup/vite-plugin-rollbar)                        |

If you've written a plugin or other resource that you'd like us to link here, please let us know! Send us an email at <[support@rollbar.com](mailto:support@rollbar.com)>

# FAQ

## What if I have more than one minified file?

That's fine -- just upload a source map package for each minified file, each time your code version changes. Note that the code version is global to your project, so you will have to upload the package for each one every time you deploy, even if only one of them changed.

## Does it matter what tool I used to build the source map?

It shouldn't, as long as the tool builds source maps adhering the V3 or later of the source map spec.

We've tested with [Webpack](https://webpack.js.org/), [Closure Compiler](https://developers.google.com/closure/compiler/) and [UglifyJS 2](https://github.com/mishoo/UglifyJS2). If you're using something else and having problems, please let us know.

## Are source maps with 'sections' supported?

Yes. Rollbar understands source maps that contain 'sections' (such as those generated by React Native tools.)

## What happens if I don't upload the source map package?

We will assume that the source map is publicly available: we attempt to download the minified file, locate the `#sourceMappingUrl=` comment at the end of that file and attempt to download the source map from that url. However, we'll still process incoming errors immediately, but skip the minified-to-source translation unless the source map is successfully retrieved.

## Where is my data stored?

The source map package (including the source map itself and any source files you upload) is stored in our MySQL cluster. We encrypt the contents with AES-256-CBC.

Derived data is stored on our dedicated hardware in the clear. This includes:

* file-line-column mappings, stored in Memcache
* un-minified file, line, column, and code snippet, stored in our MySQL cluster

## How long will my data be stored for?

The data retention process for symbol map files (Source Maps, Proguard files, iOS dSYM files, and Flutter symbol files) is that files which are unused for 90 days, as determined by not having any occurrences on their code\_version, will be automatically deleted.

## Can I still set up source linking when using source maps?

Yes, you just have to set your [`server.root`](https://docs.rollbar.com/docs/source-control#section--server-root-) in the \_rollbarConfig object to match the prefix of your stack traces. For example, if your stack traces are prefixed by `webpack:///./`, try setting `server.root = 'webpack:///./'`.

```javascript
_rollbarConfig = {
    ...
    server: {
        root: "webpack:///./"
    }
    ...
```

***

# Troubleshooting

> 📘 To troubleshoot a specific error visit our [ Source Maps Errors documentation](https://docs.rollbar.com/docs/source-map-errors)

## Here are a few common problems:

* Missing one or both of the config params in the on-page JS snippet. See Step 1 and make sure you're setting `payload.client.javascript.source_map_enabled = true` and your `payload.client.javascript.code_version` matches your occurrence's `code_version`
* If using the Upload method: `code_version` used in the one-page snippet does not match the version provided in the upload call
* If using the Automatic Download method: either the minified file doesn't have a `#sourceMappingUrl=` comment at the end of the file, or source map files and minified javascript source files are on a host that's not reachable from the public internet (e.g. they are gated behind an authorization wall). Fix: use the Upload method instead.
* The Javascript error that you are expecting to be un-minified does not have column numbers, and you haven't enabled `guess_uncaught_frames = true`. We need column numbers to be able to apply the source map without guessing--see the first section of "Basic Setup" above for more details.
* When uploading a source map, the value of `minified_url` must be the full URL of the minified file without the schema. As a rule of thumb, we apply a source map to a frame when the frame's file name matches with the `minified_url` of the source map.
* If you're a Rails asset pipeline user, be sure you aren't generating source maps for an already minified file.
* If you just uploaded your source map and occurrences are still not getting properly mapped, please be patient. We don't re-attempt to resolve a `minified_url` for 24 hours, so if previously we tried and failed to access it, we might find the uploaded source map only a day later.

If you're still not able to get source maps working, we're here to help!  Simply message us via the in-app chat or email <[support@rollbar.com](mailto:support@rollbar.com)>