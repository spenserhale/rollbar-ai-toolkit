<!-- source: https://docs.rollbar.com/docs/rollbar-terminology.md -->

# Rollbar Terminology

Key terms & concepts used throughout Rollbar

Rollbar has terms for talking about the errors, exceptions, crashes, and messages you send us.

## Item

An **Item** is the fundamental unit of work in Rollbar. Each **Item** represents a group of **Occurrences** that represent the same underlying condition. That underlying condition could be a code bug, an infrastructure issue, or any other kind of problem or metric you'd like to use Rollbar for.

Most people use Rollbar to collect exceptions/errors which represent code bugs and/or infra issues. Out of the box, Rollbar understands stack traces in many languages and can accurately group errors according to their root cause. Rollbar's [grouping engine](https://docs.rollbar.com/docs/grouping-algorithm) has knowledge about languages, frameworks, and common open source libraries. You can merge **Items** together if Rollbar splits things that should have been together, and you can augment the grouping engine with your own [custom rules](/docs/custom-grouping/).

You don't add Items directly into Rollbar. Rather, you send **Occurrences**, and then Rollbar groups them into **Items**. Here's how it works:

For each **Occurrence**, Rollbar determines the identity of the underlying condition that it represents, according to the Rollbar grouping engine and any custom rules you have defined. The identity is represented as a hash. If the hash has been seen before in the same project and environment, that means it's a repeat **Occurrence** of an existing Item, so it is grouped by Rollbar into that Item. If the hash has not been seen before, then a new Item will be created to hold that **Occurrence** and any future matching **Occurrences**.

In the Rollbar UI, you can see the list of all **Items** on the Items screen. Individual **Items** get their own URL, like `https://rollbar.com/<account_name>/<project_name>/items/<item_counter>/`.

## Occurrence

**Occurrences** are the raw events that you send to Rollbar. Under the hood, the meat of an **Occurrence** is a JSON object that conforms to the [Rollbar Occurrence schema](https://docs.rollbar.com/reference/create-item#data-format). Usually, **Occurrences** are sent to the Rollbar API by a Rollbar SDK that you've added to your code. You can also hit the API directly.

Types of **Occurrences**:

* A single time an error/exception occurred in your code ("trace" or "trace\_chain")
* A single time a native app crashed ("crash\_report")
* A single time an important event was logged ("message")

**Occurrences** are grouped into Items (see **Item** above), and most of the Rollbar UI is organized around Items. The most common way to get to an **Occurrence** is by viewing an Item, then clicking into the **Occurrences** tab, and then clicking the timestamp of an individual **Occurrence**. You can also view lists of **Occurrences** using RQL, and using the Rollbar REST API.

If you are used to using logging tools, it can be a bit difficult at first to find your data in Rollbar because the Rollbar UI is designed around Items and you might be used to seeing the raw "occurrences" (log events). But once you get used to it, it will be easier to reason about your code, application, and systems. You can now think about Items, which are groups hundreds, thousands, or millions of **Occurrences**, rather than thinking about one **Occurrence** at a time.

If you are on a page with a URL like  `https://rollbar.com/<account_name>/<project_name>/items/<item_number>/occurrences/<occurrence_number>/`, then you are looking at an **Occurrence**.

## Item Statuses and State Transitions (Active, Resolved, Reactivated, Reopened, and Muted)

In addition to being groups of **Occurrences**, **Items** also have a workflow. The current state in the workflow is called the Item Status.

The Item Statuses are:

* **Active** (the Item is actively occurring and is relevant)
* **Resolved** (the Item is fixed or has stopped occurring)
* **Muted** (the Item is not relevant)
* **Merged** (the item has been merged into another Item)

The state transitions are:

* New (nonexistent to Active)
* Resolved (Active to Resolved)
* Reactivated (Resolved to Active due to a new Occurrence)
* Reopened (Resolved to Active due to manual change)
* Muted (Active to Muted)
* Unmuted (Muted to Active)
* Merged (Active to Merged)
* Unmerged (Merged to Active)

When you fix an **Item**, we recommend that you mark it as Resolved. There are several ways to Resolve an item:

* In the Rollbar UI, press **Resolve**, **Comment and Resolve**, or **Set Status -> Resolved**
* Use the [Rollbar REST API](https://docs.rollbar.com/reference/update-an-item)
* [Resolved via commit message](https://rollbar.com/docs/resolve-via-commits/) and then notify Rollbar about a deploy of that commit
* Have Autoresolve on Deploy enabled, and then notify Rollbar about a deploy (see Settings -> Deploys)
* Have Autoresolve Old Items enabled, and let the Item naturally age out after not occurring for the set time period (see Settings -> Cleanup)

Sometimes, you might mark an **Item** as Resolved, but then Rollbar will receive Occurrence of the **Item**. (Those pesky bugs!) When this happens, the **Item** gets Reactivated. Its status will become Active and any notification triggers for "Item Reactivated" will be evaluated. This is useful for getting notified about regressions in your code, or for trial-and-error if you're narrowing down a root cause. Mark the **Item** as Resolved and let Rollbar Reactivate it and tell you if it happens again.

Sometimes, you might decide that you want to manually change an **Item**'s status from Resolved to Active. Rollbar has a separate state change for that, called "Reopened". This happens when you change an **Item**'s status from Resolved to Active using the UI or the REST API.

## Counter

Each **Item** gets a unique, sequential numeric identifier within its project, called its **Counter**. The **Counter** is useful for distinguishing between **Items** that have similar titles.

In addition to appearing in the Rollbar UI and in the Item URL, **Items** can be accessed by **Counter** [via the API](https://docs.rollbar.com/reference/get-an-item-by-project-counter).