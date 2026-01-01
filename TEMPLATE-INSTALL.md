# Template Install Guide

## Goal
Make AI-driven implementation safe by fixing:
- Spec as truth
- Schema as gate
- Tests/CI as judge
- Security policy as explicit document

## After using this template, do these FIRST
1) Fill `docs/project-config.md`
2) Fill `.cursor/rules/90-commands.mdc` (copy commands from project-config)
3) Write one feature in `docs/spec.md` (3–7 acceptance criteria)
4) If Supabase is used: update `supabase/migrations/0001_init.sql`

## Recommended workflow
- Spec -> Schema -> Tests -> Implementation
- Keep changes small (<= 5 files per iteration)
- Never merge without CI green

## If you do NOT have an API
Delete `api/` folder (optional but recommended).
