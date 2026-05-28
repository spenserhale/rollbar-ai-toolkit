# POST /api/1/dsym

Upload an iOS dSYM bundle

**Note:** dSYM bundles are a special type of Apple directory which are made to _look_ like a file, because of this, all dSYM bundles must be zipped prior to upload.

## Parameters

### Header Parameters

| Name                     | Type     | Required | Description                                              |
| ------------------------ | -------- | -------- | -------------------------------------------------------- |
| `X-Rollbar-Access-Token` | `string` | Yes      | Use a Project Access Token with 'post_server_item' scope |

## Request Body

**Content-Type:** `multipart/form-data`

```json
{
  "dsym": "string"
}
```

## Responses

### 200 — Success
