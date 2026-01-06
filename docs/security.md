# Security (Single Source of Truth)

## Threat Model

### Assets
- Volatile game boards (disc positions, turns, and undo history) that exist only in browser memory.
- UI preferences such as the sound toggle stored in `localStorage` with only non-sensitive data.

### Entry Points
- Browser client (home + gameplay screens). All logic and validation execute entirely on the client; no custom backend is deployed yet.
- No API or Supabase endpoints are exposed for the MVP, so the only network surface is static hosting on Vercel.
- There are no third-party integrations ingesting game or user data.

### Top Risks & Controls
- **Corrupted move logic**: Invalid legal-move detection could allow cheating or a stuck board, especially when two local players alternate quickly. Control: centralize validation via the board engine (`src/game/board.ts`) and schema checks (`schemas/game-state.schema.json`) before mutating state.
- **Unchecked LocalStorage writes**: Only the ON/OFF sound toggle is persisted, so we whitelist its shape via `schemas/sound-settings.schema.json` and reject `additionalProperties`.
- **Secret leakage**: There are no secrets or tokens; do not add API keys or server-side secrets for this MVP.
- **Missing input validation**: Every move, even in local mode, originates from `getLegalMoves`; ignore raw coordinate inputs without cross-checking with the schema/engine.

---

## AuthN/AuthZ Policy

### Authentication
- Not implemented because gameplay is anonymous and public. No tokens, sessions, or third-party providers are included.

### Authorization
- Model: Public. Every visitor has the same full access to play any mode, use undo/restart, and toggle sounds.
- No owner-only or admin-only flow exists for this MVP.

---

## Supabase Security (If used)
- Supabase is intentionally unused in this project. There are no tables, RLS policies, or service-role calls to document at this time.

---

## Input Validation
- JSON Schema enforcement:
  - [x] API boundary (placeholder `api/openapi.yaml` for future use).
  - [ ] DB write boundary (not applicable; no persistence beyond LocalStorage).
  - [x] Client boundary (gameplay moves, form submissions, and LocalStorage reads are validated against the schemas).
- Rule: Reject unknown fields by setting `additionalProperties: false` in the schemas.
- Two players share the same validation pipeline: the board engine recalculates legal moves and masks invalid selections before state updates on every alternating turn.

---

## Logging & Monitoring (Minimum)
- No server-side logging exists. Client-side console logs are limited to debugging scenarios.
- Error reporting is local (UI feedback) because there is no remote telemetry.
- Abuse metrics (rate limiting, throttling) are unnecessary because no API surfaces exist.

---

## Security Definition of Done
- [x] No secrets committed
- [x] Supabase/RLS not used
- [x] Input validation enforced at client boundaries
- [ ] Access control tests exist (if Supabase tables are added later)
