<!-- source: https://docs.rollbar.com/docs/decision-support-with-versions-api.md -->

# Decision Support with Versions API

The Rollbar Versions API can be used to support automated decisions throughout the SDLC. The accuracy, and immediate availability of error data in Rollbar  means that the Versions API can be used to support automated decisions in a build and deployment pipeline.

These automations save developers time and reduce interruptions. They also dramatically improve end-user experience by:

* Stopping a build with errors before it is deployed to a production environment
* Initiating a workflow to rollback a deployment that has errors

## Versions API

Rollbar [Versions](https://docs.rollbar.com/docs/versions) allows you see errors in each code version.
The Rollbar [Versions API](https://explorer.docs.rollbar.com/#tag/Versions) is based on this feature provides detailed information  about errors associated with a specific code\_version/environment. The API provides 2 endpoints:

* [Code version details in a Rollbar Project](https://explorer.docs.rollbar.com/#tag/Versions/paths/~1api~11~1versions~1{version}/get)
* [List items by code version in a Rollbar Project](https://explorer.docs.rollbar.com/#tag/Versions/paths/~1api~11~1versions~1{version}~1items/get)

## Automated Decision Support

### Stop a build with errors progressing in the pipeline

At the end of a build pipeline process a call can be made to the Rollbar Versions API to determine if the build has introduced New Errors or Reactivated Errors. This information can be used to support an automated decision about whether the build is considered Successful or Failed.

### Rollback a deployment with errors

Poll the Versions API at regular time intervals after a deployment. If the deployment fails to  meet the desired quality threshold initiate an automated rollback procedure.

### Example code on GitHub

This python script shows the Versions API being  used to determine the quality of a build.

[Check Build Quality](https://github.com/RollbarCustomerEng/build-quality-check)

## Extra Information

### Using Item and Occurrence APIs for extra detail

Improve the automated decision support by using the following API endpoints to get more detailed Item and Occurrence information

* [Get Item](https://explorer.docs.rollbar.com/#operation/get-an-item-by-id) API
* [Get Occurrence](https://explorer.docs.rollbar.com/#tag/Occurrence/paths/~1api~11~1instance~1{instance_id}/get) API

### Best Practice

Ensure that  Item data is reviewed regularly to improve the accuracy of the automated decision:

* Adjust the Item [Level](https://docs.rollbar.com/docs/item-levels) based severity and importance
* [Mute](https://docs.rollbar.com/docs/status-active-resolved-muted#muted) Items if appropriate
* [Auto-resolve](https://docs.rollbar.com/docs/auto-resolve-old-items) Items if appropriate
  Some Items may indicate a particular problem. Initiate a specific automated response for certain Item IDs. See also [Custom Fingerprinting](https://docs.rollbar.com/docs/custom-grouping)