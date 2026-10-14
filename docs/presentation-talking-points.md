# Presentation talking points

Use these notes with the [demo guide](stakeholder-demo-guide.md). Present the implemented application as a working prototype of the cloud monitoring vision. The synthetic cutoff is 30 September 2026, 17:30 IST; it is not the current time or evidence of live LMS synchronization.

| Slide or screen | Main message | Evidence to show | Question for stakeholders |
| --- | --- | --- | --- |
| 1. Vision and context | A centralized view can connect offline-first learning operations to organizational oversight | The three implemented modules and the broader documented LMS platform vision | Which operational decision most needs this visibility? |
| 2. Executive overview | Network size, activity and batch activity share a consistent published scope | 84 centers: 68 active, 11 inactive, 5 unknown; region and scheme filters | Is this the right summary for leadership reviews? |
| 3. Metric transparency | Measures need clear population, time basis and missing-data coverage | April–September: 288 created batches and 6,935 attached enrollment records; fixed-stock utilization 3,640/5,320 = 68.4% | Who approves these definitions for operational use? |
| 4. Center evidence | A summary finding can be traced to a specific center | Geographic/status drilldown, center profile, recorded activity history, batch capacity and sync targets | What context should a CM or JDM see when reviewing a center? |
| 5. Offline-first sync | Connectivity, transfer outcome and published data health represent different facts | 168 expected targets: 32 healthy, 102 degraded, 34 unknown; exact timestamps and reasons | What evidence and freshness policy will the real LMS provide? |
| 6. Alerts and escalation | Evidence can support a recommended response without treating unknowns as failures | Target-2: failed observation aged 4 hours, default JDM recommendation; edit SDM to 3 hours and preview | Which roles, deadlines and delivery channels should be approved? |
| 7. Architecture | The interface and services are separable, with shared validated contracts | [Implemented architecture diagram](architecture-summary.md); React/Fastify/in-memory fixture; optional PostgreSQL readiness | What integrations and hosting constraints shape the next stage? |
| 8. Roadmap and decision | The next investment should make the demonstrated decisions trustworthy with real data | [Future roadmap](future-roadmap.md), role scope, persistence, ingestion, learning analytics, reporting and qualification gates | Which stage should be funded and who owns acceptance? |

## Suggested opening

“Sarthak is designed for offline-first learning. This demonstration shows how a centralized dashboard could give leadership and operational managers a shared view of centers, batches and synchronization evidence. Today we are using a fixed synthetic snapshot so every finding can be reproduced.”

## Role-specific emphasis

- **CM:** Identify a center observation, distinguish activity from sync, and inspect the underlying target evidence.
- **JDM:** Compare district contributors, find an actionable exception, and review an escalation recommendation.
- **SDM:** Assess regional coverage, missing evidence and consistent measures across districts.
- **Super Admin:** Examine network scope, governance, policy controls and the future service architecture.

These are presentation narratives. The current application has no login, role switching or enforced access scope.

## Common questions and accurate answers

| Question | Response |
| --- | --- |
| Is this live data? | No. It is an invented, fixed published snapshot. Refresh reloads the same evidence. |
| Does inactive mean offline? | No. Recorded center activity is independent of device connectivity and sync health. |
| Is an unknown target a failed sync? | No. Missing evidence remains unknown and informational. Known delivery/freshness problems are degraded. |
| Are 6,935 enrollments unique learners? | No. They are enrollment records attached to batches created in the selected period. |
| Did the preview notify the SDM? | No. It calculated a request-local recommendation and did not persist a policy or send a message. |
| Can we export or schedule reports? | The eight-report strategy is documented. Exports, scheduling and delivery are not implemented. |
| Does the database readiness error invalidate the demo? | Monitoring uses the synthetic repository. Database readiness is a separate integration check; PostgreSQL-backed business storage is future work. |
| Is it ready for production deployment? | This review qualifies a local demonstration. Real identity, scoped authorization, ingestion, persistence and operational qualification still need delivery. |

## Suggested close

“The prototype demonstrates a connected path from network summary to center evidence and synchronization response. The next decisions are to approve the operational definitions, role scopes and source integrations, then implement and qualify the service-backed platform.”
