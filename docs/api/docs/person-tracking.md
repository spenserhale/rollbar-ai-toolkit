<!-- source: https://docs.rollbar.com/docs/person-tracking.md -->

# People Tracking

Rollbar can track which of your People (users) are affected by each error. This works automatically in our Rails and Django libraries, and is easy to set up for the rest.

You can see which people were affected by any one error:

![](https://files.readme.io/460ad81-small-Screenshot_2023-05-04_at_3.01.47_PM.png)

Or the history of errors experienced by a particular person:

![](https://files.readme.io/f5e34c8-small-Screenshot_2023-05-04_at_3.03.26_PM.png)

As well as the list of all people who have ever experienced an error, sorted by most recent error:

## Setup Instructions

Below are instructions specific to several popular platforms

### Python

```python
# Pyrollbar works by inspecting the `request` for a `rollbar_person`,
# `user` or `user_id` field (in that order). The first one it finds
# it uses as the person data assuming the object contains at least
# the `id` field.

# For a request with only a `user_id` field, the person is sent as
# follows: `{ id: request.user_id }`.

# Many/Most frameworks handle this all automatically. 
# If you are not using a web framework, keep in mind that 
# the `rollbar_person` param needs to be a property of the request object,
# not a dictionary element. See example below:

import logging

class SimpleRequestWithPerson(object):
    def __init__(self, person_dict):
        self.rollbar_person = person_dict
    def __str__(self):
        return str(self.rollbar_person)

old_factory = logging.getLogRecordFactory()

def record_factory(*args, **kwargs):
    record = old_factory(*args, **kwargs)
    record.request = SimpleRequestWithPerson({'id': 'id_as_a_string', 'username': 'the_username', 'email': 'email@example.com'})
    return record

logging.basicConfig(format="%(request)s - %(message)s")
logging.setLogRecordFactory(record_factory)
log = logging.getLogger()
log.warning('this is a warning')
```

### Ruby

```ruby
# For more documentation see:
# https://rollbar.com/docs/notifier/rollbar-gem/#person-tracking

# In Rails, Rollbar will automatically call the `current_user` method
# on the controller. The method name can be overridden in the Rollbar
# configuration:

Rollbar.configure do |config|
 config.person_method = 'current_user_override'
end

# The returned object should have `id`, and optionally `email` and `username`
# methods. These method names can be overridden in the Rollbar
# configuration:

Rollbar.configure do |config|
  config.person_id_method = 'user_id' # default is "id"
  config.person_username_method = 'username' # default is `nil`
  config.person_email_method = 'email' # default is `nil`
end

# If you are *not* using Rails, Rollbar will automatically pick up
# the `rollbar.person_data` key in the Rack environment and pass it
# on to the Rollbar website. It *must* have at least an `id` field.
# `username` and `email` will also be treated specially.
```

### PHP

```php
<?php
function get_current_user() {
    if ($_SESSION['user_id']) {
        return array(
            'id' => $_SESSION['user_id'], // required - value is a string
            'username' => $_SESSION['username'], // optional - value is a string
            'email' => $_SESSION['user_email'] // optional - value is a string
        );
    }
    return null;
}
$config['person_fn'] = 'get_current_user';
```

### Node.js

```javascript
// rollbar.js works by inspecting the `request` for a `rollbar_person`,
// `user` or `user_id` field (in that order). The first one it finds
// it uses as the person data assuming the object contains at least
// the `id` field. Both `email` and `username` are also specially treated.

/**
* This is a pretend function that gets called before the handler for the
* request itself. It adds the appropriate object to the request so Rollbar
* can send the person data
*/
function beforeRequestHandler(request) {
  request.user = {
    id: 42,
    email: 'dadams@example.com',
    username: 'dadams'
  }
}

// For a request with only a `user_id` field, the person is sent as
// follows: `{ id: request.user_id }`. If `user_id` is a function it will
// be evaluated before sending.

// If you are using the Passport authentication library no additional
// configuration is needed to make this work as expected.
```

### Java

```java
Rollbar.PersonData(() => new Person
{
    Id = 123, // required
    Username = "rollbar",
    Email = "user@rollbar.com"
});
```

### .NET

```csharp
using Rollbar;
using Rollbar.DTOs;

public class HelloWorld {
    public static void main(String[] args) {
        var rollbarConfig = new RollbarConfig(<token>)
        { 
            Environment = <env>,
            Person = new Person()
        };
        RollbarLocator.RollbarInstance.Configure(rollbarConfig);
    }
}
```

### Javascript

```javascript
// To track the current user in Javascript you can alter your `_rollbarConfig`
// like so:

var _rollbarConfig = {
  // The usual
  payload: {
    // The usual
    person: {
      id: 42, // required 
      username: 'dadams',
      email: 'dadams@example.com'
    }
  }
}

// If you've already initialized Rollbar and need to set the user *after*
// initialization has already occurred you can use the `configure` method:

Rollbar.configure({
  payload: {
    person: {
      id: 456, // required
      username: "foo",
      email: "foo@example.com"
    }
  }
});
```

### Objective C

```objectivec
// In order to record the current user in an iOS application you must call
// `initWithAccessToken` with the optional `RollbarConfiguration` object.

// Something like this will work:

RollbarConfiguration *config = [RollbarConfiguration configuration];
[config setPersonId:@"42", username:"dadams", email:"dadams@example.com"];

[Rollbar initWithAccessToken:@"POST_CLIENT_ITEM_ACCESS_TOKEN" configuration:config];

// If you've already initialized the gem, you can update the person later by
// getting the `config` object and calling `setPersonId` on it:

[config setPersonId:@"42", username:"dadams", email:"dadams@example.com"];

// The person ID is required.
```

### Android

```java
// After initializing Rollbar you can configure the person with the `setPersonData` method:

@Override
public void onCreate(Bundle savedInstanceState) {
    /** The Usual **/
    Rollbar.init(this, POST_CLIENT_ITEM_ACCESS_TOKEN, ENVIRONMENT);
    Rollbar.setPersonData(CurrentUser.id, CurrentUser.username, CurrentUser.email);
}

// The methods `getUserId()`, `getUsername()` and `getEmail()` should return strings. If the
// `id` method returns null then no person will be recorded. Username and email are optional.
```