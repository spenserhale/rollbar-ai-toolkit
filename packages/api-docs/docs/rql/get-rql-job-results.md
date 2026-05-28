# GET /api/1/rql/job/{job_id}/result

Get RQL job results

# Response

The response will be a RQL job result resource, example:

````json
{
  "err" 0,
  "result": {
    "job_id": 123,  // job id
    "result": {
      "rows": [{...}],
      "selectionColumns": [...],
      "columns": [...],
      "errors": [],
      "warnings": [],
      "rowcount": 1,
      "executionTime": 123
    },
    "job": {...} // A RQL job resource if expand=job is set in the query string
  }
}```


## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `job_id` | `string` | Yes | - |
### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `expand` | `string` | No | If the value is `job`, the response will contain the RQL job resource |
## Responses

### 200 — success

````
