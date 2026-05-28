<!-- source: https://docs.rollbar.com/docs/deployment-api.md -->

# Deployment Client API

Track your software deployments metadata with Rollbar

**Module/package:** `Rollbar.Deploys`

**Namespace:** `RollbarDeploys`

Rollbar Deployment API implements deployment tracking as a REST-based service.
The Rollbar Core module of the SDK includes .NET compatible client to the Deployment API.

The key API type is the `RollbarDeploysManager` that implements `IRollbarDeploysManager` interfaces. The interface defines async methods for

* registering new deployment instance,
* querying registered deployment instances page-by-page,
* and querying deployment instance details by specified `deploymentID`.

The `RollbarDeploysManager` does not have default parameterless constructor defined since it needs some required parameters to be provided at construction time, like Rollbar write and/or read access tokens. Once properly constructed it can be used for deployment registration (by supplying a valid instance of the `Deployment` class) and querying for previously registered deployments:

[block:code]
{
  "codes": [
    {
      "code": "// create a deploys manager:\nIRollbarDeploysManager deploysManager = \n  RollbarDeploysManagerFactory.CreateRollbarDeploysManager(\n  \tRollbarUnitTestSettings.AccessToken,\n \t \tRollbarUnitTestSettings.DeploymentsReadAccessToken\n\t); \n\n// create a new deployment:\nvar deployment = DeploymentFactory.CreateDeployment(\n  environment: RollbarUnitTestSettings.Environment,\n  revision: \"99909a3a5a3dd4363f414161f340b582bb2e999\",\n  comment: \"Some new unit test deployment @ \" + DateTimeOffset.Now,\n  localUserName: \"UnitTestRunner\",\n  rollbarUserName: \"rollbar\"\n);\n\n// register the deployment:\nvar task = deploysManager.RegisterAsync(deployment);\ntask.Wait(TimeSpan.FromSeconds(3));\n\n// get all the registered deployments:\nvar deployments = GetAllDeployments();\n\n// get the very first deployment's details:\nvar latestDeployment = deployments.FirstOrDefault();\nvar getDeploymentTask = deploysManager.GetDeploymentAsync(latestDeployment.DeployID);\ngetDeploymentTask.Wait(TimeSpan.FromSeconds(3));\nvar deploymentDetails = getDeploymentTask.Result;",
      "language": "csharp"
    }
  ]
}
[/block]

where GetAllDeployments() could be implemented as:

[block:code]
{
  "codes": [
    {
      "code": "private ICollection<IDeploymentDetails> GetAllDeployments()\n{\n  List<IDeploymentDetails> deployments = new List<IDeploymentDetails>();\n\n  int pageCount = 0;\n  int pageItems = 0;\n  do\n  {\n    var task = this._deploysManager.GetDeploymentsPageAsync(\n      RollbarUnitTestSettings.Environment, \n      ++pageCount\n    \t);    \n    task.Wait(TimeSpan.FromSeconds(3));\n    \n    pageItems = task.Result.Length;\n    if (pageItems > 0)\n    {\n      deployments.AddRange(task.Result);\n    }\n  }\n  while (pageItems > 0);\n\n  return deployments;\n}",
      "language": "csharp"
    }
  ]
}
[/block]