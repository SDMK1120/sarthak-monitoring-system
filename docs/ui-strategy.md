# Sarthak UI and UX strategy

**Owner:** UI/UX Agent. **Reviewers:** Product Manager, Business Analyst, Security, Frontend, Reporting, Analytics, QA. **Status:** Proposed visual and interaction direction. **Version:** 0.8. **Date:** 2026-10-14.

## Experience principles

Make stakeholder questions, assigned scope, and evidence quality clear before visual complexity. Each indicator exposes its population, denominator, reporting time, and source limitation through readable labels/details. Preserve the distinctions established by [metric definitions](metric-definitions.md): unknown versus zero, offline versus inactive, attendance coverage versus absence, completion versus certification, and healthy targets versus successful runs.

The prototype is a demonstration. Role selectors, unsupported export/scheduling actions, and nonpersistent user/settings changes are labeled at the point of use. A successful-looking mock must not imply identity verification, saved access, delivery, or live LMS integration.

## Navigation and role landing

Primary navigation order is Executive Dashboard, Center Monitoring, Batch Monitoring, Scheme Analytics, Synchronization Health, Reports, then permission-dependent User Management and Settings. The same ordering and page names are used across roles. A selected page has a visible active state and accessible current-page indication.

| Role | Landing emphasis | Suggested shortcuts |
| --- | --- | --- |
| Super Admin | Overall permitted coverage, region/scheme distribution, systemic unknowns | Scheme Analytics, Region Comparison, Synchronization Health; User Management only with directory authority |
| SDM | Assigned regional/divisional trends and district contributors | Regional indicator comparison, contributing centers, regional report preview |
| JDM | Assigned district comparisons and center exceptions | District comparison, center detail, batch utilization, district preview |
| CM | Assigned centers/batches and participation/source exceptions | Attendance detail, center sync observations, center performance preview |

Navigation is a usability aid. Future enforced authorization checks every direct link and action. No title grants global visibility, directory authority, exports, scheduling, or learner details. Unsupported comparison widgets are replaced by permitted center summaries with the reason visible.

## Shared layout and context

Use a persistent left navigation on wide screens, a top application bar, and a main content column. The top bar shows Sarthak, assigned-context summary, current account/role, help/context, and a Demo data label in the prototype. A real identity mode does not offer an unrestricted role picker; demonstration mode uses a clearly separate Demo role selector.

Monitoring content begins with page title/question, active scope, event period/assignment cohort and applicable stock as-of time, then data-as-of and source coverage. User-facing labels emphasize dates and completeness; technical snapshot/definition IDs are available in a data-details panel for reconciliation rather than dominating everyday tasks.

Use breadcrumbs on drilldown: assigned overview → permitted area → center → batch/detail. Region/district/block breadcrumbs require approved mappings; cluster/division is independent. Detail drawers preserve overview context for short reviews; substantial batch/center tabs have clear headings and a Back to results action. Return restores filters, selected row, sorting, pagination, and focus where still authorized.

P-07 User Management and P-08 Settings deliberately leave the monitoring filter context. Show a distinct administrative/personal section heading and applicable directory/policy scope; retained monitoring dates or scheme chips must not influence user grants or preference changes.

## Proposed visual direction

Branding has not been supplied. Propose a restrained light enterprise interface: white panels, pale neutral page background, dark text, navy navigation, and a blue interaction accent. This is a reviewable design direction, not Schoolnet branding or a finalized brand system.

| Design element | Proposed convention |
| --- | --- |
| Typography | Legible sans serif; 16 px body, 14 px secondary text, 24–28 px page heading, 28–32 px card value; avoid tiny essential metadata |
| Spacing | 4 px base with 8/16/24 px rhythm; consistent card padding and section gaps |
| Grid | Twelve-column wide composition, six-column intermediate, single-column narrow; content order stays logical |
| Components | Modest borders, consistent corners, subtle elevation for overlays; tables and definitions take priority over decoration |
| Status | Text/icon plus tone: success green, known issue red, stale/partial caution amber, unknown neutral; offline is a factual state without automatic red failure styling |
| Density | Comfortable default; optional compact table presentation never removes required labels or keyboard targets |
| Motion | Minimal transitions; respect reduced-motion preference; no animated KPI count-ups obscuring exact values |

Colors/tokens and accessible contrast require review before final specification. No rating color, red/amber/green target boundary, or rank is applied to learning rates without an approved business policy. Positive numeric direction alone does not prove a favorable outcome.

## Widgets and charts

Metric cards contain label, value/unit or N/A, supporting numerator/denominator or count, period basis, coverage cue, and definition access. Trend deltas appear only for comparable periods/definitions with sufficient history; otherwise say comparison unavailable. Deltas distinguish percentage-point change from percent change.

