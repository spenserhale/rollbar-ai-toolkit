<!-- source: https://docs.rollbar.com/docs/preventing-client-side-access-token-abuse.md -->

# Preventing Client-Side Access Token Abuse

<p>Unfortunately there is no silver bullet here -- all analytics services have this problem too (Google Analytics, Mixpanel, etc.).</p>
<p>Our best practices for mitigating this problem:</p>
<p><strong>Access tokens</strong>
Use a separate client-side token with post_client_item scope only. (This is the default post_client_item token.) The client-side access token can only be used to send events and only from client-side platforms. It can't be used to read any data, and it can't be used to spoof server-side events.</p>

[block:image]{"images":[{"image":["https://files.readme.io/b692400ac74928045eacccbb2262362c74f75acbaca08c8ee158e5dd55440c10-Screenshot_2024-09-03_at_10.55.31_AM.png","Screen Shot 2022-10-05 at 4.57.36 PM.png",null],"align":"center"}]}[/block]

<p>Tokens can be disabled and replaced at any time. If someone is abusing your token, you can disable it and use a new one instead.</p>

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e755ec4f6fc748f5cf40588c78fb4105b153e8301d435dd291e3aec7e465a8f0-Screenshot_2024-09-03_at_11.00.52_AM.png",
        "Screen Shot 2022-10-05 at 5.01.55 PM.png",
        1558
      ],
      "align": "center",
      "sizing": "400px"
    }
  ]
}
[/block]

<p><strong>IP Blocklist</strong>
We also provide an IP Blocklist so that you can blocklist specific malicious IPs. You can find the source IPs in the Rollbar interface, and then add those IP(s) to the blocklist. (Project -&gt; Settings -&gt; IP Blocklist)</p>