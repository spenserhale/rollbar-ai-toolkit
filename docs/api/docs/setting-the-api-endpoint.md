<!-- source: https://docs.rollbar.com/docs/setting-the-api-endpoint.md -->

# Setting the API Endpoint

Most of the Rollbar SDKs provide a configuration option to set the API endpoint. The default is always Rollbar's API, however this can be configured to point to your own proxy.

## Ruby

Example:

```
Rollbar.configure do|config|
  config.endpoint = 'https://api.rollbar.com/api/1/item/'
end
```

## Javascript

Example:

```
Rollbar.configure({endpoint: 'https://api.rollbar.com/api/1/item'});
```