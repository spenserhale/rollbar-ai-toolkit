<!-- source: https://docs.rollbar.com/docs/error-grouping-best-practices.md -->

# Error Grouping Best Practices

#### Why error grouping is important

Without grouping, error monitoring and error logs churn out a massive list of unsorted errors that must each be separately triaged, identified, and dealt with. Since applications are being used by thousands or even millions of users simultaneously, development teams spend vast amounts of time in triaging and fixing errors. Grouping errors is increasingly important.

Below you can find a checklist that will assist you in reviewing your project settings. We also have some handy tips & tricks for you to make sure your grouping works properly, so you can concentrate on the important thing: fixing errors!

#### Error grouping in Rollbar

There are two types of item grouping in Rollbar: automation-grade grouping (default grouping) and custom fingerprinting.

[Automation-grade grouping](https://docs.rollbar.com/docs/grouping-algorithm#exception-fingerprinting/ "Automation-grade grouping") is performed by Rollbar automatically, it neither requires nor accepts any input from the user and is typically used for the majority of item grouping. Automation-grade grouping combines Rollbar’s extensive error library with machine learning components to formulate optimal grouping solutions. This provides continuous improvement to the grouping engine to help improve your experience.

[Custom fingerprinting](https://docs.rollbar.com/docs/custom-grouping "Custom fingerprinting") is more of a specialized feature that allows you to override the default grouping engine by declaring your own rules. Custom fingerprinting rules will always be evaluated first, and if no match is found then the automation-grade grouping engine will group the given occurrence. This feature allows users to create grouping rules for custom data and edge cases that the grouping engine may not properly detect.

#### Grouping Issues

Since new code is continuously being written and deployed, item grouping is an imperfect science. There are cases where the grouping engine misattributes events to the wrong item, and causes confusion for users. These are typically divided into two distinct types of grouping problems: undergrouping and overgrouping.

Undergrouping is when multiple events with the same root cause are grouped into different items. There is one code problem, but there are multiple items in Rollbar that represent this code problem. This is more of a cluttering issue, where Rollbar’s usability is degraded due to the distraction caused by these redundant items. Smaller cases of undergrouping are easily fixable in Rollbar using the merge feature, which allows you to coalesce these duplicates into a single grouped item. Merging can be edited and rolled back if necessary. Custom fingerprinting rules can also be used to fix undergrouping, and custom fingerprinting rules may be suggested as a result of a merge.

Overgrouping is when multiple code problems with their own distinct root causes are mistakenly grouped into a single item. This is a much more serious problem than undergrouping, because this can result in code issues going unnoticed and persisting in your application. Unfortunately there is no easy fix for a user, since items cannot be split apart through the web app or the API. If you encounter undergrouping, you should first file a Support ticket with details to bring this problem to our attention. This will help us to understand and fix the problem, while further improving the Rollbar grouping engine. As a second step, you can use custom fingerprinting rules to define grouping logic that will help split the overgrouped items.

Checklist:

* **Make sure you are using the latest SDK version** - part of the reason we update the SDK is to make sure the SDK is collecting the right information for grouping. New versions will collect the proper information for the latest version of grouping.
* **Make sure items are showing stack traces** - Rollbar must receive an Exception type object with a trace in order to apply the advanced grouping features. Simple text/log events are not evaluated with the same level of grouping.
* **Check custom fingerprinting rules for problematic grouping** - sometimes custom fingerprinting rules can be too generic and match on events that should be grouped separately. In these cases, the custom fingerprinting rules need to be made more specific by adding more conditional logic.

Tips and tricks to make sure your error grouping works properly:

1. [**Manually merging items**](https://youtu.be/e0P4XO-XLUk "Manually merging items") - Item merging allows you to combine multiple items into one 'group' for easier management and more accurate metrics. All past and future occurrences of any merged items will automatically be combined.
2. [**Create your own grouping rules**](https://www.youtube.com/watch?v=QgEAj4f4B8M\&feature=youtu.be "Create your own grouping rules") - You can override the default grouping engine by declaring your own rules. Custom fingerprinting rules will always be evaluated first, and if no match is found then the automation-grade grouping engine will group the given occurrence.
3. [**Leverage custom data**](https://docs.rollbar.com/docs/custom-grouping "Leverage custom data") - Custom fingerprinting allows users to create grouping rules for custom data and edge cases that the grouping engine may not properly detect.
4. **Similar items to merge** - Review the “Similar Items” menu for an Item to see possible merge candidates.
5. [**RQL**](https://docs.rollbar.com/docs/rql "RQL") - Use RQL to query for items with similar titles or properties. You can also use it to query custom data fields, which can help determine if you should use custom fingerprinting rules for better grouping.

#### Learn more

[Watch our on-demand webinar on Automation Grade Grouping](https://rollbar.com/rollbar-academy/?wistiaplay=wistia-tvmvad1jl8-1 "Watch our on-demand webinar on Automation Grade Grouping")