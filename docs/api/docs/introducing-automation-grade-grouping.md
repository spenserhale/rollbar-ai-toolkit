<!-- source: https://docs.rollbar.com/docs/introducing-automation-grade-grouping.md -->

# Introducing Automation-Grade Grouping

### Overview

Proactively discover, predict, and remediate errors with **Rollbar’s real-time, AI-assisted workflows**! The foundation for these workflows is **Automation-Grade Grouping** which dramatically **improves the performance and accuracy of error categorization**.

Automation-Grade Grouping is the next generation of our grouping engine that is **trained by machine learning on millions of crashes**. Machine learning enables us to continuously analyze frequently occurring error types to deduplicate items accurately.

**Benefits include:**

* Reduced noise in your items list and alerts
* Easier triaging by removing duplicates from the error list
* Faster response to errors through less manual effort and more automation

### Machine learning trained grouping algorithm

Unlike our competitors, who use hard-coded grouping algorithms, we use **machine learning** to determine patterns on a on-going basis and identify frequently occurring error types. This helps increase the performance of Automation-Grade Grouping over hard-coded algorithms and **significantly reduces the number of both over-grouped and under-grouped errors**, getting rid of missed bugs and noise. Hardcoded rules can’t keep up with constantly changing stack traces, so we regularly run our AI model against new errors from our customers to recognize different error types and group them effectively.

### Frequent Grouping Update releases

On the path to Automation-Grade Grouping, we frequently release new grouping updates that further **improve grouping accuracy *and allow users to* observe and respond to errors quickly**.

Automation-Grade Grouping is currently available for **Ruby**, **JavaScript**, **Java**, **Python**, **C#**, **Go**, **PHP**, **Scala** and **Elixir**. We’ll be releasing it for additional languages soon!

Our latest Ruby Grouping Update improves the grouping accuracy of Ruby issues on 680 frequently occurring error types which cause 54% of Ruby crashes! With this, users experience less noise in error monitoring, triage easier by getting a more accurate error list, and respond faster to errors through less manual effort and more automation.

With the JavaScript Grouping Update, we improved grouping accuracy on 335 frequently occurring error types that cause 38% of Javascript crashes. We trained our model on 5 million Javascript crashes to analyze frequently occurring error types and learned to distinguish different ones accurately.

### Seamless auto-upgrade

Having to manually upgrade all of your projects one-by-one every time we announce a new grouping update can be time-consuming. However, we have an automated solution for this as well. **Seamless auto-upgrade** ensures your **projects use the latest and most accurate grouping whenever we release a new one**. This way, you can focus on the important things. Auto-upgrade applies to all projects.

### Learn more

Learn more about Automation-Grade Grouping [here](https://docs.rollbar.com/docs/grouping-algorithm#exception-fingerprinting).