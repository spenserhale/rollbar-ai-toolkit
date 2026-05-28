<!-- source: https://docs.rollbar.com/docs/rollbar-best-practices.md -->

# Best Practices

Quickstart onboarding guide for new Rollbar customers. Learn how to enable and utilize all of Rollbar's features with this language-agnostic starter guide.

## Best Practices

Rollbar is designed to be developer friendly and delivers on this through customizable SDKs for all of our supported languages. There are, however, best practices for configuring and using Rollbar that generally apply across all of these languages and use cases. These best practices are documented in this guide: it is intended to help you understand how others are configuring the Rollbar agent and the web app to provide the best experience for their specific needs.

## How to use this Guide

This guide is divided into different product categories: the SDK and the web app are separate components so we will review their best practices individually. SDK configuration is best done all at once if possible, since it involves deploying new versions of your code. Web app configuration can be done in parts since there are no rollouts required for the changes. The web app best practices are divided into account and project configurations, since they have different settings that affect different scopes.

SDK configuration is also recommended as a precursor to web app configuration due to the fact that some features are only enabled in the web app by adding new SDK configurations. Make sure you review all of the code changes required to enable the full set of Rollbar features.

## [SDK Configurations](sdk-configurations)

Use this guide to learn more about configuring Rollbar in your code.

## [Account Configurations](account-configurations)

This guide focuses on account-level configs and administration, these settings will affect all users.

## [Project Configurations](project-configurations)

This guide is designed to help users improve their own Rollbar experience.

## User Training

Most of the best practices in this guide are focused on settings and configurations; there are other resources available for user training.

### Knowledge Base

The Rollbar [Knowledge Base](https://rollbar.com/knowledge-base/) combines shorter written articles & guides with short, feature-specific videos. These guides allow you to focus more specifically on a single feature or use case.

### Rollbar YouTube

The [Rollbar YouTube](https://www.youtube.com/channel/UChsd_x38qJGhDayqjATfEOA/videos) channel has all of the Rollbar Academy videos plus integration guides, SDK setup videos, and customer stories. This is the best single source of video content.