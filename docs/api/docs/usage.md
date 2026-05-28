<!-- source: https://docs.rollbar.com/docs/usage.md -->

# Usage

View your account usages

# Account Usage Page

This page is designed to provide a comprehensive overview and detailed breakdown of your usage metrics, keeping you informed about your current usage, future projections, and expected costs while offering a granular view of your data based on timeframes and specific projects. This will let you know how many error occurrences you have used and how many you have remaining during your current billing cycle. As an account owner, you can view your usage in the accounts Settings → Usage.  It's broken down into three sections.

## Usage Overview

This area details your current usage-to-date and provides a forward-looking usage projection by the end of your contract. This section is meant to give you a high-level understanding of how you're utilizing our service, allowing you to anticipate future requirements and costs better.

Here's what you will find:

* **Current Usage to Date:** This displays the amount of service you have consumed from the start of your contract until now.
* **Projected Usage:** This represents an estimate of your total usage by the end of your contract term. Our algorithm uses your current usage patterns to make this prediction, helping you to plan for the future.
* **Next Cycle's Estimated Payment:** Based on your projected usage, this figure gives you a forecast of what your next contract cycle's payment is likely to be. This helps in budgeting for your future contract cycles and avoiding surprises.

## Usage Breakdown

At the top of the table, you will find a dropdown menu allowing you to change the timeframe for the usage data. The options include Daily, Weekly, Monthly, and Yearly, with Daily as the default selection. These options allow you to view and analyze your usage data in various ways, giving you better insights into your usage patterns.

The second section of the Usage Page provides a detailed breakdown of your usage. The table in this section contains the following columns:

<table>
<thead>

  <tr>
   <td>Column Name
   </td>
   <td>Description
   </td>
  </tr>
</thead>

<tbody>

  <tr>
   <td>Timeframe
   </td>
   <td>This column represents the time-period of the usage data.
   </td>
  </tr>

  <tr>
   <td>Budget
   </td>
   <td>This column shows the amount of usage allocated for the corresponding timeframe.
   </td>
  </tr>
  <tr>
   <td>Usage
   </td>
   <td>This column represents the actual number of occurrences consumed during the specified timeframe.
   </td>
  </tr>
  <tr>
   <td>Usage Status
   </td>
   <td>This indicates whether you are over, under, or on track with your usage compared to your budget for the given timeframe.   
   </td>
  </tr>
  <tr>
   <td>Total Usage
   </td>
   <td>This column shows the cumulative usage until the specified timeframe's end
   </td>
  </tr>
  <tr>
   <td>Total Usage Percentage
   </td>
   <td>This displays the total usage as a percentage of the total budgeted amount.
   </td>
  </tr>

</tbody>
</table>

## Project Usage:

In addition to the account-level data, we also provide a project-level breakdown. To access this, click on the tab at the top of the table to toggle between viewing data for the entire account or individual projects. This gives you the flexibility to drill down into usage by project, helping you understand where your resources are going and potentially identifying areas for optimization.  The length of the contract determines this table and will show the usage share of your project over that time period. You are able to select up to 5 projects to visualize in the graph.

Here's what you will find in the table under the Project tab:

<table>
<thead>

  <tr>
   <td>Column Name
   </td>
   <td>Description
   </td>
  </tr>

</thead>

<tbody>
  <tr>
   <td>Eye icon:
   </td>
   <td>Toggle the visualization. 
   </td>
  </tr>  
   <tr>
   <td>Project Name:
   </td>
   <td>Project Name in the account. 
   </td>
  </tr>
  <tr>
   <td>Occurrences Count
   </td>
   <td>The number of times a specific occurrence for each project.
   </td>
  </tr>
  <tr>
   <td>Share of Usage
   </td>
   <td>Project's percentage of total occurrence usage. The table is sorted by this column by default, enabling you to identify which projects consume the most resources quickly.
   </td>
  </tr>
  <tr>
   <td>Actions
   </td>
   <td>This column contains a button labeled 'Set a rate limit.' Clicking on this button will allow you to set a rate limit for each project, giving you greater control over the project's resource consumption.
   </td>
  </tr>

</tbody>
</table>

