# POST /api/1/teams

Create a team

# Access Levels

`standard` is the only access level you can choose in the UI.

`light` and `view` are API-only team access levels. `light` gives the team read and write access, but not to all settings. `view` gives the team read-only access.

## Request Body

**Content-Type:** `application/json`

```json
{
  "name": "string",
  "access_level": "string"
}
```

## Responses

### 200 — success

**Content-Type:** `application/json`

```json
{
  "err": 0,
  "result": {
    "access_level": "string",
    "id": 0,
    "name": "string",
    "account_id": 0
  }
}
```
