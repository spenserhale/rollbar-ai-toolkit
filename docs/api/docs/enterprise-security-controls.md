<!-- source: https://docs.rollbar.com/docs/enterprise-security-controls.md -->

# Enterprise Advanced Security Controls

If you have an Enterprise plan, you can enable additional security controls. These advanced security features will help keep your data safe, protected, and centralized from disruptions. All features are accessed through the Account Settings page.

## User List

By clicking the User Status link, you may view a list of users associated with your account. This list includes their username, email address, last login date and time, the last date they changed their password, and, if they are locked out of their account, the time they werere locked out. By clicking on a username, you can edit the lockout status, expire the user's password, and revoke their active sessions.

## Additional Security Controls

Rollbar offers a variety of other security controls to help secure your company's use of Rollbar.

### Login Attempts

This section of Rollbar's security settings manages how the system responds to consecutive failed login attempts to prevent unauthorized access through brute force attacks.

**Max Consecutive Failed Login Attempts** specifies the maximum number of consecutive failed login attempts allowed before a user is locked out of their account.  Leaving this input empty will default to no limit.

**Lockout Time** determines the duration of the lockout period after exceeding the max consecutive failed login attempts. Users will be locked out for this duration unless manually restored by an account admin.  The default is set at indefinite, and an account admin (owner role) must manually restore access to the account for the user.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3bde4cf-Screenshot_2024-06-12_at_10.09.03_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

### Password Security

These settings ensure robust security protocols by regulating password characteristics and lifecycle for user accounts in Rollbar.

| Setting                   | Description                                                                                                                                                                 | Default                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Min Password Length**   | This setting defines the minimum number of characters that must be included in a user's password. It applies to all new passwords saved after it is configured.             | Min character count: 8         |
| **Max Password Length**   | Specifies the maximum number of characters that a password can include. This setting affects all new passwords saved after it is set.                                       | Max character count: 64        |
| **Password History Size** | Determines how many of the user’s previous passwords are stored to prevent reuse. When a password changes, it must not match any of the last specified number of passwords. | Default: 0 (no history stored) |
| **Max Password Age**      | Sets the maximum number of days a password can be used before it is considered expired and needs to be changed.                                                             | Default: no maximum            |

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/aaca8dc-Screenshot_2024-06-12_at_10.09.12_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

### Session Expiration

The session expiration settings help enhance the security of user sessions by defining the duration after which inactive sessions expire or active sessions must be renewed through re-authentication.

**Max Session Length** determines the maximum duration a user session can remain active. After this period, the user must re-authenticate. If not explicitly set, the system uses the default duration. If no custom setting is applied, user sessions will automatically expire 30 days after being initiated, irrespective of activity levels.

**Max Inactive Time** specifies a session's maximum period to remain inactive before expiring. Inactivity is defined as the duration of the session during which no actions are taken by the user. By default, there is no maximum limit.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3bac0d2-Screenshot_2024-06-12_at_10.09.21_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

<br />

### IP Safelist

The IP Safelist settings restrict access to Rollbar's UI and API to only the IP addresses specified in the Safelist. This adds a layer of security by ensuring that only requests from trusted IP sources can access the system.

**UI Safelist** is tailored to secure access to the Rollbar UI. By specifying IP addresses or ranges here, you grant access exclusively to trusted networks, thereby controlling who can interact with the UI.  When left blank, no restrictions exist, allowing access from any IP address unless specified.

**API Safelist** restricts access to Rollbar's API. This is particularly important for organizations that need to ensure that only specific servers or services can communicate with Rollbar APIs. Like the UI, the default configuration imposes no restrictions, leaving it open to all IPs until specified.

**Unified Safelist**—For environments where the same IP restrictions apply to both the UI and API, the Unified Safelist option simplifies management. By enabling this, any IP address added to the UI Safelist will also automatically apply to the API, eliminating the need to duplicate entries across both safelists.

When setting up the IP Safelist, you'll enter individual IP addresses or use CIDR notation to define ranges. For instance, entering `192.168.1.1` allows a single IP, whereas `192.168.1.0/24` encompasses an entire subnet, offering broader access.

*Note:* Only ipv4 addresses are supported at this time. When the safelist is set, access from ipv6 is blocked.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/267b3ad-Screenshot_2024-06-12_at_10.09.32_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

> 🚧 API Safelist Warning: If this value is set incorrectly or has a missing server IP addresses, data will not flow into Rollbar. The Rollbar API will return a 403 error with the  message  "Blocked: {{IP Address}} not in account safelist""

### Access Times Settings

The Access Times allows administrators to enforce time-based access restrictions, enhancing security by limiting system availability to predefined hours. This is particularly useful for controlling access during off-peak hours or outside regular operating periods.

Administrators can set specific start and end times for when system access is permitted, using GMT as the reference timezone. These settings apply to all non-owner roles, with owners retaining unrestricted access to ensure they can manage incidents or critical system needs at any time.

* **From** : This dropdown allows you to select the starting time for permitted access. Options range from 00:00 to 23:30, in 30-minute increments.
* **To** : This dropdown enables you to select the ending time for access. Similar to the start time, options are available in 30-minute increments up to 23:30.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/86ecb83-Screenshot_2024-06-12_at_10.09.43_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

## Security Audit Log

In Account settings, under Audit Log, you can see all of the recent actions in the Rollbar UI by any users in your account. Information includes the timestamp, event (such as "user\_added\_to\_team"), acting user ID and IP address, related user ID, and associated metadata.