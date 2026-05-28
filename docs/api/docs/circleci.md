<!-- source: https://docs.rollbar.com/docs/circleci.md -->

# CircleCI

Report deploys to Rollbar from CircleCI

Tracking the deployments you run via CircleCI will allow you to see new errors for each deployment, determine the deployment that is suspected to have caused each error, and automatically resolve errors that were fixed in each deployment. You can read more examples in our blog [Tracking errors after deployments with Rollbar and CircleCI](https://circleci.com/blog/tracking-errors-after-deployments-with-rollbar-and-circleci/).

## Configuration

1. Log into your [CircleCI account dashboard](https://circleci.com/dashboard).
2. Setup your project repository.
3. CircleCI looks for configuration in a folder named .circleci under the project directory. It should contain a file named config.yml
4. Add the deployment command in config.yml. For example

```yaml
- run:
     name: Deploy to S3
     command: |
     aws --region us-east-2 s3 sync dist s3://rollbar-example/ --delete --acl public-read
```

5. Insert the below Rollbar deployment notification after the deployment script. Make sure to replace the example variables with your own access token, username, etc.

```yaml
- run:
     name: Deployment notification to Rollbar
     command: |
       # Deployment script
       …
       # Notify rollbar
       curl --request POST \
            --url https://api.rollbar.com/api/1/deploy \
            --header "X-Rollbar-Access-Token: $ROLLBAR_ACCESS_TOKEN" \
            --header 'accept: application/json' \
            --header 'content-type: application/json' \
            --data '{
              "environment": "production",
              "revision": "'"$CIRCLE_SHA1"'",
              "rollbar_username": "RollbarExample",
              "local_username": "'"$CIRCLE_USERNAME"'",
              "comment": "Deploy with bug"
            }'
```

For details of the `/deploy/` endpoint, see [Report a deploy](https://docs.rollbar.com/reference/post-deploy).

## Upload source maps to Rollbar

If you use Javascript, Rollbar can map the error message back to your original source code using source maps. If not, you can skip this section.

In order to upload the [Upload a JS source map](https://docs.rollbar.com/reference/upload-a-js-source-map) at time of deployment, you need to add the Rollbar source map API call before the deployment script in the CircleCI config file. You should also set the code\_version in your Rollbar configuration. Learn more about this by reading our CircleCI blog [Automatically identify which code changes caused errors](https://circleci.com/blog/automatically-identify-which-code-changes-caused-errors/).

```yaml
- run:
     name: Upload sourcemap to Rollbar 
     command: |
     curl https://api.rollbar.com/api/1/sourcemap/ \
     -F access_token='SERVER-ACCESS-TOKEN' \
     -F version=$CIRCLE_SHA1 \
     -F minified_url=https://s3.us-east-2.amazonaws.com/rollbar-example/
      main.[hash].bundle.js \
     -F source_map=main.[hash].bundle.js.map \
     -F main.js=main.[hash].js    
```

## Help / Support

If you run into any issues, please email us at <support@rollbar.com>