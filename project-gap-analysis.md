# Project Gap Analysis

Audit date: 2026-07-30

## Executive finding

The project is an early-to-mid-stage prototype, not production-ready software. Its strongest asset is database breadth. Its weakest areas are authorization, reliable frontend integration, tested business workflows, offline/mobile capability, communications, AI, reporting, and security of citizen identity data.

The frontend currently fails `tsc --noEmit` with extensive errors. The PHP application files pass `php -l`, but only the two default scaffold tests exist. Runtime/database correctness was not claimed because the audit was expressly read-only and migrations were not run.

## Completed features

No client functional requirement is fully complete under the required definition. Smaller technical building blocks that are implemented include Sanctum token issuance/revocation, protected API grouping, core location reads, document file upload/download/preview/delete mechanics, core list pagination, and PHP syntax validity. These are components, not completed client modules.

## Partially completed features

- Authentication: login, logout, registration, profile and password change exist.
- Citizens: create/read/update/list/stats, address capture, and a partial 360 response.
- Families: list/create and schema, without trustworthy full family workflows.
- Grievances: create/read/update/list/stats/categories and supporting schema.
- Projects/MPLADS: list/detail/stats and extensive schema, but read-only operational API.
- Schemes: catalog/application read APIs and schema, but no processing workflow.
- Surveys: catalog/response read APIs and schema, but no authoring/submission workflow.
- Volunteers: list/detail/stats and extensive tables, but no management workflows.
- Meetings: appointment, public meeting, tour, Janata Darbar reads/creates and appointment updates.
- In-app notifications and several role-specific dashboard summaries.

## Missing features

- Municipality administration and territory assignment for coordinators.
- Full CRUD for most master and transactional modules.
- Imports, exports, report generation, scheduled reports, and print-ready reports.
- Scheme application creation, verification, approval/rejection, benefit processing, and eligibility evaluation.
- Project proposal/approval/tender/progress/completion workflows and project-specific document handling.
- Survey builder persistence, survey deployment, response submission, and field collection.
- Volunteer attendance/activity/training/performance write APIs and GPS verification.
- Offline-first forms, local document queue, conflict handling, and later synchronization.
- OCR, document version APIs/UI, retention rules, and document-level audit history.
- SMS, WhatsApp, email, voice, bulk calling, and IVR integrations.
- Department follow-up workflow and escalation automation.
- AI scheme advisor and AI constituency assistant.
- Real interactive maps, geospatial clustering, and issue heat maps.
- War-room live feeds and social-media monitoring.
- Settings administration and audit-log viewer/API.
- Production-grade citizen and volunteer mobile applications.

## Broken features

- Frontend TypeScript compilation fails across citizen components, charts, route root, projects, schemes, surveys, meetings, and volunteer screens.
- `src/routes/__root.tsx` references undefined `appCss`.
- Project progress tracker imports `useSuspenseQuery` from the wrong package.
- Several citizen components import types no longer exported by `citizen-data`.
- Multiple screens expect fields not supplied by `live-data` (family, coverage, eligibility, performance, and volunteer KPI shapes).
- The shared data adapter catches every API failure and silently returns empty fallback data, obscuring authentication/network/server faults.
- Citizen-related documents, schemes, grievances, surveys, interactions, and family members are assigned by array slicing or fabricated records rather than relational identifiers.
- Many analytics and KPI arrays are hardcoded while presented as operational intelligence.
- Detail pages use fixed routes with selected IDs passed through search state or fall back to the first record, making direct links unreliable.

## Placeholder pages

The following route files explicitly render `PlaceholderPage`:

- Analytics: index, constituency, assembly, mandal, village.
- Citizen booth mapping.
- Communication: index, SMS, WhatsApp, email.
- Documents: index, citizen documents, project documents.
- Settings.

Meeting engagement analytics also references placeholder behavior despite containing a visual shell.

## Dummy APIs and fabricated data

No explicit fake HTTP server was found. The equivalent problem exists in `src/lib/live-data.ts`:

- Hardcoded mandal, assembly, department, escalation, feedback, trend, budget, allocation, coverage, eligibility, AI, census, survey, and volunteer performance values.
- Generated family members, interactions, citizen activity, volunteer badges, scores, attendance, registrations, contributions, and completion percentages.
- Array-position slicing associates unrelated records to citizens.
- API errors are swallowed and replaced by empty values, so screens can look valid while the integration is broken.

Seeders also create demonstration records. Seed data is legitimate for development, but it must not be interpreted as implemented workflow behavior.

## Unused components and dead routes

