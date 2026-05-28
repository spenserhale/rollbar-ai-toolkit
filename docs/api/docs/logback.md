<!-- source: https://docs.rollbar.com/docs/logback.md -->

# Logback

How to configure rollbar-java to work with Logback

## Installing

### Maven

```xml
<dependencies>
  <dependency>
    <groupId>com.rollbar</groupId>
      <artifactId>rollbar-logback</artifactId>
      <version>1.9.0</version>
  </dependency>
</dependencies>
```

### Gradle

```
implementation('com.rollbar:rollbar-logback:1.+')
```

1. Configure Rollbar in your `logback.xml` file.

```
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- encoders are assigned the type
             ch.qos.logback.classic.encoder.PatternLayoutEncoder by default -->
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="ROLLBAR" class="com.rollbar.logback.RollbarAppender">
        <accessToken>[post_server_item_access_token]</accessToken>
    </appender>

    <logger name="com.example.rollbar.logback" level="debug" additivity="false">
        <appender-ref ref="ROLLBAR" />
    </logger>>

    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>

    <shutdownHook class="ch.qos.logback.core.hook.DelayingShutdownHook"/>
</configuration>
```

2. Create a Rollbar logger in your code and log an exception.

```
Logger logger = LoggerFactory.getLogger("com.example.rollbar.logback");
logger.error(exception);
```

For further examples and information on using rollbar-logback, check out the example app [here](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-logback).

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-java, please see the docs [here](https://docs.rollbar.com/docs/java)."
}
[/block]