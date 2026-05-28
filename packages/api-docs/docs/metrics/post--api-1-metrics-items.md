# POST /api/1/metrics/items

Get metrics for a list of items

Get metrics for a provided list of item IDs. The endpoint follows search/query semantics as a POST request using project read access token

## Request Body

**Content-Type:** `application/json`

```json
{
  "item_counters": [0]
}
```

## Responses

### 200 — List of metrics for the requested item IDs

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "project_id": 0,
    "project_slug": "string",
    "metrics": null
  }
}
```
