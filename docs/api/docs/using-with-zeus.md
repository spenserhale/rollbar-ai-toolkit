<!-- source: https://docs.rollbar.com/docs/using-with-zeus.md -->

# Using with Zeus

How to configure rollbar-gem to work with Zeus

Some users have reported problems with Zeus when `rake` was not explicitly included in their Gemfile. If the zeus server fails to start after installing the rollbar gem, try explicitly adding `gem 'rake'` to your `Gemfile`. See [this thread](https://github.com/rollbar/rollbar-gem/issues/30) for more information.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]