# Coding Standards

This document is the binding baseline for all code in this repository. Every rule here is enforceable in review or CI. When a rule and a convenience conflict, the rule wins.

---

## 1. Naming Conventions

- Variables and functions: `camelCase`.
- Classes, interfaces, types, enums: `PascalCase`.
- Interfaces are not prefixed with `I` (`User`, not `IUser`).
- DTO types are suffixed `Dto` (`CreateUserDto`).
- Boolean variables are prefixed `is`, `has`, `can`, or `should` (`isActive`, `hasPermission`).
- Module-level constants: `UPPER_SNAKE_CASE`.
- Enum members: `PascalCase`, not `UPPER_CASE`.
- No abbreviations except universally understood ones (`id`, `url`, `api`, `db`).
- No single-letter identifiers except loop indices (`i`, `j`) and generic type parameters (`T`, `K`, `V`).

## 2. Folder Conventions

- One feature per folder; folder names are `kebab-case`.
- A feature folder owns its components, hooks, services, and types. No file outside the folder imports its internals directly — only its public export.
- Shared code lives in a single `shared/` (or `common/`) location. Never duplicate a utility across features.
- No folder nesting deeper than 4 levels from its feature root.
- `index.ts` barrel files exist only at the feature-folder boundary, never inside it.
- Test files sit beside the file they test, suffixed `.spec.ts` (unit/integration) or `.e2e-spec.ts` (end-to-end).
- Any file exceeding 300 lines must be split.

## 3. React Conventions

- Functional components only. No class components.
- One component per file; file name matches the component name.
- Props are typed via an explicit interface named `<Component>Props`.
- Functions passed as props to memoized children are wrapped in `useCallback`.
- Custom hooks start with `use` and never return JSX.
- Components contain no business logic — they call hooks or services and render.
- State lives as close as possible to where it is used; lift state only when more than one component needs it.
- Components use named exports, never default exports.
- Context providers wrap only the subtree that needs the context, never the whole app by default.

## 4. NestJS Conventions

- One module per business capability. Modules are not organized by technical layer (no `ControllersModule`).
- Controllers contain no business logic; they validate input via DTOs and delegate to services.
- Services never reference `Request`/`Response` objects directly.
- All dependencies are constructor-injected. No manual `new` on a provider.
- One exported class per file, file named per Nest convention (`user.controller.ts`, `user.service.ts`, `user.module.ts`).
- Guards, interceptors, and pipes are stateless and hold no per-request mutable fields.
- No circular module imports. `forwardRef` is used only as a last resort, with a comment explaining why.

## 5. TypeScript Rules

- `strict: true` in `tsconfig.json` is non-negotiable.
- `any` is forbidden. Use `unknown` and narrow it.
- No `as` type assertion to silence a type error — fix the underlying type.
- `@ts-ignore` / `@ts-expect-error` require a linked issue reference in the same comment.
- Exported functions declare explicit return types; do not rely on inference across module boundaries.
- Use `type` for unions and intersections; use `interface` for object shapes meant to be extended.
- Use literal union types for fixed string sets; use `enum` only when the values need runtime iteration.
- The non-null assertion operator (`!`) requires a comment justifying why the value cannot be null.

## 6. API Response Standards

- Every response uses one envelope shape: `{ success, data, error, meta }`.
- A success response never includes `error`; an error response never includes `data`.
- Paginated data is shaped `{ items, total, page, pageSize }` inside `data`.
- HTTP status codes match the semantic outcome (`201` on create, `204` on delete with no body — never `200` for everything).
- Response fields are `camelCase`; no `snake_case` leaks from the database layer.
- API routes are explicitly versioned (`/api/v1/...`).

## 7. Error Handling

- All errors are typed exception classes, never raw strings or plain objects.
- Every custom exception extends one shared `AppException` base.
- No empty `catch` blocks. Every `catch` handles, rethrows, or logs with context.
- Errors are never silently swallowed in a production code path.
- Client-facing error messages never expose stack traces, SQL, or file paths.
- One global exception filter maps exceptions to HTTP responses; controllers never hand-format error output.

## 8. Validation

- All external input (body, query, params) is validated via DTO + `class-validator` before it reaches business logic.
- Validation happens once, at the boundary. It is not repeated deeper in the call stack.
- DTOs reject unknown fields (`whitelist: true`, `forbidNonWhitelisted: true`).
- Frontend forms validate on blur and on submit; backend validation is never the only line of defense for UX.
- Validation errors report every failing field, not just the first.

## 9. Logging

- Logging goes through a structured logger emitting JSON. No `console.log` in committed code.
- Every log line carries a severity: `debug`, `info`, `warn`, `error`.
- Secrets, tokens, passwords, and full PII-bearing request bodies are never logged.
- Every error log includes a correlation/request ID.
- Logs mark service boundaries (calls to external systems), not iterations inside a loop.

## 10. Git Commit Naming

- Conventional Commits format: `<type>(<scope>): <subject>`.
- Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`, `ci`.
- Subject line is imperative mood ("add", not "added"), 72 characters or fewer.
- One logical change per commit.
- Breaking changes are marked with `!` after the type/scope and explained in the commit body.

## 11. Pull Request Checklist

- [ ] Title follows Conventional Commits format.
- [ ] Description states what changed and why.
- [ ] Linked to its tracking issue.
- [ ] New code has test coverage.
- [ ] No commented-out code or debug logging left in.
- [ ] CI is green: lint, type-check, tests, build.
- [ ] No unresolved `TODO` without a linked ticket.
- [ ] UI changes include a screenshot or recording.

## 12. Security Rules

- No secret, API key, or credential is ever committed, including in history.
- All user input is treated as untrusted and sanitized before storage or render.
- All database queries are parameterized; no string-concatenated SQL.
- Auth tokens are never stored in `localStorage`; use `httpOnly` cookies.
- Every endpoint has an explicit authorization check; access is default-deny.
- Dependencies are scanned for known vulnerabilities before merge.
- CORS uses an explicit allow-list; `*` is never used in production.

## 13. Performance Rules

- No N+1 database queries; use joins or batched loading.
- All list endpoints are paginated; no endpoint returns an unbounded result set.
- `useMemo`/`useCallback` and server-side caching are applied only where profiling shows measurable cost, not speculatively.
- Columns used in `WHERE`, `JOIN`, or `ORDER BY` are indexed.
- A dependency addition that meaningfully increases bundle size requires explicit reviewer sign-off.

## 14. Accessibility Rules

- Every interactive element is reachable and operable by keyboard alone.
- Every meaningful image has `alt` text; decorative images use an empty `alt`.
- State is never conveyed by color alone; pair it with text or an icon.
- Every form input has an associated, visible label.
- Body text meets a 4.5:1 contrast ratio (WCAG AA).
- Focus state is always visible; `outline: none` is never used without a visible replacement.

## 15. Code Review Checklist

- [ ] The change does what the PR claims, and nothing more.
- [ ] Naming, folder, and language conventions above are followed.
- [ ] No dead code, unused imports, or unreachable branches.
- [ ] Edge cases considered: empty, null, max-length, concurrent access.
- [ ] No obvious security or performance regression.
- [ ] Tests assert behavior, not implementation detail.

## 16. Definition of Done

- [ ] Merged to `main` via a reviewed, approved PR.
- [ ] Automated tests pass in CI.
- [ ] No new lint, type-check, or build warnings.
- [ ] Documentation updated if behavior or API changed.
- [ ] Verified running in a live environment, not only via unit tests.
- [ ] No known regression in existing functionality.
