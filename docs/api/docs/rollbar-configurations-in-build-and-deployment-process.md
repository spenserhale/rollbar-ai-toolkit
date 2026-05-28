<!-- source: https://docs.rollbar.com/docs/rollbar-configurations-in-build-and-deployment-process.md -->

# Rollbar configuration in the build/deployment process

## Setting configurations in the build and deployment process

Many Rollbar configuration settings are known during the build and deployment process. Set up a process so that important Rollbar settings are added as part of the build and deployment process.

Examples of configuration settings commonly added during the build/deployment process

* code\_version
* environment
* Custom additional data fields that make responding to errors more efficient
  * container\_id
  * cluster\_id
  * etc.

### Code Version

Configuring the Rollbar SDK code\_version setting provides a lot of extra context when an error occurs. The commit number or release tag is generally available in the Continuous Integration tool as an environment variable.

For example:
Jenkins Git Plugin - $GIT\_COMMIT
[CircleCI](https://circleci.com/docs/2.0/env-vars/#built-in-environment-variables) - $CIRCLE\_SHA1

This can then be used to generate the configuration settings for the application.

### Environment

Ensure that the environment setting is being configured as part of the deployment process.

### Additional custom data fields

Additional custom data fields can be configured that will be included in every error sent to Rollbar. These may be properties to:

* Help an SRE team to deduce the root cause of an error
* Trigger an automated response to an error

### Python Example

This example code shows Rollbar configuration settings being read from a config file at application start.
It includes some addition custom data fields that will be help the Development and SRE teams to respond to an error more efficiently.

```python
import rollbar
import configparser as cp

config = cp.ConfigParser()
config.read('config.ini')
 
# set variable values
ENVIRONMENT = str(cp.get('settings', 'environment'))
ACCESS_TOKEN = str(cp.get('settings', 'access_token'))
CODE_VERSION = str(cp.get('settings', 'code_version'))
CLUSTER_ID = str(cp.get('settings', 'cluster_id'))
CONTAINER_ID = str(cp.get('settings', 'container_id'))


def payload_handler(payload, **kw): 
   # add/remove data just before the error payload is sent

   # add additional custom data to the payload
   payload['deploy_info'] = {}
   payload['deploy_info']['cluster_id] = CLUSTER_ID
   payload['deploy_info']['container_id] = CONTAINER_ID

   return payload
 

rollbar.init(ACCESS_TOKEN, ENVIRONMENT, code_version=CODE_VERSION)
rollbar.events.add_payload_handler(payload_handler)

```

### Other Links

[Adding custom additional data](https://docs.rollbar.com/docs/custom-data) to the payload
[Trigger Notification based on custom data](https://docs.rollbar.com/docs/path-filter) using the Path filter
[Webhooks](https://docs.rollbar.com/docs/webhooks) for custom error response workflow