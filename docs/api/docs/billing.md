<!-- source: https://docs.rollbar.com/docs/billing.md -->

# Billing

> 📘 Partner Billing
>
> The following applies to accounts created via Rollbar.com.  See the section <a href="#section-partner-billing">Partner Billing</a> for details on how billing works if you created an account elsewhere.

## Billing Cycles

For both monthly and annual plans, your account will have a billing cycle that starts on the day of the month when you originally signed up for the plan.  The billing cycle is used to calculate your monthly usage.   If you sign up after the 28th then your billing cycle date will vary depending on the length of the month. Your monthly occurrence limit will reset on this date at midnight Pacific time - if you have a limit in place, this is when Rollbar will resume receiving occurrences.

## On-Demand Events

The following applies to monthly subscriptions for accounts created via Rollbar.com.

If you exceed your monthly event limit, you can now pay *per event* over the limit.  For monthly plans, if your on-demand charge is sufficiently high that it would be more economical to upgrade to the next plan, then we'll send you an email to indicate that it would be cheaper to upgrade to the next occurrence level.

Online pricing: <https://rollbar.com/pricing>

Once your account has been upgraded, it will remain at the new plan level for future billing cycles.  You can change your plan at any time by going to **Account Settings → Choose Plan**.  If you choose a lower plan level, the change will take effect at the start of your next monthly billing cycle.

You can upgrade your subscription manually at any time by going to **Account Settings → Choose Plan**.

### Usage & Upgrade Alerts

