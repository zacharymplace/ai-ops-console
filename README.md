# AI Ops Console

A portfolio-grade prototype for AI-assisted operational request triage.

## Purpose

AI Ops Console demonstrates how AI can support real operational workflows without removing human judgment.

The system classifies messy inbound requests, assigns risk and urgency, recommends next action, and writes an audit trail for review.

## Core Capabilities

- Request intake
- AI-style classification
- Risk and urgency scoring
- Human review queue
- Audit log
- Dashboard metrics

## Portfolio Positioning

This project supports the portfolio lane:

**AI systems builder focused on workflow automation, evaluation, governance, and operational tooling.**

## v0.1 Scope

This version uses a deterministic mock classifier rather than a live LLM API. That keeps the system testable, inspectable, and safe for early portfolio development.

## Next Improvements

- Add real OpenAI classification behind a feature flag
- Add prompt versioning
- Add evaluation test cases
- Add approval/rejection actions
- Add Supabase persistence
- Add role-based review controls
- Add case study page
