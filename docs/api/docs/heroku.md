<!-- source: https://docs.rollbar.com/docs/heroku.md -->

# Heroku

Deploy Tracking with Heroku and Rollbar

When your application breaks, you want to know why. It is often because of a code change in a recently deployed release. Rollbar makes it easy to see when new code has been shipped, and what code changed, with the Rollbar Deploy Tracking feature.

Here are the instructions to set up automatic Deploy Tracking for applications on Heroku.

## Set up Instructions

### Create an access token with post\_server\_item scope for your Rollbar Project

In the Rollbar UI complete the following steps

1. Select the Projects menu from the Rollbar left navigation menu
2. Select your Rollbar Project from the list of Projects
3. Choose the Project Access Tokens menu item
4. Create an access token with the scope `post_server_item`

### Complete the process using one of the 2 options below

#### Option 1: Using the Heroku CLI

1. Log in to the Heroku CLI

```
heroku login
```

2. Add the Heroku webhook using the command below ,where ROLLBAR\_POST\_SERVER\_TOKEN is the token created above, and ROLLBAR\_ENV is the name of the environment as you want it to appear in Rollbar.

```
heroku webhooks:add -a YOUR_HEROKU_APPLICATION_NAME -i api:release -u 'https://api.rollbar.com/api/1/webhook/heroku?access_token=ROLLBAR_POST_SERVER_TOKEN&environment=ROLLBAR_ENV' -l notify
```

For further information on the heroku webhooks:add command options, type

```
heroku webhooks:add --help
```

#### Option 2: Using the Heroku UI

1. Log in to the Heroku UI and go to <https://dashboard.heroku.com/apps>
2. Select the Pipeline with your app
3. Select the app that you want to notify Rollbar about, when it is released.
   * The app Overview screen will now be displayed
4. Select the More/View webhooks dropdown option from the upper right of the screen
5. Select Create Webhook
6. For the Payload URL use the following URL, where ROLLBAR\_POST\_SERVER\_TOKEN is the token created above, and ROLLBAR\_ENV is the name of the environment as you want it to appear in Rollbar.

```
https://api.rollbar.com/api/1/webhook/heroku?access_token=POST_SERVER_ITEM_TOKEN&environment=ROLLBAR_ENV
```

7. Check the `api:release` Event Type

### Verify that the process is working

1. Confirm that your Rollbar Project has been onboarded, and that the Rollbar Project has received at least 1 item
2. Make a minor change to your Heroku application
3. Deploy the application. For example, from the Heroku CLI:

```
git push heroku master 
```

4. Within a few seconds of the build completing, you should see the deploy notification in the following locations in Rollbar:

#### The Items List View

Click on the left-hand Items menu

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/977a36e-image3.png",
        "image3.png",
        1191,
        138,
        "#000000"
      ]
    }
  ]
}
[/block]

#### The Deploys List View

Select the deploy from the left-hand Deploys menu

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/0ffe4b6-image2.png",
        "image2.png",
        735,
        621,
        "#000000"
      ]
    }
  ]
}
[/block]

#### Deploy Detail

Select the Timestamp link on either of the views above

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7c69f96-image1.png",
        "image1.png",
        1178,
        254,
        "#000000"
      ],
      "border": true
    }
  ]
}
[/block]