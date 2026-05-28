<!-- source: https://docs.rollbar.com/docs/java.md -->

# Java

Rollbar SDK for Java and Android | Support Level: Supported

> 👍 Curious about Log4J (“Log4Shell”) impact on Rollbar-Java
>
> [Learn more in our community update](https://rollbar.com/blog/log4j-zero-day-2021-log4shell/?utm_campaign=docs\&utm_content=java_home\&utm_medium=web\&utm_source=rollbar_docs)

## Quick Start

For the most basic Java applications use this to install rollbar-java:

```java
implementation('com.rollbar:rollbar-java:1.+')
```

> 🚧 Gradle dependency versions
>
> For a test application, using `1.+` will quickly pull the latest version of rollbar-java. In a production scenario it's good practice to include the full version, eg. `1.10.0`. The latest version is always available on [Maven Central.](https://search.maven.org/artifact/com.rollbar/rollbar-java)

If you require direct access to the underlying API objects include `rollbar-api` as a dependency. For Android include `rollbar-android`. For web projects include `rollbar-web`.

To configure rollbar-java and send an error and a message:

```java
Config config = ConfigBuilder.withAccessToken("<post_server_item_access_token>")
        .environment("production")
        .codeVersion("1.0.0")
        .build();
Rollbar rollbar = new Rollbar(config);
rollbar.error(exception);
rollbar.info("This is an info message");

// ...
// Call close just before the application exits to send any queued events
rollbar.close(true); 
```

These two items should appear in your project's dashboard within a few seconds.

The docs linked below will help you get Rollbar up and running quickly in various platforms and toolchains.

|                                     |                                          |                                  |
| :---------------------------------- | :--------------------------------------- | :------------------------------- |
| [Android](https://docs.rollbar.com/docs/android)  quick start | [Gradle](https://docs.rollbar.com/docs/gradle) information         | [Web](https://docs.rollbar.com/docs/web) quick start       |
| [Logback](https://docs.rollbar.com/docs/logback)  quick start | [Spring MVC](https://docs.rollbar.com/docs/spring-mvc) quick start | [Log4j2](https://docs.rollbar.com/docs/log4j2) quick start |
| [Scala](https://docs.rollbar.com/docs/scala)  quick start     | [Kotlin](https://docs.rollbar.com/docs/kotlin)  quick start        |                                  |

## ProGuard Deobfuscation

If you use ProGuard to obfuscate your code in production, reported stack traces will not be very useful in most cases.

Rollbar provides a way for you to upload the `mapping.txt` file generated in the obfuscation process so that stack traces can be deobfuscated as they are reported.   Our current max file size for upload is 440 MB.  If you have a large `mapping.txt` file, we suggest you compress the file before uploading for a better experience.

Here is an example cURL command to upload a `mapping.txt` file:

```
curl 'https://api.rollbar.com/api/1/proguard' \
  -F access_token=POST_SERVER_ITEM_ACCESS_TOKEN \
  -F version=0.0.10 \
  -F mapping=@path/to/mapping.txt
```

Where `version` matches the `android:versionName` in your app's `AndroidManifest.xml`, corresponding to the version the `mapping.txt` was generated for.

After uploading, any future reported exceptions for the specified version will automatically be deobfuscated using the mapping file.

By default, file names and line numbers are removed by ProGuard. To preserve this information to make debugging easier, add the following to your `proguard-project.txt`:

`-keepattributes SourceFile,LineNumberTable`

## Usage

There are currently six libraries in this repository:

* `rollbar-api`
* `rollbar-java`
* `rollbar-web`
* `rollbar-android`
* `rollbar-log4j2`
* `rollbar-logback`

`rollbar-api` is a set of data objects representing structures that make up the payload the backend API understands.

`rollbar-java` has the core functionality for taking input from your code and transmitting it to our API. `rollbar-java` depends on `rollbar-api` and provides many points of customizing its behavior.

`rollbar-web` is a higher level abstraction built on `rollbar-java` which intended to be integrated into web servers based on the Servlet API.

`rollbar-android` is a library for use in an Android environment built on `rollbar-java`.

The example directory contains examples using `rollbar-java` directly as well as using `rollbar-web` and `rollbar-android`.

For actual usage, the easiest way to get started is by looking at the examples:

* [rollbar-java](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-java)
* [rollbar-web](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-web)
* [rollbar-android](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-android)
* [rollbar-scala](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-scala)
* [rollbar-log4j2](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-log4j2)
* [rollbar-logback](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-logback)

### How payloads are sent

The actual notifier configuration builds a notifier that uses a BufferedSender to send the items to Rollbar. That sender is built using an unbound memory queue and a scheduled thread to send the events from the queue. The queue as well as the frequency of the scheduled thread can be customized when building the buffered sender and it can be replaced by passing a custom configuration when creating the notifier or initializing it.

### How to build it

To build the notifier there are some system environment variables that are needed.

* ANDROID\_HOME. Pointing to the android sdk.
* JAVA\_HOME. Pointing to the java8 sdk.
* JDK7\_HOME. Pointing to the java7 sdk.

```
./gradlew clean build
```

### Exceptions

Errors can be caught or uncaught exceptions.

### Caught Exceptions

To report a caught exception to Rollbar, use the following:

```java
// Configure Rollbar
Config config = ConfigBuilder.withAccessToken("<post_server_item_access_token>")
        .environment("production")
        .codeVersion("1.0.0")
        .build();
Rollbar rollbar = new Rollbar(config);

//Try Catch and Report Error to Rollbar
try {
  //Code to try
  some_function();
}
catch(Exception exception) {
  //  Code to handle errors
  rollbar.error(exception);  
}

// Call close just before the application exits to send any queued events
rollbar.close(true); 
```

### Uncaught Exceptions

We initialize com.rollbar.notifier.Rollbar with a Config which has the access token and other configuration properties set on it. We can then this this instance of Rollbar to report messages via the log/debug/warning/error/critical methods. Any uncaught exceptions are automatically reported to Rollbar. This behavior can be turned off via the configuration.

```java
// Add your package declaration here, eg. package com.mycompany;

import static com.rollbar.notifier.config.ConfigBuilder.withAccessToken;
import com.rollbar.notifier.Rollbar;
import com.rollbar.notifier.config.Config;

public class Application implements AutoCloseable {
  private Rollbar rollbar;

  public Application() {
    Config config = withAccessToken("8036dbd8a78945bd97b6e725e60f702c")
        .environment("production")
        .codeVersion("1.0.0")
        .build();
    this.rollbar = Rollbar.init(config);
  }

  @Override
  public void close() throws Exception {
    this.rollbar.close(true);
  }

  public static void main(String[] args) throws Exception {
    try (Application app = new Application()) {
      app.execute();
    }
  }

  private void execute() {
    try {
      throw new RuntimeException("Some error");
    } catch (Exception e) {
      rollbar.error(e, "Hello, Rollbar");
    }
  }
}
```

### Upgrading from Previous Versions

Please see [Upgrading from v0.5.4 or earlier to v1.0.0+](https://docs.rollbar.com/docs/upgrading-from-v054-or-earlier-to-v100).

## Managing Sensitive Data

### GDPR & HIPAA

If you are required to comply with [GDPR](https://www.eugdpr.org/) or HIPAA, we have a few recommendations for how to manage the sensitive data you may be sending to Rollbar. We recommend setting up person tracking, customizing your data retention period (more info on this [here](https://docs.rollbar.com/docs/data-retention)), anonymizing or not capturing IP addresses for rollbar-web, and [removing sensitive data](https://docs.rollbar.com/docs/java#section-transforming-the-payload) before sending Rollbar items. For HIPAA compliance, we recommend [transforming the payload](https://docs.rollbar.com/docs/java#section-transforming-the-payload) before sending Rollbar items, as sometimes sensitive data may be found in stack traces.

For information on settrefing up person tracking, please see [here](https://docs.rollbar.com/docs/java#section-person-tracking). You can simply send only the `person.id` and no other identifying information, such as an email address. If you have already sent Rollbar sensitive person data and wish to delete it, please see our documentation on deleting person data [here](https://explorer.docs.rollbar.com/#operation/delete-a-person).

You may also configure the `captureIp` setting in your config to either not capture IP addresses (by setting `captureIp` to `none`) or have the SDK do a semi-anonymization on the captured IP address by masking out the least significant bits (by setting `captureIp` to `anonymize`). Please note that capturing IP addresses is only possible when using rollbar-web.

```java
Config config = ConfigBuilder.withAccessToken("<access_token>"))
       .environment("development")
       .codeVersion("1.0.0")
       .request(new RequestProvider.Builder().captureIp("anonymize").build())
       .build();
```

### Scrubbing Items

If you need to scrub certain data in the payload before sending it to Rollbar, the best way to do so is via a `Transformer` function. Please see [`transforming the payload`](https://docs.rollbar.com/docs/java#section-transforming-the-payload) below.

### Transforming the Payload

If you would like to change some of the data in the payload before sending an item to Rollbar, you may do so via a `Transformer` function.

```java
// For example, to remove the framework:
public class RemoveFrameworkTransformer implements Transformer {

  @Override
  public Data transform(Data data) {
    return new Data.Builder(data)
        .framework(null)
        .build();
  }
}

Config config = ConfigBuilder.withAccessToken("<access_token>"))
        .environment("development")
        .codeVersion("1.0.0")
        .transformer(new RemoveFrameworkTransformer())
        .build();
```

### Ignoring Items

If you would like to have the client ignore an item and not send it to Rollbar, you can use a `Transformer` function. Please see  [`transforming the payload`](https://docs.rollbar.com/docs/java#section-transforming-the-payload) above. Additionally, you can use a Filter to check the payload and decide if an item should be sent or not.

```java
// Doesn't send items with 'debug' level
public class FilterDebugItems implements Filter {

  @Override
  public boolean preProcess(Level level, Throwable error, Map<String, Object> custom,
      String description) {
    return level.equals(Level.DEBUG);
  }

  @Override
  public boolean postProcess(Data data) {
    return false;
  }
}

Config config = ConfigBuilder.withAccessToken("<post_server_item_access_token>"))
        .environment("development")
        .codeVersion("1.0.0")
        .filter(new FilterDebugItems())
        .build();
```

## Features

### Disable sending error data to Rollbar

If you don't want to send error data to Rollbar, set the `enabled` flag to `false`.

```java
Config config = ConfigBuilder.withAccessToken("<post_server_item_access_token>"))
        .environment("development")
        .codeVersion("1.0.0")
        .enabled(false)
        .build();
```

### [UUIDs](https://docs.rollbar.com/docs/uuids)

Most Rollbar SDKs automatically generate a [UUID](https://docs.rollbar.com/docs/uuids) for each event reported from the notifier to the platform. This UUID can be used to track customer issues, correlate exceptions to automated test sessions, and more. In Java, the UUID is not automatically created; however, you have the option to set a UuidGenerator as part of the Config:

```java

    Config config = ConfigBuilder.withAccessToken("MY_ACCESS_TOKEN")
        .environment("development")
        .codeVersion("1.0.0")
        .uuidGenerator(new MyUUIDGenerator())
        .build();
    Rollbar rollbar = new Rollbar(config);
```

Once you have set a generator, the UUID will be assigned to each occurrence reported back to Rollbar and will be available for use.

### Person Tracking

If your application has authenticated users, you can track which user ("person" in Rollbar parlance) was associated with each event.

```java
public class MyPersonProvider implements Provider<Person> {

  @Override
  public Person provide() {
    return new Person.Builder()
        .id("84935784903")
        .email("janedoe@gmail.com")
        .username("janedoe1234")
        .build();
  }
} 

Config config = ConfigBuilder.withAccessToken("<access_token>"))
       .environment("development")
       .codeVersion("1.0.0")
       .person(new MyPersonProvider())
       .build();
```

Note: in Rollbar, the id is used to uniquely identify a person; email and username are supplemental and will be overwritten whenever a new value is received for an existing id. The id is a string up to 40 characters long. By default we only attempt to capture the id for a user.

### Synchronous option

By default, the client sends items **asynchronously**. You can disable this, and send items synchronously if you wish.

```java
Config config = ConfigBuilder.withAccessToken("<access_token>"))
        .environment("development")
        .codeVersion("1.0.0")
        .sender(new SyncSender.Builder()
            .build())
        .build();
```

## Github Integration

Link the project with [Github](https://docs.rollbar.com/docs/github).\
**In Rollbar**\
Go to **Projects → Select Project → Source Control**\
Complete **Default Branch** (usually *main* or *master*) and **Project Root** (usually */src/main/java*)

In the application we need to configure the server.root like this

```java
public class ServerProvider implements Provider<Server> {

  @Override
  public Server provide() {
    return new Server.Builder()
      .root("com.example.your.app.package")
      .build();
  }
}
```

**Code version**

The **Code version** represents the version of the application code being deployed. In this example, it corresponds to the Git commit *hash* of the latest commit on the master branch.

This value is shown here as a hardcoded string for demonstration purposes only. In a real setup, it is expected to be injected at build or deploy time via a configuration file generated by your CI pipeline.

This example is for Spring but it's the same configuration in other platforms

```java
import com.rollbar.notifier.Rollbar;
import com.rollbar.notifier.config.Config;
import com.rollbar.spring.webmvc.RollbarHandlerExceptionResolver;
import com.rollbar.spring.webmvc.RollbarSpringConfigBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration()
public class RollbarConfig {

  @Value("${rollbar.access-token}")
  private String accessToken;

  /**
   * Register a Rollbar bean to configure App with Rollbar.
   */
  @Bean
  public Rollbar rollbar() {
    return new Rollbar(getRollbarConfigs());
  }

  @Bean
  public RollbarHandlerExceptionResolver rollbarExceptionResolver(Rollbar rollbar) {
    return new RollbarHandlerExceptionResolver(rollbar);
  }

  private Config getRollbarConfigs() {
    return RollbarSpringConfigBuilder.withAccessToken(accessToken)
      .environment("prod")
      .codeVersion("43410b26")
      .server(new ServerProvider())
      .build();
  }
}
```

## Help / Support

If you run into any issues, please email us at `support@rollbar.com`.

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-java/issues/new).