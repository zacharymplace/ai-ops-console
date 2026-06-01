# Hermes Readiness Real Package Pilot

## Purpose

Pilot installed package usage for @hermes/readiness in ai-ops-console.

## Package Source

Installed from a local tarball produced by hermes-observability:

npm pack ./packages/readiness

## Expected Command

npm run hermes:readiness

The repo now uses:

hermes-readiness

instead of the temporary package-style shim.

## Validation

npm run hermes:readiness
npm run check

## Migration Meaning

This proves ai-ops-console can consume @hermes/readiness as an installed package artifact before public package distribution.
