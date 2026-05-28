<!-- source: https://docs.rollbar.com/docs/could-not-compare-commits-between-shas.md -->

# Could not compare commits between SHAs

# Occasionally when using Rollbar's Deploy Tracking feature, you may see a message such as the following:

<p>Could not compare commits between SHAs abcdef.... and 123456.... This usually means that one of the SHAs is either invalid or has not been pushed to Github. </p>
<p>A common cause of this problem is that your Github OAuth token has expired.  Here are steps to see if this is the source of the problem:</p>
<p><strong>In Rollbar:</strong></p>
<ul>
<li>In the Rollbar project where you encountered the issue, go to Settings → Source Control .   Copy the Repository , Default Branch , and Project Root  settings for later use.</li>
<li>Click Disconnect where it says Connected to Github as {github-username} .</li>
</ul>
<p><strong>In GitHub:</strong></p>
<ul>
<li>Go to Settings → Applications → Authorized OAuth Apps, find Rollbar, click Revoke, and then confirm that you want to revoke access.</li>
</ul>
<p><strong>In Rollbar:</strong></p>
<ul>
<li>In the Rollbar project where you encountered the issue, go to Settings → Source Control, select Github as the source control provider, then click Connect to Github, and then complete the authorization process.</li>
<li>Reconfigure Repository , Default Branch , and Project Root .</li>
<li>Check your deploys page.  If the SHAs specified in the deploys are valid, then you should no longer see the message.</li>
</ul>