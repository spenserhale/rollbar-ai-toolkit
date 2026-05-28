<!-- source: https://docs.rollbar.com/docs/item-levels.md -->

# Item Levels

Manage the items in your queue by severity or importance

Item Severity, or item level, is a field on Rollbar items and occurrences that categorizes them by different levels of importance or severity. The five levels are, in ascending order of severity: **DEBUG**, **INFO**, **WARNING**, **ERROR**, and **CRITICAL**. These are treated as an ordinal list, which allows for the use of inequality statements when filtering (e.g. "level >= warning").

## Working with Item Levels

When searching your item list, you have the option to select different item levels using the checkboxes shown in the UI. This allows for a selection of any subset of item levels, as well as the option to view just one level or all of them at once. By assigning the appropriate levels to your items, you will improve the user experience for everyone and make finding items much easier.

New items default to the ERROR level, and all occurrences of a given item will have the same level. You can change an item's level in the web app UI and the change will persist to all occurrences, including new occurrences that appear after the change. If you have Slack Actions enabled, you can change the item's level directly through the Slack message. You can also set up custom configurations in your code base to assign different levels to new items as they are generated.

NOTE: Only the first occurrence of an item will have its item level checked from the event payload, you can manually change it after the first occurrence using the methods mentioned above, but new occurrences will have their level ignored and be treated as the same level as all other occurrences.

[block:image]{"images":[{"image":["https://files.readme.io/8916d93060e8d0125745f49aa7824484e088c229bc342af040a91856cde502c4-Screenshot_2024-08-30_at_2.31.33_PM.png",null,null],"align":"center"}]}[/block]

## RQL

The "level" column in RQL is represented by a number, with the following numbers corresponding to each given level:

* 10 = DEBUG
* 20 = INFO
* 30 = WARNING
* 40 = ERROR
* 50 = CRITICAL

This means that you can also use inequality statements such as "level >= 20" when writing filter statements for RQL queries.