Use column charts for monthly batch creation, horizontal/grouped bars for geographic/scheme comparisons, and separately labeled categorical bars for classification/outcome states. Use lines only where a valid time series exists. Keep distinct grains separate; overlapping scheme populations are not a parts-of-whole chart. Avoid three-dimensional charts, unapproved scores, dual-axis comparisons, and mandatory maps without validated geography.

Each chart has a title stating population/period, clear axes/units, category labels, legend where needed, value/denominator details, coverage note, and a table alternative. Selecting a mark provides an explicit Inspect/Filter to action; focus/keyboard can access the equivalent table link. Do not rely on hover for essential data or create hidden filter changes.

Lists and tables show distinct record grain, sortable column state, selected filters, result count, bounded pagination, and useful empty messages. Summary totals use the full authorized filtered population, not only the displayed page. Horizontal overflow is confined to wide tables; critical identity/status columns remain discoverable without clipping labels.

## Filter and time behavior

1. Maintain a validated context separate from draft selections. Apply commits compatible changes together; the prior result stays explicitly labeled until the new context finishes loading.
2. Scope choices expose only authorized options. Changing a parent area clears incompatible descendant filters with a visible explanation. Block filters are unavailable or labeled unmapped when A-24/source mappings are unresolved.
3. Carry compatible monitoring filters and the selected data publication across P-01–06. Explain and remove unsupported filters when changing pages/templates. Detail-only status filters label their narrower table population and do not silently redefine the cohort denominator.
4. Separate event period, assignment cohort, stock as-of, and received-through time. Report/template labels show which date each section uses; display timezone preferences do not silently alter reporting calendar grouping.
5. Reset restores that role's approved default context within assigned scope. Back/deep links restore validated state, not unauthorized cached data. Changing demo role clears selections incompatible with the new assigned population.
6. New data available offers Refresh to latest received data. Keeping a prior view preserves its snapshot; refreshing updates all dependent metrics coherently. In-flight obsolete results cannot overwrite newer context or mix publications.

Scope or permission revocation clears affected cached content and routes to an explicit access/session state in an enforced implementation. A failed refresh may retain an explicitly stale prior result with an error; it must not claim a successful latest view.

## States and accessible behavior

| State | Required experience |
| --- | --- |
| Loading | Stable labeled placeholder/progress; preserve context and announce completion without forcing focus |
| No assigned scope | Explain that no monitoring area is assigned; avoid showing overall organization values |
| Empty valid result | State no matching records and offer filter reset; distinct from failed data retrieval |
| Unknown/unavailable | Show reason and N/A where appropriate; preserve known values and coverage |
| Partial/stale | Keep visible age/coverage warning near affected values; separate sync and business status |
| Error | Explain failed action, retry received-data retrieval where safe, and preserve the last valid context |
| Access/session denied | No restricted-value preview; clear sensitive prior content and provide an appropriate return/sign-in path |
| Proposed/demo change | Show draft impact and Not saved/Not sent; no false success toast |
| Save conflict/failure | Retain editable input safely, show field/conflict reason, revalidate before a future retry |

Propose WCAG 2.2 AA as the eventual accessibility target, subject to agreement and implementation validation. Specify meaningful headings/landmarks, keyboard order, visible focus, sufficient contrast, descriptive controls, chart/table alternatives, and status text. Drawer/dialog entry focuses its heading/first relevant control; Escape and Close return focus to the invoker; modal focus containment applies only to actual modal interactions. Validation links errors to fields and presents an error summary.

Use inclusive text: “No attendance record received” rather than “Absent” when evidence is missing; “Pending source certification” rather than “Not completed.” Show units, full dates on demand, and explicit timezone. Essential status and coverage is never color-only or tooltip-only.

## Responsive design targets

Proposed design review widths are 1440 px desktop, 1024 px intermediate, 768 px tablet, and 390 px narrow. These are design targets, not measured browser support. At narrower widths the side navigation becomes a labeled menu/drawer; filter panels expand on demand with active chips visible; cards reorder into fewer columns in the same reading order; detail drawers become full-width views. Chart/table alternatives and critical actions remain available.

User/admin forms use a single readable column on narrow screens; Save/Cancel must not obscure validation or content. Do not depend on hover interactions or produce page-wide horizontal scrolling. Long center/scheme names wrap or have an accessible full-label affordance.

## Scope and future review

The requested documents describe experience only. No React, HTML/CSS, image asset, design-tool prototype, authentication, provisioning, preference persistence, or reporting automation is delivered. User Management and policy settings require A-27 permission/lifecycle specifications beyond the earlier monitoring architecture. Existing [acceptance criteria](acceptance-criteria.md) covers monitoring; the page/flow/wireframe reviews add proposed administrative and settings checks without claiming new business requirements are approved.

Before implementation, validate page access/actions with Security/BA, widget definitions with Analytics, report flows with Reporting, visual identity/language with PM, responsive/accessibility targets with QA, and admin policy impact with Architect. Review all four role journeys, all eight pages, edge states, and context/snapshot consistency.
