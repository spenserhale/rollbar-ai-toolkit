<!-- source: https://docs.rollbar.com/docs/reactive-streams.md -->

# Reactive Streams

Integrating Rollbar with Reactive Streams

This example demonstrates how to capture errors in a reactive stream and send them to Rollbar using the rollbar-reactive-streams-reactor integration.

## Step 1: Add Dependencies

You will need to add the following dependency:

```xml Maven
<dependency>
    <groupId>com.rollbar</groupId>
    <artifactId>rollbar-reactive-streams-reactor</artifactId>
    <version>2.0.0</version>
</dependency>
```
```java Gradle
implementation("com.rollbar:rollbar-reactive-streams-reactor:2.0.0")
```

<br />

This will include the Rollbar integration and the necessary logging dependencies.

<br />

## Step 2: Example Code for Reactive Stream with Rollbar

```java
import reactor.core.publisher.Mono;
import com.rollbar.reactivestreams.reactor.RollbarSubscriber;

public class Application {
    public static void main(String[] args) throws Exception {
      Config config = ConfigBuilder
        .withAccessToken(System.getenv("POST_SERVER_ACCESS_TOKEN"))
        .httpClient(new ReactorAsyncHttpClient.Builder().build())
        .environment("development")
        .build();
      
      ReactorRollbar rollbar = new ReactorRollbar(config);
    
			// application code goes here
			//on Mono a user must add .onErrorResume(rollbar::logMonoError);
      // on Flux a user must add .onErrorResume(rollbar::logFluxError);
	}
}

```