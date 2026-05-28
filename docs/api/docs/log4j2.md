<!-- source: https://docs.rollbar.com/docs/log4j2.md -->

# Log4j2

How to configure rollbar-java to work with Log4j2

[block:callout]
{
  "type": "success",
  "body": "[Learn more in our community update](https://rollbar.com/blog/log4j-zero-day-2021-log4shell/?utm_campaign=docs&utm_content=java_log4j&utm_medium=web&utm_source=rollbar_docs)",
  "title": "Curious about Log4J (“Log4Shell”) impact on Rollbar-Java"
}
[/block]

## Installing

### Maven

```xml
<dependencies>
  <dependency>
    <groupId>com.rollbar</groupId>
      <artifactId>rollbar-log4j2</artifactId>
      <version>1.9.0</version>
  </dependency>
</dependencies>
```

### Gradle

```
implementation('com.rollbar:rollbar-log4j2:1.+')
```

1. Configure Rollbar in your `log4j2.xml` file.

```
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">
  <Appenders>
    <Rollbar name="ROLLBAR">
      <accessToken>[post_server_item_access_token]</accessToken>
    </Rollbar>
  </Appenders>

  <Loggers>
    <Root level="debug">
      <AppenderRef ref="ROLLBAR" />
    </Root>
  </Loggers>
</Configuration>
```

2. Create a Rollbar logger in your code and log an exception.

```
Logger logger = LoggerFactory.getLogger("com.example.rollbar.logback");
logger.error(exception);
```

## Known Issues

### Building fat-jar

Due to the issue [LOG4J2-954](https://issues.apache.org/jira/browse/LOG4J2-954), with log4j2, when building a fat-jar, it seems that some .dat files are not concatenated.

Possible solutions would be to use this gradle plugin <https://github.com/TheBoegl/shadow-log4j-transformer> or the maven equivalent one <https://github.com/edwgiz/maven-shaded-log4j-transformer>.

Thanks to [Steve](https://github.com/st-h) for reporting and sending the solution to us, you can find more info about this issue [here](https://github.com/rollbar/rollbar-java/issues/150).

For further examples and information on using rollbar-log4j2, check out the example app [here](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-log4j2).

[block:callout]
{
  "type": "info",
  "body": "For more information on rollbar-java, please see the docs [here](https://docs.rollbar.com/docs/java)."
}
[/block]