# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Plan/Checks)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - A shell proof built on grep must fail on grep errors (exit 2), not only on matches: test the exit code is 1 and pin LC_ALL=C.UTF-8 for -P patterns
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend-proofs` · harmful: 0
- features: ord-03-shell-login
- evidence: checks.md C35 (frontend-proofs)
- last seen: 2026-11-14T04:25:16Z

### L-002 - A claim that a route is kept must mount the router and assert the current path, not only call the client function
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `frontend-routes` · harmful: 0
- features: ord-03-shell-login
- evidence: frontend/src/lib/api.test.ts C20 (frontend-routes)
- last seen: 2026-11-14T04:25:17Z

### L-003 - Logout and session expiry must reset the login mutation so a previous login error never shows on the access screen
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend-auth` · harmful: 0
- features: ord-03-shell-login
- evidence: verification.md finding 3 / C42 (frontend-auth)
- last seen: 2026-11-14T04:25:17Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
