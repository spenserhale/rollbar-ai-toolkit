<!-- source: https://docs.rollbar.com/docs/rollbar-net-sdk-versioning-releases.md -->

# Rollbar .NET SDK Versioning & Releases

Developing software at scale requires a certain level of stability and predictability. At Rollbar, we aim to meet those requirements through the development of Long-Term Support (LTS) releases. These LTS releases follow a separate, enterprise-focused track of scheduled major version releases roughly every twelve months with support lasting eighteen months for each release. After release, the development of the LTS track stays feature-locked with work focused on bug fixes and patches.

We also want to keep the Rollbar main branch releases growing and gaining new features outside the LTS track. We will continue developing the main branch to include the latest and greatest features possible within Rollbar and the broader developer community.

[block:api-header]
{
  "title": "LTS package distribution via Nuget"
}
[/block]

The LTS flavor of the SDK modules will be distributed via the Nuget package management system using a naming schema similar to the main branch packages but with the prefix “LTS”. For example, LTS.Rollbar, LTS.Rollbar.Deploys, etc.

[block:api-header]
{
  "title": "Versioning"
}
[/block]

Rollbar version numbers reflect standard practices in semantic versioning (<https://semver.org/>). The releases in the main branch will be numerical (e.g., v3.0.0) while versioning in the LTS track will contain the suffix “-LTS” (e.g., v3.0.0-LTS). Previews of major and minor releases in each track may also contain additional suffixes for beta (“-Beta”) releases. Beta versions will typically be released for testing one month prior to the target release date for the corresponding release.

Each release’s build artifacts will be published within the GitHub repository’s [Releases page](https://github.com/rollbar/Rollbar.NET/releases). These artifacts include code quality analysis and links to documentation.

[block:api-header]
{
  "title": "Releases types"
}
[/block]

* *Major releases* - contain new features or changes in functionality and are reflected as changes in the primary version number (e.g., 1.x.x → 2.0.0). Upgrading between major releases will require some developer mitigation to adopt the new version. Common pain points in moving between versions will be documented on [docs.rollbar.com](http://docs.rollbar.com/) and linked from the release notes.
* *LTS releases* - The current LTS is always supported for eighteen months or up until six months after the next LTS release become generally available, whichever is longer. LTS major releases should be expected roughly every twelve months with a preview available a month before release target.
* *Regular releases -* The current major release (main branch) is always supported
  *Minor releases* - contain updates and new functionality that is backward compatible with the existing major release and are reflected as changes in the secondary version number (e.g., 1.0.x → 1.1.0). Upgrading on minor release version numbers should not expect developer effort to be required but may enable new functionality to be available for integration with the existing customer codebase. Dependency inclusion may be upgraded during minor version updates but are not required to be upgraded in deployment. Patches and bug fixes are carried forward in minor release updates
* *Patch releases* - are small changes made to address individual bugs and are reflected as changes in the tertiary version number (e.g., 1.1.0 → 1.1.1). These should apply with minimal-to-no developer intervention required unless explicitly stated in the release notes of the patch (e.g., security fix with a dependency may require attention).
* *Beta releases* - are made available prior to the production release of minor and major releases. The expectations for a preview release mirror those of the minor or major release it is meant to predicate. Preview releases may be modified at any time and are made available for community feedback on new feature development.

[block:api-header]
{
  "title": "Release frequency"
}
[/block]

* *Major releases* - represent larger changes in the codebase to enable new features and compatibilities. Major releases are usually preceded by a beta release.
* *Minor releases* - are released depending upon feature work requested by the community and within Rollbar. Minor versions may be preceded by a beta release.
* *Patch releases* - are made available as deemed necessary for feature and security functionality. Patches in the LTS track may be released as a preview.
* *LTS releases* - are made available roughly every twelve months. Each major release will be based upon an LTS candidate from the main branch based upon its stability and feature completeness
* *Beta releases* - should be expected roughly one month prior to the corresponding major or minor release

[block:api-header]
{
  "title": "Update paths"
}
[/block]

It is possible to begin development on the current major \[or LTS release]. If upgrading from a previous major release it is recommended to develop for each interstitial major release as well, e.g., upgrading from 1.x.x to 3.0.0 would recommend first upgrading to 2.0.0 (or the most latest release on the 2.x.x branch) and only once that is working to continue upgrading to 3.0.0.

[block:api-header]
{
  "title": "Support policy and calendar"
}
[/block]

Each LTS release is supported for 18 months from initial release or at least six months after the release of a new LTS version. Each major release is supported as long as it is the active release and then at least three months after the release of a new major version.

[block:parameters]
{
  "data": {
    "0-0": "3.12.0",
    "1-0": "3.0.0-LTS",
    "0-1": "Active",
    "1-1": "LTS",
    "0-2": "5/18/2020",
    "1-2": "August 2020",
    "0-3": "4.0 + 3 Months",
    "1-3": "February 2022",
    "h-0": "Version",
    "h-1": "Status",
    "h-2": "Release Date",
    "h-3": "Support Ends"
  },
  "cols": 4,
  "rows": 2
}
[/block]