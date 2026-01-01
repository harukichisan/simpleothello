# Security (Single Source of Truth)

## Threat Model (Minimal)

### Assets
- User data:
- Auth/session:
- Admin actions:
- Billing/payment (if any):

### Entry Points
- Web client:
- API endpoints (if any):
- Supabase direct access:
- Third-party integrations:

### Top Risks (project-specific)
- Broken access control / IDOR
- Secret leakage
- Unsafe input handling
- Excessive data exposure
- Abuse (rate limiting / scraping)

---

## AuthN/AuthZ Policy

### Authentication
- Provider:
- Session strategy:
- Token storage:

### Authorization
- Model: Owner-only / RBAC / ABAC
- Rules:
  - Example: A user can access only rows where user_id = auth.uid()

---

## Supabase Security (If used)

### RLS Mandatory
- Principle: RLS is ON for all tables by default.
- Exceptions must be explicitly documented here.

### Policies Required per Table
For each table:
- SELECT policy:
- INSERT policy:
- UPDATE policy:
- DELETE policy:

### Service Role Usage (if any)
- Allowed only on server-side code (never in client)
- Use cases:
  - Admin jobs
  - Aggregations not expressible with RLS

---

## Input Validation
- JSON Schema enforced at:
  - [ ] API boundary
  - [ ] DB write boundary
  - [ ] Client boundary (UX)
- Rule: Reject unknown fields (`additionalProperties: false`) on external input.

---

## Logging & Monitoring (Minimum)
- Audit log events:
  - Login/logout
  - Privilege changes
  - Data deletion
- Error logging:
- Abuse protection:

---

## Security Definition of Done
- [ ] No secrets committed
- [ ] RLS ON + policies defined (if Supabase)
- [ ] Input validation enabled on boundaries
- [ ] Access control tests exist (at least 3 cases)
