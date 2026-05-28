<!-- source: https://docs.rollbar.com/docs/oidc-setup.md -->

# Okta OIDC Setup

These instructions create a **custom Okta OIDC Web App** and connect it to **Rollbar OIDC SSO**.

## 1. Create the Okta OIDC app

1. In **Okta Admin Console**, go to:\
   **Applications → Applications**
2. Click **Create App Integration**
3. Select:
   * **Sign-in method:** OIDC - OpenID Connect
   * **Application type:** Web Application
4. Click **Next**

<br />

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8b427ce81f66d1e1028c007aa01cd77fd111aa4d5b6f94de0e1d2fe328c821ca-Screenshot_2026-02-18_at_12.59.00PM.png",
        "",
        ""
      ],
      "align": "center",
      "sizing": "500px"
    }
  ]
}
[/block]

***

## 2. Configure the Okta app settings

### General Settings

* **App integration name:** `Rollbar OIDC` (or similar)

### Grant type

Enable:

* Authorization Code
* Refresh Token

<br />

Do not enable:

* Client Credentials (not needed)
* Wildcard redirect URIs (do not use)

<br />

### Sign-in redirect URIs

Set the redirect URI to Rollbar’s OIDC callback:

* `https://app.rollbar.com/auth/callback/oidc`

Remove any default localhost callback URL.

<br />

### Sign-out redirect URIs (optional)

Not required for Rollbar. If you want a clean configuration, set:

* `https://app.rollbar.com/`

<br />

### Trusted Origins / Base URIs

Leave blank.

<br />

Click **Save**.

***

## 3. Copy Client ID and Client Secret from Okta

1. Open the app (**Rollbar OIDC**)
2. Go to the **General** tab
3. In **Client Credentials**, copy:
   * **Client ID**
4. In **Client Secrets**, reveal/copy:
   * **Client Secret**

<br />

You will paste these into Rollbar.

***

## 5. Get your Okta OIDC Discovery URL

The discovery URL is an Okta endpoint. Use the correct format based on your Okta authorization server.

### Option A: Org Authorization Server

Use this if you are using the Okta org issuer:

* `https://{yourOktaDomain}/.well-known/openid-configuration`

### Option B: Custom Authorization Server (most common: `default`)

Use this if you use Okta’s custom authorization server (often named `default`):

* `https://{yourOktaDomain}/oauth2/{authServerId}/.well-known/openid-configuration`

Most commonly:

* `https://{yourOktaDomain}/oauth2/default/.well-known/openid-configuration`

How to confirm which one you’re using:

* Okta Admin → **Security → API → Authorization Servers**
  * If you use a server like `default`, use Option B.

***

## 6. Configure Rollbar to use Okta OIDC

In Rollbar:

1. Go to **Account Settings → Identity Provider** (or SSO settings)
2. Under **OIDC** configuration, enter:
   * **Client ID:** (from Okta)
   * **Client Secret:** (from Okta)
   * **OIDC Discovery URL:** (from Step 5)
3. Save

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8919f27b287605192da54499a6d4c936d55da8a74dc72216cd3476542e063ba3-Screenshot_2026-02-18_at_2.23.22PM.png",
        "",
        ""
      ],
      "align": "center",
      "sizing": "500px"
    }
  ]
}
[/block]

***

## 7. Add users to Rollbar (important)

Okta authentication does **not** automatically grant Rollbar access.

Ensure you user is added to the team or add the new user.

1. In Rollbar, go to **Account Settings → Users/Team**
2. Invite the user(s) you assigned in Okta (or ensure they already exist in the Rollbar account)
3. Have them accept the invite if required

***

## 8. Test the login

Preferred test flow (SP-initiated):

1. Go to:\
   `https://app.rollbar.com/login/{your_rollbar_account_slug}`
2. Click **Log in with OIDC Identity Provider**
3. Authenticate in Okta
4. Confirm you land in the correct Rollbar account

If you see "Access needed: contact your admin":

* The user authenticated successfully, but is not a member of that Rollbar account yet.
* Fix by inviting them in Rollbar (Step 7).