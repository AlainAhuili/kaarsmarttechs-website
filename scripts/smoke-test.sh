#!/usr/bin/env bash
# Usage: smoke-test.sh <base-url> [expected-version]
# Verifies a deployed environment serves the right build with the right headers.
set -euo pipefail

BASE="${1:?base url required}"
EXPECTED_VERSION="${2:-}"
FAILED=0

check() { # description, command...
  local desc="$1"; shift
  if "$@" >/dev/null 2>&1; then echo "PASS  $desc"; else echo "FAIL  $desc"; FAILED=1; fi
}
status() { curl -s -o /dev/null -w '%{http_code}' --retry 3 --retry-all-errors "$BASE$1"; }

# Allow the load balancer a moment to pick up new pods.
for _ in $(seq 1 10); do [ "$(status /healthz)" = 200 ] && break; sleep 3; done

check "health endpoint"            test "$(status /healthz)" = 200
check "homepage"                   test "$(status /)" = 200
check "projects page"              test "$(status /projects/)" = 200
check "flagship case study"        test "$(status /projects/lego-sorting-system/)" = 200
check "impressum"                  test "$(status /impressum/)" = 200
check "unknown page returns 404"   test "$(status /this-page-does-not-exist/)" = 404

HEADERS="$(curl -sI "$BASE/")"
check "CSP header"                 grep -qi '^content-security-policy:' <<<"$HEADERS"
check "HSTS header"                grep -qi '^strict-transport-security:' <<<"$HEADERS"
check "nosniff header"             grep -qi '^x-content-type-options: nosniff' <<<"$HEADERS"

if [ -n "$EXPECTED_VERSION" ]; then
  check "serves version $EXPECTED_VERSION" test "$(curl -s "$BASE/version.txt")" = "$EXPECTED_VERSION"
fi

exit "$FAILED"
