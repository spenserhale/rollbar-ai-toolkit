<!-- source: https://docs.rollbar.com/docs/security.md -->

# Security & Compliance Policy

Rollbar is committed to the security of your application’s data. As part of this commitment, we use a variety of industry-standard security technologies and procedures to protect your information from unauthorized access, use, or disclosure. We adhere to HIPAA and ISO 27001 compliance and meet industry best practices where applicable.

Rollbar commits to:

* implement and maintain the Information Security Program at Rollbar;
* satisfy applicable requirements related to information security;
* continuously improve and align information security practices to global best practices and standards;
* ensuring every employee shares responsibility for effective information security;
* protecting its employees, information, intellectual property, assets against misuse, loss, damage, disruption or unauthorized disclosure. It is also critical that Rollbar retains the confidence of those who entrust confidential information to Rollbar and;
* developing and maintaining security policies and controls designed to meet the requirements of ISO 27001.

The Rollbar security program is led by IT and Security Senior Leadership and is responsible for the following areas:

* Application Security
* Infrastructure and Network Security
* Compliance
* Privacy
* Corporate Security
* Physical Security

Our employees are required to attend annual security awareness training and are informed of their security responsibilities.

# Rollbar Compliant SaaS Solution

The Rollbar Compliant SaaS solution meets the strict guidelines of the Health Insurance Portability and Accountability Act (HIPAA) and ISO 27001 controls. Rollbar Compliant SaaS allows customers to store their sensitive data and rely on Rollbar to perform all of the underlying security and safeguards needed.

## HIPAA

Rollbar Compliant SaaS is fully compliant with HIPAA and the HITECH Act. The Compliant SaaS environment is set up to allow customers to place their sensitive data within the Rollbar application. We follow all of the required procedural and technical controls within the cloud environment. Additionally we will sign a Business Associate Agreement (BAA) with each Compliant SaaS customer that may request one in order to ensure that Rollbar and the customer are both in alignment with the security controls being enforced to protect such data. There's no additional cost for the BAA, and the entry level plan available for a BAA is the Advanced 4M plan, paid annually. You can review current pricing [here](https://rollbar.com/pricing/).

## ISO 27001

We have chosen to become ISO 27001 compliant with our production environment. This level of compliance provides reassurance to our customer that we have implemented, are maintaining, and are continually improving an information security management system in accordance with international industry best practices.

## SOC 2

Rollbar has received its SOC 2 Type I and Type II compliance certifications.

