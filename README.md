# AI Ops Console

A portfolio-grade prototype for AI-assisted operational request triage, human review, evaluation, and auditability.

## Purpose

AI Ops Console demonstrates how AI can support real operational workflows without removing human judgment.

The system classifies messy inbound requests, assigns category/risk/urgency, recommends a next action, queues the item for human review, and writes an audit trail for system and human decisions.

## Portfolio Positioning

**AI systems builder focused on workflow automation, evaluation, governance, and operational tooling.**

This project is designed to show practical AI implementation skill beyond prompt demos:

- Workflow design
- Human-in-the-loop review
- AI-style classification
- Risk routing
- Evaluation harnesses
- Audit logs
- Portfolio-ready case study writing

## Core Capabilities

- Request intake
- Deterministic classifier
- Category, risk, and urgency assignment
- Review queue
- Human approve/reject/review actions
- Reviewer notes
- Audited reclassification
- Dashboard metrics
- Audit log
- Classifier evaluation suite
- JSON evaluation report
- Portfolio case study page

## Architecture

```text
src/app/
  page.tsx                 Home
  actions.ts               Server actions
  dashboard/page.tsx       Metrics + audit log
  requests/new/page.tsx    Intake form
  requests/review/page.tsx Human review queue
  case-study/page.tsx      Portfolio case study

src/lib/
  ai/classifier.ts         Classification logic
  data/store.ts            JSON file persistence
  data/types.ts            Domain types
  eval/cases.ts            Evaluation cases

scripts/
  eval-classifier.ts       Classifier regression test

data/
  requests.json            Local request records
  audit-log.json           Local audit log

reports/
  classifier-eval.json     Latest eval report
```

## Commands

```bash
npm run dev
npm run eval:classifier
npm run lint
npm run check
```

## Evaluation

The classifier is tested against labeled cases with expected:

- category
- risk level
- urgency score

The evaluation script prints results and writes a report to:

```txt
reports/classifier-eval.json
```

Current eval status:

```txt
6 / 6 cases passing
100% score
```

## Version History

### v0.1 - App scaffold

- Next.js app
- Request intake
- Review queue
- Dashboard
- JSON persistence

### v0.2 - Evaluation harness

- Labeled eval cases
- Classifier regression script
- JSON report output

### v0.3 - Human review actions

- Mark reviewed
- Approve
- Reject
- Reviewer notes
- Human audit events

### v0.4 - Audited reclassification

- Reclassify stale records with current rules
- Log before/after category, risk, and urgency

### v0.5 - Portfolio case study

- Navigation
- Case study page
- Project explanation
- Metrics pulled from local data

## Next Roadmap

- Add prompt/version registry
- Add OpenAI classification behind a feature flag
- Add Supabase persistence
- Add authentication
- Add role-based review controls
- Add expanded evaluation coverage
- Add CI gate for `npm run check`
- Add deployed demo
- Add screenshots to README
