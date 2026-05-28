<!-- source: https://docs.rollbar.com/docs/the-item-detail-page-video.md -->

# Item Detail Page Overview Video

![]()

The Item Detail page is the page used to investigate error Items in your software application. The page helps you to quickly triage the root cause of an error, understand the business impact of an error, and work out the steps need to reproduce it.

## Overview Video

This 6 minute video walks through the primary workflows of investigating an error in your application in Rollbar.

[block:embed]
{
  "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FY7agiuGFb3g%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DY7agiuGFb3g&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FY7agiuGFb3g%2Fhqdefault.jpg&key=7788cb384c9f4d5dbbdbeffd9fe4b92f&type=text%2Fhtml&schema=youtube\" width=\"854\" height=\"480\" scrolling=\"no\" title=\"YouTube embed\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen=\"true\"></iframe>",
  "url": "http://www.youtube.com/watch?v=Y7agiuGFb3g",
  "title": "Rollbar Item Detail Overview and Usage",
  "image": "https://i.ytimg.com/vi/Y7agiuGFb3g/hqdefault.jpg",
  "provider": "youtube.com",
  "href": "http://www.youtube.com/watch?v=Y7agiuGFb3g",
  "typeOfEmbed": "youtube"
}
[/block]

### Topics Covered in the Video

#### Personalizing the Item Detail Page

* Minimizing the left hand menu
* Hiding the Item Comments and Status changes
* Orienting the data horizontally for a wide-screen view
* Displaying the Context Graphs horizontally oriented on a separate tab

#### Occurrence trends of the Item

* Occurrence trends over time
* Viewing trends in IP addresses impacted
* Viewing trends in the users impacted
* The Occurrences, IP addresses, Servers, and People Impacted tables
  * Including columns for custom data that has been added to Occurrences
* Linking out to the Versions page to  see all Items occurring with the same code version

#### Viewing the detailed table view of the Item Occurrence

* Viewing metadata for the Occurrence
* Viewing custom data that has been added to an Occurrence of an Item
* Viewing all Items from the same code version
* Viewing all errors from the Occurrence user
* Viewing all errors from the IP address

#### Viewing telemetry data of the Item  Occurrence

* Viewing page events for the Occurrences
* The events that occurred prior to the Occurrence

#### Comments, Status changes, and Followers

* Adding a comment to the Item
* Viewing comments for the Item
* Viewing previous status changes for the Item
* Adding a viewing Followers

#### Querying related data using Rollbar Service Links

Using Rollbar Service Links to link out to other data in your ecosystem using the metadata from the Occurrence currently being viewed

For example:

* Querying your  Support Tickets from the same person.id
* Querying Kibana Info and Debug log messages from the same IP address/Session ID
* Querying DataDog for information from the same Trace ID
* Querying Google or StackOverflow for additional information about the Item Exception Type

#### Taking  the appropriate next step for an Item

* Lowering the Level of the Item for an error that is of lower importance
* Muting an Item to stop further notifications
* Assigned the Item to a User
* Opening a ticket in a Support System/Paging System