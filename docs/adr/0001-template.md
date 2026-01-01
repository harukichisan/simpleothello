# ADR 0001: Spec/Schema/Test as Truth

## Decision
We adopt a spec/schema/test-first workflow to support AI implementation while minimizing manual code review.

## Rules
- Spec/security/schema/contract are the source of truth.
- CI gates define correctness.
- Small, incremental changes only.

## Consequences
- Higher repeatability and fewer regressions.
- Requires keeping spec and tests updated.
