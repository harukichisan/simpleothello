# Cursor Spec/Schema/Test Template

This repository is a **GitHub Template** for projects developed with:
- Spec-first (requirements as truth)
- Schema-first at boundaries (JSON Schema)
- Test-driven verification (CI gates)
- AI implementation via Cursor (minimal manual code review)

## Quick Start
1. Click **Use this template**
2. Clone the new repo
3. Open in Cursor
4. Fill `docs/project-config.md`
5. Write one feature in `docs/spec.md`
6. Ask Cursor to implement following the rules in `.cursor/rules/`

## What you should edit
- `docs/project-config.md` (commands + stack)
- `docs/spec.md` (requirements)
- Optionally: `docs/security.md`, `schemas/`, `api/openapi.yaml`, `supabase/migrations/`, `tests/`

## Non-negotiables
- `docs/spec.md` is the single source of truth for behavior
- CI must be green before merge/deploy
- If using Supabase, RLS is mandatory by default
