<!-- source: https://docs.rollbar.com/docs/bash.md -->

# Bash

Report a deploy to Rollbar from the Bash shell

To report a deploy, use a `cURL` command  to call the [Rollbar Deploy API](https://explorer.docs.rollbar.com/#operation/post-deploy) directly.
Below is an example:

curl -H "X-Rollbar-Access-Token:  POST\_SERVER\_ACCESS\_TOKEN" -H "Content-Type: application/json" -X POST '<https://api.rollbar.com/api/1/deploy>' -d '{"environment": "qa", "revision": "dc1f74dee5", "rollbar\_name": "john", "local\_username": "circle-ci", "comment": "Tuesday deployment", "status": "succeeded"}'