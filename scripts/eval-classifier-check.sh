#!/usr/bin/env bash
set -euo pipefail

REPORT="reports/classifier-eval.json"
TMP_DIR="$(mktemp -d)"
HAD_REPORT="0"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [ -f "$REPORT" ]; then
  HAD_REPORT="1"
  cp "$REPORT" "$TMP_DIR/classifier-eval.json"
fi

set +e
npm run eval:classifier
STATUS=$?
set -e

if [ "$HAD_REPORT" = "1" ]; then
  cp "$TMP_DIR/classifier-eval.json" "$REPORT"
else
  rm -f "$REPORT"
fi

exit "$STATUS"
