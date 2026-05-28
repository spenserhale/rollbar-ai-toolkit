<!-- source: https://docs.rollbar.com/docs/manual-merging-vs-custom-fingerprints.md -->

# Manual merging vs. Custom fingerprints

<h3>Overview</h3>
<p>Rollbar has a pretty sufficient default grouping algorithm, that <strong>automatically analyzes the stack traces of the incoming occurrences and groups them if there is a common pattern</strong>. This helps to reduce the noise of incoming occurrences by a great deal! But what happens, if you want to organize your Items list differently?</p>
<p>In this article, we will walk you through all the benefits of:</p>
<ul>
<li>Merging items manually, instantly, when you think 2 or more items should go together,</li>
<li>Create custom fingerprints for future occurrences and tailor grouping to your own needs.</li>
</ul>
<h3>Merge your items instantly</h3>
<p>You can manually <a href="https://docs.rollbar.com/docs/merge-items">merge items</a> together, thus combining items into one new group for easier management. In this case, all past and future occurrences of those items will be combined automatically, and you will have one unified view on the Item details page of all the occurrences of the error.</p>
<p>Manually merging your items comes handy, when the grouping algorithm separates items that you think should rather go together. You can then group them instantly with the merging option. It is also useful when you want to group items together, that do not require their own custom fingerprint.</p>
<p>If you want to remove items from a group, because they were mistakenly grouped together or you decided to organize the occurrences separately, you have the chance to un-merge them and from then on they will be handled as separate items.</p>
<img src="//downloads.ctfassets.net/cj4mgtttlyx7/3aV4l8iURwRtz0WGBdP5dJ/7823c3fb4f7e93e06430e794126585d9/Merging_manually_GIF.gif" alt="Manual merging GIF">
<h3>Create custom fingerprints</h3>
<p>When you manually merge items together, Rollbar will analyze the items and if it can spot a detectable common pattern, then the system will automatically offer you the option to easily create a new <a href="https://docs.rollbar.com/docs/custom-grouping">custom fingerprint</a> on the spot. This custom fingerprint will then automatically apply to all future occurrences and combine them into the new item group.</p>
<p>Custom fingerprints allows you to set up precise rules combining certain occurrences and generating new fingerprints. This is especially useful if you want to handle certain errors in the same way, together, regardless of their stack trace, and you want to avoid having to manually merge multiple items together. You can also easily keep an eye on the custom fingerprints that are created for your projects in the Custom Fingerprinting Version History.</p>
<h3>Let’s get started!</h3>
<p>Want to have a deeper-dive overview of how grouping works and how to set-up custom fingerprints? Check out our Docs on <a href="https://docs.rollbar.com/docs/grouping-occurrences">Grouping Occurrences into Items</a>, and take the next step to make your Rollbar projects more effective and transparent!</p>