# Claude Workflow

## Purpose

This document defines how Claude should be used inside ai-ops-console.

Claude is best used for implementation, refactors, test repair, repo cleanup, documentation parity, and release chores.

Product strategy and larger direction should stay outside the repo until translated into a clear implementation task.

## Good Claude Tasks

- Fix a failing check.
- Add or update a small feature behind an existing flag.
- Add missing tests or evaluation cases.
- Improve documentation to match actual behavior.
- Clean up a narrow TypeScript issue.
- Add a smoke test for a route or classifier path.
- Prepare release notes from a completed diff.

## Bad Claude Tasks

- Redesign the product direction.
- Change classifier categories without approval.
- Rewrite the app structure broadly.
- Change persistence strategy without approval.
- Add dependencies casually.
- Modify deployment or environment behavior without approval.
- Replace human review with full automation.

## Standard Prompt

Use this when starting Claude Code:

Read CLAUDE.md and README.md first.

Create or stay on a task branch.

Implement the smallest useful version of the requested change.

Do not change product purpose, persistence assumptions, classifier categories, feature flags, audit trail behavior, or unrelated files.

Run:

    npm run agent:preflight
    npm run release:ready

Summarize:

- files changed
- validation results
- risks
- next recommended patch

Do not push unless I explicitly ask.

## Review Checklist

Before accepting a Claude-generated patch, confirm:

- The diff is narrow.
- No unrelated formatting churn was introduced.
- Classifier behavior is intentional.
- Evaluation fixtures still represent the product goal.
- Human review and audit trail assumptions remain intact.
- Validation commands passed or failures are clearly explained.
