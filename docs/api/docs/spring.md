<!-- source: https://docs.rollbar.com/docs/spring.md -->

# Spring

How to configure Rollbar with Java Spring

Rollbar offers error monitoring integration for Spring apps. This guide will show you how to install and configure Rollbar for Spring. It will also provide examples of how to use the SDK and advanced configurations.

## Installation

### Configure Gradle dependencies

Depending on your project type, add the appropriate dependency for Gradle.

#### Spring Boot

If you have a Spring Boot 1 or 2 project, add the following to your dependencies:

```java
implementation('com.rollbar:rollbar-spring-boot-webmvc:1.10.0')
```

For Spring Boot 3+, add the following to your dependencies:

```java
implementation('com.rollbar:rollbar-spring-boot3-webmvc:1.10.0')
```

#### Spring Web MVC

For a Spring Web MVC 5.x project, add the following to your dependencies:

```java
implementation('com.rollbar:rollbar-spring-webmvc:1.10.0')
```

For Spring Web MVC 6.x, add the following to your dependencies:

```java
implementation('com.rollbar:rollbar-spring6-webmvc:1.10.0')
```

### Get your Access Token

Log into your [Rollbar account dashboard](https://rollbar.com). Go to Settings, then Project Access Tokens, and copy the `post_server_item` access token. Make sure to keep this token secure.

### Configure the Rollbar Bean

You can create a new `RollbarConfig` class, such as the one below, and add it to your project for a simple configuration. Make sure to set your `ACCESS_TOKEN` and add your project package to the `@ComponentScan`.

```java
@Configuration()
@EnableWebMvc
@ComponentScan({
    // ADD YOUR PROJECT PACKAGE HERE
    "com.rollbar.spring"
})
public class RollbarConfig {

  /**
   * Register a Rollbar bean to configure App with Rollbar.
   */
  @Bean
  public Rollbar rollbar() {
    return new Rollbar(getRollbarConfigs("<ACCESS_TOKEN>"));
  }

  private Config getRollbarConfigs(String accessToken) {

    // Reference ConfigBuilder.java for all the properties you can set for Rollbar
    return RollbarSpringConfigBuilder.withAccessToken(accessToken)
            .environment("development")
            .codeVersion("1.0.0")
            .build();
  }
}
```

## Usage

Register a Rollbar bean in the installation section and load `com.rollbar.spring components`. At this point, any exceptions raised by Spring will be sent to Rollbar. We also offer several methods to track other items at your convenience.

### Logging a Specific Message

You can log messages anywhere in your app. For example, to log a `debug` message:

```java
rollbar.debug("Here is some debug message");
```

### Add Context Information

You can pass user information as context like this:

```java
 rollbar.error(e);
 HashMap<String,Object> map=new HashMap<String, Object>();
 map.put("Id","123");
 map.put("User Name","John Doe");
 map.put("Email","john@doe.com");
 rollbar.log(e,map);
```

### Exception Logging

If you wish to report data from the `HttpServletRequest`, use the Rollbar error reporting method. For example:

```java
@Override
public String buildLogMessage(Exception e, HttpServletRequest req) {             
    System.out.println("Exception : " + e.toString());
    rollbar.error(e);
    return "MVC exception: " + e.getLocalizedMessage();
}
```

You can also report an error to Rollbar with a specific exception block. For example, to log any `Exception`, add the following:

```java
try {
   String test = null;
   test.toString();
} catch(Exception e) {
   rollbar.error(e, "This is a null pointer exception");
}
```

## Additional Configuration Options

The Rollbar object allows additional configuration. Reference the config object [here](https://javadoc.io/doc/com.rollbar/rollbar-java/latest/com/rollbar/notifier/config/Config.html) in our JavaDoc to learn what you can configure.

### Examples

The examples below demonstrate how to configure the Rollbar Java SDK:

**Configure a new Request Provider**\
Add a `RequestProvider` to capture request metadata, such as the remote IP:

```java
// Example add a `RequestProvider` to capture metadata about the request
RequestProvider requestProvider = new RequestProvider
                    .Builder()
                    // To use a header to resolve the source IP address uncomment below line.
                    .build();

return new Rollbar(RollbarSpringConfigBuilder.withAccessToken("ACCESS_TOKEN")
            .environment("development")
            .codeVersion("1.0.1")
            // Add the custom requestProvider to the Rollbar instance
            .request(requestProvider) 
            .build());
```

**Setup a proxy**

```java
return new Rollbar(RollbarSpringConfigBuilder.withAccessToken("ACCESS_TOKEN")
            .environment("development")
            .codeVersion("1.0.1")
            .proxy(JAVA_PROXY_OBJECT) 
            .build());
```

### JavaDocs

You can reference the Spring Boot and Spring WebMVC Java Docs here:

* **Spring Boot**: <https://javadoc.io/doc/com.rollbar/rollbar-spring-boot-webmvc/latest/index.html>
* **Spring WebMVC**: <https://javadoc.io/doc/com.rollbar/rollbar-spring-webmvc/latest/index.html>