<!-- source: https://docs.rollbar.com/docs/get-more-insights-and-control-over-your-errors.md -->

# Get more insights and control over your errors

<h3>Overview</h3>
<p>In this article, we will walk you through all the perks of integrating GitHub source control with your Rollbar projects. Once you have source control integration set up and a Git repository is connected to your Rollbar projects, you will have more visibility on:</p>
<ul>
<li>where the error was most recently activated,</li>
<li>the context of the code line where the bug occurred, and </li>
<li>who the last person was to work on the affected code section, thus being able to assign it to the right person to work on it and resolve it faster. </li>
</ul>
<p>Additionally, you won’t even have to leave your Rollbar project. Sounds tempting, right? Let's get to it!</p>
<p>Don't have time to read? Watch our short video on GitHub source control integration.</p>
<iframe width="720" height="405" src="https://www.youtube.com/embed/rLlV6hvsOd0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h3>Gain more visibility all in one place</h3>
<p>When a Rollbar project is connected to a Git repo, <strong>stack traces will include links to each file in the code version</strong> where the error was most recently activated.
Another advantage is that the list of commits included in each deploy will include URLs so you can view the difference for each commit as well as the entire deployed code version, thus spotting where the error occurred and fixing it with ease.</p>
<p>You will also have the chance to view un-deployed commits. Any commit that has been merged to your master branch but not yet deployed will be highlighted at the top of the Deploys screen. This will provide more visibility for <strong>developers who have missed the commits while deploying to act quickly upon them</strong>.
The commits in each deploy and the un-deployed commits are visible under the Deploys tab after you select the project and the environment you want to check.</p>
<img src="https://rollbar.wpengine.com/wp-content/uploads/2021/05/deploys.png" alt="Deploys">
<h3>Get more context around your errors</h3>
<p>Once you have source control integration set-up with GitHub, we can pull the code context directly from GitHub into the Item details page in the Rollbar UI. You will be able to see the offending piece of code, and additionally, you will have <strong>visibility of what happens right before and after that line of code</strong>.</p>
<p>With this integration, you will have context around your errors in one convenient location. There is no need to switch between GitHub and Rollbar trying to match up the lines of codes!</p>
<h3>Git Blame, but no blame</h3>
<p>Let’s say you got a new notification coming in, about an error that has just occurred. You might want to get more information on who was the last one to work on that piece of code.
With your project connected to the Git repo, we can provide this information conveniently in the Rollbar UI with the help. You will see the GitHub User Avatar of <strong>the last developer to edit the line of code that triggered the error</strong>. The User Avatar will provide additional information on the pull request and the date and time of the commit.</p>
<img src="//downloads.ctfassets.net/cj4mgtttlyx7/hWZIILITqVz6S5s1RstjP/f37cbaed95eb4a41dfa1f84d14c81ed8/name-error.gif" alt="Name Error">
<p>With Git Blame, you will have the information on when the code was written and by whom, thus you can quickly assign the developer who was the last to work on it and probably has knowledge around those specific lines of code which can help to fix the error quickly.</p>
<h3>Set-up source control for your projects</h3></p>
<p>Take your Rollbar experience to the next level and <strong>integrate the GitHub source control</strong> with each of your projects! Check out <a href="https://docs.rollbar.com/docs/github">our GitHub Docs</a> for easy set-up. </p>
<h3>Want to learn more? </h3>
<p>Read our article on the benefits of keeping an eye on your deploys with the help of <a href="https://rollbar.com/knowledge-base/keep-an-eye-on-your-deploys-with-the-help-of-deploy-tracking/">Deploy tracking</a>.</p>