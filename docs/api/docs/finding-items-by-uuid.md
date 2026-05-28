<!-- source: https://docs.rollbar.com/docs/finding-items-by-uuid.md -->

# Finding items by UUID

### UUID in general

A *universally unique identifier* ([*UUID*](https://en.wikipedia.org/wiki/Universally_unique_identifier)) is a [128-bit](https://en.wikipedia.org/wiki/128-bit) number used to identify information in computer systems. When generated according to the standard methods, UUIDs are, for practical purposes, unique. Unlike most other numbering schemes, their uniqueness does not depend on a central registration authority or coordination between the parties generating them. While the probability that a UUID will be duplicated is not zero, for most applications it is negligible.

### How Rollbar uses UUID

In Rollbar, each item and the corresponding occurrences have UUIDs based on this pattern: aaaaaaaa-bbbb-cccc-dddd-eeeeffffeeee.

[Rollbar uses UUIDs](https://docs.rollbar.com/docs/uuids) to differentiate occurrences from each other within a project. You can use them to search and identify occurrences.

### Finding items by UUID

First, let's see where you can find UUIDs. The two most common places are the UI and Rollbar API responses.

Here you can see a UUID inside an occurrence:

[block:image]{"images":[{"image":["https://files.readme.io/1b2e134a6c310cc6db12e1a5eb2c506b103239727006e21d5ff1971c4dd66a29-Screenshot_2024-09-03_at_10.52.17_AM.png",null,null],"align":"center"}]}[/block]

Here is the UUID in an instance creation API response:

![UUID](https://rollbar.com/wp-content/uploads/2021/05/create_item.gif)As every occurrence have its own UUID, regardless if those were created through an API or by a Rollbar SDK, your logs and error messages might show you some, or even your customers can send you one along with their issue. To easily navigate to the corresponding occurrence on our UI, we created an easy-to-use search link.

In Rollbar, we have two types of UUID search links.

One for the Items (Example): rollbar.com/item/uuid/?uuid=aaaaaaaa-bbbb-cccc-dddd-eeeeffffeeee

Another for the Occurrences (Example): rollbar.com/occurrence/uuid/?uuid=aaaaaaaa-bbbb-cccc-dddd-eeeeffffeeee

### Learn more

Learn more about [UUIDs in Rollbar](https://docs.rollbar.com/docs/uuids). Learn how to [create an item with a custom UUID](https://explorer.docs.rollbar.com/#operation/create-item).