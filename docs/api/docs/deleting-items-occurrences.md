<!-- source: https://docs.rollbar.com/docs/deleting-items-occurrences.md -->

# Deleting items & occurrences

Rollbar offers the ability to delete errors from our service. You can delete individual occurrences using either the UI or the API. This can help remove data from our system. Please note, we are unable to recover data that has been deleted.

## Delete an item

To delete an item, you must delete each individual occurrence contained within the item. Instructions to delete occurrences are included below.

## Delete occurrences using the UI

To delete error occurrence data from the UI, you can simply follow these steps:

* Click on an item to navigate to the item details page.

![](https://files.readme.io/42dbc6f-image.png)

* Ensure you are on the occurrence you want to delete. Scroll down to the bottom of the page.

![](https://files.readme.io/5672e61-image.png)

* At the bottom of the page, you will see the `Delete Occurrence` section. Click to open this section and click on the red `Delete` button.
* ![](https://files.readme.io/c8c0324-image.png)

  A confirmation modal will appear. Click on the red `Delete` button to confirm the occurrence deletion.

  ![](https://files.readme.io/d91cf45-image.png)

## Delete occurrences using the API

You can delete an occurrence using our [delete occurrence API endpoint here](https://docs.rollbar.com/reference/delete_api-1-instance-instance-id). To get started using our API, you can review our [quickstart guide here](https://docs.rollbar.com/reference/getting-started-1). Here's a example on how to delete an occurrence using the API.

* You can retrieve the occurrence ID by using the [List all occurrences in an item API endpoint here](https://docs.rollbar.com/reference/get_api-1-item-item-id-instances) or using the UI. If you want to use the UI you can click on an item to navigate to the item details page.

![](https://files.readme.io/42dbc6f-image.png)

* The occurrence ID will appear in the details tab. Ensure you are on the occurrence you want to delete.

![](https://files.readme.io/5672e61-image.png)

* Use this occurrence ID and run the [Delete an occurrence](https://docs.rollbar.com/reference/delete_api-1-instance-instance-id) API endpoint. Here is an example cURL command to execute this call. Simply replace the `OCCURRENCE_ID` and `PROJECT_WRITE_TOKEN` with your own.

```Text cURL
curl --location 'https://api.rollbar.com/api/1/instance/OCCURRENCE_ID' \
--header 'X-Rollbar-Access-Token: PROJECT_WRITE_TOKEN'
```

## Bulk delete occurrences using the API

There are a variety of ways to delete each occurrence within an item and this would depend on your own use cases. Here are a few Python examples on [how to delete each occurrence in an item](https://github.com/phillram/rollbar-singles/blob/master/delete_item_occurrences.py) and [how to delete occurrences that match an RQL query](https://github.com/phillram/rollbar-singles/blob/master/delete_occurrences_using_rql.py).