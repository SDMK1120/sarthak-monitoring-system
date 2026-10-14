# Sarthak dashboard user personas

**Owner:** Business Analyst Agent. **Reviewers:** Product Manager, Security, UI/UX. **Status:** Proposed business analysis baseline. **Version:** 0.3. **Date:** 2026-10-14.

These personas describe the four confirmed user roles. Goals and working patterns are proposed for review rather than findings from user interviews. Scope assignments, geographic hierarchy, and learner-detail permissions remain open under [A-01, A-02, and A-22](assumptions.md). No demographic attributes or reporting relationships are assumed.

## PER-CM Cluster Manager

**Purpose:** Understand conditions at assigned centers and identify local operational and learning exceptions.

**Proposed scope:** Explicitly assigned centers/clusters, with district and region context only where permitted. A cluster is not assumed to equal a district.

**Goals:** Know which centers are onboarded and classified active/inactive; understand scheme coverage; inspect batch formation and utilization; identify attendance, assessment, completion, certification, and sync gaps.

**Primary tasks:** Review center summary; filter by scheme/category; inspect monthly batches and eligible enrollment; review learner participation at batch level; distinguish incomplete uploads from poor participation; prepare findings through a scoped report preview.

**Information needed:** Center lists, classification rule, scheme membership, capacity and enrolled seats, unique learners versus enrollments, attendance coverage, outcome denominators, certification source status, and last successful synchronization.

**Likely difficulties:** Missing attendance may resemble absence; an offline center may appear inactive; stale records can obscure recent improvement; utilization can be misleading without capacity.

**Proposed working pattern:** Frequent local exception review, with deeper investigation before discussing issues with operational stakeholders. No fixed review cadence is mandated.

**Success:** The CM can identify a center/batch requiring attention, explain the evidence and its freshness, and retain the same scope in a report preview. Correcting source records, starting sync jobs, or issuing certificates is outside this persona's dashboard workflow.

**Links:** Stories US-CM-01–06 in [user stories](user-stories.md); center, capacity, learning, and sync workflows WF-02–05 in [business workflows](business-workflows.md).

## PER-JDM Junior Divisional Manager

**Purpose:** Compare assigned operational areas and districts and investigate exceptions contributing to performance differences.

**Proposed scope:** Explicit assignments covering centers and/or geographic areas. The title does not establish access to all districts or a management relationship with particular CMs.

**Goals:** Compare equivalent district indicators; understand center/scheme coverage; identify underutilized batches; review learning participation and outcomes; judge whether stale data limits a conclusion.

**Primary tasks:** Select comparable districts and period; inspect summary indicators and coverage; drill into authorized contributing centers; compare scheme and batch views; review synchronization exceptions; open a scoped management report.

**Information needed:** District populations and denominators, center classification, scheme overlap, enrollment/capacity totals, attendance and outcomes, source freshness, and reporting cutoff.

**Likely difficulties:** Different populations or incomplete uploads can create misleading comparisons; simple averages of percentages can distort capacity use; summaries may not reconcile with center details.

**Proposed working pattern:** Periodic comparison supplemented by exception investigation. Formal escalation channels and service targets are not assumed.

**Success:** The JDM can explain a district difference using comparable metrics and authorized drilldowns, and report the result without dropping coverage limitations.

**Links:** Stories US-JDM-01–06; geographic workflow WF-06 and report workflow WF-07.

## PER-SDM Senior Divisional Manager

**Purpose:** Review broader assigned performance trends and identify regions or districts needing investigation.

**Proposed scope:** Explicitly assigned divisional/regional areas. Divisions and regions are not assumed interchangeable, and the title alone does not grant global visibility.

**Goals:** Understand regional coverage and trends; compare scheme distribution; review batch growth and capacity; assess learning outcomes and certification gaps; communicate evidence-based findings.

**Primary tasks:** Review regional indicators; drill into districts and centers; compare like-for-like periods and populations; inspect coverage/freshness; open a summary report with the same filters.

**Information needed:** Region-to-district mappings, distinct center counts, comparable learning denominators, weighted utilization, certification statuses, synchronization coverage, and cutoff/version metadata.

**Likely difficulties:** Aggregate metrics can hide exceptions; overlapping assignments can double-count centers; historical changes and delayed data can affect comparisons; a single composite score can conceal metric meaning.

**Proposed working pattern:** Summary review with targeted drilldown ahead of management discussions.

**Success:** The SDM can move from a regional finding to contributing districts, explain denominator and freshness limitations, and produce a matching report preview without relying on invented performance scores.

**Links:** Stories US-SDM-01–06; WF-06 geographic review and WF-07 report preparation.

## PER-SA Super Admin

**Purpose:** Review platform-wide monitoring coverage and identify systemic operational, learning, mapping, or synchronization issues.

**Proposed scope:** Platform-wide monitoring, subject to the approved role matrix. Learner-level detail and export rights require separate approval.

**Goals:** Understand overall center onboarding/activity; review schemes and geography; inspect batch and learning trends; identify unknown/unmapped populations and synchronization gaps; ensure consistent reporting.

**Primary tasks:** Review overall indicators; filter by region/district/scheme; inspect classification and mapping exceptions; compare outcomes; examine sync patterns; reconcile overall and scoped report previews.

**Information needed:** All monitoring families, data coverage, unmapped records, definitions, scenario/snapshot metadata, and source freshness.

**Likely difficulties:** Unknown values may be hidden in headline totals; failed sync can distort comparisons; overlapping schemes are not additive; a simulated role selector may be mistaken for security enforcement.

**Proposed working pattern:** Broad oversight and targeted investigation during platform or stakeholder review.

**Success:** The Super Admin can explain platform coverage, trace totals to authorized contributing records, and demonstrate all monitoring areas with explicit limitations. User provisioning, policy editing, operational writes, and infrastructure administration are outside this MVP persona.

**Links:** Stories US-SA-01–06; WF-02–07.

## Shared experience needs

All roles need visible assigned scope, retained filters, readable charts/tables, keyboard access, clear unknown/empty/error states, and independent activity and synchronization indicators. Shared acceptance AC-C01–09 in [acceptance criteria](acceptance-criteria.md) applies to every persona.

Persona responsibilities guide navigation and demonstration narratives; approved permissions must be recorded separately before implementation.
