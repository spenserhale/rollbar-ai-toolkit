# GET /api/1/people/delete_jobs/{job_id}

Get person deletion status

Check on the status of a person deletion request.

The response will include a status, e.g.

```
{
  "err": 0,
  "result": {
    "state": "success", // possible values are "new","running","paused","success","cancelled","failed"
    "id": 3
  }
}
```

## Parameters

### Path Parameters

| Name     | Type      | Required | Description                                                                 |
| -------- | --------- | -------- | --------------------------------------------------------------------------- |
| `job_id` | `integer` | Yes      | The id of the deletion job (from the response to a `POST` to `delete_jobs`) |

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "state": "string",
    "id": 0
  }
}
```
