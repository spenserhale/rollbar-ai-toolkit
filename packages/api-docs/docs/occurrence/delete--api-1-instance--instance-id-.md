# DELETE /api/1/instance/{instance_id}

Delete an occurrence

Permanently deletes an occurrence. This will make it unavailable in the Rollbar UI and API. Aggregate counts are not updated. Deleting occurrences will not reduce or reset your quota.

Deletion takes place asynchronously, typically within a few seconds. To verify that deletion has completed, use GET and expect a 404 response.

## Responses

### 200 — success

**Content-Type:** `application/json; charset=utf-8`

```json
{
  "err": 0,
  "message": "string"
}
```
