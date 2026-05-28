# POST /api/1/rql/jobs/

Create an RQL job

# Response

The response will be a RQL Job resource, example:

````json
{
  "err" 0,
  "result": {
    "id": 123,  // job id
    "project_id": 456,
    "query_string": "show tables",
    "status": "new", // One of "new", "running", "success", "failed", "cancelled", or "timed_out"
    "job_hash": "abcdefabcdefabcdef",
    "date_created": 1446598885,
    "date_modified": 1446598885
  }
}```


## Request Body

**Content-Type:** `application/json`

```json
{
    "query_string": "string",
    "force_refresh": true
  }
````

## Responses

### 200 — RQL job created

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "items": {}
  }
```
