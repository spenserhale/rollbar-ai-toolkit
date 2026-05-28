<!-- source: https://docs.rollbar.com/docs/sdk-usage-how-tos.md -->

# SDK Usage How-Tos

How-To by Example

# Initialize the Infrastructure

**Module/package:** `Rollbar`\
**Namespace:** `Rollbar`

Use of the Infrastructure is optional and not always possible (for example, within Blazor client-side). However, we do recommend the use of the infrastructure whenever possible. It provides significant performance benefits and adds extra features that are not available otherwise.

To enable the infrastructure, you need to initialize it with a valid configuration object before using any of the Rollbar loggers. For example:

```csharp
// minimally required Rollbar configuration:
RollbarInfrastructureConfig config = 
 	new RollbarInfrastructureConfig(
    RollbarSamplesSettings.AccessToken, 
    RollbarSamplesSettings.Environment
  );

// optional:
RollbarOfflineStoreOptions offlineStoreOptions = 
  new RollbarOfflineStoreOptions();
offlineStoreOptions.EnableLocalPayloadStore = 
  true;
config
  .RollbarOfflineStoreOptions
  .Reconfigure(offlineStoreOptions);

// optional:
RollbarTelemetryOptions telemetryOptions = 
  new RollbarTelemetryOptions(true, 3);
config
  .RollbarTelemetryOptions
  .Reconfigure(telemetryOptions);

// optional:
HttpProxyOptions proxyOptions = 
  new HttpProxyOptions("http://something.com");
config
  .RollbarLoggerConfig
  .HttpProxyOptions
  .Reconfigure(proxyOptions);

// optional:
RollbarDataSecurityOptions dataSecurityOptions = 
  new RollbarDataSecurityOptions();
dataSecurityOptions.ScrubFields = 
  new string[] {
    "user_password",
    "secret",
	};
config
  .RollbarLoggerConfig
  .RollbarDataSecurityOptions
  .Reconfigure(dataSecurityOptions);

// optional:
RollbarPayloadAdditionOptions payloadAdditionOptions = 
  new RollbarPayloadAdditionOptions();
payloadAdditionOptions.Person = 
  new Person() { 
    Id = "007", 
    Email = "jbond@mi6.uk", 
    UserName = "JBOND", 
	};      
config
  .RollbarLoggerConfig
  .RollbarPayloadAdditionOptions
  .Reconfigure(payloadAdditionOptions);

// initialize the Rollbar Infrastructure:
RollbarInfrastructure
  .Instance
  .Init(config);

// optionally, if you would like to monitor all Rollbar instances' internal events:
RollbarInfrastructure
  .Instance
  .QueueController
  .InternalEvent += OnRollbarInternalEvent;
```

There are many more configuration settings/options available to play with. Visual Studio’s IntelliSense is your friend when exploring available options. We will be documenting all the options here as well, but this documentation could become a bit outdated as time goes by.

# Use Shared Logger Singleton

**Module/package:** `Rollbar`\
**Namespace:** `Rollbar`

Remember, if you do not use the Rollbar Infrastructure, the shared logger needs to be properly configured before making the first logging method call on it. Please see the details below.

## When the Infrastructure is Initialized

Whenever the Rollbar Infrastructure is initialized prior to the very first access to the shared logger instance, the logger will deduce its configuration from the infrastructure. Hence, you can just start using the shared logger instance like so:

```csharp
RollbarLocator
  .RollbarInstance
  .Info("Hello from the Rollbar Shared Logger", customFields);
```

## When the Infrastructure is Not Used

If the Rollbar Infrastructure is not initialized/used, the shared logger needs to be properly configured before making the first logging method call on it, for example:

