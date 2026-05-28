<!-- source: https://docs.rollbar.com/docs/go.md -->

# Go

Rollbar SDK for Go | Support Level: Supported

[rollbar-go](https://github.com/rollbar/rollbar-go) is a Golang Rollbar client that makes it easy to report errors to Rollbar with full stacktraces. Errors are sent to Rollbar asynchronously in a background goroutine.

Because Go's error type doesn't include stack information from when it was set or allocated, we use the stack information from where the error was reported.

## Usage

```go
package main

import (
  "github.com/rollbar/rollbar-go"
  "time"
)

func main() {
  rollbar.SetToken("MY_TOKEN")
  rollbar.SetEnvironment("production")                 // defaults to "development"
  rollbar.SetCodeVersion("v2")                         // optional Git hash/branch/tag (required for GitHub integration)
  rollbar.SetServerHost("web.1")                       // optional override; defaults to hostname
  rollbar.SetServerRoot("github.com/heroku/myproject") // path of project (required for GitHub integration and non-project stacktrace collapsing)  - where repo is set up for the project, the server.root has to be "/"

  rollbar.Info("Message body goes here")
  rollbar.WrapAndWait(doSomething)

  rollbar.Close()  // call before your application closes to send any final events
}

func doSomething() {
  var timer *time.Timer = nil
  timer.Reset(10) // this will panic
}
```

## Documentation

[API docs on godoc.org](http://godoc.org/github.com/rollbar/rollbar-go)

## Running Tests

For full integration tests, set up a dummy project in Rollbar and pass the access token as an environment variable to `go test`:

```
TOKEN=POST_SERVER_ITEM_ACCESS_TOKEN go test
```

and verify the reported errors manually.

For coverage results, run:

```
TOKEN=POST_SERVER_ITEM_ACCESS_TOKEN go test -coverprofile=cover.out
go tool cover -html=cover.out -o cover.html
```

## Help / Support

If you run into any issues, please email us at `support@rollbar.com`.

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-go/issues/new).