# Stakeholder demonstration guide

**Project:** Sarthak-Monitoring-System. **Audience:** CM, JDM, SDM and Super Admin stakeholders. **Duration:** approximately 11 minutes. **Scope:** the implemented Executive Dashboard, Center Monitoring and Synchronization Monitoring demonstration.

The application presents a centralized monitoring view of an offline-first LMS. Every center, learner enrollment, batch and synchronization observation is synthetic. Present the four roles as proposed responsibilities and viewing needs; this application does not implement role login, assigned scopes or RBAC enforcement.

## Preflight

Run these commands from the repository root before the presentation, with compatible Node/npm installed. The workspace accepts Node 20.19+ within major 20, or Node 22.12+; npm 10+ is required.

```text
npm ci
npm run setup:env
npm run check
npx playwright install chromium
npm run test:demo
```

Environment setup copies missing templates without overwriting existing configuration. Review existing configuration if it was customized. The compiled browser tests manage their own temporary servers; keep ports 3001 and 4173 free while running them. Run these checks before starting the presentation server. Development browser regression checks remain available through `npm run test:browser` on 3001/5173. The synthetic modules do not require a running PostgreSQL database; the API still requires valid configuration from its environment template.

For the presentation, start the built application:

```text
npm run demo
```

Open **http://127.0.0.1:4173/**. Fastify serves the API on port **3001**; the frontend preview forwards `/api` requests to it. Keep the command running throughout the demonstration. Stop the application with **Ctrl+C** when finished. This is a local presentation command, not a cloud deployment.

`npm run demo` performs missing-environment setup and a fresh build before launching the two processes. After a successful build, `npm run demo:serve` reuses that built output for a faster local restart. It does not apply unbuilt source changes. Demo mode uses the local API environment; it does not force production database configuration.

For development, use `npm run dev` and open **http://127.0.0.1:5173/** instead. Run one mode at a time because both use API port 3001. If environment ports were changed, use the addresses printed by the processes and ensure the frontend proxy points to the API.

Open these tabs before presenting: `/`, `/centers`, `/synchronization`, and `/synchronization/targets/target-2`. Reset filters on the three overview pages. Reload any target detail opened during a previous preview. Browser zoom at 100% is a useful starting point; charts have **View data table** alternatives.

## Reference snapshot

The published snapshot is **demo-2026-09-v1**, with an evidence cutoff of **30 September 2026, 12:00:00 UTC**, displayed in synchronization views as **30 Sept 2026, 17:30:00 IST (UTC+05:30)**. The default executive creation period covers April–September 2026: 1 April inclusive to 1 October exclusive.

| Checkpoint | Expected unfiltered value |
| --- | --- |
| Center network | 84 total; 68 active; 11 inactive; 5 unknown |
| Executive creation cohort | 288 batches; 6,935 enrollments |
| Current batch utilization | 68.4% at the fixed snapshot |
| Expected synchronization targets | 168; two per center |
| Target health | 32 healthy; 102 degraded; 34 unknown |
| Health and classification coverage | 19.0% health; 79.8% classification coverage |
| Primary alerts | 119: 17 information, 85 warning, 17 critical |
| Default escalation thresholds | CM 0 hours; JDM 2; SDM 6; Super Admin 24 |

Refresh reloads this publication. It does not advance the clock, obtain a new source feed or trigger LMS synchronization. Alert ages are measured at the fixed evidence cutoff, not at the wall-clock time of the presentation.

## Eleven-minute presentation script

