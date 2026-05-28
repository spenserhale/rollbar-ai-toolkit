<!-- source: https://docs.rollbar.com/docs/grouping-algorithm.md -->

# Default Grouping Algorithm

When it comes to combining similar errors, Rollbar has a few key concepts and terms:

* An *occurrence* is a single event instance: an exception or log message, along with its associated metadata.
* A *fingerprint* is a string used to identify each occurrence (more on this below).
* An *item* is the combination of all occurrences with the same fingerprint.

Occurrences can be:

* *exceptions*, which have an exception class, exception message, and stack trace. or
* *messages*, which have only a string message

## Goals

Rollbar tries to combine occurrences such that:

* Occurrences with the same root cause are combined
* Occurrences with different root causes are kept separate
* Fingerprints are resilient to deploys and code changes

When the above goals are in conflict, we usually create more items to ensure that no issues remain hidden. We are continuously improving grouping performance by using machine learning to minimize the noise caused by these conflicts.

## Grouping changes

Rollbar continuously improves the default grouping engine and automatically uses the most advanced version for projects created as of July 29, 2020. We apply grouping updates in such a way as to avoid false alarms caused by applying new grouping to existing items. You can enable auto-upgrades for older projects on the 'Upgrade Grouping' settings page.

## Exception Fingerprinting

We attempt to recognize frequently occurring error types and fingerprint them using patterns identified by machine learning instead of using hard-coded grouping algorithms that apply generic rules. We continuously train our model to maximize its performance.

For less frequent exceptions that we do not have patterns for, our basic fingerprinting algorithm is:

1. Combine the filenames and method names from all of the stack frames
2. Append the exception class name
3. Take the SHA1 hash of the result

The resulting SHA1 hash is used as the occurrence fingerprint.

Things to note:

* We use all of the stack frames, not just the frame from the top of the stack. While this sometimes means there will be multiple Items for the same root cause, it also prevents unrelated issues from being combined together when they happen to call into the same library function.
* We don't use the line numbers in the stack trace, as they often change due to unrelated code changes (i.e. someone added a line of code at the beginning of the file).
* When `server.root` is set, we strip the root off of each filename and replace it with a constant string. So the filenames used for the fingerprint will be different than if `server.root` is not set.

We've added a number of tweaks to this basic algorithm. Here are some of the big ones:

* dates and shas are stripped from paths in filenames
* integers 2 characters or longer are stripped from method names
* we attempt to recognize and ignore boilerplate stack frames of frameworks

## Message Fingerprinting

For messages, we apply a number of heuristics on the message text itself. The basic algorithm is:

1. Strip out things that look like data
2. Take the SHA1 hash of what remains

Like exceptions, the resulting SHA1 hash is used as the occurrence "fingerprint", and occurrences with the same fingerprint are combined.

"Things that look like data" includes:

* things that look like dates or timestamps
* email addresses
* IP addresses
* numbers with decimal points
* integers 2 digits or longer
* hexadecimals 4 digits of longer

On the other hand, we attempt to preserve "things that look like data" if we assume it's relevant for grouping, like error codes or HTTP status codes.

## Customizing Fingerprinting Rules

If our default algorithm doesn't group the occurrences the way you would like to see, you can create rules to override the default behavior. This can be found in Settings -> {Project} -> Custom Fingerprinting. Please see the [Custom Fingerprinting](/docs/custom-grouping/) guide to learn more.

## Client-side Fingerprints

If you cannot describe the grouping you would like to use as [Custom Fingerprinting Rules](/docs/custom-grouping/), you can calculate a fingerprint yourself and send it with the occurrence report. Note that despite its flexibility, we discourage using this feature as any change you would like to make in grouping this way will require you to re-deploy your application.

See the docs for the Rollbar library you are using for instructions on how to set specific keys in the payload. To send the fingerprint, you'll just need to set the `fingerprint` key in the payload to the value you want.

Occurrences with the same fingerprint will be combined. The fingerprint should be a string up to 40 characters long. If you pass a string longer than 40 characters, we'll use its SHA1 hash instead.