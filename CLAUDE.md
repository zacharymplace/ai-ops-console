# Claude Operating Rules

## Project Purpose

AI Ops Console is a small operational triage console for classifying messy business notices, preserving human review, and recording an audit trail.

Treat this repo as an operations/product prototype, not a generic Next.js sandbox.

## Default Work Mode

Claude should act as a repo-native implementation agent.

Expected loop:

1. Read this file first.
2. Inspect relevant files before editing.
3. Create the smallest useful patch.
4. Avoid unrelated cleanup.
5. Run validation.
6. Summarize changed files, validation results, risks, and next steps.

## Do Not Change Without Explicit Approval

- Core product purpose
- Existing data model or persistence assumptions
- Public route structure
- Classifier categories
- Evaluation cases
- Feature flag behavior
- Audit trail semantics
- Environment variable names
- Deployment configuration
- Generated reports unless explicitly requested
- Visual hierarchy or product positioning copy outside the requested scope

## Protected Files and Areas

Be especially careful with:

- package.json
- package-lock.json
- .env files
- next.config files
- src/app
- lib
- scripts
- reports
- evaluation fixtures or classifier test cases

Changes to these areas should be small, justified, and validated.

## Validation Commands

Preferred validation:

    npm run check
    npm run build

For release readiness:

    npm run release:ready

For agent preflight:

    npm run agent:preflight

## Commit Rules

- Use a branch for every change.
- Keep commits small.
- Do not push without explicit instruction.
- Do not rewrite Git history unless explicitly instructed.
- Do not mix unrelated fixes into the same patch.
- Leave the working tree clean after a completed task when possible.

## Response Format After Work

Use this structure:

Summary
- ...

Files changed
- ...

Validation
- ...

Risks
- ...

Next recommended patch
- ...

## Product Judgment

When uncertain, prefer:

- human review over automation
- auditability over cleverness
- small deterministic rules over broad opaque behavior
- traceable evaluation over subjective confidence
- boring maintainable code over impressive complexity