```csharp
// minimally required Rollbar logger configuration:
RollbarLoggerConfig config = 
 	new RollbarLoggerConfig(
 		RollbarSamplesSettings.AccessToken, 
		RollbarSamplesSettings.Environment
  );

// optional:
RollbarDataSecurityOptions dataSecurityOptions = 
  new RollbarDataSecurityOptions();
dataSecurityOptions.ScrubFields = new string[] {
	"user_password", 
  "secret",
};
config
  .RollbarDataSecurityOptions
  .Reconfigure(dataSecurityOptions);

// optional:
RollbarPayloadAdditionOptions payloadAdditionOptions = 
  new RollbarPayloadAdditionOptions();
payloadAdditionOptions.Person = new Person() { 
	Id = "007", 
	Email = "jbond@mi6.uk", 
	UserName = "JBOND", 
};      
config
  .RollbarPayloadAdditionOptions
  .Reconfigure(payloadAdditionOptions);

// configure the shared logger with a valid configuration:
RollbarLocator
  .RollbarInstance
  .Configure(config);

// start using the shared logger:
RollbarLocator
  .RollbarInstance
  .Info(
  	"Hello from the Rollbar Shared Logger", 
  	customFields
	);
```

# Use Scoped (Short-Lived) Logger Instances

**Module/package:** `Rollbar`\
**Namespace:** `Rollbar`

## When the Infrastructure is Initialized

Once the Infrastructure is properly initialized, you can just call `RollbarFactory.CreateNew()` to get a reference to a valid logger without supplying any logger configuration instance for it. A proper configuration will be used based on the pre-configured Infrastructure:

```csharp
using(var logger = RollbarFactory.CreateNew())
{
	//...

  logger.Info("Hello from a scoped logger!");

  //...
}
```

And, if you would like to create an alternatively configured scoped logger, just supply `RollbarFactory.CreateNew(...)` with a valid RollbarLoggerConfig instance:

```csharp
// minimally required Rollbar logger configuration:
RollbarLoggerConfig config = 
 	new RollbarLoggerConfig(
 		RollbarSamplesSettings.AccessToken, 
    RollbarSamplesSettings.Environment
	);
using(var logger = RollbarFactory.CreateNew(config))
{
	//...

  logger.Info("Hello from a scoped logger!");

  //...
}
```

## When the Infrastructure is Not Used

In cases when the infrastructure is not used, you always must supply `RollbarFactory.CreateNew(...)` with a valid RollbarLoggerConfig instance:

```csharp
// minimally required Rollbar logger configuration:
RollbarLoggerConfig config = 
 	new RollbarLoggerConfig(
 		RollbarSamplesSettings.AccessToken, 
    RollbarSamplesSettings.Environment
 );
using(var logger = RollbarFactory.CreateNew(config))
{
	//...

  logger.Info("Hello from a scoped logger!");

  //...
}
```

# Blocking vs Non-Blocking Logging

The SDK is designed to have as little impact on the hosting system or application as possible. It takes an async "fire-and-forget" approach to logging. Normally, you want to use fully asynchronous logging, since it virtually has no instrumentational overhead on your application execution performance at runtime (especially when running on a multi-core/multi-processor system).

The payloads can be packaged/queued/transmitted using either fully asynchronous logging, for example:

```csharp
RollbarLocator.RollbarInstance
    .Log(ErrorLevel.Error, "test message");
```

or fully synchronously using an explicitly specified timeout:

```csharp
RollbarLocator.RollbarInstance
    .AsBlockingLogger(TimeSpan.FromSeconds(5))
    .Log(ErrorLevel.Error, "test message");
```

## Payload Transformer

Use the Payload Manipulation Options to transform the payload before it is sent to the Rollbar API for processing. Example for custom json added to payload.Data.Custom in .NET.

```c C#
//Configure Rollbar
RollbarLoggerConfig rollbarConfig = new RollbarLoggerConfig(rollbarAccessToken, rollbarEnvironment);
RollbarLocator.RollbarInstance.Configure(rollbarConfig);

//Lets send in a custom JSon Object butplace it into the Custom Object in Rollbar's Payload.
var json = JsonConvert.SerializeObject(YOURCUSTOMJSONOBJECTHERE);
var dictionary = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

RollbarPayloadManipulationOptions rollbarPayload = new RollbarPayloadManipulationOptions()
{
    Transform = payload => {
        payload.Data.Custom = dictionary;
        payload.Data.Environment = rollbarEnvironment;
    }
};
RollbarLocator.RollbarInstance.Configure(rollbarConfig);
```

