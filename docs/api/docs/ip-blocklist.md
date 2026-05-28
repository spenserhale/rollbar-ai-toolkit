<!-- source: https://docs.rollbar.com/docs/ip-blocklist.md -->

# IP Blocklist

When used in client-side Javascript, Rollbar access tokens are visible to end users and at risk of being used inappropriately to send data to your projects.

Each Rollbar project can be configured with a blocklist of IP addresses from whom we will not accept any data.

To configure the blocklist for your project, go to **Project Settings → IP Blocklist**, and enter one or more valid IPv4/IPv6 addresses or subnets (in [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation), separated by newlines or commas.  Examples of valid entries include:

* `192.168.0.1`
* `192.168.0.1/24`
* `2620:0:2d0:200:0:0:0:7/128`

<br />

The Rollbar API will return with the status code **403** and the message **"Your IP address (x.x.x.x) has been blocked"**.

```Text json
{ "err":1, "message": "Your IP address (x.x.x.x) has been blocked." }
```

If you are also logging data to an external logging system you may see a message like **"Got unexpected status code from Rollbar api: 403"**

To resolve this error you must modify the IP Blocklist for the selected project. This can be found under the project settings menu.

The direct path to this setting is <https://rollbar.com/YOUR_ACCOUNT_NAME/YOUR_PROJECT_NAME/settings/ip_blocklist/>

<br />

Rollbar has additional enterprise security features to allow or block certain IP addresses. Read more [here](https://docs.rollbar.com/docs/enterprise-security-controls#ip-safelist).