[Contact us](https://rollbar.com/contact/?inquiryType=Other) to obtain the report.

## SOC 3

Rollbar has received its SOC 3 compliance certification which can be [viewed here](https://rollbar.com/wp-content/uploads/2024/06/Rollbar-Inc.-SOC-3-Report-5-31-24.pdf).

## Cloud Security Alliance – STAR registrant

The Cloud Security Alliance is a not-for-profit organization with a mission to promote the use of best practices for providing security assurance within cloud computing. One of the mechanisms the Cloud Security Alliance uses in pursuit of its mission is the Security, Trust, and Assurance Registry (STAR) - a free, publicly accessible registry that documents the security controls provided by various cloud computing offerings.

[Read Rollbar’s STAR Consensus Assessment Initiative Questionnaire](https://cloudsecurityalliance.org/star-registrant/rollbar-inc/)

## SSAE16 / ISAE 3402 Type II Attestations

We utilize [Google Cloud Platform](https://cloud.google.com/) to host the complete Rollbar environment.  Google undergoes annual independent audits for the following:

* SOC 1
* SOC 2
* [SOC 3 public audit report](https://rollbar.com/wp-content/uploads/2022/08/GCP-SPR-2022-GCP-SOC-3..pdf)

For further details, see [Google Cloud Platform Security](https://cloud.google.com/security/compliance).

## Independent Audits

Rollbar undergoes third-party penetration tests on an annual basis. All items found in the testing are addressed, mitigated, or remediated depending on the severity of the finding. A summary report is available to customers that are currently under contract with Rollbar at the Enterprise level.

In addition to the yearly penetration testing, we have a quarterly third-party vulnerability scan performed that covers all of our IP space. This is meant to complement the annual penetration test and to ensure there are no gaps throughout the year.

In addition to internal and third-party security testing we commission directly, we encourage outside security researchers to test the Rollbar application and report any vulnerabilities found to the Rollbar Security Team, in accordance with our [Responsible Disclosure Policy](https://rollbar.com/about/responsible-disclosure-policy/). Testing is performed by account owners or members authorized by the account owner to conduct testing. We will respond and fix vulnerabilities in accordance with our commitment to security and privacy, and will not take legal action against or terminate access to Rollbar for those who discover and report security vulnerabilities.

## Internal Audits

Our engineering team performs monthly authenticated internal vulnerability scans of our production environment. This is to ensure that all systems are not only patched but are following industry best practices in security.

## Data Centers

Our primary data center, where data is stored and encrypted at rest, is located in the Iowa region. We also utilize a global points-of-presence network to deliver fast and reliable experience to users anywhere in the world. Our data center provider complies with top certifications, including ISO 27001, AICPA SOC 2 and 3, PCI DSS, HIPAA, and more.

# Meeting Your Compliance Requirements

## Data Encryption

For Rollbar Compliant SaaS accounts, all raw data is encrypted at rest with a different encryption key per account. The data that is being requested is decrypted only when requested by an authenticated member of the subscription. This provides an additional level of protection should Rollbar ever encounter a breach of its infrastructure. In this case, if data was ever lost, it would be protected by the best industry standards in encryption technology and the data would be useless to the attacker since it would appear to be randomized data.

All data in transit is sent through https (TLS) encrypted connections. This ensures the confidentiality and integrity of the data sent between the Rollbar application and the customer.

## Two-Factor Authentication

Two-Factor Authentication provides an extra layer of security to your Rollbar account by requiring a time-based one-time password in addition to a password each time you login. Two-factor Authentication can be enabled by each user and requires a mobile authenticator app, such as Google Authenticator or Authy.

[Read the Rollbar documentation for detailed instructions on implementing Two-Factor Authentication](/docs/two-factor-authentication/).

## SAML-Based Single Sign On

[On designated Rollbar plans](https://rollbar.com/pricing/), you can enable SAML-based single sign-on (SSO) using Google Apps for Work, Okta, or Bitium. SSO not only improves the user experience by making it seamless to log into the Rollbar application, SSO also enhances security by allowing companies to control and maintain their own identity management, which translates into fewer user identities and simpler accessibility across trusted domains.

[Read the Rollbar documentation for detailed instruction on how to setup SSO](/docs/saml/).

## Data Removal

On designated plans with data encryption at rest, data removal can be accomplished by destroying the customer’s encryption key from the Rollbar encryption key store. This will have the same effect of removing the data from the database. This option would normally be used to remove all account data.

On plans that do not use the database encryption, data can be purged from the database and will fall out of backups over seven days. This option is also used for one-off deletions of specific data.

## Customized Data Retention

Rollbar’s standard data retention is 180 days. Through our Compliant SaaS solution we may accommodate data retention plans of varying lengths to meet your compliance and regulatory requirements.

## Audit Controls

Rollbar has an entire suite of audit controls built into the application. The following is a sample of Rollbar capabilities:

* User List - List of all users associated with your account along with their activity.
* Security Audit Logs - Shows all of the recent actions pertaining to your Rollbar account.

[Find the entire list of Enterprise Security Controls in the Rollbar docs](/docs/enterprise-security-controls/).

## Data Privacy

Rollbar complies with the EU-U.S. Privacy Shield Principles and Swiss-U.S. Privacy Shield Principles of notice, choice, onward transfer, security, data integrity, access, and enforcement.

Access to account data by Rollbar employees is limited to a necessary set of users consistent with their assigned Rollbar responsibilities. At Rollbar, we believe in the concepts of ‘need to know’ and ‘least privileged’.

In addition to this, you are ultimately in control of what data is sent to Rollbar. We provide you the ability to filter out information you don’t want to send to Rollbar in the client configuration. This may be due to regulatory issues like PCI-DSS, or any other possible privacy concern that you might have.

## Access Control

The Rollbar application has a set of Enterprise level access controls, including:

* Single Sign On
* Two-Factor Authentication
* Password complexity settings
* IP safelisting for UI and API
* Session timeout
* Controls on the number of invalid login requests before locking out a user
* Controls to force a user password to expire after a period of use
* Restrict access to specific time periods.

## Contingency Plans and Operations

We have a documented and tested Contingency Plan and Disaster Recovery plan. These plans are tested at least annually or when there is a major change in the Rollbar environment. Lessons learned from the tests are compiled and are remediated by our engineering department.

## Risk Management

We engage in performing Risk Management on a regular basis and update the Risk Management document as items progress. However, the official Risk Management document is reviewed and updated on an annual basis. Our main goals in Risk Management are the continuation of the Rollbar service along with the confidentiality, integrity, and availability of customer data.

## Security Awareness and Training

All Rollbar employees, upon initial hire and annually, go through security awareness training. This training includes some of the best practices and guidelines from the security industry, and includes the mandated HIPAA training.

## Security Policies

We have the following security policies and will make them available for customer review under an NDA. All policies are updated as needed and reviewed on an annual basis.

* Acceptable Use of Data in Test
* Access Control Policy
* Backup Policy
* Contingency Plan
* Device and Media Control Policy
* Encryption Policy
* HIPAA Data Retention Policy
* HIPAA Security Review Policy
* Information System Activity Review Policy
* Rollbar Vulnerability and Patch Management Policy
* Security Awareness and Training Policy
* Security Responsibility Assignment
* Software Development Life Cycle
* System and Information Integrity Policy

## Responsible Disclosure Policy

Rollbar aims to keep our service safe for everyone, and data security is of utmost priority. If you are a security researcher and have discovered a security vulnerability in our service, we appreciate your help in disclosing it to us in a responsible manner.  For more information, please see our [Responsible Disclosure Policy](https://rollbar.com/about/responsible-disclosure-policy/).