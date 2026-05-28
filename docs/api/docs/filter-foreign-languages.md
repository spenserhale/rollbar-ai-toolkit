<!-- source: https://docs.rollbar.com/docs/filter-foreign-languages.md -->

# Filtering Javascript Errors by Language

Ignore errors from browsers with foreign locale settings

If your application has an international user base, you may be receiving Javascript error reports in the local language of your users' browsers.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/baf25f98bf23d50ed64ddd010e7374555269320105a225370f9a656782859b5b-Screenshot_2024-09-03_at_9.27.42_AM.png",
        "error_spanish.png",
        1181
      ],
      "align": "center"
    }
  ]
}
[/block]

While Rollbar can't translate error messages into your preferred language, it is possible to group errors by language so that you have fewer items to manage.

Here are a few [custom fingerprinting rules](https://docs.rollbar.com/docs/custom-grouping) to match errors based on browser language:

## One supported language

The following rule groups errors where `client.language.javascript` does not contain `en-`:

```json
  {
    "condition": {
       "path": "client.javascript.language","ncontains": "en-"
    }, 
    "fingerprint": "non-en error", 
    "title": "non-english error"
  }
```

## Multiple supported languages

The following rule groups errors where `client.language.javascript` does not contain `en-`,`fr-`,`de-`, or `es-`:

```json
{
  "condition":{
    "all":[
      {"path":"client.javascript.language","ncontains":"en-"},
      {"path":"client.javascript.language","ncontains":"fr-"},
      {"path":"client.javascript.language","ncontains":"de-"},
      {"path":"client.javascript.language","ncontains":"es-"}
    ]
  },
  "fingerprint": "non-supported language error",
  "title": "non-supported language error"
}
```