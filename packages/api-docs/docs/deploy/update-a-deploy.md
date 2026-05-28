# PATCH /api/1/deploy/{deploy_id}

Update a deploy

````JavaScript
$.get('http://yoursite.com/test/' + id, function(data) {
    console.log(data);
});```


## Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `deploy_id` | `integer` | Yes | ID of the deploy to update |
## Request Body

**Content-Type:** `application/json`

```json
{
    "status": "string",
    "comment": "string"
  }
````

## Responses

### 200 — Success

**Content-Type:** `application/json`

```json
{
    "err": 0,
    "result": "items": {}
  }
```

### 409 — Invalid data sent

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "message": "string"
}
```
