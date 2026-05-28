<!-- source: https://docs.rollbar.com/docs/onelogin-oidc.md -->

# OneLogin OIDC

These instructions configure **OneLogin as an OIDC Identity Provider** for a Rollbar account.

## 1. Create the OneLogin OIDC application

1. In the **OneLogin Admin** UI, go to:\
   **Applications → Applications**
2. Click **Add App** (top right).
3. Search for **OpenId Connect (OIDC)**.
4. Select the app created by **OneLogin, Inc.**
5. (Optional) Update the **Display Name** and upload a Rollbar icon for clarity.
6. Click **Save**.

***

<br />

## 2. Configure Rollbar URLs in OneLogin

After saving, you’ll be on the larger configuration screen.

1. Go to the **Configuration** tab.
2. Set the following fields:

### Login URL

`https://app.rollbar.com/auth/{rollbar_account_name}/oidc`

### Callback URL

`https://app.rollbar.com/auth/callback/oidc`

<br />

3. Click **Save**.

<br />

***

<br />

## 3. Verify SSO settings in OneLogin

1. Go to the **SSO** tab.
2. Confirm these dropdowns:

* **Application type:** `Web`
* **Token endpoint | Authentication method:** `POST`

3. Click **Save**.

***

<br />

## 4. Copy the OneLogin values you need for Rollbar

From the OneLogin app, copy:

* **Client ID**
* **Client Secret**
* **Well-known configuration**

Important:

* For **Well-known configuration**, copy the **hyperlink URL** (the link target), **not** the Issuer URL text you see on the screen.

***

<br />

## 5. Configure Rollbar to use OneLogin OIDC

1. In Rollbar, go to:\
   **Account Settings → Identity Provider**

2. Scroll to the **OIDC connection settings**

3. Fill in:
   * **Provider:** `OneLogin`
   * **Client ID:** (from OneLogin)
   * **Client Secret:** (from OneLogin)
   * **OIDC Discovery URL:** (the OneLogin well-known configuration link)

4. Click **Save OIDC configuration**.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/0491356dd63cba2ffc7d8c804fab8c83ab564b9b9f15b1afe514d397f0f3e76a-Screenshot_2026-02-18_at_2.23.22PM.png",
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

<br />

## 6. Test login

After saving successfully, you can log in either way:

### Option A: OneLogin tile

* Use the **Rollbar OIDC Login** tile in the OneLogin portal.

### Option B: Rollbar login page

* Go to:

`https://app.rollbar.com/login/{your-account-name}`

Click **Log in with OIDC Identity Provider**.

***

<br />

## 7. Access control note (SSO enforced accounts)

If your Rollbar account requires IdP login, that requirement is respected for OIDC the same way it is for SAML.

Practical implication:

* Provision users and group is not available for OIDC logins
* Users still need to be members of the Rollbar account (invited/added) to get past “access needed” screens, even if they authenticate successfully via OneLogin.