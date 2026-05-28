<!-- source: https://docs.rollbar.com/docs/root-cause-analysis.md -->

# Root Cause Analysis

AI-assisted ability to Root Cause an error in Rollbar.

Root Cause Analysis (RCA) is an AI-assisted capability in Rollbar. It investigates errors across the projects and services you use to surface where a failure started, not only where it appeared. Instead of manually correlating logs across Rollbar projects, you start a single analysis: Rollbar aggregates related occurrences, follows cross-project signals, and returns a structured explanation of the probable root cause.

Root cause analysis is manually triggered in all accounts and will not be run automatically,  but if you would like to opt out of AI feature please reach out to <support@rollbar.com> with a request.

> 📘 RCA is currently experimental and in beta

***

## Requirements

* A paid Rollbar account with available AI credits.
* For best results: GitHub connected and a repository mapped to your project (see [Connecting GitHub](https://www.notion.so/Documentation-for-RCA-330510a20ff6803883b8d4b16d9fd29d?pvs=21)).
* Optional, for cross-project distributed tracing: [Rollbar JS SDK v3.1.x](https://github.com/rollbar/rollbar.js) or [Python Rollbar SDK v1.4.x](https://github.com/rollbar/pyrollbar) or higher (propagation IDs across projects; see [Cross-service correlation](https://www.notion.so/Documentation-for-RCA-330510a20ff6803883b8d4b16d9fd29d?pvs=21)).

***

## Connecting GitHub

For the best results, RCA uses your GitHub repository to add code context to the analysis. Connect GitHub and map a repository to your project before you run an analysis. For full setup steps, see [GitHub Integration](https://docs.rollbar.com/docs/github) in the Rollbar docs (Code Context).

If you open the Root Cause tab on an item before GitHub is connected, you see a Not Connected state with a link to start authorization. After you finish your source code setup, you are directed to return to the same item’s Root Cause tab automatically.

Note: GitHub is the only source control provider RCA supports today. Additional providers may be added in a future release.

***

## Manually running Root Cause Analysis

You can start an analysis from any item by opening that item’s details page.

### From the item detail page

1. Open an item in Rollbar.
2. Open the Root Cause tab or click **Analyze root cause** in the action bar at the top of the page.
3. Choose **Analyze root cause**.

### What happens during analysis

After you start a run, Rollbar walks through a pipeline before the model writes your report. It first finds every related occurrence you are allowed to see across Rollbar projects, using propagation IDs and session correlation so errors that belong to the same request or user session are treated as one failure story rather than isolated items. That cross-project picture is much richer when each service runs a current Rollbar SDK that forwards correlation fields. If RCA rarely links upstream and downstream items, upgrading the SDK is usually the highest-leverage fix (see [Cross-project correlation](#cross-project-correlation)).

Next the system spins up an isolated sandbox for the agent. It loads GitHub context from the repository mapped to the project, including file paths, structure, and code the model can cite. It loads Rollbar context: the item you started from, linked occurrences, snapshots, and other telemetry already in Rollbar. With that combined material, the agent runs the analysis.

While the job executes, the Root Cause tab shows a live progress stream that auto-scrolls to the newest line. If you scroll up to read earlier messages, auto-scroll pauses until you choose **Resume auto-scroll**.

Note: You do not need to refresh the page. When the run finishes, the three result sections appear in the same tab. The analysis also runs in the background if you navigate away. You can inspect other items or leave Rollbar and return later for the outcome.

***

## Viewing results

When analysis completes, the Root Cause tab presents three sections.

### Context

This section frames the error: what is failing in production, how it shows up in Rollbar, and the main signals you need to orient yourself (for example affected queries or services, variable payloads, messages, and stack traces). It answers what happened and what is known before the deeper diagnosis. Depending on the run, impact and reproduction notes may appear here or under **Root cause**.

### Root cause

This section explains why the error occurs: the error path or chain, proximate versus systemic causes, where it happens in code when GitHub is mapped, why the error is emitted, unknowns when the data does not pin down the caller or product intent, and occasionally a related but separate warning so high-volume noise is not mistaken for the real issue. Impact and reproduction sometimes live in this block instead of Context. Subheadings and ordering inside this section vary by error; headings may repeat or nest. Read the body under each heading, not only the title. Correlated item IDs or snapshots may appear inline.

### Probable solution

This section is the model’s recommended direction to fix or mitigate the issue. It is guidance, not a guaranteed patch or drop-in code. If RCA finds correlated items, the same RCA may appear from the Root Cause tab on other items that share the analysis.

### Indeterminate results

If the model cannot determine a root cause confidently, the tab shows **Root cause indeterminable** with a short explanation.

That outcome is common when the project has no usable source context. For example, GitHub may not be connected or the repository may not be mapped to the project ([Connecting GitHub](https://www.notion.so/Documentation-for-RCA-330510a20ff6803883b8d4b16d9fd29d?pvs=21)). It is also common when [source maps](https://docs.rollbar.com/docs/source-maps) for client-side code are missing or not uploaded correctly, so stack traces never resolve to real files in Rollbar. Improving source integration and source maps usually gives the model better material. After you fix setup, run **Retry analysis** again.

## Cross-project correlation

RCA ties occurrences together using propagation IDs included in Rollbar SDK payloads. That is how an analysis started on a frontend item can point to a backend service as the actual source.

### How it works

Rollbar SDKs attach a session id that can travel in an HTTP baggage header across services. When both the calling service and a downstream service use Rollbar, errors in each layer can share the same session identifier. During a run, Rollbar uses that shared identifier to find related occurrences across projects, including across different services, projects, or timestamps within the same user session.

### Model

Root Cause Analysis currently uses GPT 5.2 Codex for analysis and pricing. The model is subject to change without notice.

### SDK configuration

Rollbar currently supports JavaScript and Python for cross-project correlation. Use the SDK repositories for installation, configuration, and which release includes propagation and baggage behavior:

* [rollbar.js](https://github.com/rollbar/rollbar.js) (browser and Node-oriented JavaScript)
* [pyrollbar](https://github.com/rollbar/pyrollbar) (Python)

***

## Permissions and access

### Project-level access

RCA follows Rollbar’s existing project permissions. The run only uses projects your user account can access:

* If you have access to every project on the error path, you see full RCA output.
* If you are missing access to one or more projects, a banner explains that the RCA uses data from projects you cannot see. Ask your account owner for access; visible results stay within your user purview.
* If you only have access to the downstream (root-cause) project and the RCA was triggered by another user with full access, you may see an access restriction instead of full results. Ask your account owner for access.

Someone with access to all participating projects can re-run analysis for a complete result. Restricted users continue to see only data for projects they can access.

### Role restrictions

* View-only team members cannot start RCA; **Analyze root cause** is disabled for that role.

<br />

## Items list integration

### Agent task indicator

After RCA has run on an item, the Items list can show a  sparkle icon (similar to the Session Replay chip). Selecting the badge opens that item’s Root Cause tab.

### Filtering by agent tasks

To show only items with agent tasks (including RCA):

1. Open the filter panel in the Items list.
2. Choose **Agent Involved**.
3. Clear the filter to see all items again.

***

## Blocked states

### GitHub not connected

If GitHub is not connected for the project, the Root Cause tab shows Not Connected and a path to authorize. You cannot run analysis until GitHub is connected and the repository is mapped.

### Correlated project without GitHub

If RCA finds related occurrences in a project that does not have GitHub connected, those projects appear in a blocked state. You can:

* Connect GitHub for the missing project(s) without leaving the tab, or
* Continue without it. The run proceeds with connected projects only and notes missing code context.

### Project access restrictions

Users that do not have access to all projects associated with RCA are restricted from viewing RCA results.

See [Permissions and access](https://www.notion.so/Documentation-for-RCA-330510a20ff6803883b8d4b16d9fd29d?pvs=21).

***

<br />

## Data processed by Root Cause Analysis

When you trigger a Root Cause Analysis, Rollbar Resolve processes your error data using two external providers: a compute sandbox and a LLM agent.

### With GitHub connected

Sandbox receives:

* **The item snapshot:** a structured JSON file containing the error title, status, severity, environment, framework, occurrence body (stack trace, request data, custom context), recent comments, status history, and occurrence trends
* **Your source code:** the repository is cloned into the sandbox at the commit SHA associated with the occurrence, if available

LLM receives:

* The full contents of those files and item snapshot, which the LLM agent reads during its session. This includes the occurrence body and your source code

### Without GitHub connected

Sandbox receives:

* **The item snapshot:** a structured JSON file containing the error title, status, severity, environment, framework, occurrence body (stack trace, request data, custom context), recent comments, status history, and occurrence trends

LLM receives:

* The Item snapshot (same as above)

***

### What neither provider receives

* metadata fields from the raw occurrence body are stripped before the snapshot is built
* body.telemetry is excluded from the parameter summary

<br />

***

<br />

## AI Privacy and Data Retention

Your data is not used to train or improve models by the LLM agent. Data used for RCA is retained by the LLM agent up to 30 days.

***

<br />

## RCA and Rollbar Credits

RCA spends credits from your account balance each time a run executes.

When you start an RCA run, Rollbar reserves your default per-run limit against your balance for that run. That limit is the same maximum configured under **Account Settings → Agent Settings** (2,000 credits by default). If your current credit balance is at or below that per-run limit, you need to add credits or enable on-demand billing before you can continue using RCA. This same mechanism affects how many RCAs you and your team can run in parallel.  If there are too many analyses running in parallel and it reserves all of the account credits, the account will no longer be able to run analyses until the current running RCAs are complete.  On-demand usage will allow your account to go beyond the subscribed credit balance but will only charge the account for what credits are used.

Each run carries metadata you can review on the tab: the user who started the analysis, when it ran, and how many credits that run used. Every Root Cause tab also includes a credits component so you can see balance, per-run limits, and related controls in place while you work with RCA.

### Per-action limits

Account owners can cap spend per run under **Account Settings → Agent Settings**. The default limit is 2,000 credits (\~$0.60). If a run hits the limit, it will not complete the analysis until an account owner increases the limits.  Once limit is increased account owners can restart the analysis.

[Learn more about Rollbar Credits →](https://docs.rollbar.com/docs/credit-billing)