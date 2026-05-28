<!-- source: https://docs.rollbar.com/docs/goalie.md -->

# Goalie

How to configure rollbar-gem to work with Goalie

If you're using [Goalie](https://github.com/obvio171/goalie) for custom error pages, you may need to explicitly add `require 'goalie'` to `config/application.rb` (in addition to `require 'goalie/rails'`) so that the monkeypatch will work. (This will be obvious if it is needed because your app won't start up: you'll see a cryptic error message about `Goalie::CustomErrorPages.render_exception` not being defined.)

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]