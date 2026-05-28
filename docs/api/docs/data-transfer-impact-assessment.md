<!-- source: https://docs.rollbar.com/docs/data-transfer-impact-assessment.md -->

# Data Transfer Impact Assessment

Last updated on: March 15th, 2023

# Overview

This document provides information to help Rollbar customers conduct data transfer impact assessments in connection with their use of the Rollbar application, in light of the “Schrems II” ruling of the Court of Justice for the European Union and the recommendations from the European Data Protection Board.

In particular, this document describes the legal regimes applicable to Rollbar in the US, the safeguards Rollbar puts in place in connection with transfers of customer personal data from the European Economic Area, United Kingdom or Switzerland ("Europe"), and Rollbar's ability to comply with its obligations under the Standard Contractual Clauses ("SCCs").

# Identify your transfer:

Where Rollbar processes personal data governed by European data protection laws as a data processor, Rollbar complies with its obligations under its Data Processing Addendum available at Data Processing Addendum ("DPA"). The Rollbar DPA incorporates the SCCs.

**Q**: **Identify each country outside the EEA and not subject to an adequacy determination by the European Commission (“Destination Country”) where Vendor will store EEA Personal Data.**

**A**: United States of America

**Q**: **Will Vendor’s systems in the Destination Country be used to store any EEA Personal Data that constitutes sensitive personal data (as defined in Article 9 of the EU’s General Data Protection Regulation) for purposes of providing the services?**

**A**: Yes

# Identify the transfer tool relied upon:

Where personal data originating from Europe is transferred to Rollbar, Rollbar relies upon the European Commission's approved SCCs to provide an appropriate safeguard for the transfer. To review Rollbar’s Data Processing Addendum (which incorporates the SCCs) <a href="https://docs.rollbar.com/docs/data-processing-agreement">please visit Data Processing Addendum.</a>

# Schrems II Analysis and Supplementary Measures

**Q**: **Has Vendor conducted an assessment of the laws and practices of each country identified where data will be stored, as required by Clause 14 of the controller-to-processor Standard Contractual Clauses approved by the European Commission on June 4, 2021, and by the decision of the Court of Justice of the European Union in Schrems II?**

**A:** Yes

**Q:** **What was the outcome of the assessment for each Destination Country?**

**A:** **Key Findings FISA 702:**

* Government access to company data is “unlikely to arise because the data they handle is of no interest to the U.S. intelligence community.” Companies handling “ordinary commercial information like employee, customer, or sales records, would have no basis to believe US intelligence agencies would seek to collect that data.”

* There is individual redress, including for EU citizens, for violations of FISA section 702.

**A**: **Key Findings EO 12333**:

* EO 12333 does not on its own “authorize the U.S. government to require any company or person to disclose data.” EO 12333 relies on a statute, such as FISA 702, in order to collect data.

* Bulk data collection, the type of data collection at issue in Schrems II, is expressly prohibited under EO 12333.

**Q:** **Has Vendor implemented supplementary measures for EEA Personal Data in light of Schrems II and the subsequent Recommendation of the European Data Protection Board in response to that decision?**

**A:** Yes, **please see below**:

* Encryption of data in transit and at rest.
* Internal Rollbar access by authorized personnel
* Measures for ensuring ongoing confidentiality, integrity, availability and resilience of processing systems and services
* Processes for regularly testing, assessing and evaluating the effectiveness of technical and organizational measures in order to ensure the security of the processing
* **Security and certifications**: Additional information about Rollbar’s security practices and certifications are available on <a href="https://docs.rollbar.com/docs/security">Rollbar’s Security and Compliance Documentation</a>.

**Q**: **Has Vendor implemented a policy for responding to requests from a law enforcement authority, intelligence agency, and other government authorities in the Destination Country for EEA Personal Data? If so, please provide a copy of the policy.**

A: To obtain data from Rolllbar, law enforcement officials must provide legal process appropriate for the type of information sought, such as a subpoena, court order, or a warrant. Rollbar will promptly inform Customer and provide details of the same, to the extent legally permitted. Rollbar will not respond to any Third Party Request, without Customer’s prior consent except as legally required to do so or to confirm that such Third Party Request relates to Customer.

# Data Subprocessors

Here is a list of  <a href="https://docs.rollbar.com/docs/data-subprocessors">our data subprocessors.</a>

# Re-evaluate at appropriate intervals:

Rollbar will review the risks involved in cross border data transfers and the measures it has implemented to mitigate current and future risks periodically.