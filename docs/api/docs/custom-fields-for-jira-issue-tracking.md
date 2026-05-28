<!-- source: https://docs.rollbar.com/docs/custom-fields-for-jira-issue-tracking.md -->

# Custom Fields for Jira Issue Tracking

Jira's flexible workflows and views are great for customization, but you may have run into a situation where Rollbar informs you that it can't create a Jira issue - this may be due to a mandatory/required field in your Jira issue type that Rollbar will need to set, just like you would in Jira's UI itself.

Luckily, Rollbar allows for this in your project's Jira settings: click **Projects** in the left sidebar of Rollbar's UI, then the **Jira icon** to the right of your project name, or click the project name, then **Notifications > Jira**.

Here, you'll see a '**Custom Fields**' text box just below the drop down menus for the other Jira settings, with an example of a JSON object referring to a custom field and its value.

### Custom Field format

The custom field format is a JSON object, with a key or keys referring to the custom field ID(s) in the following format: `customfield_XXXXX` where XXXXX is replaced by the Field ID. Here's an example of a SelectList custom field, with an ID of 12345 and the value set to 'banana':

```json
{"customfield_12345": { "value": "banana" }}
```

Adding the above to your Custom Fields text box would ensure that Rollbar sends this or these field values over along with the rest of the issue creation request. To retrieve the Custom Field ID within Jira, you can head to **Settings > Issues > Custom Fields**, then click the **More** icon to the right of the field name, followed by '**View field information**'. From here, the ID should be in the URL bar of your browser.

> 📘 Alternatives for Retrieving the ID:
>
> Jira's knowledge base page [here](https://confluence.atlassian.com/jirakb/find-my-custom-field-id-number-in-jira-744522503.html) goes over various other methods, including a dedicated API endpoint to retrieve all custom field IDs at once.

### Custom Field types

Depending upon the type of your custom field, the format of the above JSON may differ. For example, a RadioButtons field might have the same format as the SelectList field example above, but a MultiSelect field would differ, as it allows for multiple choices to be selected at once:

```json
{"customfield_12346": [ {"value": "banana" }, {"value": "apple" }]}
```

For specific examples of the various Custom Field types, you can refer to Jira's API documentation [here](https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/#setting-custom-field-data-for-other-field-types). Please note that you'll want to encase these examples in {} brackets to make a full JSON object.