[View our Usage Documentation](https://docs.rollbar.com/docs/usage)

### Disabling On-Demand

If you are on a strict budget and don't mind missing some errors, then you can choose to disable on-demand events at **Account Settings → Billing Info**.  If on-demand is disabled and you reach your plan limit, we will not process new errors until your next billing cycle begins.

### On-Demand Billing

On-demand event charges are calculated at the end of your billing cycle, and are included in the next month's subscription charge.

Here's an example of how this works:

```
Your Essential - 100,000 Events ($49/mo) plan is billed each month on the 10th.

During the period April 10 - May 9, you use 109,532 events (9,532 over your monthly limit).

On May 10th, your monthly charge will be $58.53
* $9.53 for on-demand events during April 10 - May 9.
* $49.00 for your subscription May 10 - June 9.
```

### Upgrade Billing

If your account is upgraded, then you will be charged immediately for the difference between your old plan and your new one.  Your monthly billing date will remain the same.

Here's an example of how this works:

```
Your Essential - 100,000 Events ($49/mo) plan is billed each month on the 10th.

On April 20, you choose to upgrade to the Essential - 500,000 Events ($149/mo) plan, or your on-demand usage exceeds 100,000 events.

You are immediately charged $100 for this upgrade ($149 - $49 = $100).

Your next charge will be on May 10th for $149.
```

## Annual Plans

Rollbar annual plans offer a way to pre-pay for usage at a rate equivalent to receiving two months free in a year.

### On-Demand Events & Annual Plans

#### Paying by credit card

If you are on an annual plan using your credit card for payment and exceed your monthly event limit, you will not be automatically upgraded to the next subscription plan and the cost of the additional events will be billed separately.

Your monthly subscription fee will be deducted from the remaining balance of your prepayment, so your annual plan will last exactly 12 months. When the funds in an annual plan are fully used, your account will be charged the amount of the annual plan again, and a new annual cycle will begin.

|                         | Annual prepayment | Monthly discounted subscription fee (deducted from the remaining balance of the prepayment) | Remaining Balance | On-demand events (billed separately) | Monthly cost |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------ | ------------ |
|                         | $9,990            |                                                                                             |                   |                                      |              |
| M1                      |                   | $832.50                                                                                     | $9,158            | $500                                 | $1,333       |
| M2                      |                   | $832.50                                                                                     | $8,325            |                                      | $833         |
| M3                      |                   | $832.50                                                                                     | $7,493            | $300                                 | $1,133       |
| M4                      |                   | $832.50                                                                                     | $6,660            |                                      | $833         |
| M5                      |                   | $832.50                                                                                     | $5,828            | $250                                 | $1,083       |
| M6                      |                   | $832.50                                                                                     | $4,995            |                                      | $833         |
| M7                      |                   | $832.50                                                                                     | $4,163            |                                      | $833         |
| M8                      |                   | $832.50                                                                                     | $3,330            | $100                                 | $933         |
| M9                      |                   | $832.50                                                                                     | $2,498            |                                      | $833         |
| M10                     |                   | $832.50                                                                                     | $1,665            |                                      | $833         |
| M11                     |                   | $832.50                                                                                     | $833              | $200                                 | $1,033       |
| M12                     |                   | $832.50                                                                                     | $0                |                                      | $833         |
| New annual cycle begins |                   |                                                                                             |                   |                                      |              |

<br />

#### ACH (bank account withdrawl)

For customers in the United States, Rollbar offers to pay via ACH (Automated Clearing House), a secure and efficient direct bank-to-bank payment method. Bank transfers require 3-5 business days.  If your account returns a transaction error, the account will be active, and the transaction will be retried until successful.  If payment is not successful after 30 days, your account will be suspended.

<br />

#### Invoice (available for Enterprise customers only)

We support sending an invoice via a manual process from via QuickBooks. QuickBooks allows payment via Wire, ACH or Credit Card.  Contact our support team to see if your account is approved.

## Overage Budgets

Users on both monthly or annual plans can choose to set a limit for how many occurrences, replays or credits will be processed above the plan limit. Once the budget is reached, no more occurrences, replays or credits will be processed that month. This allows customers to be able to process some occurrences and replays, and credit usage, in case the monthly allowance has been used, but have peace of mind that there is a limit to the financial exposure they are potentially exposed to.

## Credits

Essentials and Advanced account owners can purchase a monthly Credit subscription as an add-on to their core plan. Credits are used to pay for features such as Root Cause Analysis and upcoming credit-based features. The credit balance resets each billing cycle and does not carry over.

* **Upgrade:** Adding or increasing Credit takes effect immediately and is charged pro-rated for the remainder of the billing period.
* **Downgrade:** Reductions take effect at the start of the next billing cycle.
* **Annual plans:** Credits are billed separately and are not included in the annual discount.
* **Invoices:** Credits appear as a distinct line item.

See [Credit Billing](https://docs.rollbar.com/docs/credit-billing) for full details, including how to add Credit, usage tracking, and FAQ.

## Partner Billing

### Heroku

If you created your account through Heroku, then your Rollbar subscription is included in your monthly Heroku bill. If you reach your monthly event limit, then error data will not be processed until you migrate your plan ([instructions here](https://devcenter.heroku.com/articles/rollbar#migrating-between-plans)) or a new monthly billing cycle begins.

### GitHub Marketplace

If you created your account through GitHub Marketplace, then your Rollbar subscription is included in your monthly GitHub bill. If you reach your monthly event limit, then error data will not be processed until you [edit your plan in GitHub Marketplace](https://github.com/marketplace/rollbar) or a new monthly billing cycle begins.

### Migrating from Partner Billing to Rollbar Billing

We offer the ability to transfer your billing information from one of our partners, such as Heroku or Github Marketplace, to Rollbar's billing system. This offers some additional benefits over our partner plans, such as:

* The ability to select additional plan options that aren't available on those marketplaces
* The option to enable overages to ensure you're not losing any data
* Consolidating your different Rollbar projects into a single dashboard
* Easier Rollbar user & team administration

To transfer your Heroku or GitHub marketplace plans to a Rollbar plan follow the steps below:

* Create a new trial account on Rollbar. This can be done by clicking on your icon in Rollbar and selecting "Create new account"

![](https://files.readme.io/3bc75fa-image.png)

* Transfer your existing Rollbar projects to your new account as noted [here](https://rollbar.com/knowledge-base/transfer-projects-between-accounts/).
* Purchase a Rollbar subscription plan on your new account.
* Optionally, delete your old Rollbar account by clicking in your "Manage account settings".

## Cancelling a Subscription

Within Rollbar, you may cancel your subscription at any time by going to **Account Settings → Choose Plan** and clicking the **Cancel subscription** button near the bottom. Similarly to plan changes, this will take effect at the end of your current billing period, and your account will not be deleted.

For Heroku, GitHub Marketplace, and similar plans, you may also migrate to the Rollbar Free plan using the instructions above.

## Nonprofit Discount

Rollbar offers a discount of 50% for any self-serve paid plan to nonprofit / non-profit 501(c)(3) organizations and educational institutions. Please contact <support@rollbar.com> to request the discount for your account.