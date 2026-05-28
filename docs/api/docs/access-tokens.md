<!-- source: https://docs.rollbar.com/docs/access-tokens.md -->

# Access Tokens

Managing Account & Project Access Tokens

> 🚧 Exciting Security Enhancements: Stronger, Smarter Access Tokens
>
> Release date: April 2025 (for majority of users)

### What is changing?

**Stronger Protection** – Newly created tokens will now be encrypted and will no longer be accessible via the UI or API after creation. When you generate a token, be sure to copy and store it securely - once you close the create token window, the token will be securely encrypted with no way to view it again.

**Flexible Security Options** – Choose between 512-bit tokens for maximum security or 128-bit tokens if you need to maintain compatibility with existing token lengths.

**Updated Scope Rules** – To enhance security, for newly created project tokens certain token scopes must now be separate - post\_server\_item and post\_client\_item can no longer be combined with other scopes. Your current tokens can remain in their current state, but we recommend that you create new tokens with separate scopes.\
Encrypt Existing Tokens - You can immediately encrypt your tokens without having to make any changes to the tokens themselves or your code - the tokens will be updated to the new encrypted storage mechanism.

### What do I need to do?

**No immediate action is needed** – your existing tokens will remain unchanged and continue to work as usual. Existing tokens will still be visible in the UI and API, but any new tokens you create will follow the upgraded security process and be in the new format.

***

<br />

## What is an Access Token?

Access tokens are essential for enabling various data interactions within your Rollbar projects. Each project has its own unique set of access tokens, making them indispensable for routing data through different SDKs.

### Project Access Scopes

You can find and administer your project access tokens in Project -> Settings -> Project Access Tokens. Project access tokens can have any or all of the following scopes:

| Scope              | Description                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| post\_server\_item | Can perform all POST requests to `/deploy/` and `/item/`. Can also be used to upload source maps (JS, proguard, dSym, flutter) |
| post\_client\_item | Can perform POST requests to `/item/`, but only if the item has a client-side platform (browser, mobile).                      |
| read               | Can perform all GET requests                                                                                                   |
| write              | Can perform PATCH and DELETE requests.                                                                                         |

New projects are created with four tokens, one with each scope. As client tokens often need to be embedded in publicly visible code (i.e. the HTML source of a page)

> 📘 A good practice is to use a separate client-side token with post\_client\_item scope, which only permits event sending from client-side platforms.

## Editing and Configuring Tokens

Managing individual tokens is straightforward, and now we've added the ability to edit multiple tokens in bulk for convenience. You'll find various actions that can be performed for each token and options for bulk editing.

### Individual Token Actions

Here's a brief rundown of the actions you can perform on each token:

<table>
  <tr>
   <td><strong>Action</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td>Edit
   </td>
   <td>Allows you to update the token's configurations, such as title, scope, and rate limits.
   </td>
  </tr>
  <tr>
   <td>Regenerate	
   </td>
   <td>​​Generates a new token while keeping the same configurations. The new token will inherit the ‘Active’ status.
   </td>
  </tr>
  <tr>
   <td>Disable
   </td>
   <td>Temporarily deactivates the token. The token's status will change to 'Disabled.'
   </td>
  </tr>
  <tr>
   <td>Expire
   </td>
   <td>Manually sets the token to an 'Expired' status. The token becomes inoperable but is kept for historical reference.
   </td>
  </tr>
  <tr>
   <td>Delete
   </td>
   <td>Permanently removes the token from the Rollbar platform.
   </td>
  </tr>
</table>

### Bulk Editing

Bulk editing is a useful feature for managing multiple tokens at once. Select the checkboxes next to the tokens you want to edit to utilize this function. Once selected, an action menu will appear in the table's header, displaying available actions. It's worth noting that the collective status of the tokens selected will determine the options presented. For example, if you choose an 'Active' and an 'Expired' token, the 'Disable' action won't be available since expired tokens can't be disabled. However, actions like 'Delete' and 'Regenerate' will remain accessible since active and expired tokens can undergo these changes.

This new approach streamlines your token management process, making it easier to enact large-scale changes or quickly adjust to new requirements.

## Rate Limiting

> 🚧 Rate Limit is only available for Paid Accounts

### What is a Rate Limiting?

Rate limiting is the mechanism that restricts the amount of data an access token can send to Rollbar within a specific time window.  You can learn more by visiting our [rate limiting documentation](https://docs.rollbar.com/docs/rate-limits)

### System-Defined Rate Limiting

Rollbar imposes a system-defined rate limit of 50,000 API requests per 1 minute, which acts as the upper boundary for data intake.

### User-Defined Rate Limiting

For paid users, you can set your rate limits up to the 50,000 API requests per 1-minute system limit. These can be customized for various time frames, including 1 minute, 5 minutes, 30 minutes, 1 hour, 1 day, 1 week, and 30 days.

## Token Status

Understanding the status of your access tokens is crucial for effective project management and security. On the project access token page, you'll notice a 'Status' column color-coded to represent the current state of each token. We've introduced five key statuses to guide you:

### Active

Active tokens are fully operational and can be employed for all authorized data interactions based on their scopes.

### Disabled

If a token is compromised or being misused, it can be disabled. Once disabled, Rollbar will no longer accept data sent via this token and will return a 403 response code. You can disable a token via the context menu at the end of the token’s row in the table or by bulk-selecting multiple tokens. Disabled tokens can be re-enabled at any time.

### Expiring Soon

A token with an ‘Expiring Soon’ status is still fully operational, just like an ‘Active’ token, but has an expiration date within one month. When the expiration date is reached, the token will get an ‘Expired’ status and become inoperable.

You cannot set token expiration dates; it is an internal Rollbar feature used in particular circumstances.

### Expired

Tokens with an 'Expired' status are inoperable and cannot be reactivated or modified. They are retained in your project records primarily for historical reference. Expired tokens can also be easily regenerated if necessary, retaining their original configurations, such as scope and rate limits.

This feature offers a convenient way to manage your tokens effectively and avoid any potential issues that may arise during your project.