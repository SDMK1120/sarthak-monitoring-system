# Sarthak dashboard business goals

**Owner:** Product Manager Agent. **Reviewers:** Business Analyst, Analytics, Reporting. **Status:** Phase 2 documentation baseline. **Version:** 0.2. **Date:** 2026-10-14.

The dashboard should help CM, JDM, SDM, and Super Admin users understand the state of their authorized operations and identify where attention is needed. The prototype demonstrates that value; it does not claim measured operational or learning improvements.

## Goals and demonstration success

| ID | Business goal | Stakeholder value | Observable prototype success |
| --- | --- | --- | --- |
| BG-01 | Establish central visibility into the center network | Understand onboarded centers and active/inactive distribution | Users inspect scoped counts and drill into center lists; unknown classifications are visible. |
| BG-02 | Explain scheme coverage | Compare centers by scheme category and scheme | Scheme filters and grouped counts reconcile with distinct centers under the same scope. |
| BG-03 | Monitor batch creation and capacity use | Identify changes in batch formation and underutilization | Monthly creation trends and utilization views show the chosen date basis, capacity denominator, and missing capacity. |
| BG-04 | Track learner participation | Understand enrollment and attendance across batches and locations | Users distinguish unique learners from enrollment records and inspect attendance coverage. |
| BG-05 | Monitor learning outcomes | Identify assessment, completion, and certification gaps | Outcome views expose eligibility and status definitions, with linked scoped drilldowns. |
| BG-06 | Make offline-data limitations understandable | Separate operational concerns from incomplete uploads | Users distinguish a known inactive center, an offline device, stale observations, and failed sync. |
| BG-07 | Support district and regional review | Identify areas requiring investigation | Comparable geographic summaries include counts, denominators, reporting periods, and freshness. |
| BG-08 | Provide consistent management communication | Share the same findings across roles and reporting views | Dashboard and report previews agree for identical filters and snapshot cutoff. |
| BG-09 | Present an enterprise platform vision | Explain product experience and future cloud oversight | A repeatable synthetic walkthrough covers all four roles and all confirmed monitoring areas. |

## Evaluation principles

Prototype acceptance is based on journey coverage, understandable definitions, reconciled numbers, appropriate role scope, and repeatability. Each confirmed monitoring area must have an MVP screen or section and measurable acceptance in [product requirements](product-requirements.md).

Future operational measures could include time needed to investigate exceptions, reporting preparation effort, and freshness coverage. Establish baselines and targets with stakeholders before evaluating live impact. No numeric improvement target is assumed in this documentation.

## Decisions the product should support

- Which centers or locations require investigation, and is the evidence current enough to act on?
- How does center coverage vary by scheme category and scheme?
- Where are batches underutilized, and is capacity data available?
- Which batches show participation, assessment, completion, or certification gaps?
- Which differences between districts or regions reflect comparable populations rather than missing uploads?

The dashboard supports investigation and review. It does not infer causal explanations, automatically penalize centers, or make predictive claims from synthetic data.