> 🚧 Warning Note
>
> In case of a timeout, all the blocking log methods throw `System.TimeoutException` instead of gracefully completing the call. Therefore you might want to make all the blocking log calls within a try-catch block while catching `System.TimeoutException` specifically to handle a timeout case.

> 📘 Helpful Option: Asynchronous Logging with Synchronous Packaging
>
> Sometimes you may want to package a payload synchronously but queue and transmit it asynchronously. In this sort of scenario, you can use our package and package decorator concepts where you can flag either package or a decorator as "must apply synchronously" (during its construction).  One flag set like this will cause the whole resulting decorated package to be packaged synchronously even if it is logged using the asynchronous API.\
> For more details on using packages and package decorators, please, see the section below\...

# Use Packages and Package Decorators

**Module/package:** `Rollbar`\
**Namespace:** `Rollbar`

Packages and Package Decorators provide a convenient way to capture a lot of specific extra data within a logging method call. The SDK supplies a wide variety of predefined packages and decorators, and you can also add your own custom ones.

Here is a simple example of their use:

```csharp
IRollbarPackage rollbarPackage = 
	new ExceptionPackage(
  	ex, 
  	$"{nameof(RollbarMiddleware)} processed uncaught exception."
	);
                        
if (context != null)
{
	if (context.Request != null)
  {
  	rollbarPackage = 
			new HttpRequestPackageDecorator(rollbarPackage, context.Request, true);
  }
  if (context.Response != null)
  {
  	rollbarPackage = 
			new HttpResponsePackageDecorator(rollbarPackage, context.Response, true);
  }
}

RollbarLocator.RollbarInstance.Critical(rollbarPackage);
```

# Monitor SDK Internal Events

**Module/package:** `Rollbar`\
**Namespace:** `Rollbar`

You can monitor the SDK Internal Events on an individual logger level or on the infrastructure level:

```csharp
// if you would like to monitor all Rollbar instances' internal events, 
// for example, the shared one:
RollbarLocator.RollbarInstance.InternalEvent += 
  OnRollbarInternalEvent;

// if you would like to monitor all Rollbar instances' internal events
// on the Infrastructure level:
RollbarInfrastructure.Instance.QueueController.InternalEvent += 
  OnRollbarInternalEvent;

private static void OnRollbarInternalEvent(object sender, RollbarEventArgs e)
{
	Console.WriteLine(e.TraceAsString());

  switch (e)
  {
  	case InternalErrorEventArgs rollbarEvent:
    		// handle this specific type of Rollbar event...
        break;
    case RollbarApiErrorEventArgs rollbarEvent:
        // handle this specific type of Rollbar event...
        break;
    case CommunicationErrorEventArgs rollbarEvent:
        // handle this specific type of Rollbar event...
        break;
    case TransmissionOmittedEventArgs rollbarEvent:
    		// handle this specific type of Rollbar event...
        break;
    case PayloadDropEventArgs rollbarEvent:
    		// handle this specific type of Rollbar event...
        break;
   	case CommunicationEventArgs rollbarEvent:
    	// handle this specific type of Rollbar event...
      break;
    default:
    	// handle this specific type of Rollbar event...
      break;
  }
}
```

# Capture Extra State When Reporting Errors

**Module/package:** `Rollbar`\
**Namespace:** `Rollbar`

You can use the `RollbarAssistant` utility class to easily capture extra data that could be useful when logged side by side with an error. The `RollbarAssistant` can capture the state of any arbitrary object including static data. For example:

```csharp
var criticalObj = new InstanceType();
criticalObj.AutoProperty = -100;

try
{
	///...
  /// oh, no! - we have an exception:
  throw new System.Exception("An exception with state capture!");
  ///...
}
catch (System.Exception ex)
{
	// capture state of this instance:
	var state = RollbarAssistant.CaptureState(this, "Self"); 
  // also, capture state of some other critical object:
  state = new Dictionary<string, object>(
    state.Concat(
      RollbarAssistant.CaptureState(
        criticalObj,
        nameof(criticalObj)
      ))
  );
	// also, capture current state of a static type:
  state = new Dictionary<string, object>(
		state.Concat(RollbarAssistant.CaptureState(typeof(StaticType))
	));

	// report the captured states along with the caught exception:
  RollbarLocator.RollbarInstance.Error(ex, state);
}
```

