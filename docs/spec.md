# Spec (Single Source of Truth)

## Product Goal
- Deliver a performant, rules-accurate browser Othello experience where players can duel a CPU opponent at selectable difficulty or another person on the same device, complete with legal-move guidance, undo/restart controls, and responsive UX for PC and mobile.

## Scope
### In scope
- Home screen with CPU mode (weak/medium/strong) and local two-player mode selection.
- Gameplay screen with legal-move highlighting, automatic pass detection, undo (player+CPU pair for CPU mode), restart, score display, sound toggle, and end-of-game messaging.
- CPU decision making that exhibits distinguishable behavior per tier and respects the official rules (legal flips in all directions, pass when stuck, game-end detection).

### Out of scope
- Online matchmaking, leaderboards, persistence of matches/statistics, accounts, or ads.
- Variant board sizes, rule tweaks, or backend data storage (Supabase not used).
- Replay systems, analytics, or monetization.

## Feature List (High-level)
- F1: CPU mode with three difficulty tiers, legal-rule enforcement, and undo/restart controls.
- F2: Local two-player mode sharing the same board + controls and alternating turns.
- F3: Supporting UX (mode selection, responsive layout, sound toggle, minimal animation).

---

# Current Feature (Work on ONE at a time)

## Feature: CPU mode with three difficulty tiers

### User Story
- As a solo player, I want to pick a difficulty (weak/medium/strong) and play against a CPU that follows official Othello rules, so that I can practice without needing a second person.

### Acceptance Criteria (3–7 MUST items)
- [ ] MUST: The home screen offers a CPU mode entry point, difficulty selector (weak/medium/strong), and immediately loads the game board with the human player starting as black.
- [ ] MUST: The gameplay view highlights legal moves, prohibits illegal picks, flips discs along all valid directions, auto-passes when no legal moves are available, and terminates when the board is full or both sides consecutively pass.
- [ ] MUST: Each difficulty displays distinguishable behavior (weak: random/maximum flips, medium: heuristic prioritizing edges/corners, strong: search/evaluation within ~2s), and the CPU responds after every valid player move unless undo is invoked.
- [ ] MUST: Current turn indicator and score display (black/white disc counts) update on every move, and the end screen shows black win/white win/draw options plus a restart prompt.
- [ ] MUST: Undo rewinds the history appropriately (player+CPU pair in CPU mode) and restart resets the board, legal moves, sound settings (persisted toggle), and UI indicators to the initial state.

### Error Handling (if applicable)
- 400: Not applicable (client validates before board actions).
- 401: Not applicable (no auth).
- 403: Not applicable.
- 404: Not applicable.
- 409: Not applicable.
- 429: Not applicable.
- 5xx: Not applicable.

### Data & Constraints
- Related schemas:
  - schemas/game-state.schema.json
  - schemas/sound-settings.schema.json
  - schemas/move-action.schema.json
- Notes: Board state includes an 8×8 array (empty/black/white), current turn, legal-move list, undo history stack, and optional sound preference saved to LocalStorage via the sound settings schema.

### Security Requirements (minimum)
- Auth required? No.
- Who can read/write? Public (all users get same access).
- RLS impact? Not applicable (no Supabase).
- Audit log needed? No.

### Test Plan (minimum)
- Unit: Board rule engine (legal-move detection, flipping, pass detection, undo/resume) and CPU heuristics/search per difficulty.
- Integration: Transition from home→CPU, undo/restart wiring, auto-pass detection, score display, and sound toggle persistence.
- E2E: Complete CPU matches per tier to ensure rules, scoring, undo/restart work across viewports.
#### CPU behavior clarifications
- Weak CPU: choose any legal move uniformly but prefer the move that flips the most discs when multiple legal moves exist.
- Medium CPU: evaluate each legal move with a heuristic that values corners, stable edges, and penalizes X-squares before selecting the best-scoring move.
- Strong CPU: run minimax with alpha-beta pruning to a fixed depth (e.g., 4 plies) or within a 2-second cap, using the same heuristic for leaf evaluation.

#### Definition of Done
- [x] Spec updated
- [ ] Schemas updated (if boundary changed)
- [ ] OpenAPI updated (if applicable)
- [ ] Tests added/updated
- [ ] All canonical commands pass

## Feature: Local two-player mode with shared board

### User Story
- As two players on the same device, we want to take turns on the same board with satisfying feedback and undo/restart controls, so that we can play a full Othello match without waiting on a network opponent.

### Acceptance Criteria (3–7 MUST items)
- [ ] MUST: The home screen lets the players choose “Local two-player” and immediately shows the board starting with black’s turn, with indicators close to the board that display whose turn it is and the current scores.
- [ ] MUST: Legal moves are highlighted for the current player, and taps/clicks outside those moves are ignored with optional light feedback; the board enforces the same 8-direction flip rules as CPU mode.
- [ ] MUST: When a player has no legal moves, the board automatically passes control to the opponent (with toast/message) and records the pass in the move history.
- [ ] MUST: Undo reverts the last move (single human action) and restores both players’ previous state; undo can be used repeatedly down to the initial board and keeps the score display, legal-move map, and history length consistent with the restored turn.
- [ ] MUST: Restart resets the board to the initial configuration, resets scores, legal moves, history, and current player (black), and does not clear the archived sound preferences.

### Error Handling (if applicable)
- 400: Not applicable (client validates board moves before applying).
- 401: Not applicable.
- 403: Not applicable.
- 404: Not applicable.
- 409: Not applicable.
- 429: Not applicable.
- 5xx: Not applicable.

### Data & Constraints
- Related schemas:
  - schemas/game-state.schema.json
  - schemas/sound-settings.schema.json
  - schemas/move-action.schema.json
- Notes: The schema already covers `mode` (cpu/local) and the undo/move history stack/move count; local mode relies on the same history semantics as the CPU mode but skips the CPU actor moves, so the UI renders the history length as the number of player moves that have occurred.

### Security Requirements (minimum)
- Auth required? No.
- Who can read/write? Public (two players share device).
- RLS impact? Not applicable.
- Audit log needed? No.

### Test Plan (minimum)
- Unit: Board engine + undo stack to confirm turn flips, pass detection, and restart behavior for local mode.
- Integration: Home-to-local workflow, undo/restart wiring, turn indicators, and score updates.
- E2E: Local-mode match to completion with alternating turns ensuring UI updates align with rules.
