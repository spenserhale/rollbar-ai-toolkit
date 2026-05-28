<!-- source: https://docs.rollbar.com/docs/test-mocks.md -->

# Test Mocks

In Apex test classes, all callouts must be mocked including callouts in dependent packages like Rollbar. However, Salesforce doesn't allow adding `Test.setMock` directly to your code for callouts that are in managed packages.

The following interfaces can be used in your tests to wrap `Test.setMock`.

To set a default mock:

```
rollbar.RollbarTestHelper.setDefaultMock();
```

To provide your own custom mock:

```
rollbar.RollbarTestHelper.setMock(new CustomMock);
```

Example:

```
@isTest
public class CalloutTest {
    @isTest
    public static void calloutIsMocked(){
        // Set the test mock.
        rollbar.RollbarTestHelper.setDefaultMock();

        // Also initialize a test token. (Can be any string.)
        insert new rollbar__RollbarSettings__c(rollbar__AccessToken__c = 'test-token');
        
        Test.startTest();
        // Any Rollbar callouts (e.g. rollbar.Rollbar.log()) should work.
        Test.stopTest();
    }
}
```