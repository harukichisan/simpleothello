# Project Config (Fill This First)

## 1) Project Type
- [x] Web app
- [x] Browser game
- [ ] Mobile app
- [ ] API service
- [ ] Other:

## 2) Stack (Brief)
- Frontend: Next.js/React + TypeScript SPA that runs entirely in the browser
- Backend: None (game logic runs client-side; no dedicated server)
- Database: None (state is transient; optional localStorage only for sound prefs)
- Hosting/Deploy: Vercel (static/edge hosting for the Next.js build)
- Auth: None (public play with no login)

## 3) Environments
- Local: `npm run dev` (Next.js dev server on `localhost:3000`)
- Staging (optional): Vercel preview deployments for feature branches
- Production: Vercel production deployment for the `main` branch

## 4) Canonical Commands (Used by CI and Cursor)
> This is the "truth" for how to validate.

- Install: `npm install`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test: `npm run test`
- Build: `npm run build`
- Dev: `npm run dev`
- E2E (optional): `npm run test:e2e`

## 5) Validation Targets
- OpenAPI present?
  - [x] Yes  [ ] No
  - Validate command: `npm run openapi:validate`
- JSON Schemas present?
  - [x] Yes  [ ] No
  - Validate command: `npm run schema:validate`

## 6) Data Boundaries (where schema should apply)
- [x] API requests/responses
- [ ] DB writes
- [x] Form submissions
- [x] LocalStorage / save data
- [ ] Config files

## 7) Security Defaults
- Auth method: None (public board experience, no login required)
- Authorization model: Public (no distinct roles or per-user data)
- Supabase usage:
  - [ ] Direct client (RLS strict)
  - [ ] API mediated (service role only on server)
  - Not used (client-side logic only, no Supabase backend)
- Secret management:
  - [x] Env vars only
  - [ ] Secrets manager

## 8) Links
- Repo: `https://github.com/harukichisan/simpleothello`
- Supabase project: N/A (Supabase not used)
- Hosting: `https://vercel.com/`
- Issue tracker: `https://github.com/harukichisan/simpleothello/issues`
