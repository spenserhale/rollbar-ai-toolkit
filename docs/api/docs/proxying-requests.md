<!-- source: https://docs.rollbar.com/docs/proxying-requests.md -->

# Proxying Requests

Some of the Rollbar SDKs provide one or more ways to proxy requests before transmitting to the Rollbar API. This can allow queueing, storing, deferring, or otherwise managing the outbound requests payloads before sending to Rollbar.

To proxy requests across a network, see [Setting the API Endpoint](/docs/setting-the-api-endpoint/).

To proxy requests within a local process, see [JSON Proxy](/docs/json-proxy/).