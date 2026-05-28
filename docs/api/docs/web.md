<!-- source: https://docs.rollbar.com/docs/web.md -->

# Web (Servlet)

How to configure rollbar-java to work with your web app

## Installation

1. Open your app.gradle of your project, and add the following dependencies.

```java
implementation('com.rollbar:rollbar-web:1.+')
```

2. Log into your [Rollbar account dashboard](https://rollbar.com). Go to Settings → Project Access Tokens and then copy the post\_server\_item access token.

3. In your code, create a `ConfigProvider` implementation that will provide a Rollbar `Config`:

```
import com.rollbar.notifier.config.Config;
import com.rollbar.notifier.config.ConfigBuilder;
import com.rollbar.notifier.config.ConfigProvider;
import com.rollbar.web.example.server.ServerProvider;

public class MyConfigProvider implements ConfigProvider {

  @Override
  public Config provide(ConfigBuilder builder) {
    return ConfigBuilder.withAccessToken("<post_server_access_token>")
        .environment("production")
        .codeVersion("1.0.0")
        .server(new ServerProvider())
        .build();
  }
}
```

4. Setup a listener and filter in your `web.xml` file:

```
 <!-- Rollbar listener and filter -->
    <listener>
        <listener-class>com.rollbar.web.listener.RollbarRequestListener</listener-class>
    </listener>

    <filter>
        <filter-name>Rollbar Filter</filter-name>
        <filter-class>com.rollbar.web.filter.RollbarFilter</filter-class>
        <init-param>
            <param-name>config_provider</param-name>
            <param-value>com.rollbar.web.example.config.MyConfigProvider</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>Rollbar Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```

At this point, all uncaught errors throw by servlets will be logged to Rollbar. If you'd like to send caught items from inside your code, proceed to step 5.

5. Create an instance and send an error and a message.

```
// Create a config builder
ConfigBuilder configBuilder = ConfigBuilder.withAccessToken("<post_server_access_token>");

// Create an instance of the ConfigProvider created in step 3, for example
ConfigProvider configProvider = new MyConfigProvider();

// Create the notifier instance
Rollbar rollbar = new Rollbar(configProvider.provide(configBuilder));

// Send an error and a message
rollbar.error(exception);
rollbar.info("This is an info message");
```

These two items should appear in your project's dashboard within a few seconds.

For further examples and information on using rollbar-web, check out the example app [here](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-web).

> 📘
>
> For more information on rollbar-java, please see the docs [here](https://docs.rollbar.com/docs/java).