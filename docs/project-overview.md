# Sarthak project overview

**Owner:** Product Manager Agent. **Reviewers:** Business Analyst, Solution Architect, Documentation. **Status:** Phase 2 documentation baseline; unresolved policies remain proposed. **Version:** 0.2. **Date:** 2026-10-14.

## Purpose

Sarthak is an Offline-First Learning Management System. Its dashboard is a centralized cloud-based monitoring and analytics platform that gives organizational stakeholders visibility into centers, schemes, batches, learner activity, learning outcomes, synchronization, and geographic performance.

The current project remains a demonstration and presentation prototype. It should communicate a realistic enterprise experience and a credible platform vision using synthetic scenarios. This Phase 2 delivery defines business and product documentation; it does not implement a dashboard or establish live LMS integration.

## Monitoring coverage

The dashboard covers total onboarded, active, and inactive centers; scheme-category-wise and scheme-wise centers; monthly batch creation and batch utilization; learner enrollments; attendance; assessments; course completion; certification status; synchronization status; district performance; and regional performance.

These areas are confirmed requirements. Detailed definitions, eligibility rules, thresholds, source availability, and access assignments are governed by [product requirements](product-requirements.md) and [assumptions](assumptions.md).

## Users

| Confirmed role | Proposed monitoring responsibilities |
| --- | --- |
| CM — Cluster Manager | Review assigned centers and clusters; investigate batch utilization, learner participation, and synchronization exceptions. |
| JDM — Junior Divisional Manager | Compare assigned operational areas and districts; identify underutilization and learning/operational exceptions. |
| SDM — Senior Divisional Manager | Review broader assigned divisional/regional performance and drill into contributing districts and centers. |
| Super Admin | Review platform-wide monitoring and data-quality coverage; inspect all agreed geographic and scheme dimensions. |

Role names are confirmed. The scopes above are proposals, not an approved hierarchy or permission matrix. Administrative write privileges are outside the monitoring MVP; Super Admin does not imply unrestricted learner-detail exports.

## Conceptual information flow

Offline LMS activity occurs at centers. After connectivity becomes available, records may synchronize to the centralized platform. The dashboard uses received records to provide authorized summaries, drilldowns, trends, and reports. The demonstration simulates this flow rather than claiming a working ingestion engine.

Local event occurrence time and cloud receipt time must remain separate. The cloud cannot reliably infer unuploaded attendance or learning activity. Every view should communicate its reporting period, data-as-of time, and relevant coverage/freshness limitations.

## Product boundaries

The dashboard monitors LMS operations and outcomes. Course authoring, batch creation, attendance entry, assessment delivery, certification issuance, and offline synchronization execution remain source-system responsibilities unless separately scoped. Showing certification status does not establish issuing authority or external certificate verification.

The [business goals](business-goals.md) explain stakeholder value. The [MVP scope](mvp-scope.md) bounds the prototype. The [requirements](product-requirements.md) specify observable behavior. The [assumptions](assumptions.md) identify decisions required before implementation.

## Phase 2 delivery

The five documents in this package are the requested Phase 2 business/product baseline. Earlier planning proposed an architecture-oriented Phase 2; the current user instruction defines this delivery's scope. Architecture, data schemas, interface specifications, technology selection, and implementation remain future work. No previously proposed phase gate is claimed complete by these documents.

## Subsequent architecture documentation

The architecture phase adds [system and low-level architecture](system-architecture.md), [high-level design](high-level-design.md), [module breakdown](module-breakdown.md), and [technical decisions](technical-decisions.md). These specifications extend the Phase 2 baseline. They do not implement the platform or resolve outstanding business policies, technology selections, or hosting decisions.
