
## Goal
Persist reservation submissions to Lovable Cloud and add a secure admin dashboard to view, filter, update status, annotate, and delete them.

## 1. Enable Lovable Cloud
Enable the built-in backend (database + auth).

## 2. Database schema (migration)
- `app_role` enum: `admin`, `user`
- `reservation_status` enum: `pending`, `confirmed`, `cancelled`, `completed`
- `public.reservations`
  - id, name, email, phone, party_size, reservation_date, reservation_time, occasion, special_requests, status (default `pending`), admin_notes, created_at, updated_at
  - Public `INSERT` allowed (anyone can book, with validation)
  - Only admins can `SELECT / UPDATE / DELETE`
- `public.user_roles` (separate table — never on profiles)
  - user_id, role, unique(user_id, role)
- `public.has_role(_user_id, _role)` SECURITY DEFINER function
- RLS enabled on all tables + proper GRANTs to `anon` (insert reservations only), `authenticated`, `service_role`

## 3. Reservation form wiring
Update the existing form on `/` to:
- Validate with zod (lengths, email format, date not in past, party size 1–20)
- Insert into `reservations` via the browser Supabase client (anon insert)
- Toast success/error states; reset form on success

## 4. Auth
- Add `/auth` route: email + password sign-in and sign-up (email confirmation disabled by default so login works immediately)
- Root route wires `onAuthStateChange` and invalidates router/queries
- No public "Sign in" link in the main navbar (kept minimal for guests); admins access via `/auth` directly

## 5. Admin dashboard
- `src/routes/_authenticated/admin.tsx` — protected by the integration-managed `_authenticated` layout
- Additional client-side gate: fetch caller's roles; if not `admin`, show "Unauthorized"
- Server functions (`src/lib/reservations.functions.ts`) using `requireSupabaseAuth` middleware, each verifying admin via `has_role`:
  - `listReservations({ status?, search?, from?, to? })`
  - `updateReservationStatus({ id, status })`
  - `updateReservationNotes({ id, admin_notes })`
  - `deleteReservation({ id })`
- UI features:
  - Table with columns: date/time, name, contact, party size, occasion, status badge, created
  - Filters: status dropdown, date range, search (name/email/phone)
  - Row actions: change status (dropdown), edit notes (dialog), delete (confirm dialog)
  - Uses TanStack Query with proper invalidation
  - Matches the site's luxury dark/gold aesthetic

## 6. Bootstrapping the first admin
After the user signs up, they run a one-time SQL insert (I'll provide the snippet) to grant themselves the `admin` role in `user_roles`. Documented in the final message.

## Technical notes
- Roles live in `user_roles` (never on profiles) — prevents privilege escalation
- Public INSERT policy on `reservations` restricted to reasonable column values; no read-back for anon
- Client Supabase browser client for the public insert; server functions for all admin reads/writes
- Bearer attach middleware in `src/start.ts` (append generated attacher if not already present)
