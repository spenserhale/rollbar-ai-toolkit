<!-- source: https://docs.rollbar.com/docs/datagrail.md -->

# DataGrail

Rollbar API Integration: API Integration and PII Extraction specifics

[block:api-header]
{
  "title": "Authentication & Authorization"
}
[/block]

I. Credentials

* Rollbar authentication is done via access token (project or account) included as a header parameter.
* Access tokens can be found and managed in the Rollbar settings (see the help docs).
* Publicly exposing your API credentials can allow unauthorized access to the Rollbar API endpoints, and your Rollbar data by a third party. DataGrail stores your API credentials encrypted and protected.

II. Permissions

* Project Access Token should be configured to allow access to all GET calls (read).
* Account Access Token should be configured to allow access to all account-level GET calls (read) and all account-level write calls (write).

III. Scopes
No special scopes required and used to connect API with related credentials.

IV. Endpoints Utilized

* Verify authentication via Project Access Token and check the read access to the items list:
  GET <https://api.rollbar.com/api/1/items>
* Verify authentication via Account Access Token and check the read access to the tracking deletion jobs:
  GET <https://api.rollbar.com/api/1/people/delete_jobs/0>

[block:api-header]
{
  "title": "Version"
}
[/block]

Rollbar integration currently supports version 1 (1.0).

[block:api-header]
{
  "title": "Limits"
}
[/block]

DataGrail processes API responses with HTTP 429 status to interrupt requests, waiting and
retrying (using an exponential backoff strategy).

[block:api-header]
{
  "title": "Access"
}
[/block]

For an access request, DataGrail will take the following actions:

* Fetch all items whose email matches the email from the Data Subject provided in the request.
* For each of the found items, DataGrai will list all occurrences.
* For all objects found, DataGrail will return all available fields. You can edit which objects and fields you want to provide to the Data Subject via our Portal Requests.

Endpoints Utilized

* GET <https://api.rollbar.com/api/1/items>
* GET <https://api.rollbar.com/api/1/item/{item_id}/instances>

[block:api-header]
{
  "title": "Deletion"
}
[/block]

For a deletion request, DataGrail will take the following actions:

* Request person deletion with email from the Data Subject as a person identifier. The returned value will include an id property that can be used to track the status of the deletion process.
* Track on the status of a person's deletion request.
* Once deletion is completed, data associated with requested email will be removed from the Rollbar project and prevent future data collection about them.
  Endpoints Utilized
* POST <https://api.rollbar.com/api/1/people/delete_jobs>
* GET <https://api.rollbar.com/api/1/people/delete_jobs/{job_id}>