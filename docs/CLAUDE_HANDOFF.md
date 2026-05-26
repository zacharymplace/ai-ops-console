# AI Ops Console Claude Handoff

## Project Role

AI Ops Console is an operational triage prototype. It classifies messy business notices, keeps a human review layer, and preserves a basic audit/evaluation loop.

Treat this repo as a product prototype, not a generic Next.js sandbox.

## Current State

- Branch: main
- App framework: Next.js
- Classifier eval is active and required.
- Current classifier eval set: 6 cases.
- Current eval result: 6/6 passing.
- Current release readiness command:

    npm run release:ready

This currently verifies:

    npm run check
    npm run build

`npm run check` verifies:

    npm run lint
    npm run eval:classifier:check

## Core Rule

Do not weaken the classifier evaluation loop.

For docs, refactors, UI cleanup, and implementation passes:
- preserve current classifier categories unless explicitly asked
- preserve eval fixtures unless explicitly scoped
- preserve release readiness semantics unless explicitly asked
- keep changes narrow and reviewable
- do not mix product behavior changes with validation-system changes

## Validation Commands

Before proposing completion, run:

    npm run release:ready

For cleanup or PR-prep branches, also run:

    git status --short --branch

If a PR cleanup helper is added later, use it as the PR completion gate.

## Useful Scripts

Current known scripts:

    npm run lint
    npm run eval:classifier
    npm run eval:classifier:check
    npm run check
    npm run build
    npm run release:ready
    npm run agent:preflight

## Recommended Next Product Branch

    product/operator-review-loop-v02

Goal:
- make the review queue more useful to one operator
- improve triage clarity
- sharpen what the operator should do next
- preserve classifier eval behavior unless explicitly scoped

## Good Claude Work

Use Claude for:
- narrow UI implementation
- review-flow improvements
- typed refactors
- eval case expansion
- documentation updates
- validation loop hardening

Use strategic review before:
- changing classifier categories
- changing scoring/urgency logic
- changing eval pass/fail expectations
- changing release readiness
- introducing persistence/auth/backend services

## Completion Standard

A Claude-assisted branch is not complete until:

    npm run release:ready

passes and the final status is clean or intentionally scoped.
