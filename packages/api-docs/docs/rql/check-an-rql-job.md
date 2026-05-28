# GET /api/1/rql/job/{job_id}

Check an RQL job

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
    "date_modified": 1446598885,
    "result": {...} // A RQL job resource if expand=result is used in query string
  }
}``


## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `job_id` | `integer` | Yes | - |
### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `expand` | `string` | No | If the value is `result`, the response will contain the job result |
## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "items": {}
  }
````
