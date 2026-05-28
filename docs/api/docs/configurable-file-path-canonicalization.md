<!-- source: https://docs.rollbar.com/docs/configurable-file-path-canonicalization.md -->

# Configurable file path canonicalization

Here you can define regex substitution rules for file paths.

If our [default grouping algorithm](https://docs.rollbar.com/docs/grouping-algorithm/) is separating occurrences because they have different file paths, but you would rather have them combined, you can configure canonicalization rules.

To set your custom rules, go to **Settings > Advanced > Custom Fingerprinting** for the project you want to configure.

Here's an example configuration:

```
[{
  "pattern": "^.*/lib/python\\d+.\\d+/(.*)$",
  "replacement": "PYTHON_LIB_FOLDER/\\1"
}]
```

The above configuration has one rule. Each rule is a JSON object that consists of `pattern` and `replacement`.

The `pattern` is a regex matching the part of the file path you want to canonicalize, the `replacement` is the string that will be substituted instead of `pattern`.

* You can use capture groups in the regex in `pattern` and refer to it in `replacement`.
* You can use the symbols `^` and `$` as the beginning and the end of the string, so you rule will be more specific.
* The rules are applied in order
* At most one rule is applied
* If none of the rules can be applied, there will be no modification.

The example above can be used to group together occurrences where the only difference is the python lib folder. E.g. if one occurrence has a file path
`/home/deploy/app/local/lib/python2.7/site-packages/sqlalchemy/engine/base.py`, while the other has `/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/base.py`, after the canonicalization both will look like this:
`PYTHON_LIB_FOLDER/site-packages/sqlalchemy/engine/base.py`, so their fingerprint will be the same.