| Time | Presenter action | Suggested explanation and expected evidence |
| --- | --- | --- |
| 0:00–1:00 | Open `/`; point to the synthetic-data notice and stock snapshot. | “Sarthak operates offline-first. This prototype shows the centralized view stakeholders would use after evidence is received and published. Today's records are invented so we can demonstrate the experience reproducibly.” |
| 1:00–2:30 | Read the center and operational cards. Open **View data table** beneath a chart. | Verify 84 / 68 / 11 / 5. Unknown activity is separate from inactive. The default creation cohort has 288 batches and 6,935 enrollments; these are enrollment records, not unique learners. Utilization is 68.4%, weighted by comparable capacity at the snapshot. Scheme membership can overlap; scheme bars cannot be added into a network total. |
| 2:30–3:15 | Change **Event period** to **Last month**, click **Apply filters**, then **Reset filters**. | The creation flow changes; center stock and current utilization retain their snapshot basis. Draft selections take effect only after Apply. Reset restores April–September and the full network. |
| 3:15–4:30 | Open **Center monitoring**. Click **View inactive centers**; then **Reset filters**. In geographical analysis click **Show region North Region**, then **Show district District 01**. | Inactive filtering narrows the directory while the status comparison still shows the full geographic/search scope before the activity filter. North Region has 28 centers; District 01 has 7. These are illustrative geographic filters, not enforced role permissions. |
| 4:30–5:30 | Open **Sarthak Center 01**. Review profile/activity history, batches and synchronization targets. Follow a target link if useful; otherwise return with **Back to centers**. | Center 01 has unknown recorded activity. Its target-1 has missing evidence while target-2 has a known failed transfer. These observations do not turn the center into “inactive.” Batch details cover all recorded creation dates, unlike the executive creation-period cohort. |
| 5:30–6:15 | Reset center filters. Select **Region: North Region**, **District: District 02**, **Scheme: Career Readiness**, **Activity status: Active**; enter `SAR-002` in **Search centers** and click **Apply filters**. Open **Sarthak Center 02**, then **Back to centers**. | The intersection identifies Center 02. Its detail shows six batch records. Back restores the listing's applied filters and URL context; direct detail URLs also survive browser reload. |
| 6:15–7:30 | Open **Synchronization monitoring**, click **Reset filters**, and read health/coverage cards. Click **Monitor failed transfers**. | Check 168 expected targets and 32 / 102 / 34 classification. Health includes unknown targets in the denominator. The failed-transfer view contains 17 latest failed observations; it is not a historical failed-attempt count. The demo cadence is 24 hours and pending deadline 2 hours. Connectivity alone does not determine health. |
| 7:30–8:15 | In the failed view set **Region: North Region**, **District: District 01**, **Center: Sarthak Center 01** and click **Apply filters**. Open **target-2**. | Inspect the exact last observation and last successful sync: 30 Sept 2026 at **13:30:00 IST (UTC+05:30)**. The failed observation is four hours old at the publication cutoff and the default recommended recipient is JDM. A prior success does not erase the latest failure. |
| 8:15–9:15 | Use **Back to synchronization**. In **Escalation rules**, change **SDM after hours** from 6 to 3, then click **Preview escalation**. | The same four-hour failed observation now recommends SDM in **Request-local preview results**. Default CM/JDM/SDM/Super Admin thresholds are 0 / 2 / 6 / 24. This is a policy preview; it neither saves a policy nor sends a notification. |
| 9:15–10:00 | Open the preview target's detail, observe **Default-rule alert recommendation**, return, and click **Reset escalation rules**. If desired, use the unfiltered failed view to demonstrate **Next preview page**. | Target detail evaluates the default policy, so target-2 still recommends JDM. Preview thresholds are not carried into the detail API or persisted. Reset restores SDM to 6 and clears preview output. Preview pagination is local to the evaluation. |
| 10:00–11:00 | Reset synchronization filters and open `/synchronization/targets/target-1`. Close with the role narratives below. | Missing evidence has no known failure timestamp, no inferred outage age and no recipient escalation. The demonstrated flow connects organizational monitoring with center and target investigation. Explain the planned capabilities without presenting them as delivered. |

The preview is cleared when you leave the page. If the default-rule detail round trip already cleared it, **Reset escalation rules** still restores the default editor values. For a shorter presentation, omit Center 02 and the second preview page.

## Role narratives

| Proposed stakeholder | Demonstration emphasis |
| --- | --- |
| CM — Cluster Manager | Inspect individual centers, distinguish recorded activity from sync issues, and review target evidence. |
| JDM — Junior Divisional Manager | Compare district coverage and review recommended escalation of known failed/partial or overdue observations. |
| SDM — Senior Divisional Manager | Review regional operations, evidence coverage and the illustrative escalation ladder. |
| Super Admin | Review the overall network, scheme coverage, monitoring architecture and proposed policy governance. |

These narratives do not establish implemented access grants, geography assignments, notification recipients or a role hierarchy. There is no login or role switch to demonstrate.

## Recovery and backup routes

| Situation | Presenter recovery |
| --- | --- |
| A filtered view differs from the reference numbers | Click **Reset filters** on that module. Executive and center/sync views use different batch time bases; do not compare their enrollment totals as though they share a cohort. |
| A request fails | Use **Try again** after confirming both local processes are running. Keep the current URL to preserve the attempted scope. Reload only after restoring the API connection. |
| A pasted URL contains invalid filters | Use **Reset filters**. The error is intentional validation; the application does not silently broaden the requested scope. |
| A page number is beyond available results | Use **Go to first page** or **Go to first alerts page**, as applicable. |
| Escalation thresholds are rejected | Restore increasing values: CM 0, JDM 2, SDM 6, Super Admin 24. Use SDM 3 for the successful preview example. |
| The API is live but database readiness is 503 | The synthetic dashboard can still work. `/api/health/ready` checks PostgreSQL independently; do not claim database ingestion is working. |
| A process cannot bind its port | Stop the other project session using that port; do not start dev and demo modes together. |
| Navigation is interrupted | Use the direct bookmarks in [Feature walkthrough](feature-walkthrough.md), then Reset before continuing. |

Use the currently running frontend origin for backup routes. Browser tests can produce local screenshots under `test-results/`; screenshots are secondary presentation material and do not replace an interactive demonstration or prove live operational data.

## Expectation boundaries

Delivered: the three monitoring modules, typed/validated APIs, synthetic shared facts, filter intersections, charts/table alternatives, geographic and target drilldowns, exact sync timestamps, primary alert recommendations, request-local policy evaluation, and automated checks.

Planned: real offline ingestion, persistent domain data and policy/audit storage, authentication/RBAC, learner attendance/assessment/completion/certification modules, exports/scheduled reports, actual notification delivery, and cloud deployment. PostgreSQL connection scaffolding and design documents do not mean these modules are implemented. See [Feature walkthrough](feature-walkthrough.md) for the module inventory.
