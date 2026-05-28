<!-- source: https://docs.rollbar.com/docs/upgrading-from-1100.md -->

# Upgrading from < 1.10.0

The Rollbar package for Salesforce was unmanaged in versions lower than 1.10. When upgrading from one of those versions, it is necessary to uninstall the previous package before installing the new one. Once this is done and the current package is 1.10 or higher, the package can be upgraded when new versions are available and uninstalls are no longer required.

To uninstall:

1. Remove the Rollbar Email Service. Salesforce will not allow uninstall while this dependency exists. Navigate to Email Services, select RollbarEmailService, and select *View* for the Rollbar email address. Click *Delete*, and then click *Delete* for the Email Service.

2. Remove Rollbar API from Remote Site Settings. Navigate to Remote Site Settings and click the Delete action for Rollbar API. This is necessary for the install of the later version to proceed.

3. Temporarily comment out all calls to Rollbar in your classes. Salesforce will not allow uninstall while this dependency exists. Once the new version is installed, these calls to Rollbar should be prefixed with `rollbar.` as with any managed components.

4. Navigate to Installed Packages and uninstall the package itself. This should go smoothly with the above dependencies removed. If you forgot to do one of the steps above, Salesforce will remind you here.

Once this is done, you're ready to install the current version following the steps [here](https://docs.rollbar.com/docs/salesforce-apex).