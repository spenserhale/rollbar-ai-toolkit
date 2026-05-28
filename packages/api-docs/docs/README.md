# Rollbar API Reference

Generated from official OpenAPI 3.0.1 specification.

**Base URL:** https://api.rollbar.com

**Source:** [https://docs.rollbar.com/reference](https://docs.rollbar.com/reference)

---

## Endpoints by Resource

### Deploy

| Method  | Operation                                        | Path                        |
| ------- | ------------------------------------------------ | --------------------------- |
| `GET`   | [Get a deploy](./deploy/get-a-deploy.md)         | `/api/1/deploy/{deploy_id}` |
| `GET`   | [List all deploys](./deploy/list-all-deploys.md) | `/api/1/deploys`            |
| `POST`  | [Report a deploy](./deploy/post-deploy.md)       | `/api/1/deploy`             |
| `PATCH` | [Update a deploy](./deploy/update-a-deploy.md)   | `/api/1/deploy/{deploy_id}` |

### Email Notification Rules

| Method   | Operation                                                                                                                          | Path                                        |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `GET`    | [get**api_1_notifications_email_rule**rule*id*](./email-notification-rules/get--api-1-notifications-email-rule--rule-id-.md)       | `/api/1/notifications/email/rule/{rule_id}` |
| `GET`    | [get\_\_api_1_notifications_email_rules](./email-notification-rules/get--api-1-notifications-email-rules.md)                       | `/api/1/notifications/email/rules`          |
| `POST`   | [post\_\_api_1_notifications_email_rules](./email-notification-rules/post--api-1-notifications-email-rules.md)                     | `/api/1/notifications/email/rules`          |
| `PUT`    | [put**api_1_notifications_email_rule**rule*id*](./email-notification-rules/put--api-1-notifications-email-rule--rule-id-.md)       | `/api/1/notifications/email/rule/{rule_id}` |
| `PUT`    | [Replace existing notification rules](./email-notification-rules/put--api-1-notifications-email-rules.md)                          | `/api/1/notifications/email/rules`          |
| `DELETE` | [delete**api_1_notifications_email_rule**rule*id*](./email-notification-rules/delete--api-1-notifications-email-rule--rule-id-.md) | `/api/1/notifications/email/rule/{rule_id}` |

### Environment

| Method | Operation                                                       | Path                  |
| ------ | --------------------------------------------------------------- | --------------------- |
| `GET`  | [List all environments](./environment/list-all-environments.md) | `/api/1/environments` |

### Item

| Method  | Operation                                                                    | Path                               |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| `GET`   | [Get an item (by project counter)](./item/get-an-item-by-project-counter.md) | `/api/1/item_by_counter/{counter}` |
| `GET`   | [Get an item (by UUID)](./item/get-an-item-by-occurrence-uuid.md)            | `/api/1/item/`                     |
| `GET`   | [Get an item (by ID)](./item/get-an-item-by-id.md)                           | `/api/1/item/{itemid}`             |
| `GET`   | [List all items](./item/list-all-items.md)                                   | `/api/1/items`                     |
| `POST`  | [Create item](./item/create-item.md)                                         | `/api/1/item/`                     |
| `PATCH` | [Update an item](./item/update-an-item.md)                                   | `/api/1/item/{itemid}`             |

### Metrics

| Method | Operation                                                                                  | Path                         |
| ------ | ------------------------------------------------------------------------------------------ | ---------------------------- |
| `POST` | [Get metrics for a list of items](./metrics/post--api-1-metrics-items.md)                  | `/api/1/metrics/items`       |
| `POST` | [Occurrences over a span of time](./metrics/post--api-1-metrics-occurrences.md)            | `/api/1/metrics/occurrences` |
| `POST` | [Get resolution time metrics for a list of projects](./metrics/post--api-1-metrics-ttr.md) | `/api/1/metrics/ttr`         |

### Notification Channels

| Method | Operation                                                                                             | Path                             |
| ------ | ----------------------------------------------------------------------------------------------------- | -------------------------------- |
| `PUT`  | [put\_\_api_1_notifications_email](./notification-channels/put--api-1-notifications-email.md)         | `/api/1/notifications/email`     |
| `PUT`  | [put\_\_api_1_notifications_pagerduty](./notification-channels/put--api-1-notifications-pagerduty.md) | `/api/1/notifications/pagerduty` |
| `PUT`  | [put\_\_api_1_notifications_slack](./notification-channels/put--api-1-notifications-slack.md)         | `/api/1/notifications/slack`     |
| `PUT`  | [put\_\_api_1_notifications_webhook](./notification-channels/put--api-1-notifications-webhook.md)     | `/api/1/notifications/webhook`   |

### Occurrence

| Method   | Operation                                                                              | Path                              |
| -------- | -------------------------------------------------------------------------------------- | --------------------------------- |
| `GET`    | [Get an occurrence](./occurrence/get--api-1-instance--instance-id-.md)                 | `/api/1/instance/{instance_id}`   |
| `GET`    | [List all occurrences in a project](./occurrence/get--api-1-instances.md)              | `/api/1/instances`                |
| `GET`    | [List all occurrences in an item](./occurrence/get--api-1-item--item-id--instances.md) | `/api/1/item/{item_id}/instances` |
| `DELETE` | [Delete an occurrence](./occurrence/delete--api-1-instance--instance-id-.md)           | `/api/1/instance/{instance_id}`   |

### PagerDuty Notification Rules

| Method   | Operation                                                                                                                                      | Path                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `GET`    | [get**api_1_notifications_pagerduty_rule**rule*id*](./pagerduty-notification-rules/get--api-1-notifications-pagerduty-rule--rule-id-.md)       | `/api/1/notifications/pagerduty/rule/{rule_id}` |
| `GET`    | [get\_\_api_1_notifications_pagerduty_rules](./pagerduty-notification-rules/get--api-1-notifications-pagerduty-rules.md)                       | `/api/1/notifications/pagerduty/rules`          |
| `POST`   | [post\_\_api_1_notifications_pagerduty](./pagerduty-notification-rules/post--api-1-notifications-pagerduty.md)                                 | `/api/1/notifications/pagerduty`                |
| `PUT`    | [put**api_1_notifications_pagerduty_rule**rule*id*](./pagerduty-notification-rules/put--api-1-notifications-pagerduty-rule--rule-id-.md)       | `/api/1/notifications/pagerduty/rule/{rule_id}` |
| `PUT`    | [Replace existing notification rules](./pagerduty-notification-rules/put--api-1-notifications-pagerduty-rules.md)                              | `/api/1/notifications/pagerduty/rules`          |
| `DELETE` | [delete**api_1_notifications_pagerduty_rule**rule*id*](./pagerduty-notification-rules/delete--api-1-notifications-pagerduty-rule--rule-id-.md) | `/api/1/notifications/pagerduty/rule/{rule_id}` |

### People

| Method | Operation                                                            | Path                                 |
| ------ | -------------------------------------------------------------------- | ------------------------------------ |
| `GET`  | [Get person deletion status](./people/get-person-deletion-status.md) | `/api/1/people/delete_jobs/{job_id}` |
| `POST` | [Request person deletion](./people/delete-a-person.md)               | `/api/1/people/delete_jobs/`         |

### Project Access Tokens

| Method   | Operation                                                                                                                  | Path                                                          |
| -------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `GET`    | [List all project access tokens](./project-access-tokens/list-all-project-access-tokens.md)                                | `/api/1/project/{project_id}/access_tokens`                   |
| `POST`   | [Create a project access token](./project-access-tokens/post--api-1-project--project-id--access-tokens.md)                 | `/api/1/project/{project_id}/access_tokens`                   |
| `PATCH`  | [Update a rate limit (token identifier in the body)](./project-access-tokens/update-a-rate-limit-2.md)                     | `/api/1/project/{project_id}/access_token`                    |
| `PATCH`  | [Update a rate limit (token identifier in the path)](./project-access-tokens/update-a-rate-limit.md)                       | `/api/1/project/{project_id}/access_token/{token_identifier}` |
| `DELETE` | [Delete a project access token (token identifier in the body)](./project-access-tokens/delete-a-project-access-token-2.md) | `/api/1/project/{project_id}/access_token`                    |
| `DELETE` | [Delete a project access token (token identifier in the path)](./project-access-tokens/delete-a-project-access-token.md)   | `/api/1/project/{project_id}/access_token/{token_identifier}` |

### Projects

| Method   | Operation                                            | Path                          |
| -------- | ---------------------------------------------------- | ----------------------------- |
| `GET`    | [Get a project](./projects/get-a-project.md)         | `/api/1/project/{project_id}` |
| `GET`    | [List all projects](./projects/list-all-projects.md) | `/api/1/projects`             |
| `POST`   | [Create a project](./projects/create-a-project.md)   | `/api/1/projects`             |
| `DELETE` | [Delete a project](./projects/delete-a-project.md)   | `/api/1/project/{project_id}` |

### RQL

| Method | Operation                                           | Path                             |
| ------ | --------------------------------------------------- | -------------------------------- |
| `GET`  | [Check an RQL job](./rql/check-an-rql-job.md)       | `/api/1/rql/job/{job_id}`        |
| `GET`  | [Get RQL job results](./rql/get-rql-job-results.md) | `/api/1/rql/job/{job_id}/result` |
| `GET`  | [List all RQL jobs](./rql/list-all-rql-jobs.md)     | `/api/1/rql/jobs/`               |
| `POST` | [Cancel an RQL job](./rql/cancel-an-rql-job.md)     | `/api/1/rql/job/{job_id}/cancel` |
| `POST` | [Create an RQL job](./rql/create-an-rql-job.md)     | `/api/1/rql/jobs/`               |

### Replay

| Method   | Operation                                                                                                            | Path                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `GET`    | [Get a session replay](./replay/get--api-1-environment--environment--session--sessionid--replay--replayid-.md)       | `/api/1/environment/{environment}/session/{sessionId}/replay/{replayId}` |
| `DELETE` | [Delete a session replay](./replay/delete--api-1-environment--environment--session--sessionid--replay--replayid-.md) | `/api/1/environment/{environment}/session/{sessionId}/replay/{replayId}` |

### Reports

| Method | Operation                                                           | Path                               |
| ------ | ------------------------------------------------------------------- | ---------------------------------- |
| `GET`  | [Get activated item counts](./reports/get-activated-item-counts.md) | `/api/1/reports/activated_counts`  |
| `GET`  | [Get active occurrence counts](./reports/get-occurrence-counts.md)  | `/api/1/reports/occurrence_counts` |
| `GET`  | [Get top active items](./reports/get-top-active-items.md)           | `/api/1/reports/top_active_items`  |

### Service Links

| Method   | Operation                                                                                | Path                        |
| -------- | ---------------------------------------------------------------------------------------- | --------------------------- |
| `GET`    | [get\_\_api_1_service_links](./service-links/get--api-1-service-links.md)                | `/api/1/service_links`      |
| `GET`    | [get**api_1_service_links**id\_](./service-links/get--api-1-service-links--id-.md)       | `/api/1/service_links/{id}` |
| `POST`   | [post\_\_api_1_service_links](./service-links/post--api-1-service-links.md)              | `/api/1/service_links`      |
| `PUT`    | [put**api_1_service_links**id\_](./service-links/put--api-1-service-links--id-.md)       | `/api/1/service_links/{id}` |
| `DELETE` | [delete**api_1_service_links**id\_](./service-links/delete--api-1-service-links--id-.md) | `/api/1/service_links/{id}` |

### Slack Notification Rules

| Method   | Operation                                                                                                                          | Path                                        |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `GET`    | [get**api_1_notifications_slack_rule**rule*id*](./slack-notification-rules/get--api-1-notifications-slack-rule--rule-id-.md)       | `/api/1/notifications/slack/rule/{rule_id}` |
| `GET`    | [get\_\_api_1_notifications_slack_rules](./slack-notification-rules/get--api-1-notifications-slack-rules.md)                       | `/api/1/notifications/slack/rules`          |
| `POST`   | [post\_\_api_1_notifications_slack_rules](./slack-notification-rules/post--api-1-notifications-slack-rules.md)                     | `/api/1/notifications/slack/rules`          |
| `PUT`    | [put**api_1_notifications_slack_rule**rule*id*](./slack-notification-rules/put--api-1-notifications-slack-rule--rule-id-.md)       | `/api/1/notifications/slack/rule/{rule_id}` |
| `PUT`    | [Replace existing notification rules](./slack-notification-rules/put--api-1-notifications-slack-rules.md)                          | `/api/1/notifications/slack/rules`          |
| `DELETE` | [delete**api_1_notifications_slack_rule**rule*id*](./slack-notification-rules/delete--api-1-notifications-slack-rule--rule-id-.md) | `/api/1/notifications/slack/rule/{rule_id}` |

### Symbol Maps

| Method | Operation                                                                       | Path                    |
| ------ | ------------------------------------------------------------------------------- | ----------------------- |
| `POST` | [Upload an iOS dSYM bundle](./symbol-maps/upload-a-dsym-file.md)                | `/api/1/dsym`           |
| `POST` | [Upload a Flutter symbols file](./symbol-maps/upload-a-flutter-symbols-file.md) | `/api/1/fluttersymbols` |
| `POST` | [Upload an Android Proguard file](./symbol-maps/upload-a-proguard-file.md)      | `/api/1/proguard`       |
| `POST` | [Upload a JS source map](./symbol-maps/upload-a-js-source-map.md)               | `/api/1/sourcemap`      |

### Teams

| Method   | Operation                                   | Path                    |
| -------- | ------------------------------------------- | ----------------------- |
| `GET`    | [Get a team](./teams/get-a-team.md)         | `/api/1/team/{team_id}` |
| `GET`    | [List all teams](./teams/list-all-teams.md) | `/api/1/teams`          |
| `POST`   | [Create a team](./teams/create-a-team.md)   | `/api/1/teams`          |
| `DELETE` | [Delete a team](./teams/delete-a-team.md)   | `/api/1/team/{team_id}` |

### Teams ⟷ Projects

| Method   | Operation                                                                                                 | Path                                         |
| -------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `GET`    | [List a project's teams](./teams--projects/list-a-projects-teams.md)                                      | `/api/1/project/{project_id}/teams`          |
| `GET`    | [Check if a team is assigned to a project](./teams--projects/check-if-a-team-is-assigned-to-a-project.md) | `/api/1/team/{team_id}/project/{project_id}` |
| `GET`    | [List a team's projects](./teams--projects/list-a-teams-projects.md)                                      | `/api/1/team/{team_id}/projects`             |
| `PUT`    | [Assign a team to a project](./teams--projects/assign-a-team-to-a-project.md)                             | `/api/1/team/{team_id}/project/{project_id}` |
| `DELETE` | [Remove a team from a project](./teams--projects/remove-a-team-from-a-project.md)                         | `/api/1/team/{team_id}/project/{project_id}` |

### Teams ⟷ Users

| Method   | Operation                                                                                        | Path                                   |
| -------- | ------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `GET`    | [Get invitation](./teams--users/get-invitation.md)                                               | `/api/1/invite/{invite_id}`            |
| `GET`    | [List invitations to a team](./teams--users/list-invitations-to-a-team.md)                       | `/api/1/team/{team_id}/invites`        |
| `GET`    | [Check if a user is assigned to a team](./teams--users/check-if-a-user-is-assigned-to-a-team.md) | `/api/1/team/{team_id}/user/{user_id}` |
| `GET`    | [List a team's users](./teams--users/list-a-teams-users.md)                                      | `/api/1/team/{team_id}/users`          |
| `GET`    | [List a user's teams](./teams--users/list-a-users-teams.md)                                      | `/api/1/user/{user_id}/teams`          |
| `POST`   | [Invite an email address to a team](./teams--users/invite-an-email-address-to-a-team.md)         | `/api/1/team/{team_id}/invites`        |
| `PUT`    | [Assign a user to team](./teams--users/assign-a-user-to-team.md)                                 | `/api/1/team/{team_id}/user/{user_id}` |
| `DELETE` | [Cancel invitation](./teams--users/cancel-invitation.md)                                         | `/api/1/invite/{invite_id}`            |
| `DELETE` | [Remove a user from a team](./teams--users/remove-a-user-from-a-team.md)                         | `/api/1/team/{team_id}/user/{user_id}` |

### Users

| Method | Operation                                   | Path                    |
| ------ | ------------------------------------------- | ----------------------- |
| `GET`  | [Get a user](./users/get-a-user.md)         | `/api/1/user/{user_id}` |
| `GET`  | [List all users](./users/list-all-users.md) | `/api/1/users`          |

### Users ⟷ Projects

| Method | Operation                                                            | Path                             |
| ------ | -------------------------------------------------------------------- | -------------------------------- |
| `GET`  | [List a user's projects](./users--projects/list-a-users-projects.md) | `/api/1/user/{user_id}/projects` |

### Versions

| Method | Operation                                                                          | Path                              |
| ------ | ---------------------------------------------------------------------------------- | --------------------------------- |
| `GET`  | [Code version details in one project](./versions/get--api-1-versions--version-.md) | `/api/1/versions/{version}`       |
| `GET`  | [List items by code version](./versions/get--api-1-versions--version--items.md)    | `/api/1/versions/{version}/items` |

### Webhook Notification Rules

| Method   | Operation                                                                                                                                | Path                                          |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `GET`    | [get**api_1_notifications_webhook_rule**rule*id*](./webhook-notification-rules/get--api-1-notifications-webhook-rule--rule-id-.md)       | `/api/1/notifications/webhook/rule/{rule_id}` |
| `GET`    | [get\_\_api_1_notifications_webhook_rules](./webhook-notification-rules/get--api-1-notifications-webhook-rules.md)                       | `/api/1/notifications/webhook/rules`          |
| `POST`   | [post\_\_api_1_notifications_webhook_rules](./webhook-notification-rules/post--api-1-notifications-webhook-rules.md)                     | `/api/1/notifications/webhook/rules`          |
| `PUT`    | [put**api_1_notifications_webhook_rule**rule*id*](./webhook-notification-rules/put--api-1-notifications-webhook-rule--rule-id-.md)       | `/api/1/notifications/webhook/rule/{rule_id}` |
| `PUT`    | [Replace existing notification rules](./webhook-notification-rules/put--api-1-notifications-webhook-rules.md)                            | `/api/1/notifications/webhook/rules`          |
| `DELETE` | [delete**api_1_notifications_webhook_rule**rule*id*](./webhook-notification-rules/delete--api-1-notifications-webhook-rule--rule-id-.md) | `/api/1/notifications/webhook/rule/{rule_id}` |
