<!-- source: https://docs.rollbar.com/docs/android.md -->

# Android

How to configure rollbar-java to work with your Android app

This plugin integrates Rollbar into your Android app using the [Java & Android](https://docs.rollbar.com/docs/java) SDK. This guide will show you how to add a global exception handler to catch all uncaught errors in your Android app.

## Installation

1. Open your app.gradle of your project, and add the following dependencies for Kotlin or Groovy

```java Kotlin

implementation("com.rollbar:rollbar-android:1.10.0")
  
```
```java Goovy

implementation 'com.rollbar:rollbar-android:1.10.0'

```

> 🚧 Gradle dependency versions
>
> For a test application, using `1.+` will quickly pull the latest version of rollbar-android. In a production scenario it's good practice to include the full version, eg. `1.10.0`. The latest version is always available on [Maven Central.](https://search.maven.org/artifact/com.rollbar/rollbar-android)

2. Log into your [Rollbar account dashboard](https://rollbar.com). Go to Settings → Project → Project Access Tokens and then copy the `post_client_item` token.

3. Add the access token from step 2 into your manifest file's application section as shown below. You can find the manifest file in your project directory.

```xml
<meta-data android:name="com.rollbar.android.ACCESS_TOKEN" android:value="ACCESS_TOKEN" />
```

The manifest file looks like this after adding the meta-data section.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
   package="rollbar.com.rollbarexample">

   <application
       android:allowBackup="true"
       android:icon="@mipmap/ic_launcher"
       android:label="@string/app_name"
       android:roundIcon="@mipmap/ic_launcher_round"
       android:supportsRtl="true"
       android:theme="@style/AppTheme">
       <activity android:name=".MainActivity">
           <intent-filter>
               <action android:name="android.intent.action.MAIN" />
               <category android:name="android.intent.category.LAUNCHER" />
           </intent-filter>
       </activity>

       <meta-data android:name="com.rollbar.android.ACCESS_TOKEN" android:value="<post_client_item_access_token>" />
   </application>

</manifest>
```

4. Open the code for your launcher activity, and then initialize Rollbar in the `onCreate` method.

```java Kotlin
import com.rollbar.android.Rollbar

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Rollbar.init(this)

        setContent { /* Composables views */ }
    }
}
```
```java Groovy
import com.rollbar.android.Rollbar;

public class MainActivity extends AppCompatActivity {
  
    private Button button;
    private Rollbar rollbar;
  
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Rollbar.init(this);
    }
}
```

> 📘 Initialization failures caused by manifest issues
>
> In some cases, Rollbar will silently fail to initialize. This is caused by typos or other errors in the `manifest.xml` file, a temporary workaround would be to call the `Rollbar.init()` method with the access token as one of the parameters.

## Usage

In the installation section, we created a global error handler to log the error in Rollbar. We also offer several methods to track other items at your convenience.

### Logging a Specific Message

You can log your own messages anywhere in your app. For example, to log a `debug` message:

```java
rollbar.debug("Here is some debug message");
```

### Adding Context Information

You can pass user information as context like this:

```java
rollbar.setPersonData("123","John Doe","john@doe.com");
rollbar.error("This is an error");
```

### Exception Logging

You can also report an error to Rollbar with a specific exception block. For example, to log any `Exception` add the following:

```java
try {
   String test = null;
   test.toString();
} catch(Exception e) {
   rollbar.error(e,"This is a null pointer exception");
}
```

### Setting the [environment](https://docs.rollbar.com/docs/environments)

To set the environment you need to modify the `Rollbar.init` call in your main activity:

```java
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        String environment = "development";
        Rollbar.init(this, null, environment);
    }
```

The second argument is the access token, and should be left as null if it has been configured in the application's manifest file.

### Detecting when the network is unavailable

By default `rollbar-android` will try to send errors to Rollbar even if the network is unavailable. Errors that cannot be sent will be discarded.

This behavior can be changed using the `suspendWhenNetworkIsUnavailable` option, which can be enabled during initialization:

```java
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        boolean suspendWhenNetworkIsUnavailable = true;
        // The second argument is the access token, and should be left 
        // as null if it has been configured in the application's manifest file.
        Rollbar.init(this, null, suspendWhenNetworkIsUnavailable);
    }
