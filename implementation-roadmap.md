# Implementation Roadmap

Audit baseline: 2026-07-30  
Current conservative completion: 32%  
Estimation basis: experienced delivery team, existing code retained where safe, eight productive hours per person-day. Estimates include implementation, tests, review, and stabilization but exclude procurement/vendor approval and large data-cleansing exercises.

## Priority 1 — Critical

Target: eliminate privilege escalation, privacy exposure, and build blockers before adding features.

| Work item | Deliverable | Hours |
|---|---|---:|
| Close public role escalation | Remove privileged self-selection; invitation/approval-based onboarding | 16–24 |
| Server authorization foundation | Policies/permissions, geographic scoping, ownership checks, deny-by-default tests | 120–180 |
| Protect identity data | Aadhaar encryption/tokenization/masking, access logging, migration plan | 64–96 |
| Secure documents | Per-record authorization, safe download, validation, malware/size/type controls | 48–72 |
| Frontend compile repair | Resolve TypeScript contracts, route root, charts/imports, broken page shapes | 80–120 |
| Replace silent API fallbacks | Explicit loading/empty/error states and observable integration failures | 32–48 |
| Authentication hardening | Rate limits, password policy, recovery, lockout, session/device controls; MFA design | 64–96 |
| Critical test suite | AuthN/AuthZ, IDOR, registration, citizen/document/grievance access | 80–120 |

Priority 1 total: **504–756 hours (63–95 person-days)**.

Exit criteria: frontend type-check passes; privileged registration is impossible; every sensitive endpoint has server-side authorization; Aadhaar is never exposed raw by default; critical security tests pass.

## Priority 2 — High

Target: make core constituency operations genuinely end-to-end.

| Work item | Deliverable | Hours |
|---|---|---:|
| Citizen/family 360 | Correct relational family/address/history, CRUD, filters, import/export, dedupe | 120–180 |
| Grievance workflow | Assignment, department handoff, escalation, SLA jobs, updates, feedback, notifications | 120–180 |
| Scheme workflow | Catalog administration, eligibility rules, applications, review, benefit/disbursement | 140–210 |
| MPLADS/project workflow | Proposal through completion, budgets, contractors, milestones, documents/photos | 160–240 |
| Survey workflow | Persisted builder, publishing, assignments, submissions, validation, analytics | 140–220 |
| Volunteer operations | CRUD, territory, attendance/GPS, activities, training, performance | 100–160 |
| Meeting follow-up | Notes/actions, token queue, appointment ownership, media and follow-up | 72–112 |
| API contracts | Versioning, Resources, Requests, consistent errors, pagination/filter specs | 64–96 |
| Core integration tests | Backend feature tests and frontend interaction/API tests | 120–180 |

Priority 2 total: **1,036–1,578 hours (130–197 person-days)**.

Exit criteria: each core module supports authorized UI→API→database workflows with validation, error handling, audit trail, and automated tests.

## Priority 3 — Medium

Target: deliver operational intelligence and field reliability.

| Work item | Deliverable | Hours |
|---|---|---:|
| Reports/exports | Server-side CSV/XLSX/PDF exports, background jobs, report permissions | 80–120 |
| Real analytics | Assembly/mandal/village/booth aggregates, definitions, drill-downs | 100–150 |
| Maps/heat maps | Geospatial API, clustering, filters, privacy controls, interactive UI | 100–160 |
| Document intelligence | OCR pipeline, search, versions, retention, audit UI | 100–160 |
| Communication hub | SMS/WhatsApp/email templates, consent, delivery/status/retry | 120–180 |
| Department tracker | Correspondence, ownership, reminders, SLA, escalation | 64–96 |
| Offline/PWA field mode | Encrypted local queue, document capture, sync/conflict resolution | 160–240 |
| Performance/scalability | Query plans, search strategy, caches, queues, load tests, observability | 120–180 |

Priority 3 total: **844–1,286 hours (106–161 person-days)**.

## Priority 4 — Low

Target: advanced/optional capability after trustworthy data and workflows exist.

| Work item | Deliverable | Hours |
|---|---|---:|
| AI scheme advisor | Deterministic eligibility grounding, explanation, evaluation, guardrails | 80–120 |
| AI constituency assistant | Authorized semantic queries, citations, audit, prompt-injection controls | 120–200 |
| Voice/IVR/bulk calling | Provider integration, consent, scripts, delivery and survey capture | 100–160 |
| Election module (optional) | Voter segmentation, booth analytics, campaigning controls and legal review | 160–260 |
| Social/war-room feeds | Ingestion, moderation, dedupe, alerts, live dashboard | 100–160 |
| Native app decision/work | Only if PWA is insufficient; shared contracts and release pipeline | 200–360 |

Priority 4 total: **760–1,260 hours (95–158 person-days)**.

## Remaining estimate

- Core production-ready scope (Priorities 1–3): **2,384–3,620 hours**, or **298–453 person-days**.
- Full stated scope including optional/advanced Priority 4: **3,144–4,880 hours**, or **393–610 person-days**.
- Suggested contingency for integration, data migration, security retest, accessibility, UAT, and deployment: **20–30%**.
- Planning total with contingency: **3,773–6,344 hours**, or **472–793 person-days**.

Calendar duration depends on team size and parallelism. A stable team of six (backend, frontend, QA/security, DevOps/product coverage) at roughly 70% effective delivery capacity would need approximately **5–9 calendar months for Priorities 1–3** and **8–14 months for the full scope**. These are engineering estimates, not promises; vendor onboarding, client decisions, mobile-store release, legacy data quality, and compliance review can extend them.

## Recommended delivery sequence

1. Freeze new visual-only screens and establish truthful API/error behavior.
2. Resolve Critical security and compilation issues.
3. Define roles, geography scopes, state machines, and API contracts with the client.
4. Complete one vertical slice at a time: citizen/family, grievance, schemes, projects, surveys, volunteers, meetings.
5. Add reports, maps, communication, offline support, and scale engineering only on tested workflows.
6. Add AI only after data permissions, definitions, provenance, and evaluation are reliable.

## Production acceptance gates

- Zero critical/high authorization findings and a completed penetration test.
- Type-check, lint policy, unit, feature, integration, and end-to-end suites pass in CI.
- Tested backup/restore, monitoring, audit retention, incident response, and deployment rollback.
- Load test demonstrates agreed concurrency and dataset size with measured SLOs.
- Accessibility, mobile/responsive, browser, offline-sync, and poor-network test matrices pass.
- Client UAT signs off each workflow against the extracted requirement matrix.