When you click on a project name, a slide-out panel appears with a detailed breakdown of that project's occurrences over different time-periods, including Daily (set as default), Weekly, Monthly, and Yearly. The table in this panel has the following columns:

<table>

<thead>
  <tr>
   <td>Column Name
   </td>
   <td>Description
   </td>
  </tr>

</thead>

<tbody>
  <tr>
   <td>Timeframe
   </td>
   <td>This column represents the time-period of the usage data.
   </td>
  </tr>
  <tr>
   <td>Usage
   </td>
   <td>This column represents the actual number of occurrences consumed during the specified timeframe.
   </td>
  </tr>

</tbody>
</table>

This project-centric view provides insights at a granular level, making it easier for you to manage resources efficiently across various projects and ensuring that you are getting the best value from our service.

## CSV Downloads:

We provide options for downloading detailed usage data as CSV files. These options allow you to import your data into your favorite data analysis tools, simplifying the process of conducting in-depth examinations and allowing you to generate reports on your usage.

Three CSV download options are available:

**Usage by Item:** This download option provides a comprehensive breakdown of your usage data on an item-by-item basis. It's an excellent choice when you need to understand how individual items contribute to your overall usage.

**Usage by Project/Framework/Severity:** This download gives you a detailed view of usage data categorized by each project, framework, and severity level. This option is beneficial when you want to analyze your usage patterns across different projects, understand the impact of different frameworks, or see how severity levels correlate with usage.

**Usage by Project/Environment/Framework/Severity:** The most detailed of the three options, this download provides a breakdown of your usage data by each project, environment, framework, and severity level. This comprehensive view lets you understand the interplay between different elements and their effect on your usage.

To download a CSV file, select your preferred option and timeline.  Dates before your contract will not be available for selection.  When submitted, the file will be generated asynchronously and emailed to your user email for download,  ready for you to open with your preferred data analysis tool. With these CSV download options, we've made it easier than ever to dive deep into your data and extract meaningful insights.

## Notifications

You'll find a Notifications button at the top of the Rollbar Usage Page. Clicking this button reveals a slide-out panel with two tabs: Email and Slack. These tabs allow you to set up and manage your usage notifications. We'll send you alerts when your usage hits the 80%, 90%, and 100% milestones of your occurrence allotment, ensuring you're always informed about your usage status.

### Email:

The Email tab is designed to manage who receives the usage notifications via email.

**Adding Emails:** The account owner's email is automatically included in this list. However, you can add up to 10 more emails to receive these notifications. To add an email, enter the desired email address into the input field and click "Add." Note that these email addresses do not necessarily need to be associated with users of your Rollbar account.

**Removing Emails:** To remove an email from the list, locate the desired email and click the red 'x' button next to it. This will immediately remove the email from the list, and they will no longer receive usage notifications.

### Slack

The Slack tab allows you to manage notifications sent via Slack.

Connection Check: Ensure your Rollbar account is connected to your Slack workspace before proceeding. If you still need to, you must set up this integration first. Please ensure that the Rollbar Slack bot is a member of the selected channel. Only then will you be able to receive Slack notifications for that channel.

Once your account is connected, you can choose the Slack workspace and channel where you wish to receive usage notifications.

Using both the Email and Slack tabs, you can manage your notifications effectively, ensuring the right people get the right information at the right time.

## Spike Detection:

A unique feature of Rollbar is its Spike Detection capability, designed to alert you to sudden, dramatic increases in event occurrences in your projects that may warrant your attention.

When any of your projects generate more than 1500 occurrences within 15 seconds, our system interprets this as a spike. Once this threshold is exceeded, you will receive an alert via your preferred notification channel (either email or Slack), indicating a potential spike in one of your projects that might require immediate attention.

If the spike continues and the occurrences do not drop below the set threshold, you will receive subsequent alerts every 30 minutes. These ongoing notifications serve as a reminder that the spike is persisting and might need to be addressed.

Spike Detection provides you with real-time insights into unusual activities in your projects, allowing you to respond to potential issues promptly, minimize disruptions, and ensure the smoother operation of your projects. By integrating this feature with your notification settings, you'll always be aware of significant changes in your project's activity levels and be able to act accordingly.

Spike detection is active in all paid accounts, and all emails and slack channels added to notifications will receive spike detection alerts.