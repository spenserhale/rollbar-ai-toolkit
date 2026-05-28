<!-- source: https://docs.rollbar.com/docs/download-items-occurrences.md -->

# Download items & occurrences

Rollbar allows you to download or export your error occurrence data using our API. This data can be retrieved using the [Get an item (by project counter)](https://docs.rollbar.com/reference/get-an-item-by-project-counter), [Get an item (by ID)](https://docs.rollbar.com/reference/get-an-item-by-id), & [Get an item (by UUID)](https://docs.rollbar.com/reference/get-an-item-by-occurrence-uuid) API endpoints.

There are a variety of ways to pull and export this data. [Here](https://github.com/phillram/rollbar-singles/blob/master/get_occurrence_data.py) is an example on how to download the entire item's data using the Get an item (by project counter) API endpoint.