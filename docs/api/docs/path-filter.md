<!-- source: https://docs.rollbar.com/docs/path-filter.md -->

# Path Filter

The Notifications Path filter allows data in the JSON payload to be used to decide when a notification should be sent

## Raw JSON

The Rollbar SDK in the running application sends a JSON payload containing the event occurrence data. This raw JSON data can be viewed by selecting an occurrence on the Occurrences tab of the Item view. The Raw JSON is displayed at the end of the Occurrence view.

The JSON below is an example of a Raw JSON payload

```java
{
 "body": {
      "trace": {
        "frames": [
          {
            "class_name": "java.lang.Thread", 
            "method": "run", 
            "lineno": 748, 
            "filename": "Thread.java"
          }, 
          {
            "class_name": "org.apache.tomcat.util.threads.TaskThread$WrappingRunnable", 
            "method": "run", 
            "lineno": 61, 
            "filename": "TaskThread.java"
          }, 
          {
            "class_name": "com.example.springboot.MainController", 
            "method": "test", 
            "lineno": 32, 
            "filename": "MainController.java"
          }
        ], 
        "exception": {
          "message": "Unhandled Thread error has occurred", 
          "class": "java.lang.RuntimeException"
        }
      }
    }, 
    "person": {
      "id": "10098"
    }, 
    "custom": {
      "trace_id": "9e5ba3146", 
      "customer_type": "enterprise"
    }
  }
```

## Filter Operators

[block:parameters]
{
  "data": {
    "h-0": "Operator",
    "h-1": "Description",
    "0-0": "== ",
    "0-1": "Equals",
    "1-0": "!=",
    "1-1": "Not equals",
    "2-0": "\\>=",
    "2-1": "Greater or equal to",
    "3-0": "\\<=",
    "3-1": "Less than or equal to",
    "4-0": "starts with",
    "4-1": "String starts with",
    "5-0": "contains substring",
    "5-1": "Content contains substring  \n  \n**Evaluates to false if path does not exist**",
    "6-0": "does not contain substring",
    "6-1": "Content does not contain substring  \n  \n**Evaluates to false if path does not exist**",
    "7-0": "contains substring matching regex",
    "7-1": "Content contains substring matching regex  \n  \n**Evaluates to false if path does not exist**",
    "8-0": "does not contain substring matching regex",
    "8-1": "Content does not contain substring matching regex  \n  \n**Evaluates to false if path does not exist**",
    "9-0": "exists",
    "9-1": "Path exists",
    "10-0": "does not exist",
    "10-1": "Path does not exist"
  },
  "cols": 2,
  "rows": 11,
  "align": [
    "left",
    "left"
  ]
}
[/block]

<br />

## Example Filters

Note: All Path filters need to be prefixed with the tag **body**

### Example 1:  Exception message contents

**body**.body.trace.exception.message

### Example 2: Custom data field contents

\*\*body.\*\*custom.customer\_type

### Example 3 First frame of the stack trace

frames.0 means 1st frame of the stack trace

\*\*body.\*\*body.trace.frames.0.class\_name

### Example 4: Last frame of the stack trace

frames.-1 means last frame of the stack trace

\*\*body.\*\*body.trace.frames.-1.method

### Example 5: Numeric value

\*\*body.\*\*person.id >= 1000