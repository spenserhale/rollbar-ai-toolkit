<!-- source: https://docs.rollbar.com/docs/summarization.md -->

# Item Summarization

An overview of item summarization fields.

Item summarization enhances the Item Detail page with summary data that helps users understand the data within the occurrences that make up an item. Custom data included within occurrences is also summarized.

Within the new Summary tab, we show the top 3 values for each supported parameter, along with the concentration of each value. This summarization includes custom data that users have sent. In the Details section, for each individual occurrence, we show how typical each supported value is across all the occurrences within the item.

## Summary - Default Fields

By default, some fields are summarized automatically. The fields that go automatically in the summary vary based on the available data in the payload sent to Rollbar, but here is a list of some of the summarized fields:

```text
os.family
os.version
browser.family
browser.version
device.brand
device.model
scm.code_version
scm.branch
context
environment
framework
language
server.cpu
server.host
server.root
server.pid
person.id
person.username
person.email
platform
request.url
request.method
request.query_string
request.body
request.user_ip
notifier.name
notifier.version
```

## Custom Summarization

For custom data to be summarized, they must be sent under the `custom` key.

Here is an example in Ruby:

```Text Ruby
  def alert
    notifier = Rollbar.scope({
      :person => {:id => 8891, :username => "John Doe", :email => "John.Doe@emaildomain.com"},
      :tote => 12345,                               # this will not be included in the summarization tab
      :account_sid => '123',                        # this will not be included in the summarization tab
      :custom => { :test => '444', :try => '12345'} # this will be included in the summarization tab
    })
    notifier.critical("Invalid account type: please contact support")
  end

```