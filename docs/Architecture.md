# Architecture

> **Status: DRAFT — proposal for CTO review.**
> Nothing in this document is a final decision. Every choice below is a recommendation based on standard enterprise practice for this stack, made to give the CTO a concrete starting point to approve, amend, or reject. Points that depend on a decision not yet made are marked **Assumption**. See "Decisions Requiring CTO Approval" at the end.

---

## 1. Architecture Philosophy

- Favor boring, proven technology over novel technology. This system has to be maintained for years by a team, not just built once.
- Favor a modular monolith over microservices until a specific, measured problem justifies the operational cost of splitting it.
- Every module has an explicit boundary. Nothing reaches across a boundary informally.
- Prefer reversible decisions. Avoid one-way doors this early, when the least is known about real usage.
- Complexity is added only in response to a proven need, never speculatively.

## 2. Overall System Architecture

- A single backend application (modular monolith), internally organized by business capability, not by technical layer.
- A single frontend application (SPA), deployed separately from the backend, communicating only through the API.
- Client, API, and data layer are strictly separated — the frontend never talks to the database directly.
- **Assumption:** the system is multi-tenant SaaS (one shared application serving many customer organizations, with data isolated per tenant), not one deployment per customer. Flagged for confirmation given the "Business Operating System" framing.

## 3. Frontend Architecture

- A single-page application, organized around features rather than technical type (per the folder conventions in CodingStandards.md).
- Rendering is client-side by default. Server-side rendering is not adopted unless a proven need for SEO or first-paint performance emerges — this is treated as an internal business application, not a public marketing site.
- Configuration is resolved at build time per environment, not injected at runtime, unless a single build artifact needs to run across multiple environments.

## 4. Backend Architecture

- The backend is one deployable application, internally layered: an HTTP boundary, a business-logic layer, and a data-access layer.
- Internal modules call each other in-process. They do not communicate over the network while the system remains a monolith.
- Cross-cutting concerns — authentication, logging, validation — are implemented once, centrally, and applied uniformly. They are never reimplemented per module.

## 5. Database Strategy

- PostgreSQL is the single system of record.
- One database per environment (development, staging, production) — not one database per tenant.
- Multi-tenancy is enforced at the application/query layer (every query scoped by tenant), not through separate schemas or databases per tenant.
- Schema changes are made only through versioned, reviewed migrations. There is no direct manual change to a production schema.
- **Assumption:** row-level tenant isolation is sufficient for the initial customer segment. Stronger isolation (separate schema or database per tenant) is only justified by a specific compliance or contractual requirement, which has not been specified yet.

## 6. Authentication Strategy

- Authentication is handled by one central module. No feature implements its own login or credential handling.
- Sessions are represented by short-lived tokens with a refresh mechanism, delivered via cookies inaccessible to JavaScript (consistent with the "no tokens in client-side storage" rule in CodingStandards.md).
- Credentials are never stored or transmitted in plain text; hashing method is an implementation detail decided at build time, not here.
- **Assumption:** username/password authentication, with optional single sign-on, is sufficient at launch. Mandatory enterprise SSO is treated as a future decision unless a specific target customer requires it contractually.

## 7. Authorization Strategy

- Role-based access control is the baseline: users are assigned roles, and roles carry permissions.
- Every endpoint enforces its own authorization check. Access is default-deny — an endpoint with no explicit check is not reachable.
- The frontend never assumes what a user can do; it reflects what the API allows, and the API is the actual enforcement point.
- **Assumption:** flat role-based access is sufficient at launch. Finer-grained, attribute- or policy-based authorization is deferred until a concrete multi-department or multi-permission-tier use case requires it — likely for a "Business Operating System," but not yet specified.

## 8. API Design Standards

- One API style for the whole system, following the response and versioning standards in CodingStandards.md.
- The API is the only way into the system — the frontend today, and any future client (including a future mobile app), goes through the same API. No client-only business logic bypasses it.
- A second query style (e.g., a query language layered on top of REST) is not adopted unless a proven flexibility need arises that REST cannot reasonably serve.

## 9. State Management Strategy

- Server state (data owned by the backend) and client/UI state (form inputs, open/closed toggles, local view state) are treated as separate concerns and are not stored together.
- Server state uses a dedicated fetching/caching approach rather than being reimplemented by hand in every feature.
- Global client-side state is kept minimal. State defaults to living inside the component that needs it and is only lifted or centralized when genuinely shared.

## 10. File Upload Strategy

- Uploaded files are never stored on the application server's local disk — this breaks statelessness and blocks horizontal scaling.
- Files are stored in an object store and referenced from the database by key, not stored as binary data inside PostgreSQL.
- File type and size are validated on the server. Client-side validation is a convenience, never the actual control.
- **Assumption:** the specific object storage provider depends on the cloud provider decision, which is open (see below).

## 11. Background Jobs Strategy

- Work that is slow or deferrable (sending email, generating exports, running notifications) runs asynchronously through a job queue, not inline in a request/response cycle.
- Jobs are written to be safely retryable — running a job twice does not duplicate its effect.
- A failed job retries with backoff and becomes visible for investigation. It is never silently dropped.
- **Assumption:** a lightweight job queue is sufficient at the expected initial scale. A heavier event-streaming platform is not justified yet.

