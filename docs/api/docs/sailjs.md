<!-- source: https://docs.rollbar.com/docs/sailjs.md -->

# Sails.js

Support Level: Community

Sails.js runs on Node.js and can use all [Rollbar.js options and features](https://docs.rollbar.com/docs/javascript). To use Rollbar with Sails.js, follow these steps for configuration and for capture of unhandled errors.

Add a Rollbar.js configuration file to your Sails.js app.

**/config/rollbar.js**

```javascript
module.exports.rollbar = (function() {
 
 var Rollbar = require('rollbar');
 
 return Rollbar.init({
   accessToken: 'SERVER_ACCESS_TOKEN',
   captureUncaught: true,
   captureUnhandledRejections: true,
   payload: {
     code_version: '1.0.0',
     custom_data: 'foo'
   }
 });
})();
```

The global Rollbar object is available throughout the Sails.js app at `sails.config.rollbar`.

Example:

```javascript
sails.config.rollbar.info(‘Hello world.’);
```

All [Rollbar capabilities and settings](https://docs.rollbar.com/docs/javascript) are available in Sails.js.

Sails.js maintains its own handler for uncaught errors. To modify this handler it must be replaced, as Sails.js does not support chaining handlers. Most applications will do this anyway in order to have a custom 500 page in production. Replacing the handler is easy, since Sails.js will automatically use anything provided in the /api/responses folder.

Here is an example that calls Rollbar with any uncaught error and then calls the Sails.js default handler.

**/api/responses/serverError.js**

```javascript
var defaultServerError = require('sails/lib/hooks/responses/defaults/serverError');
 
module.exports = function serverError (data) {
 // Get access to `sails`
 var req = this.req;
 var sails = req._sails;
 
 // Log to Rollbar
 if (data) {
   sails.config.rollbar.error(data);
 }
 
 // Call default handler
 return defaultServerError.bind(this)(data);
};
```

[block:callout]
{
  "type": "info",
  "body": "For help with importing or requiring Rollbar into your project with Typescript or a version of ECMAScript (ES5/ES6/ES7/ES8/ES9), please see this document [here](https://docs.rollbar.com/docs/importing-or-requiring-rollbar)"
}
[/block]