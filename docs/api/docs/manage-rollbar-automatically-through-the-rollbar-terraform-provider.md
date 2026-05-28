<!-- source: https://docs.rollbar.com/docs/manage-rollbar-automatically-through-the-rollbar-terraform-provider.md -->

# Manage Rollbar automatically through the Rollbar Terraform Provider

### Terraform Provider is available for Rollbar Accounts

The Rollbar account administration is critical to get the most out of Rollbar and to maintain data visibility across teams. However, this process can be tedious for large and fast-growing accounts. Users are required to manually support provisioning and management of Rollbar Accounts (using the UI or the APIs). Fortunately, the [Rollbar Terraform Provider](https://rollbar.com/integrations/terraform/) offers an automated way!

Terraform is a multi-cloud provisioning product used to create, manage, and update infrastructure resources. The Provider will automate the creation, modification, and removal of resources within your account such as projects, users, and teams.

The Terraform Provider is a declarative framework - which means that you can describe the end state that you want to achieve without stating the exact steps and ‘how’ to get there. It leverages the Rollbar API to make the changes necessary to reach and maintain its desired state. This way you can reduce the time it takes to provision and manage your Rollbar account, while cutting back on manual efforts and human error.

### What does the integration do?

A Terraform integration, known as a Provider, provides a way to provision and manage a Rollbar Account. Instead of using the Ingestion API, it will use parts of the API that create, edit, and destroy Rollbar Accounts, Project, Teams, Access Tokens, etc.

With the Rollbar Terraform Provider you will be able to:

**Manage projects and users with ease**

* Create, read, update or delete projects and users easily
* Provision new projects automatically as new microservices are created
* Provision Rollbar access tokens automatically

**Meet security requirements easily**

* Rotate Rollbar access tokens automatically
* Update Rollbar Team membership when new employees join or leave.
* Manage security settings such as password policy, SAML/SSO settings, etc

### Watch our demo video

[block:embed]
{
  "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FurF_pRlCeuA%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DurF_pRlCeuA&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FurF_pRlCeuA%2Fhqdefault.jpg&key=f2aa6fc3595946d0afc3d76cbbd25dc3&type=text%2Fhtml&schema=youtube\" width=\"854\" height=\"480\" scrolling=\"no\" title=\"YouTube embed\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen=\"true\"></iframe>",
  "url": "https://www.youtube.com/embed/urF_pRlCeuA",
  "title": "Manage Rollbar automatically through the Rollbar Terraform Provider",
  "favicon": "https://www.youtube.com/favicon.ico",
  "image": "https://i.ytimg.com/vi/urF_pRlCeuA/hqdefault.jpg"
}
[/block]