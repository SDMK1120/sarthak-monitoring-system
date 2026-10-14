# Sarthak dashboard wireframe descriptions

**Owner:** UI/UX Agent. **Reviewers:** Product Manager, Business Analyst, Frontend, Analytics, Reporting, Security, QA. **Status:** Proposed textual wireframes; no rendered screens or implementation. **Version:** 0.8. **Date:** 2026-10-14.

These low-fidelity descriptions give layout, content order, control placement, and interaction intent for all eight pages. They accompany [dashboard specifications](dashboard-pages.md), [UI strategy](ui-strategy.md), and [user flows](user-flows.md). Bracketed names are component placeholders, not working controls or displayed real data.

## Shared shell and responsive composition

The desktop review target is 1440 px, with a proposed 240 px navigation rail, 64 px top bar, and 24 px content inset. Exact sizing is provisional. Use a twelve-column content grid and logical reading order. The top bar contains Sarthak, assigned-context label, demo indicator where applicable, help, and account/current role. It does not claim authenticated identity in demonstration mode.

```text
[Top bar: Sarthak | assigned context | Demo data | help | account]
[Navigation rail] [Page title and role-specific subtitle          ]
[selected page  ] [Scope | period/cohort | as-of | data coverage   ]
[other pages    ] [Supported draft filters | Apply | Reset        ]
[              ] [Active filter chips and data-as-of notice       ]
[              ] [Summary widgets                               ]
[              ] [Charts with table alternatives                 ]
[              ] [Results table and contextual detail             ]
```

Do not display every possible date as one unexplained toolbar field. Show the page's primary time selector; cohort/as-of details are explicit in section labels and an expandable context panel. Data-as-of and important unknown/partial warnings remain visible. Internal snapshot IDs are available in Data details.

At 1024 px reduce chart/card columns before removing content. At 768 px use a collapsible rail and stacked panels. At 390 px use a labeled navigation drawer, one-column cards/forms, an expandable filter panel with visible applied chips, and full-width detail views. Wide tables scroll within their own region with accessible identities/actions; the whole page must not require horizontal scrolling.

## P-01 Executive Dashboard wireframe

```text
[Executive Dashboard | assigned-scope subtitle | Open report]
[Review context and freshness/coverage notice               ]
[Onboarded] [Active] [Inactive] [Unknown centers]
[Batch utilization] [Attendance + coverage] [Engagement]
[Course completion] [Certification] [Sync target health]
[Monthly batch creation chart] [Permitted area comparison]
[Center status / scheme coverage] [Observation exceptions]
[Contributing area/center table | table alternative/actions  ]
```

**Composition:** Four center-network cards across the full row; two three-card rows for capacity/learning/outcomes; trends and comparison in equal six-column panels; exception/table content below. Cards display counts or numerator/denominator and N/A reasons, not decorative unsupported trends. On narrow screens preserve the same order and prioritize scope/coverage before cards.

**Role variants:** Super Admin compares overall permitted regions/schemes; SDM sees assigned regions/districts; JDM sees assigned districts/centers; CM sees assigned centers/batches. Page name stays consistent while subtitle and comparison grain change. Unsupported global geography is never shown as an empty substitute for local scope.

**Interactions/states:** Active/Inactive opens the corresponding center-list detail population in P-02, while retaining original scope context. Chart table links provide keyboard-equivalent drilldown. Loading placeholders maintain card positions; unavailable numerator/denominator says N/A; a failed refresh retains only explicitly labeled older data.

## P-02 Center Monitoring wireframe

```text
[Center Monitoring | scoped result context | Report preview]
[Geography/unit | scheme/category | as-of | Apply/Reset     ]
[Onboarded] [Active] [Inactive] [Unknown + coverage]
[Classification bar] [Scheme membership bars + overlap note]
[List status tabs | search | sorting/result count           ]
[Center table: identity | geography | status | coverage     ]
[Selected center panel: Overview/Batches/Learning/Sync      ]
```

**Composition:** Summary/coverage first, compact breakdowns second, list toolbar and table as the main working area. A 4-column desktop side panel can inspect a selected center while an 8-column table remains visible; use a full-width detail view on narrow screens or for long tabs. The selected center and breadcrumb remain explicit.