## 12. AI Integration Strategy

- Any AI provider is called from behind the same API and authorization boundary as every other feature. The frontend never calls an AI provider directly.
- AI provider access is wrapped behind one internal interface, so the underlying provider or model can be changed without changing the code that uses it.
- AI-generated output that affects business data is treated as untrusted input and validated like any other input — never applied automatically without a check.
- **Assumption:** which AI provider and which specific features will use AI is entirely undecided. This section states the integration principle only.

## 13. Caching Strategy

- No caching layer is introduced speculatively. Caching is added only in response to a measured performance problem.
- If introduced, the first and simplest target is data that is read often and changes rarely (e.g., reference/configuration data).
- Whoever writes data is responsible for invalidating its cache. Invalidation is never an afterthought bolted on separately.
- **Assumption:** no dedicated caching layer is provisioned at launch.

## 14. Search Strategy

- Basic filtering and text search use PostgreSQL's own query capabilities at launch.
- A dedicated search engine is not introduced until data volume or query complexity demonstrably outgrows what the database can reasonably do.

## 15. Logging & Monitoring Strategy

- All logs are structured and shipped to one centralized destination — never left as local files scattered per server.
- Monitoring is centered on user-facing symptoms (error rate, latency) rather than raw infrastructure metrics alone.
- Every request is traceable end to end, from frontend through backend through logs, via a shared correlation identifier.
- **Assumption:** the specific logging/monitoring vendor is a tooling choice deferred to the accounts-setup stage, not fixed here.

## 16. Deployment Strategy

- Every environment (development, staging, production) is provisioned from the same versioned configuration. No environment is manually hand-configured and left to drift.
- Deployment is automated through a CI/CD pipeline — not manual file transfer or manual server access.
- Every deployment is traceable to a specific commit and can be rolled back.
- **Assumption:** the target cloud provider and hosting model are not yet decided. This is the single largest open question in this document — it directly affects file storage (§10), monitoring tooling (§15), and the specifics of this section.

## 17. Scaling Strategy

- The backend holds no server-side session state that ties a request to a specific instance, so horizontal scaling means adding instances, not redesigning the system.
- The database is scaled vertically first, as the simpler option. Read replicas or partitioning are introduced only once a specific, measured bottleneck justifies them.
- Scaling the database horizontally before there is a proven need is treated as unnecessary complexity.

## 18. Backup Strategy

- Database backups are automated and scheduled, with a defined retention period — never manual or ad hoc.
- Backups are periodically restored as a test, not just taken and assumed to be valid.
- The backup strategy covers both the database and any object storage holding user-uploaded files.

## 19. Disaster Recovery Strategy

- A Recovery Time Objective and Recovery Point Objective are defined before launch, even if initially generous. Having a deliberate number matters more than the number itself at this stage.
- The recovery procedure is written down and tested at least once before it is ever relied on in a real incident.
- Known single points of failure are documented explicitly, even where not all are eliminated at launch — accepting a risk should be a conscious decision, not an oversight.

## 20. Future Mobile App Strategy

- Because the API is the only way into the system (§8), a future mobile app is simply a new client of the existing API. It does not require backend re-architecture, provided the API boundary is respected consistently from day one.
- No mobile-specific work happens now. This section exists only to confirm today's decisions do not foreclose it later.

---

## Future Decisions

Decisions deliberately postponed until a concrete, proven need exists — revisiting any of these early, without a real trigger, is treated as unnecessary complexity:

- Splitting the modular monolith into separate services.
- Multi-region or active-active deployment.
- Per-tenant database or schema isolation, as an alternative to row-level isolation.
- A dedicated caching layer.
- A dedicated search engine.
- Mandatory enterprise SSO.
- Fine-grained, attribute- or policy-based authorization beyond flat roles.
- An internal event bus or message-driven communication between modules.
- Server-side rendering for the frontend.
- Native mobile app development.
- Any disaster-recovery posture beyond a single documented RTO/RPO (e.g., multi-region failover).

---

## Decisions Requiring CTO Approval

Every recommendation above is a proposal. These are the specific points that need an explicit answer before any implementation begins:

1. Confirm multi-tenant SaaS model, and confirm row-level tenant isolation as the launch approach (§2, §5).
2. Confirm modular monolith (not microservices) as the launch architecture (§2, §4).
3. Confirm username/password + optional SSO is sufficient at launch, vs. mandatory SSO (§6).
4. Confirm flat role-based authorization is sufficient at launch, vs. finer-grained authorization (§7).
5. Confirm REST-only API, vs. adding a second API style (§8).
6. Decide the target cloud provider and hosting model — this blocks concrete decisions in file storage, monitoring, and deployment (§10, §15, §16).
7. Confirm no caching layer is provisioned at launch (§13).
8. Confirm database-native search is sufficient at launch, vs. dedicated search infrastructure (§14).
9. Decide which AI provider(s) and which features are AI-powered, once that scope exists (§12).
10. Set target RTO/RPO numbers for disaster recovery (§19).
11. Confirm whether and when a mobile app is actually planned, to calibrate how much the API should anticipate it now (§20).
