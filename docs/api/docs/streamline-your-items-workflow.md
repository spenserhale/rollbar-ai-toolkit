<!-- source: https://docs.rollbar.com/docs/streamline-your-items-workflow.md -->

# Streamline your items workflow

<h3>Overview</h3>

<p>Chances are you have multiple incoming occurrences in your Rollbar projects, grouped into items, appearing in your Item list, one after another. You also start to receive notifications pouring in your inbox. Now, you might as well keep your incoming items organized and clean by Rollbar’s useful options of:</p>
<ul>
<li>Setting up statuses for your items, that determine how they appear and behave,</li>
<li>Triaging and rating them based on their severity level.</li>
</ul>
<p>This way you can make sure your item list is transparent, you will not be spammed by irrelevant notifications, provide clear visibility for your teams who manage the same project by appropriately triaging your errors and setting up the relevant severity level and status, to speed up the process of debugging, making sure everyone focuses their attention on the relevant things!</p>
<iframe width="720" height="405" src="https://www.youtube.com/embed/Eedkzgd9s1c" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h3>Item statuses</h3>
<p>At Rollbar, we offer the chance to assign 3 statuses for your items: Active, Resolved, Muted.</p>
<h3>Active items</h3>
<p>All items start as active. Active means that the error is present and on-going and it requires your attention. It could represent a bug that has not yet been fixed or an intermittent ongoing backend issue.</p>
Active items
<ul>
<li>Appear on the Dashboard</li>
<li>Trigger notifications on their first occurrence and when thresholds are crossed (according to your notification rules)</li>
<li>Count for billing purposes</li>
<li>Can be changed to Resolved and Muted</li>
</ul>
<h3> Resolved items</h3>
<p>When you believe your item is fixed or if you want to be notified if the bug re-appears you can mark it as Resolved. If possible you should include the version in which the item is fixed for future reference, as it will prevent it from being reactivated fore you deploy the new code version. This way you can also prevent your items from being reactivated by clients that are still running the old code.</p>
Resolved items
<ul>
<li>Won’t appear on the dashboard (but you can still filter for them)</li>
<li>Will be reactivated when the error occurs again in a newer code version, triggering a notification</li>
<li>Count for billing purposes</li>
<li>Can be Reactivated or set to Muted</li>
</ul>
<h3>Muted items</h3>
<p>If you consider an item as a non-issue for the time or currently don’t want to work on it, you can set it to Muted. Errors that currently aren’t worth investigating can be set to Muted, making sure they stay out of sight. Muted items are still searchable and can be indexed.</p>
Muted items
<ul>
<li>Won’t appear on the dashboard (but you can filter for them)</li>
<li>Remain muted even if they occur again</li>
<li>Count for billing purposes</li>
<li>Can be set to Resolved or Active</li>
</ul>
<h3>Update your item statuses</h3>
<p>There are many ways to <a href="https://docs.rollbar.com/docs/status-active-resolved-muted">update item statuses</a>, you can:</p>
<ul>
<li>Set the item status to Active, Resolved or Muted manually in the UI on the Item list view or the Item details view</li>
<li>Set it to Active, Resolved or Muted via Rollbar API</li>
<li>Automatically resolve via commit message</li>
<li>Automatically resolve on deploy</li>
<li>Automatically resolve when an item hasn’t occurred in a set amount of days</li>
<li>Resolve when a Jira issue is closed</li>
</ul>
<h3>Severity levels</h3>
<p>All Rollbar Items have severity levels. Properly setting up your severity level can reduce the noise in your Items/Dashboard/Versions view and your notifications and also reduce alert fatigue. There are 5 levels:</p>
<ul>
<li>Critical</li>
<li>Error</li>
<li>Warning</li>
<li>Info</li>
<li>Debug</li>
</ul>
<p>The default severity level for all unhandled items is Error, which you can change based on your system of prioritization. You can easily change the severity levels in the UI manually. Severity levels can be used as criteria for notification rules. It is useful if you only want to receive notifications about a certain level of bugs. It can also be used as a filter in RQL or the Item/Dashboard/Versions view, so you can manage the visibility of your items.</p>
<img src="//downloads.ctfassets.net/cj4mgtttlyx7/7afA15gZtGcZ3nJk9KIEsE/531064e75d0ae2e762f6e492835bc8de/items-workflow-001.gif" alt="Items Workflow">
<h3>Learn more</h3>
<p>Check out our Docs to get more details on <a href="https://docs.rollbar.com/docs/status-active-resolved-muted">how to change your item statuses</a>!</p>