# POST /api/1/people/delete_jobs/

Request person deletion

This endpoint allows for removal of a tracked person from all projects within an account.

To identify the person, you must provide **exactly one** of the following:

- `email`
- `username`
- `person_id`

These correspond to the values transmitted in the original occurrences (see the docs for [Create item](ref:create-item)) and can also be found by viewing any tracked person via the [People Tracking](doc:person-tracking) page in any project.

Requests for person deletion are asynchronous. The returned value will include an `id` property that can be used to check the status of the deletion process, e.g.

```
{
  "err": 0,
  "result": {
    "id": 3
  }
}
```

## Parameters

### Query Parameters

| Name       | Type     | Required | Description                                   |
| ---------- | -------- | -------- | --------------------------------------------- |
| `username` | `string` | No       | `username` value of the person to be deleted. |
| `email`    | `string` | No       | `email` value of the person to be deleted.    |
| `id`       | `string` | No       | `id` value of the person to be deleted.       |

## Responses

### 200 — Person deleted
