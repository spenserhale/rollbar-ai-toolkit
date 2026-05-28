# POST /api/1/deploy

Report a deploy

For tool-specific instructions on reporting a deploy, see our [Deploy Tracking](doc:deploy-tracking) docs.

For instructions on setting the default deploy timeout period, see [Deploy Timeouts](https://docs.rollbar.com/docs/deploy-tracking#section-deploy-timeout).

## Request Body

**Content-Type:** `application/json`

```json
{
  "environment": "string",
  "revision": "string",
  "rollbar_username": "string",
  "local_username": "string",
  "comment": "string",
  "status": "string"
}
```

## Responses

### 200 — Success

**Content-Type:** `application/json`

```json
{
  "data": {
    "deploy_id": 0
  }
}
```
