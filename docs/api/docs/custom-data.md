<!-- source: https://docs.rollbar.com/docs/custom-data.md -->

# Adding Additional Data to the Occurrence

All Rollbar SDKs support adding additional custom data to the occurrence payload.

Additional data can be used to:

* Understand the root cause of an error more easily
* Better understand the business impact of an error
* Make an automated response decision

Some common additional data fields that are added to the payload include:

* Session ID
* Trace ID - Extra context in in web service based application
* Feature Flag ID - To trigger a [Webhook notification](https://docs.rollbar.com/docs/webhooks)  to turn off a feature with errors
* End User Type - To trigger a notification if important end users are experiencing errors
* Owning Team - To route an error to the correct team

## Adding additional data

Additional data can be added to the configuration at any time.

### Adding  additional data when Rollbar is initialized

If the value of the additional data is known when Rollbar is initialized, it can be added at initialization.

This is an example of adding the custom data when instantiating Rollbar in a JavaScript application

```javascript
var _rollbarConfig = {
    accessToken: "*********",
    payload: {
        environment: "production", code_version: '1.0.1',
        custom: {session_id: '1234', container_id: '6789'} }};
```

### Adding additional data after initialization

This is an example of additional data being added after Rollbar initialization in a JavaScript application.

```javascript
Rollbar.configure({payload: { custom: { customer_type: "premium"}} });
```

### Adding additional data in log messages sent to Rollbar

Additional data can also be added  when Rollbar is called explicitly

This is an example of adding the custom data added to an error occurrence in a JavaScript application.

```javascript
Rollbar.error("An error has occurring processing data ", {error_owner: "DataPipelineTeam"});
```

Additional data can also be added  when Rollbar is called explicitly for a caught exception

### Adding additional data to a caught exception sent to Rollbar

This is an example of adding the custom data added to an error occurrence along with the exception/error object

```javascript
Rollbar.error("An error has occurring processing data ", excp, {error_owner: "DataPipelineTeam"});
```

### Adding additional data in a payload transformer

A payload transformer is a method that gets called before an occurrence payload is sent. The payload transformer allows data to added, deleted, or relocated in the occurrence payload. It can be used to additional contextual information to the error just before occurrence is sent

#### Payload Transformer Examples

[Javascript](https://docs.rollbar.com/docs/javascript#transforming-the-payload)

[Java](https://docs.rollbar.com/docs/java#transforming-the-payload)

[Python](https://docs.rollbar.com/docs/python#transforming-the-payload)

[Ruby](https://docs.rollbar.com/docs/ruby#transforming-the-payload)

## Triggering notifications based on additional custom data

To trigger a notification based on additional custom data see [Notifications Path Filter](https://docs.rollbar.com/docs/path-filter) documentation.\
This can be useful to trigger a [Webhook notification](https://docs.rollbar.com/docs/webhooks) under specific circumstances, or to send a [Slack notification](https://docs.rollbar.com/docs/slack) to a different Slack channel based on the custom data.

## Creating a Service Link with additional custom data

Service Links are Query URLs that can include additional custom data.\
See the [Service Links](https://docs.rollbar.com/docs/service-links) documentation for examples.

### Adding trace\_id as additional custom data in web service applications

Web service applications often include a trace\_id to make it easier to triage an error across multiple services. Adding the trace\_id as custom data is helpful extra context.

This data can also be included in  [RQL](https://docs.rollbar.com/docs/rql) queries and to build [Service Links](https://docs.rollbar.com/docs/service-links).

## Creating custom fingerprinting rules using custom data

Custom data that you include in the error occurrence payload can be used in custom fingerprinting rules. Errors can be grouped differently based on the custom data in the error occurrence payload.

See [Custom Fingerprinting Rules](https://docs.rollbar.com/docs/custom-grouping)

For example: Grouping errors from the same endpoint differently based on the status code returned

```javascript
Rollbar.error("An error has occurring adding a new user", 
    {custom: {{endpoint: "new_user", status_code: "429"});
```

## Including additional custom data in an RQL query

Additional custom data is supported in the Rollbar Query Language (RQL) schema. You can write queries that filter by custom data fields.\
RQL supports querying across multiple Rollbar projects.\
This is an example of querying for all occurrences with a specific trace\_id in the last 24 hours, potentially across multiple Rollbar projects.

```SQL
select * from item_occurrence WHERE custom.trace_id='16865426728' AND
  timestamp > unix_timestamp() - 60 * 60 * 24
```

See also the [RQL](https://docs.rollbar.com/docs/rql) documentation.

## Other Information

### Language Examples

See the language [SDK documentation](https://docs.rollbar.com/docs) for more details on how to add additional custom data to the occurrence payload for a specific language.

### Recommendations

It is recommended that you group additional custom data  under a specific node in the JSON payload to make maintenance easier.

### Limitations

Additional custom data fields cannot have the title `data`