**Controls:** Activity tabs filter the table with a visible detail label; top summary remains the pre-tab context. Scheme overlap and unknown geography have text notices, not omitted rows. Report preview selects RPT-001/002/003 appropriately. Batches/Learning routes to P-03; Sync to P-05.

**States:** No assignments differs from no matching centers; denied detail shows no restricted metadata; unsupported historical classification has a current-state explanation. Essential center labels wrap/accessibly expand rather than truncating silently.

## P-03 Batch Monitoring wireframe

```text
[Batch Monitoring | scoped context | Batch report preview    ]
[Creation period | stock/cohort details | supported filters  ]
[Created batches] [Seats/capacity + exclusions] [Enrollments]
[Distinct learners] [Utilization + comparable batch count]
[Monthly creation chart] [Comparable utilization bars]
[Batch table: code | center | course/scheme | lifecycle      ]
[Selected batch heading and retained context                ]
[Capacity/Enrollment | Attendance | Assessments              ]
[Completion | Certification                                 ]
[Selected tab breakdown, table, denominator and coverage     ]
```

**Composition:** Creation is a flow panel with its own period; capacity/enrollment are stock panels with explicit cutoff. The detailed tab area occupies the main width below the list or a navigable detail view. The tab row wraps/uses an accessible overflow control without hiding the selected state.

**Tab content:** Capacity shows comparable seats/capacity and unavailable/overcapacity; Attendance shows eligible opportunities and present/absent/unrecorded counts plus recording coverage; Assessments separates attempts, grading, and selected outcomes; Completion shows assignment eligibility/status; Certification shows independent supported issuance/status. Learner identities are only in a separately permitted detail view.

**States:** Zero capacity yields N/A, not a zero bar. No received attendance has a source/roster limitation, not a blanket absence claim. A source failure affects its panel explicitly rather than erasing all known batch context.

## P-04 Scheme Analytics wireframe

```text
[Scheme Analytics | category/scheme context | Report preview]
[Category | scheme | geography | period/cohort | Apply/Reset ]
[Center coverage: distinct memberships + overlap/unassigned ]
[Category bars] [Selected scheme center status breakdown    ]
[Batch-attributed outcomes: seats/enrollment/learning        ]
[Comparable outcome bars + denominators/coverage            ]
[Scheme table and selected population detail                ]
[Inspect participating centers | Inspect attributed batches ]
```

**Composition:** Two explicitly titled population sections prevent membership coverage from being mistaken for batch attribution. Horizontal bars suit long scheme names. The scheme table has separate center coverage and outcome columns with their units/coverage. Associated-center synchronization is a labeled supplementary panel, not scheme-specific run success.

**Interactions:** Selecting a category exposes permitted schemes; selecting a scheme offers participating centers in P-02 or attributed batches in P-03. Each action carries its own labeled population context. Open RPT-004 preserves those semantics.

**States:** Unassigned memberships and null attributed scheme remain separately visible. Overlapping coverage cannot be a misleading exclusive donut total; group totals need not equal overall distinct centers.

## P-05 Synchronization Health wireframe

```text
[Synchronization Health | received-data context | Report    ]
[Target evaluation as-of | observed run period | source      ]
[Healthy targets] [Degraded targets] [Unknown + coverage]
[Health classification] [Transfer/connectivity/freshness     ]
[Outcome timeline/chart + table alternative                 ]
[Center/target table: mapping | last success | coverage      ]
[Target detail: attempts | sanitized receipts | publication  ]
[Source limitations and explicit unavailable reasons        ]
```

**Composition:** Health target denominator and coverage are immediately visible. Outcome/connectivity/freshness controls occupy independent labeled groups. Run timeline/table does not replace the target summary. Detail includes last-success evidence, known source expectations, and processing/publication state only when supplied.

**Interactions:** Select center/target to view observed runs; return restores sorting/filter/focus. Refresh reads available cloud observations; there is no Force sync or Retry upload button. RPT-006 preview uses matching context and declared target/run grains.

**States:** Never observed, known never-successful, partial, failed, stale, and unknown need text labels. A missing local-backlog value is Unknown. Do not use connectivity color alone to identify failure or infer center inactivity.

## P-06 Reports wireframe

