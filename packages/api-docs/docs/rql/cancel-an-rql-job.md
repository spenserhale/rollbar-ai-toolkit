# POST /api/1/rql/job/{job_id}/cancel

Cancel an RQL job

# Response

The response will be a RQL Job resource, example:

````json
{
  "err" 0,
  "result": {
    "id": 123,  // job id
    "project_id": 456,
    "query_string": "show tables",
    "status": "cancelled", // One of "new", "running", "success", "failed", "cancelled", or "timed_out"
    "job_hash": "abcdefabcdefabcdef",
    "date_created": 1446598885,
    "date_modified": 1446598885
  }
}```


## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `job_id` | `integer` | Yes | system-wide ID of the job to be canceled |
## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "items": {}
  }
````
