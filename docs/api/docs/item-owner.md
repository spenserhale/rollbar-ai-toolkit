<!-- source: https://docs.rollbar.com/docs/item-owner.md -->

# Item Owner

# Overview

Items can have a specific Rollbar user designated as the Owner of an item. This can be used to indicate which user is responsible for a specific item; also items assigned to a specific person can be found more quickly, as well as showing which items currently have no owner assigned to them, by using the filters on the item list page.

# Assigning Owners

## Item List

Items can be assigned individually using the inline option

![](https://files.readme.io/a5a5344-image.png)

Multiple items can be assigned using the batch action option

![](https://files.readme.io/a02063fddcce0fda8db2db46d6dba62a9d4d0ac8a9ef265f03e7b7736c84db11-image.png)

![](https://files.readme.io/7d169f3adf2274eb03f04fc1c7bb29abc688ba17d88a1271a74e568bcce61098-image.png)

<br />

## Item Detail

Items can be assigned to valid Rollbar users in both the item list page (both inline or via batch actions) and the item detail page. When an item is assigned to a user, a notification email will be sent to inform the user of this. All other notifications for the item in question then follow the rules defined at the Project level.

![](https://files.readme.io/220df51-image.png)

Ownership changes are recorded in the history sidebar.

# Team Assignment

In the Advanced and Enterprise tiers, users have the option to assign a relevant team instead of an individual owner. Teams that are assigned to the project can be selected. When an item is assigned to a team, all members in the team will receive an email to inform them of this. All locations where a user can be assigned also allows team assignment for supported tiers.

Items can be assigned to any team associated with a project.

# Auto-suggest owner based on git blame

Advanced and Enterprise tier users can enable the auto-suggestion of the owner based on the git blame data for GitHub integrated projects. This is done at the project level, configuration details can be found [here](https://docs.rollbar.com/docs/github)

If enabled, if git blame identifies a user with a related Rollbar configured user, that user will be suggested at the top of the owner field in the item list and item detail page.

![](https://files.readme.io/7b31d7c-image.png)