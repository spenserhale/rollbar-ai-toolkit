<!-- source: https://docs.rollbar.com/docs/improve-your-error-grouping-with-the-help-of-rollbar.md -->

# Improve your Error Grouping with the help of Rollbar

<h3>Overview</h3>
<p>Congratulations on setting up your Rollbar projects! You took a step towards more visibility and an easier flow when it comes to debugging. Now, you might as well learn how the <strong>incoming errors are examined and grouped together by Rollbar</strong>. Let’s see how it happens and what else we have to offer!</p>
<p>With the help of Rollbar’s default grouping algorithm, you will:</p>
<ul>
<li>Keep your items list transparent and organized,</li>
<li>Reduce the noise in your notifications,</li>
<li>Understand and respond to your errors better.</li>
</ul>
<h3>Learn how Rollbar groups your items by default
</h3>
<p>Error grouping means that when you release a code to production, and it crashes hundreds of times, <strong>our system groups all of those crashes together in one error item and sends you one notification</strong> instead of notifying you every time, resulting in 100 notifications in your inbox. The 1 item in your items list will include all the details of your error occurrences. Learn more about <a href="https://docs.rollbar.com/docs/grouping-occurrences">Grouping</a>.</p>
<p>The Rollbar grouping algorithm is smart and is constantly improving, so we can serve our customers. Rollbar tries to <strong>group occurrences together with the same root cause</strong> in one item so that you:</p>
<ul>
<li>Have visibility over all the occurrences of one error item, which makes you</li>
<li>Understand your errors a lot easier, and</li>
<li>Speed up the bug fixing process.</li>
</ul>

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/1aa3a9bc37f795af271175436fc40df52c8db52bc5918ed621c7f6af848b8d1e-Screenshot_2024-09-16_at_2.16.46_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

<p>The occurrence fingerprints are resilient to deploys and code changes, so you can <a href="http://help.rollbar.com/en/articles/4030845-spot-and-prioritise-production-errors-with-versions">track the history of your occurrences through multiple deploys and code versions</a>.</p>
<p><strong>Take your Grouping to the next level</strong></p>
<p>It is also important to mention that our default grouping algorithm is designed to be adequate for most projects. However, you might want a more <strong>customized experience</strong>. Well, this is when you can make good use of merging or custom fingerprinting.</p>
<p>Rollbar errs on the <strong>undergrouping</strong>. This means we would rather create additional unique items for occurrences that cannot be clearly grouped into existing items than risk a bug going unnoticed by the developers in the noise.</p>

<h3>Merging</h3>
<p>If you think our algorithm skipped grouping errors that you think belong together, you can:</p>
<ul>
<a href="https://docs.rollbar.com/docs/merge-items">Merge them manually</a> and group all past and future occurrences together,</li>

<p>You can manually <a href="https://docs.rollbar.com/docs/merge-items">merge items</a> together, thus combining items into one new group for easier management. In this case, all past and future occurrences of those items will be combined automatically, and you will have one unified view on the Item details page of all the occurrences of the error.</p>
<p>Manually merging your items comes in handy when the grouping algorithm separates items that you think should rather go together. You can then group them instantly with the merging option. It is also useful when you want to group items that do not require their custom fingerprint.</p>
<p>If you want to remove items from a group because they were mistakenly grouped or you decided to organize the occurrences separately, you have the chance to un-merge them. From then on, they will be handled as separate items.</p>

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d9758dfff62970b4d8f9879e4d748e9c4bc31702305825f452b4b67bad88c6a7-Screenshot_2024-09-16_at_2.20.56_PM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]

</ul>

<h3>Custom fingerprints</h3>

<a href="https://docs.rollbar.com/docs/custom-grouping">Create a custom fingerprinting rule</a>, so it applies to all future occurrences that comply with the rule.

<p>When you manually merge items, Rollbar will analyze the items. If it can spot a discernible common pattern, then the system will automatically offer you the option to create a new easily <a href="https://docs.rollbar.com/docs/custom-grouping">custom fingerprint</a> on the spot. This custom fingerprint will automatically apply to all future occurrences and combine them into the new item group.</p>
<p>Custom fingerprints allows you to set up precise rules combining certain occurrences and generating new fingerprints. This is especially useful if you want to handle certain errors in the same way, together, regardless of their stack trace, and you want to avoid having to merge multiple items manually. You can also easily keep an eye on the custom fingerprints that are created for your projects in the Custom Fingerprinting Version History.</p>