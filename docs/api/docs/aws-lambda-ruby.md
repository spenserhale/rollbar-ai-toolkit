<!-- source: https://docs.rollbar.com/docs/aws-lambda-ruby.md -->

# AWS Lambda

Simple step by step tutorial on how to use rollbar-gem with AWS Lambda

In November 2018, Amazon added support for Ruby to their popular cloud computation solution AWS Lambda. We are very happy to say that `rollbar-gem` can be added to your Lambda functions.

In this tutorial, we will build a simple AWS Lambda function to send a log message to Rollbar. We will also package it and deploy as an Amazon CloudFormation application.

If you don't want to go through this whole tutorial, just know that `rollbar-gem` will work perfectly fine in your Lambda functions as long as you include it as a `bundler` dependency in your deployed application. If you're not sure how to do this, continue reading.

[block:api-header]
{
  "title": "Requirements for a sample application"
}
[/block]

* Amazon Web Services account
* `ruby-2.5` on your development environment
* `bundler gem` on your development environment
* AWS CLI on your development environment ([read more here](https://aws.amazon.com/cli/)) or a prepared AWS S3 bucket
* AWS SAM CLI on your development environment ([read more here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html))

[block:api-header]
{
  "title": "Building the application"
}
[/block]

1. Make sure you run `ruby-2.5` on your development environment. This is important, as `bundler` gem will prepare a package appropriate for the ruby version you are using. If you are using `rvm` to manage multiple Ruby binaries, make sure you switch to `ruby-2.5`.
2. Create an S3 bucket to store your application code (through the `aws` CLI or S3 Management Console). Note: if you have never used the AWS CLI, you will need to provide your AWS credentials first. Make sure to note the `bucketname` you are using, as we will use it again in step 8:

[block:code]
{
  "codes": [
    {
      "code": "aws s3 mb s3://<bucketname>",
      "language": "shell"
    }
  ]
}
[/block]

3. Create your application directory:

[block:code]
{
  "codes": [
    {
      "code": "mkdir rollbar-lambda && cd rollbar-lambda",
      "language": "shell"
    }
  ]
}
[/block]

4. Add the following code to `Gemfile`:

[block:code]
{
  "codes": [
    {
      "code": "# Gemfile\nsource 'https://rubygems.org'\ngem 'rollbar'",
      "language": "ruby",
      "name": "Gemfile"
    }
  ]
}
[/block]

5. Add the following code to `rollbar-lambda.rb`. Make sure to replace `POST_SERVER_ITEM_ACCESS_TOKEN` with your Rollbar project's access token:

[block:code]
{
  "codes": [
    {
      "code": "# rollbar-lambda.rb\nrequire 'rollbar'\n\ndef report(event:,context:)\n  Rollbar.configure do |config|\n    config.access_token = \"POST_SERVER_ITEM_ACCESS_TOKEN\"\n    config.environment = \"rollbar-lambda\"\n    # Other Configuration Settings\n  end\n\n  Rollbar.debug(\"Rollbar message from rollbar-lambda app\")\nend ",
      "language": "ruby",
      "name": "rollbar-lambda.rb"
    }
  ]
}
[/block]

6. Add the following code to `template.yaml`:

[block:code]
{
  "codes": [
    {
      "code": "AWSTemplateFormatVersion: '2010-09-09'\nTransform: AWS::Serverless-2016-10-31\nDescription: 'rollbar-lambda application'\n\nResources:\n    RollbarLambdaFunction:\n       Type: AWS::Serverless::Function\n       Properties:\n           Handler: rollbar-lambda.report\n           Runtime: ruby2.5\n\nOutputs:\n    RollbarLambdaFunction:\n        Description: Rollbar Lambda Function\n        Value:\n            Fn::GetAtt:\n            - RollbarLambdaFunction\n            - Arn",
      "language": "yaml",
      "name": "template.yaml"
    }
  ]
}
[/block]

7. Package gem dependencies for deployment:

[block:code]
{
  "codes": [
    {
      "code": "bundle install && bundle install --deployment",
      "language": "shell"
    }
  ]
}
[/block]

8. In step 2 we created an S3 bucket to store the application code. We will now use it to deploy our code. First, let's package the function:

[block:code]
{
  "codes": [
    {
      "code": "sam package \\\n--template-file template.yaml \\\n--output-template-file packaged-template.yaml \\\n--s3-bucket <bucketname>",
      "language": "shell",
      "name": ""
    }
  ]
}
[/block]

9. And now, let's deploy to Amazon:

[block:code]
{
  "codes": [
    {
      "code": "sam deploy \\\n--template-file packaged-template.yaml \\\n--stack-name rollbarLambda \\\n--capabilities CAPABILITY_IAM",
      "language": "shell"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Testing the application"
}
[/block]

`rollbarLambda` should now be available in your AWS Lambda console as an application stack. Navigate into the function overview to execute a test run.

1. In the Lambda console, you will find a `Test` button up the top. Click it.
2. You will be presented with a test configuration popup. Make sure `Create new test event` radio box is selected. In the `Event name` field put `rollbarLambdaTest` and leave the test input content as it is or make it an empty JSON object: `{}`. The test input content really doesn't matter in our case.
3. Click `Create` at the bottom of the popup.
4. Now, you should have `rollbarLambdaTest` preselected as the preferred test to execute, just left of the `Test` button. Click `Test` to run the function.

If everything went well, you should receive `Execution result: succeeded` message in AWS Lambda console and a new item reported in your Rollbar project.