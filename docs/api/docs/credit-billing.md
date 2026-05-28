<!-- source: https://docs.rollbar.com/docs/credit-billing.md -->

# Credit Billing

> ## 📘 Note
>
> The following applies to accounts created via Rollbar.com on Essentials or Advanced plans. At the moment Credit Billing is available for these plans only.

## Overview

Rollbar Credits are a monthly add-on subscription balance used to pay for AI-powered features such as Root Cause Analysis (RCA) and Resolve. Credits are a separate product from your core Rollbar plan (occurrences, replays). The system enables billing for AI features without micro-transactions, while preserving predictable monthly invoicing.

* Credits are consumed when you run credit-based features.
* Your credit balance resets at the start of each billing cycle.
* Credit pricing is the same across all eligible plan tiers.

***

## Availability

| Plan         | Credit Add-On Available? | Included Credits             |
| ------------ | ------------------------ | ---------------------------- |
| Essentials   | ✅ Yes (self-serve)       | 4,000/month                  |
| Advanced     | ✅ Yes (self-serve)       | 8,000/month                  |
| Free (Basic) | ❌ No — upsell shown      | 0                            |
| Free Trial   | Trial allocation only    | 15,000 (trial duration only) |
| Enterprise   | Contact sales            | TBD                          |

Free Trial accounts receive a trial credit allocation for the duration of the trial and cannot add more credit during the trial.

***

## How to Add a Credit Subscription

*Available for Essentials and Advanced accounts only.*

1. Go to **Account Settings** in Rollbar.
2. Open **Your Plan & Usage**.
3. Find the **Credits** section.
4. Select your monthly Credit amount.
5. Confirm the change.

**What happens next:**

* Your new Credit balance is available immediately.
* If this is an upgrade (adding or increasing Credit), you will see an immediate charge pro-rated for the remainder of the billing period.
* Your updated Credit level will appear on the Your Plan & Usage screen.

***

## Viewing Your Credit Balance and Usage

* Your current Credit balance is displayed in the Credit widget, visible in the header and on AI feature pages.
* The widget refreshes after each run completes.
* Detailed usage history is available in the Usage Breakdown tab, broken down by task type and over time.

***

## How Credit Charges Work

### Billing Cycle

Credits align with your existing account billing cycle. The balance is granted at the start of each cycle and expires at the end of that cycle — unused credits do not roll over.

### Upgrade Billing (Adding or Increasing Credit)

Adding or increasing Credit is treated as a metered add-on upgrade: you are charged immediately for a pro-rated amount covering the remainder of the billing period. Your monthly billing date will remain the same.

### Downgrade Billing (Removing or Reducing Credit)

Decreases take effect at the start of your next billing cycle. Your current Credit level remains in place until then.

### Invoices

Credits appear as a distinct line item on invoices — both on the immediate upgrade charge and on your monthly subscription invoice.

### Annual Plans

If you are on an annual plan, Credits are billed separately and do not receive an annual discount.

***

## What Happens When You Run Out of Credit

* Rollbar will complete any in-flight run even if your balance reaches zero during the run. Your balance may go negative as a result.
* If you have on-demand enabled, usage will move to on-demand overages instead of going negative.
* If you have a Spend Budget set, Rollbar will still complete the current run even if the budget is reached during it, then send you a notification.

> ## 🚧 Minimum Balance to Start a Run
>
> There is a minimum credit threshold required to initiate a run. If your balance is below this threshold, the run will not start.

***

## Spend Budgets

You can set a monthly spend budget to cap your Credit usage, similar to how overage budgets work for occurrences and replays. Once the budget is reached, no more runs will be processed that month.

To configure: **Account Settings → Billing Info → Credit Budget**

***

## Downgrading or Cancelling Credit

You can reduce or remove your Credit subscription at any time from **Account Settings → Your Plan & Usage**. The change takes effect at the start of your next billing cycle.

***

## FAQ

**Why was I charged immediately when I added Credit?**

Adding or increasing Credit is treated as an upgrade. Like all upgrades in Rollbar, it takes effect immediately, and you are billed pro-rated for the remainder of the current period.

**Why does my Credit balance reset each month?**

Credits are a monthly subscription add-on, not a permanent balance. They expire at the end of each billing cycle to keep costs predictable.

**Can I prevent unexpected usage?**

Yes — set a Spend Budget in Account Settings to cap monthly credit spend. You can also monitor your balance from the Credit widget.

**What happens if I run out of credits mid-task?**

Rollbar will complete the in-flight run. Your balance may go negative. If you have on-demand enabled, the overage is billed as on-demand.

**Why can't I add Credit on the Free plan?**

Credit purchasing is only available for Essentials and Advanced plans at the moment.

**Does the annual plan discount apply to Credits?**

No. Credits are billed monthly and are excluded from the annual plan discount.