```

When this option is enabled, the notifier will try to detect if a network issue while reporting and error to Rollbar is due to the network being unavailable, and change its behavior as follows:

If it determines an error couldn't be sent to Rollbar because the network was unavailable, the error will be saved to be retried later.

Once an error couldn't be sent to Rollbar because the network was unavailable, it will suspend sending errors for a period of time, with the following rules:

* If Android's `ConnectivityManager` class confirms the network is down, it will suspend sending errors until the `ConnectivityManager` notifies the Rollbar SDK that the network is back up, or until 5 minutes have passed, whichever comes first.
* If the `ConnectivityManager` service is not available or it reports that the network is up, it will suspend sending errors for 1 second since it is likely network access has already been restored since the issue occurred.

Using Android's `ConnectivityManager` requires the `ACCESS_NETWORK_STATE` permission. While the `suspendWhenNetworkIsUnavailable` feature will degrade gracefully if this permission is not available, it is strongly recommended that the permission be requested by the application.

For further examples and information on using rollbar-android, check out the example app [here](https://github.com/rollbar/rollbar-java/tree/master/examples/rollbar-android).

## ANR Detection

Starting from **Rollbar Android SDK v2.1.0**, the library includes a built-in **ANR Detector** that automatically captures Application Not Responding (ANR) events.

The ANR detector **is enabled by default**. It automatically adapts its strategy depending on the device's API level:

* **API level < 30:** uses a Watchdog thread implementation to detect ANRs in real time.
* **API level ≥ 30:** uses the ApplicationExitInfo historical ANR detection mechanism, introduced in Android 11 (API 30).

If you want to customize or disable ANR detection, you can provide your own AnrConfiguration when initializing Rollbar. For example, you can change the watchdog timeout or disable historical ANR capture.

```kotlin
val watchdogConfiguration = WatchdogConfiguration.Builder()
    .setTimeOutMillis(4000) // Default time out for watchdog is 5000
    .build()
        
val anrConfiguration = AnrConfiguration.Builder()
    .setCaptureHistoricalAnr(false) // Turn off the Anr detector in api level >= 30
    .setWatchdogConfiguration(watchdogConfiguration)
    .build()

val androidConfiguration = AndroidConfiguration.Builder()
    .setAnrConfiguration(anrConfiguration)
    .build()

Rollbar.init(context, androidConfiguration)
```
```java
WatchdogConfiguration watchdogConfiguration = new WatchdogConfiguration.Builder()
    .setTimeOutMillis(4000) // Default time out for watchdog is 5000
    .build();

AnrConfiguration anrConfiguration = new AnrConfiguration.Builder()
    .setCaptureHistoricalAnr(false) // Turn off the Anr detector in api level >= 30
    .setWatchdogConfiguration(watchdogConfiguration)
    .build();

AndroidConfiguration androidConfiguration = new AndroidConfiguration.Builder()
    .setAnrConfiguration(anrConfiguration)
    .build();

Rollbar.init(context, androidConfiguration);
```

To completely disable ANR detection, set setAnrConfiguration(null) in your AndroidConfiguration builder.

```kotlin
val androidConfiguration: AndroidConfiguration = AndroidConfiguration.Builder()
    .setAnrConfiguration(null)
    .build()

Rollbar.init(context, androidConfiguration)
```
```java
AndroidConfiguration androidConfiguration = new AndroidConfiguration.Builder()
    .setAnrConfiguration(null)
    .build();

Rollbar.init(context, androidConfiguration);
```

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

Instead of uploading it manually, you can use our plugin <https://github.com/rollbar/rollbar-gradle-plugin>.

### Symbol Map File Retention

The data retention process for ProGuard symbol files is that files which are unused for 90 days, as determined by not having any occurrences on their code\_version, will be automatically deleted.

For more information on rollbar-java, please see the docs [here](https://docs.rollbar.com/docs/java).