```text
[Reports | assigned reporting scope                         ]
[Catalogue: eight permitted templates | template summary    ]
[Selected template's filters | period/cohort/cutoff          ]
[Preview | permitted implemented exports | proposal schedule]
[Preview title, metadata, scope, coverage and data-as-of      ]
[Template-specific summary, charts, and result tables         ]
[Run history | future schedule design/history                ]
```

**Composition:** Catalogue selection is a compact list/grid; preview is a full-width reading workspace. On wide screens a 3-column template/filter rail can sit next to a 9-column preview; narrow screens show selection/filter panels before preview. Export choices name availability and output grain. RPT-002/003 locked activity is visible.

**Schedule proposal panel:** Template/scope, recurrence/timezone, period/cutoff rule, registered recipients with scope intersection, freeze/wait/expiry behavior, and Review proposal. A footer says Not active/No delivery configured in demo mode. Schedule state, run state, and delivery state are separate views when a future implementation supplies evidence.

**States:** Preview-only, empty, failed/expired generation, changed snapshot, oversized partial result, and denied access have explicit messages. Returning to the dashboard does not silently select latest data. Candidate PDF/XLSX/CSV exports remain defined in [reporting strategy](reporting-strategy.md), not created here.

## P-07 User Management wireframe

```text
[User Management | permitted directory scope | mode label   ]
[Role | account state | permitted area/unit | scoped search  ]
[Scoped directory counts | read-only/admin capability cue    ]
[Users: label | allowed roles/scopes | account state          ]
[Selected user access detail and permitted change history    ]
[Optional proposed assignment form: role/scope/dates/reason  ]
[Current vs proposed access | report/schedule impact          ]
[Cancel | Review proposal | clear Not saved/Not sent notice  ]
```

**Composition:** Directory working table dominates. Selected-user detail can open a drawer; multi-field permission changes use a dedicated readable form rather than inline row editing. Review separates current access, exact proposed targets, effective dates, and impact. Administrative context has no monitoring date/scheme filters.

**Controls:** Only approved directory data appears. A read-only viewer sees no write control. Super Admin still needs an explicit management capability; other roles get no default page entry. Target-scope selections are restricted; blank target cannot mean all centers. Onboarding handoff never displays password/token controls or a false invitation-sent state.

**States:** Capability denied, scoped empty directory, disabled account, pending proposal, assignment-version conflict, validation error, canceled draft, failed save, and future verified save. Self-elevation/privileged change policy is pending A-27; the review design does not implement it.

## P-08 Settings wireframe

```text
[Settings | personal context / permitted policy context      ]
[Personal Preferences | Report Preferences | Policy reference]
[Supported presentation fields | current value | sample      ]
[Approved reporting timezone separately visible              ]
[Unsaved changes | Cancel | Preview or future verified Save   ]
[Read-only policy values, status, and data definition details ]
[Optional permitted proposal: new value | impact | reason     ]
[Review proposal | Not active policy notice                   ]
```

**Composition:** Use a section list beside a readable form on wide screens and stacked section selector/form on narrow screens. Form width is restrained even when the workspace is wide. Personal preferences and platform policy never share an unlabeled Save action.

**Controls:** Density/date/number/display timestamp choices have a local sample. Report timezone/calendar remains a separately identified business policy. Unsupported theme/language controls are omitted or marked proposals. Policy reference fields are read-only unless a separately approved proposal action exists. No raw secret, cloud deployment, source credential, or infrastructure controls are included.

**States:** Policy pending rather than guessed defaults; personal unsaved draft; nonpersistent preview; future save validation/conflict/error; proposed policy not active. Dirty-form navigation offers continue/discard. A canceled policy draft does not alter KPI/report definitions.

## Overlay focus and review checklist

Data-definition/coverage panels open from adjacent named controls and return focus on close. Modal dialogs contain focus, support Escape where safe, and do not hide essential validation; nonmodal panels remain ordinary navigable content. All rows/charts/actions have keyboard-accessible equivalents. Synthetic values are labeled and never mistaken for measured organization results.

Review each page at the four target widths, each role's permitted navigation, all eight KPI/coverage labels, report templates, scoped drilldowns, compatible filter persistence, and unknown/error states. User Management/Settings need separate permission/business approval. These descriptions are wireframe artifacts only; no visual screenshot, browser validation, accessibility conformance, or working control is claimed.
