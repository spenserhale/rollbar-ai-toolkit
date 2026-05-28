<!-- source: https://docs.rollbar.com/docs/scala.md -->

# Scala

How to configure rollbar-java to work with your Scala app

## Installation

### Maven

```xml
<dependencies>
  <dependency>
    <groupId>com.rollbar</groupId>
      <artifactId>rollbar-java</artifactId>
      <version>1.9.0</version>
  </dependency>
</dependencies>
```

### Gradle

```
implementation('com.rollbar:rollbar-java:1.+')
```

1. Configure Rollbar

```
import com.rollbar.notifier.Rollbar
import com.rollbar.notifier.config.ConfigBuilder

import scala.util.control.NonFatal

val config = ConfigBuilder.withAccessToken(sys.env("ROLLBAR_ACCESSTOKEN"))
      .language("scala")
      .codeVersion("1.0.0")
      .environment("production")
      .build();

val rollbar = new Rollbar(config)
```

2. Send an error and a message.

```
rollbar.error(exception);
rollbar.info("This is an info message");
```

These two items should appear in your project's dashboard within a few seconds.

For further examples and information on using rollbar-java for Scala, check out the example app [here](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-scala).

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-java, please see the docs [here](https://docs.rollbar.com/docs/java)."
}
[/block]