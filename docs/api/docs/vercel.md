<!-- source: https://docs.rollbar.com/docs/vercel.md -->

# Vercel

## Overview

This native integration connects your Vercel projects to Rollbar so you can map environments cleanly, track deployments, and see production signals tied to the code that shipped.

* Works with multiple Vercel projects and resources
* Install from the Vercel UI in minutes
* Automatically detected deployment tracking.
* Code-first observability focused on clear issues and readable stack traces
* Manage accounts and billing in one place

***

<br />

## Install

1. In the Vercel Marketplace, find Rollbar in the Observability category or by searching.
2. Click Install and authorize access for your team.
3. Select the number of occurrences your project needs, and choose a plan: Free, Essentials, or Advanced.
4. Add your product name, review the plan, and click the "Create" button.
5. After the product is created, click the "Done" button.

<br />

## Project linking and SDK configuration

Project linking maps each Vercel project to a Rollbar project and environment. You can connect multiple projects during install or add links later. Follow the Getting Started guide in the Vercel dashboard for your framework.

1. Click the "Connect Project" button and select your Vercel project.
2. Select the environments you want Rollbar to access, and add a custom prefix if needed.
3. Click the "Create" button.

We create your Rollbar project and access tokens. Click "Open in Rollbar" and follow the onboarding instructions to integrate Rollbar's JavaScript SDK with your application.

We also add two tokens to your Vercel project as environment variables. Names follow this pattern.

* Client token: ROLLBAR\_*{{project\_name}}\_CLIENT\_TOKEN*{{public identifier}}
* Server token: ROLLBAR\_*{{project\_name}}\_SERVER\_TOKEN*{{public identifier}}

To learn more, visit our [Project Access Tokens documentation.](https://docs.rollbar.com/docs/access-tokens#editing-and-configuring-tokens)

<br />

## Usage

1. Install the Rollbar SDK in your application (Next.js, React, Vue, etc.). If you did not complete this during onboarding, see the [JavaScript SDK guide](https://docs.rollbar.com/docs/javascript).
2. Confirm that environment names in Rollbar match your Vercel environments.
3. Deploy on Vercel. Issues begin flowing into your Rollbar project Item List.

> 📘 Session Replay for Vercel
>
> * Vercel installations include 1,000 Session Replays per month at no cost.
> * Buying additional replays through Vercel is not available yet. It is on our roadmap for mid 2026.
> * If you need higher limits now, contact us to upgrade directly with Rollba

<br />

***

<br />

## Deployment tracking

With the Vercel integration, Rollbar automatically detects deployments and updates versions in Rollbar. No additional configuration is required.

See the [Deploy Tracking docs](https://docs.rollbar.com/docs/deploy-tracking) for more in-depth information.

<br />

## Vercel Deployment with Source Maps

Add these environment variables in Vercel Project Settings:

1. `ROLLBAR_SERVER_TOKEN` - Your server access token
2. `BASE_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
3. `SOURCE_VERSION` - (Optional) Version tag for tracking (e.g., `1.0.0` or git commit SHA)

Update your Vercel build command to:

```bash
npm run build:production
```

<br />

### Verifying Source Maps Work

1. Send an exception from your deployed app
2. Open the error in Rollbar
3. Check the stack trace - you should now see:
   * Actual file paths like `components/EventControls.js:57`
   * Real function names
   * Correct line numbers

If you are still having issues click the "Source Map Error" button and review our [Source Map Errors Guide](https://docs.rollbar.com/docs/source-map-errors)

<br />

### Important Notes

* Source maps are **only uploaded during production builds** using `npm run build:production`
* Development builds (`npm run dev`) don't need source maps - they already have readable stack traces
* Source maps are **not included** in your deployed bundle (they're uploaded to Rollbar separately)
* Without `ROLLBAR_SERVER_TOKEN`, the build will still succeed but skip source map uploads