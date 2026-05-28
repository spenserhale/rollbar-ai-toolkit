<!-- source: https://docs.rollbar.com/docs/encryption-at-rest.md -->

# Encryption at Rest

[block:callout]
{
  "type": "info",
  "body": "Advanced Encryption at Rest ('encryption') is currently available to customers of our [compliance solutions](https://rollbar.com/compliance/).  \n\nFor more information, [contact us](https://rollbar.com/compliance/#contact-us).",
  "title": ""
}
[/block]

When encryption is enabled, all existing data in all projects within your account will be encrypted and all new data will be encrypted as it is received.  For more details about Advanced Encryption <https://rollbar.com/blog/encryption-at-rest/>

To view the status of the encryption process, go to **Account Settings → Encryption**

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/f54f0af-encryption-project-list.png",
        "encryption-project-list.png",
        884,
        277,
        "#f8f8f8"
      ]
    }
  ]
}
[/block]

The encryption status of each project in your account is displayed, as well as a summary of the overall progress towards encrypting all of the existing data within your account.

## Encryption Method

Rollbar uses an <a href="https://en.wikipedia.org/wiki/Galois/Counter_Mode" target="wikipedia">AES-256 GCM</a> algorithm to encrypt data at rest.  A unique encryption key is used for each Rollbar project.

[block:callout]
{
  "type": "info",
  "body": "If you have further questions about encryption at rest in Rollbar, please email [security@rollbar.com](mailto:security@rollbar.com)"
}
[/block]