# GET /api/1/versions/{version}

Code version details in one project

Returns the details about one specific code version in one project

https://docs.rollbar.com/docs/versions

## Parameters

### Path Parameters

| Name      | Type     | Required | Description                                     |
| --------- | -------- | -------- | ----------------------------------------------- |
| `version` | `string` | Yes      | The code version sent on the occurrence payload |
|           |

### Query Parameters

| Name          | Type     | Required | Description                                        |
| ------------- | -------- | -------- | -------------------------------------------------- |
| `environment` | `string` | Yes      | The environment where the code version is detected |

## Responses

### 200 — success

**Content-Type:** `application/json; charset=utf-8`

Type: `object`
