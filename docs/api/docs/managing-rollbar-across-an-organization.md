<!-- source: https://docs.rollbar.com/docs/managing-rollbar-across-an-organization.md -->

# Managing Rollbar across an Organization

# Centrally Managing Rollbar Configuration

To successfully manage Rollbar across an organization, a process is needed to automatically provision, and configure Rollbar for all applications.

By centralizing this process, your organization can help teams to:

* Ensure Rollbar is implemented in all new applications
* Meet organization data security goals
* Meet organization error response best-practices goals

# Automate the 3 Rollbar  Setup Steps

There are 3 steps to configuring Rollbar for a new application.

1. Create the Rollbar Project for the application.
2. Configure and instantiate Rollbar in the application source code.
3. Complete configuration and verification in the CI/CD process

These steps can be easily automated.

## Step 1: Auto-provision Rollbar projects

Auto-provision Rollbar projects using  the Rollbar Terraform Provider or the Rollbar REST API

[Rollbar & Terraform](https://rollbar.com/integrations/terraform/)
[Rollbar Terraform Provider](https://docs.rollbar.com/docs/terraform)
[Rollbar API](https://docs.rollbar.com/reference)

## Step 2: Configure and Instantiate Rollbar

### Wrap the Rollbar SDK

For each language that your organization develops create a wrapper class to wrap the Rollbar SDK.  This controls direct access to the Rollbar SDK,  and ensures that all your team configure Rollbar according to your organizations' requirements.

* Include this wrapper in a core library that is included in all applications
* Include Rollbar in your organizations' new application templates.
* Regularly update to the latest Rollbar SDK version

See also the [Rollbar Create Item API](https://explorer.docs.rollbar.com/#operation/create-item) .

### Implement Data Security Requirements

Your organization may have particular data security requirements. For example

* Denying configuration of  certain SDK settings
* Requiring configuration of certain SDK settings
* Implementing extra data scrubbing, including regex matching
* Adding extra data to the payload as required by your organization
* Including a mechanism receive a notification if teams are inadvertently attempting to send inappropriate data in the payload.

Review the following JavaScript documentation links
[Transforming the payload](https://docs.rollbar.com/docs/javascript#transforming-the-payload)
[Ignoring certain items](https://docs.rollbar.com/docs/javascript#ignoring-items)

All Rollbar language SDKs have similar functionality. See the relevant SDK documentation.

## Step 3: Rollbar in the CI/CD Process

### 1. Generate dynamic settings in the CI/CD process

Generate dynamic settings that change for every release during the build or deployment, including:

```
- Environment 
- code_version
- Custom data fields as required by your organization e.g cluster_id, container_id etc.
```

### 2. Verify that Rollbar is configured correctly

Verify that teams are implementing Rollbar according to your organizations' requirements by including verification steps in the CI/CD process. For example:

* Unit Tests
* Static Code Analysis Tests

### 3. Notify Rollbar of Deployments

[Deploy Tracking](https://docs.rollbar.com/docs/deploy-tracking)
[Deploy Tracking API](https://docs.rollbar.com/reference/post-deploy)

## Other Recommendations

* Include your Application Security and Data Security teams in the process
* Update the Rollbar SDK to the latest available version for your language/framework
* Train end users of Rollbar and application error best-practices for your organization
* Automate as much as possible of the Rollbar setup process for new applications, including instantiation of Rollbar at application start-up if possible
* Review the process regularly to ensure it still meets your organizations requirements