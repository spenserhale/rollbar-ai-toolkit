<!-- source: https://docs.rollbar.com/docs/rollbar-solutions-enabling-support-teams.md -->

# Rollbar Solutions: Enabling Support Teams

<h3>Overview</h3>
<p>When your application surfaces bugs, it might put your Support team in a difficult position in understanding the impact of an error on users and customers and who might be the right team to assign the issue to. A proactive approach is essential: when users are affected by bugs in your software, it corrupts the customer experience, leading to users eventually choosing to stop using your product. </p>
<p>In this article, we will walk you through how you can help Support team enablement with certain features of Rollbar:</p>
<ul>
<li>People tracking provides visibility over which users of the application are impacted by an error</li>
<li>Item Severity level and error frequency help prioritize errors</li>
<li>Automated Issue Tracking helps you to assign a developer to an issue to ensure resolution</li>
</ul>
<p>Rollbar helps your team understand the impact of errors on specific users, and you will be able to prioritize and assign errors based on the frequency of bugs and the volume/value of customers impacted by them. This will enable your team to address and resolve customer issues faster and with more context. </p>
<h3>People tracking</h3>
<p>When an error occurs in your application, one of the first questions is “How many people are affected?” When you have <a href="https://docs.rollbar.com/docs/person-tracking">People tracking</a> set up, you will have visibility on how the errors in your application have impacted your customers. You can check the People menu in the Item details view to see:</p>
<ul>
<li>Which customers were affected by any one error:</li>
</ul>
<img src="https://rollbar.com/wp-content/uploads/2021/05/Screen_Shot_2021-03-10_at_10.17.56_AM.png" alt="Affected users by an error">
<p>This gives you details on a particular user, how many errors have affected that person, and the last time it occurred. If you click on a selected user’s name, you will get extra visibility on:</p>
<ul>
<li>The history of errors experienced by a particular person:</li>
</ul>
<img src="https://rollbar.com/wp-content/uploads/2021/05/Screen_Shot_2021-03-10_at_10.12.58_AM.png" alt="Error history of a user">
<p>You will see the affected environment, the date, and time of the last occurrence and additional details:</p>
<ul>
<li>the specific item that is linked to the error, </li>
<li>the Severity level and the status of the item</li>
</ul>
<p>Checking the item gives you context on the error that will help you assign the error to the right person. </p>
<p>On the People Menu in the navigation, you will get the list of all people who have ever experienced an error, sorted by most recent error. Currently, we do not support people data across multiple projects. You can select a single project to view People data.
In the Affected People view, you will be able to further filter for:</p>
<ul>
<li>projects</li>
<li>environments</li>
<li>specific users by e-mail address or username</li>
</ul>
<img src="https://rollbar.com/wp-content/uploads/2021/05/Screen_Shot_2021-03-10_at_10.19.49_AM.png" alt="Affected People">
<p>This can help Support teams identify the error that has affected a particular user, and understand the impact of a customer-reported issue by matching it with the associated Rollbar item. The contextual data enables faster resolution of issues.</p>
<p>Clicking “Explore as RQL query” from the Person details will return all items that have affected the given person:</p>
<img src="https://rollbar.com/wp-content/uploads/2021/05/Screen_Shot_2021-03-18_at_8.15.04_AM.png" alt="Explore RQL 1">
<p>And clicking “Explore as RQL query” from the People tab in the Item detail menu will return all people affected by the given item:</p>
<img src="https://rollbar.com/wp-content/uploads/2021/05/Screen_Shot_2021-03-18_at_8.20.25_AM.png" alt="Explore RQL 2">
<h3>Severity levels and error frequency</h3>
<p>All Rollbar items have a severity level: </p>
<ul>
<li>Critical</li>
<li>Error (default severity level for unhandled exceptions)</li>
<li>Warning</li>
<li>Info</li>
<li>Debug</li>
</ul>
<p>You can set the severity levels in the UI in the Item list or Item details. Severity levels can be used as filters in notification rules, in the dashboard, and in RQL. Properly configured severity levels can reduce noise and alert fatigue and speed up the process of triaging and prioritizing errors.</p>
<p>You can read more about <a href="https://rollbar.com/knowledge-base/streamline-your-items-workflow/">Severity levels and Item statuses</a>.</p>
<p>The Items list view gives additional insights to further help prioritize errors:</p>
<ul>
<li>a 24-hour trend, with the option to drill down to see the number of occurrences for a particular timeframe in the last 24 hours, and </li>
<li>the total number of incoming occurrences per items,</li>
<li>a counter showing the time since the error last occurred. </li>
</ul>
<img src="https://rollbar.com/wp-content/uploads/2021/05/Screen_Shot_2021-03-10_at_10.29.22_AM.png" alt="Screen Shot 2021-03-10 at 10.29.22 AM">
<p>With the help of this high-level view, your Support team can get information on how frequently errors are occurring. In combination with People tracking, they will be able to triage and prioritize errors and assign them to the developers.</p>
<h3>Automated Issue Tracking</h3>
<p>Once errors are discovered and prioritized, it is essential to assign them to the right developer in a timely manner for fixing. You can save time and debug faster by integrating an issue tracking tool with your Rollbar projects. </p>
<p>Manual error assignment can be time-consuming and error-prone. <a href="https://docs.rollbar.com/docs/issue-tracking#automatic-issue-tracking">Automatically assign an error to a developer</a> to ensure resolution. Set up rules to avoid the need for manual intervention. Rules can be filtered to only trigger in specific conditions (e.g., only create issues for items in production that have level error or higher).</p>
<img src="https://rollbar.com/wp-content/uploads/2021/05/Screen_Shot_2021-03-10_at_10.32.19_AM.png" alt="Screen Shot 2021-03-10 at 10.32.19 AM">
<p>Rollbar can integrate with <a href="https://docs.rollbar.com/docs/issue-tracking">many popular issue tracking softwares</a>, making it easy to track Rollbar detected errors in your already existing workflow. </p>
<p>Read our article on <a href="https://rollbar.com/knowledge-base/jira-integration-best-practices/">Jira integration best practices</a> for some tips and tricks.</p>
<h3>Setup instructions</h3>
<p>Setup <a href="https://docs.rollbar.com/docs/person-tracking">People tracking</a> and see which people were affected by errors.
Read our Docs on <a href="https://docs.rollbar.com/docs/item-levels">Severity levels</a>.
<a href="https://docs.rollbar.com/docs/issue-tracking">Integrate an issue tracker</a> with your projects, and learn about <a href="https://docs.rollbar.com/docs/issue-tracking#automatic-issue-tracking">Automated Issue Tracking</a>.</p>