<!-- source: https://docs.rollbar.com/docs/ai-privacy-principles.md -->

# AI Privacy Principles

Last Update: 4/9/26

Generative AI features in Rollbar, including Rollbar Resolve, are designed with your privacy in mind. Here are the core principles that apply to how we handle your data when it comes to our generative AI features.

### Transparency in Data Processing

Our generative AI features use some of the data you've configured to collect and send to your Rollbar instance. This provides additional insights, analysis, and solutions for your review.\
The data used for these features includes:

* Error messages
* Stack traces
* Spans and traces
* Logs
* DOM interactions
* Profiles
* Relevant code from linked repositories

<br />

### No Training on Your Data

Your data will not be used to train generative AI models.

### Limited Access by Authorized Third Parties

Our generative AI features are powered by third-party large language models (LLMs) that are hosted within Rollbar's production infrastructure and not accessible by the underlying third-party model providers. This is enabled by the infrastructure providers set forth on our [subprocessor list.](https://docs.rollbar.com/docs/data-subprocessors)  For any features that rely on LLMs hosted outside Rollbar's production infrastructure, we will identify the applicable subprocessors.

In all cases, our subprocessors are only permitted to use the data as directed by Rollbar and in accordance with the commitments we make to you for the Rollbar service.

Further, by design, the Rollbar AI-generated outputs from your data inputs are shown only to you, and never shared with other customers.