# POST /api/1/sourcemap

Upload a JS source map

In the above example, our website is http://example.com, we have a minified JavaScript file at http://example.com/js/example.min.js, and we have a source tree like this:

```
example/
example/static/js/example.min.js
example/static/js/example.min.map
example/static/js/site.js
example/static/js/util.js
```

## Request Body

**Content-Type:** `multipart/form-data`

```json
{
  "version": "string",
  "minified_url": "string",
  "source_map": "string",
  "source files": "string"
}
```

## Responses

### 200 — Success