- The generic UI component library is much broader than actual usage; many primitives are likely unused and should be confirmed with a dependency graph before removal.
- `ProtectedRoute` exists, while primary protection is also implemented in `_app` route loading; this duplicates concepts.
- `RoleGuard` is not a substitute for server authorization and appears limited to role landing pages.
- Module index routes often redirect and add no feature behavior.
- Detail routes are not parameterized (`/citizens/profile`, `/grievances/detail`, `/projects/project-detail`, etc.); they are fragile rather than durable resource routes.
- Navigation exposes many routes that are placeholders or demo-only.

No deletion is recommended without a dedicated reachability/build analysis.

## Missing validations

- No Form Request classes centralize or reuse validation.
- Registration permits any active `role_slug`, including privileged roles.
- Aadhaar lacks strict format, masking, encryption, and access validation.
- Mobile, voter ID, pincode, monetary amount, date ordering, and workflow-transition validation are inconsistent.
- `per_page` is capped but not consistently lower-bounded or validated.
- List sort/filter fields lack consistent whitelisting and contracts.
- Document ownership/documentable combinations and authorization are not validated as a domain rule.
- Most frontend forms are absent; several visual “create/add/export” controls have no mutation.
- Workflow statuses can generally be updated without a state machine or actor-specific transition rules.

## Security issues

### Critical

- Public registration accepts an arbitrary active role. Because `/roles` is public and includes `super-admin`, a caller can self-register with privileged role assignment.
- Almost every protected module endpoint requires only `auth:sanctum`; any authenticated user—including citizen or volunteer—can read sensitive citizen, grievance, document, project, survey, volunteer, meeting, department, and location data. Only dashboards and citizen creation have limited role middleware.
- There are no Policies, per-record ownership checks, or systematic permission checks.

### High

- Raw Aadhaar is stored in plaintext, searchable, and returned through APIs/UI rather than masked/encrypted/tokenized.
- Document download/preview/delete authorization appears based only on authentication and route binding, creating cross-user data exposure/deletion risk.
- Citizen self-service lookup assumes user ID equals citizen ID, with no verified user↔citizen linkage.
- Bearer tokens and user data are stored in `localStorage`, increasing impact of XSS.
- No API throttling is attached to login, registration, search, or upload routes.
- Activity/audit coverage is narrow and cannot establish a reliable access history for sensitive records.

### Medium

- Single-session login deletes all prior tokens without user-visible device/session management.
- Password policy is only eight characters; no compromised-password/MFA/lockout controls are evident.
- Upload validation and storage controls need threat review, malware scanning, content-disposition hardening, quotas, and tenant/owner segregation.
- `.env.example` defaults to local/debug, which is risky if copied without production hardening.

## Performance issues

- Dashboard controllers execute many independent aggregate queries per request with no caching strategy.
- Extensive eager loading can return large nested citizen/project/grievance payloads.
- `ilike '%term%'` across names, mobile, IDs, voter ID, and Aadhaar will not use ordinary B-tree indexes efficiently at scale.
- The frontend top-level-await adapter loads many lists of 100 records at module initialization, increasing latency and coupling unrelated pages.
- Tables sometimes receive only the first 100 rows and then perform client-side analytics, which is incorrect and non-scalable.
- No queue-backed long operations, export jobs, media processing, OCR jobs, or notification delivery jobs exist.
- No load tests, query plans, caching benchmarks, partitioning plan, or evidence supports the 10–20 lakh citizen target.

## Code quality issues

- TypeScript does not compile, and lint produces a very large error set (many formatting errors plus substantive quality issues).
- `live-data.ts` is a 600+ line global adapter combining fetching, transformation, fabricated demo data, analytics, and domain selectors.
- Controllers contain validation, query construction, business logic, persistence, audit, and response shaping; there are no Requests/Resources/Policies and almost no services.
- No API versioning or formal response-resource contracts.
- PostgreSQL-specific `ilike` is embedded directly, reducing portability.
- Error handling is inconsistent; frontend errors are often swallowed.
- Almost no automated tests cover authentication, authorization, CRUD, validation, uploads, or workflows.
- Encoding mojibake appears in source/content, indicating inconsistent text encoding handling.

## Technical debt

- Broad schema ahead of application workflows.
- Permission and audit tables exist without complete enforcement/use.
- Frontend screens ahead of API contracts, causing invented data shapes.
- Large placeholder/navigation surface inflates perceived implementation.
- Generated deployment outputs/backups add repository noise and may diverge from source.
- No documented API schema, domain state machines, data retention policy, observability, backup/restore test, or deployment acceptance checklist.

## Audit limitations

The audit did not run migrations, mutate or inspect production data, start services, install packages, or perform browser/API integration tests, per instruction. Therefore scores do not award runtime behavior that cannot be proven statically. PHP syntax was checked read-only; TypeScript and lint were checked without emitting build files.
