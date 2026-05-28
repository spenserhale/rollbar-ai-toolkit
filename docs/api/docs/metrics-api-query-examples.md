<!-- source: https://docs.rollbar.com/docs/metrics-api-query-examples.md -->

# Metrics API Occurrence Query Examples

Below are examples of the format of the request body for queries to the occurrence metrics API endpoint

<https://docs.rollbar.com/reference/post_api-1-metrics-occurrences>

### Query time format

The start\_time and end\_time in the queries is unix epoch time in seconds

## Example 1

This query returns an occurrence  count of info and higher occurrences grouped by environment and level

```json
{
  "start_time": start_time,
  "end_time":  end_time,
    "group_by": ["environment", "item_level"],
      "filters": [
        {
          "field": "item_level",
          "values": ["error", "critical", "warning", "info"],
          "operator": "eq"
        }
      ]
}
```

## Example 2

This query returns the item\_count and occurrence\_id for every occurrence associated with a specific person\_ids  in a given time window

```json
{
  "start_time": starttime_unix,
  "end_time":  endtime_unix,
  "group_by": ["item_counter", "occurrence_id"],
  "filters": [
   {
     "field": "person_id",
      "values": ["12345", "67890"],
      "operator": "eq"
   }
  ]
}
```

## Example 3

This query gives the occurrence counts of each level in a time window. The date returned is for each hour in the time window.\
This type of query is useful to see the pattern of occurrence counts over a period of time

```json
{
    "filters": [{ "field": "item_level", 
                    "values": ["warning", "error", "critical"],
                    "operator": "eq"
                }],
    "start_time": starttime_unix,
    "end_time": endtime_unix,
    "group_by": ["item_level"],
    "granularity": "hour",
    "timezone": "US/Pacific"
}
```

## Example 4

The occurrence counts for each item that is occurring in an environment. Each code\_version is grouped separately. This could be useful if multiple code\_versions are running concurrently

```json
{
    "filters": [{ "field": "item_level", 
                    "values": ["error", "critical"],
                    "operator": "eq"
                },
                {"field": "environment",
                "values": ["production"],
                "operator": "eq"
                }
                ],
    "start_time": start_time,
    "end_time": end_time,
    "group_by": ["code_version", "item_counter", "environment", "item_level"],
    "granularity": "hour",
    "timezone": "US/Pacific"
}
```