# Capture Telemetry Events/Data

**Module/package:** `Rollbar`\
**Namespace:** `Rollbar`

Whenever the Rollbar Infrastructure is properly initialized, you can use it to capture many kinds of Telemetry events. These events will be captured within a fixed-depth queue maintained by the infrastructure so that the last N events will be attached to every subsequent payload sent by the SDK (where N is equal to the depth of the Telemetry queue). For example:

```csharp
RollbarInfrastructure.Instance.TelemetryCollector.Capture(
  new Telemetry(
    TelemetrySource.Client,
    TelemetryLevel.Info,
    new LogTelemetry("Something interesting happened.")
  )
);

//...

RollbarInfrastructure.Instance.TelemetryCollector.Capture(
  new Telemetry(
  	TelemetrySource.Client,
    TelemetryLevel.Error,
    new ErrorTelemetry(new System.Exception("Worth mentioning!"))
  )
);

//...

RollbarInfrastructure.Instance.TelemetryCollector.Capture(
  new Telemetry(
  	TelemetrySource.Client,
    TelemetryLevel.Error,
    new ManualTelemetry(new Dictionary<string, object>() {{"somthing", "happened" },})
 	)
);
```

# Interact with Deployment API

**Module/package:** `Rollbar.Deploys`\
**Namespace:** `Rollbar.Deploys`

Rollbar Deployment API implements deployment tracking as a REST-based service.\
The Rollbar Core module of the SDK includes .NET compatible client to the Deployment API.

The key API type is the `RollbarDeploysManager` that implements `IRollbarDeploysManager` interfaces. The interface defines async methods for

* registering new deployment instance,
* querying registered deployment instances page-by-page,
* and querying deployment instance details by specified `deploymentID`.

The `RollbarDeploysManager` does not have default parameterless constructor defined since it needs some required parameters to be provided at construction time, like Rollbar write and/or read access tokens. Once properly constructed it can be used for deployment registration (by supplying a valid instance of the `Deployment` class) and querying for previously registered deployments:

```csharp
// create a deploys manager:
IRollbarDeploysManager deploysManager = 
  RollbarDeploysManagerFactory.CreateRollbarDeploysManager(
  	RollbarUnitTestSettings.AccessToken,
 	 	RollbarUnitTestSettings.DeploymentsReadAccessToken
	); 

// create a new deployment:
var deployment = DeploymentFactory.CreateDeployment(
  environment: RollbarUnitTestSettings.Environment,
  revision: "99909a3a5a3dd4363f414161f340b582bb2e999",
  comment: "Some new unit test deployment @ " + DateTimeOffset.Now,
  localUserName: "UnitTestRunner",
  rollbarUserName: "rollbar"
);

// register the deployment:
var task = deploysManager.RegisterAsync(deployment);
task.Wait(TimeSpan.FromSeconds(3));

// get all the registered deployments:
var deployments = GetAllDeployments();

// get the very first deployment's details:
var latestDeployment = deployments.FirstOrDefault();
var getDeploymentTask = deploysManager.GetDeploymentAsync(latestDeployment.DeployID);
getDeploymentTask.Wait(TimeSpan.FromSeconds(3));
var deploymentDetails = getDeploymentTask.Result;
```

where GetAllDeployments() could be implemented as:

```csharp
private ICollection<IDeploymentDetails> GetAllDeployments()
{
  List<IDeploymentDetails> deployments = new List<IDeploymentDetails>();

  int pageCount = 0;
  int pageItems = 0;
  do
  {
    var task = this._deploysManager.GetDeploymentsPageAsync(
      RollbarUnitTestSettings.Environment, 
      ++pageCount
    	);    
    task.Wait(TimeSpan.FromSeconds(3));
    
    pageItems = task.Result.Length;
    if (pageItems > 0)
    {
      deployments.AddRange(task.Result);
    }
  }
  while (pageItems > 0);

  return deployments;
}
```