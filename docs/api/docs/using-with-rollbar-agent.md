<!-- source: https://docs.rollbar.com/docs/using-with-rollbar-agent.md -->

# Using with rollbar-agent

For even more asynchrony, you can configure the gem to write to a file instead of sending the payload to Rollbar servers directly. [rollbar-agent](https://github.com/rollbar/rollbar-agent) can then be hooked up to this file to actually send the payload across. To enable, add the following in `config/initializers/rollbar.rb`:

```ruby
config.write_to_file = true
# optional, defaults to "#{AppName}.rollbar"
config.filepath = '/path/to/file.rollbar' #should end in '.rollbar' for use with rollbar-agent
```

For this to work, you'll also need to set up rollbar-agent--see the docs [here](https://github.com/rollbar/rollbar-agent) for details.

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-gem, please see the docs [here](https://docs.rollbar.com/docs/ruby)."
}
[/block]

NOTE: The access\_token is being populated in the SDK to be passed to the rollbar-agent. There is also a check in rollbar-agent to determine if there is an access\_token and if there is not will create one. The payload delivered to the agent should be self-sufficient and that is why the SDK requires the access\_token, but it is still wise to keep the access\_token creation in rollbar-agent.