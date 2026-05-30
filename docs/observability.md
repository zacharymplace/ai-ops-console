# Observability

This repo emits local Hermes workflow traces to self-hosted Langfuse.

## Shared Standard

This repo follows the shared Hermes observability standard:

https://github.com/zacharymplace/hermes-observability

## Langfuse Local

http://localhost:3000

## Env

source ~/.config/hermes/langfuse.env

## Review Trace

npm run trace:review

Expected trace name:

ai-ops-console-review-run

## Standard Events

- command-result
- review-summary
- release-lineage
- final-disposition

## Standard Scores

- readiness
- risk
- confidence

## Local Loop

npm run hermes:observe
