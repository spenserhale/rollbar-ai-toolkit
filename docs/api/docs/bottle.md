<!-- source: https://docs.rollbar.com/docs/bottle.md -->

# Bottle

How to setup pyrollbar with Bottle | Support Level: Community

Import the plugin and install!
Can be installed globally or on a per route basis.

```python
import bottle
from rollbar.contrib.bottle import RollbarBottleReporter

rbr = RollbarBottleReporter(access_token='POST_SERVER_ITEM_ACCESS_TOKEN', environment='production') #setup rollbar

bottle.install(rbr) #install globally

@bottle.get('/')
def raise_error():
  '''
  When navigating to /, we'll get a regular 500 page from bottle,
  as well as have the error below listed on Rollbar.
  '''
  raise Exception('Hello, Rollbar!')

if __name__ == '__main__':
    bottle.run(host='localhost', port=8080)
```

Be sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your project's `post_server_item` access token, which you can find in the Rollbar.com interface.

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/pyrollbar/issues/new).