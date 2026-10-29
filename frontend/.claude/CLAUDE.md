
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
# FutLovers — Claude Project Instructions

## 1. Project Context

FutLovers is a football community platform focused initially on amateur football in Spain.

The long-term vision is to build the largest amateur football community in Spain, starting locally in Dénia / Costa Blanca and expanding progressively to other cities.

The immediate objective is NOT monetization or building physical sports complexes.

The immediate objective is:

> Launch the MVP as quickly as possible, acquire real users, create recurring football activity, and validate the product.

The current MVP should prioritize:

1. Finding existing football matches.
2. Joining matches.
3. Creating matches.
4. Building a local community.
5. Establishing basic player profiles.
6. Establishing basic player reliability.
7. Collecting basic player statistics.

Avoid implementing future-stage functionality unless it is necessary for the MVP or requires very little additional work.

---

# 2. Current Product Strategy

## Primary product

FutLovers is primarily a platform to PLAY football, not a pitch-booking platform.

The primary user flow is:

```text
Open app
    ↓
Determine location
    ↓
Show today's matches
    ↓
Select match
    ↓
Join match
```

Pitch booking is secondary during the MVP.

The application should not feel like a traditional sports-pitch booking application.

The primary question the application should answer is:

> "Where can I play football today?"

---

# 3. MVP Scope

## Core functionality

Implement the minimum functionality required to:

* Register.
* Log in.
* Create a profile.
* Discover matches.
* View match details.
* Create a match.
* Join a match.
* Leave a match.
* See players participating in a match.
* Display basic player level.
* Display basic reliability / no-show information.
* Determine the user's location.
* Allow the user to change their selected location.

## Out of scope for the initial MVP

Do NOT implement these unless explicitly requested:

* Payments.
* Premium memberships.
* Complex booking systems.
* Physical sports complex management.
* AI cameras.
* Advanced player tracking.
* Wearable integrations.
* Sponsorship management.
* Complex league management.
* Advanced tournament management.
* Internationalization.
* Microservices.
* Complex recommendation algorithms.

These belong to later product stages.

---

# 4. Current Architecture

The current architecture is intentionally simple.

```text
Angular
    ↓
Supabase
    ├── Auth
    ├── PostgreSQL
    ├── Row Level Security
    └── Storage / Realtime when required
```

The MVP does NOT currently have a custom backend API.

Do not introduce a custom backend merely for architectural purity.

Only introduce backend code when there is a real requirement that cannot reasonably be handled by Angular + Supabase.

---

# 5. Repository Structure

The project is organized conceptually as:

```text
futLovers/
├── frontend/
├── backend/
├── docs/
├── README.md
├── CHANGELOG.md
└── .gitignore
```

## Frontend

Angular application.

## Backend

Reserved for backend-specific code and Supabase configuration/functions.

The existence of the `backend` directory does NOT mean a custom backend must be implemented immediately.

## Documentation

All project documentation belongs under `docs/`.

---

# 6. Database

The current database contains three main tables:

```text
profiles
matches
match_player
```

## profiles

Represents the public profile of a FutLovers user.

Current security model:

* Public profiles can be read according to the existing RLS policy.
* A user can edit their own profile according to the existing RLS policy.

## matches

Represents a football match.

Current RLS policies are generic and may need to be hardened as functionality is implemented.

## match_player

Represents the relationship between a player and a match.

Current RLS policies are generic and may need to be hardened as functionality is implemented.

IMPORTANT:

Never assume that generic RLS policies are production-ready.

When implementing functionality involving database writes, verify that the corresponding RLS policy actually enforces the intended business rule.

---

# 7. Supabase Rules

Use Supabase as the primary backend service during the MVP.

Prefer:

* Supabase Auth for authentication.
* PostgreSQL for persistent data.
* RLS for authorization.
* Supabase Storage when file storage is required.
* Supabase Edge Functions only when server-side execution is actually required.

Never expose secret keys in frontend code.

Never bypass RLS merely to simplify frontend development.

Never put service-role credentials in Angular or any client-side environment.

Use the publishable/anon client-side key as appropriate for the Supabase project.

---

# 8. Security

Security is part of the implementation, not a later cleanup task.

Before implementing a database operation, consider:

* Who can read this data?
* Who can create it?
* Who can modify it?
* Who can delete it?
* Can a user modify another user's data?
* Can a user join the same match twice?
* Can a user join a full match?
* Can a user manipulate another player's participation?
* Can an unauthenticated user perform the operation?

Prefer enforcing security-critical rules at the database/backend level rather than relying exclusively on frontend validation.

Frontend validation improves UX.

It is NOT a security boundary.

---

# 9. Product Rules

Business rules must not be invented casually.

If a requirement is unclear:

1. Check the existing documentation.
2. Check the existing implementation.
3. If still unclear, ask for clarification before implementing behavior that could affect the product model.

Do not silently invent:

* pricing;
* penalties;
* player ranking algorithms;
* reliability formulas;
* match capacity rules;
* cancellation policies;
* booking policies.

When a new business rule is introduced, update the relevant documentation.

---

# 10. Architecture Principles

Prefer simple architecture over premature abstraction.

## Rules

* Do not introduce libraries without a reason.
* Do not create abstractions before they are needed.
* Do not create generic services that only have one consumer unless there is a clear architectural reason.
* Keep features isolated.
* Keep business logic out of presentational components.
* Keep Supabase access out of UI components whenever reasonably possible.
* Prefer feature-based organization.
* Prefer small, focused components.
* Prefer explicit code over clever code.

The goal is maintainable simplicity, not maximum architectural sophistication.

---

# 11. Development Workflow

Claude is expected to do as much implementation work as possible while keeping every meaningful step reviewable.

For each task:

## Step 1 — Understand

Before changing code:

* Inspect the relevant files.
* Inspect the existing architecture.
* Inspect related database types/schema.
* Check existing documentation.
* Identify dependencies and side effects.

Do not modify code based only on assumptions.

## Step 2 — Plan

Create a concise implementation plan before making significant changes.

The plan should identify:

* files to modify;
* files to create;
* database changes;
* security implications;
* tests required;
* documentation changes.

## Step 3 — Implement

Implement the complete task rather than stopping after the first obvious change.

Prefer the smallest implementation that correctly solves the requirement.

## Step 4 — Verify

After implementation:

* Run the relevant tests.
* Run the TypeScript compiler/build when appropriate.
* Check linting when available.
* Check for obvious accessibility issues.
* Check affected flows.
* Check that no secrets were introduced.
* Check git diff.

## Step 5 — Documentation

If the implementation changes:

* architecture;
* database structure;
* business rules;
* UX;
* API behavior;
* project decisions;

update the relevant documentation.

Do not leave documentation knowingly outdated.

## Step 6 — Git

Before suggesting a commit:

```text
git status
git diff
```

Review the changes.

Only then propose the commit.

Claude MUST NOT commit or push unless explicitly authorized to do so.

---

# 12. Git Commit Convention

Use Conventional Commits.

Allowed primary types:

* feat
* fix
* docs
* refactor
* chore
* test
* build
* ci
* perf
* style

## Examples

```text
feat: add match creation
feat: allow players to join matches
fix: prevent duplicate match participation
docs: document match database model
refactor: extract match service
chore: configure project tooling
test: add match service tests
build: add supabase client
```

## Commit rules

Commit messages must:

* be written in English;
* use imperative style;
* be concise;
* describe the actual change;
* avoid unnecessary detail.

Do NOT use vague commits such as:

```text
update
changes
fix stuff
final
more changes
```

Prefer one logical change per commit.

---

# 13. Documentation Rules

Documentation is part of the project.

Current documentation structure:

```text
docs/
├── vision.md
├── mvp.md
├── architecture.md
│
├── decisions/
│   ├── 001-supabase-as-backend.md
│   ├── 002-play-first-ux.md
│   ├── 003-monolith-over-microservices.md
│   └── 004-match-booking-separation.md
│
├── database/
│   ├── README.md
│   ├── schema.md
│   ├── relationships.md
│   └── security.md
│
├── frontend/
└── backend/
```

## Documentation principle

Code explains HOW.

Documentation explains WHY.

Do not document obvious implementation details that can be understood directly from clean code.

Document decisions, architecture, business rules, constraints and important workflows.

---

# 14. Architecture Decision Records

Use ADRs when making an important architectural decision.

An ADR should normally contain:

```md
# ADR-X: Decision title

## Status

Proposed / Accepted / Rejected / Superseded

## Context

Why is this decision necessary?

## Decision

What was decided?

## Alternatives considered

What other options were considered?

## Consequences

What are the benefits and drawbacks?
```

Do not create ADRs for trivial implementation details.

Never delete an old ADR because the decision changed.

Mark it as superseded and create a new ADR.

---

# 15. Changes Requiring Special Attention

Claude should stop and request approval before making changes that:

* delete production data;
* perform destructive database migrations;
* remove existing functionality;
* significantly change the database model;
* change authentication behavior;
* change RLS policies in a potentially breaking way;
* introduce a new major dependency;
* introduce a custom backend;
* change deployment configuration;
* expose new public APIs;
* introduce significant recurring infrastructure costs.

Normal implementation work does not require approval before every individual file edit.

The user wants Claude to maximize implementation autonomy while preserving control over meaningful architectural and destructive decisions.

---

# 16. Database Changes

Never modify the database schema casually.

For schema changes:

1. Explain the intended change.
2. Identify affected tables and relationships.
3. Consider existing data.
4. Consider RLS.
5. Create a migration.
6. Update database documentation.
7. Verify generated types if applicable.

Never edit the database manually in a way that leaves the repository unaware of the change.

The migration history should remain reproducible.

---

# 17. Frontend Guidelines

Follow `.claude/angular.md` for Angular and TypeScript-specific rules.

Project-specific frontend rules:

* Use feature-based architecture.
* Keep UI components focused.
* Keep business logic outside presentation components.
* Keep Supabase queries inside appropriate services/data-access layers.
* Use typed models.
* Avoid `any`.
* Prefer signals for local/reactive state.
* Do not introduce global state management unless justified.
* Build mobile-first.
* Prioritize the "Play" flow.

---

# 18. UX Priorities

The main UX objective is reducing the time between opening FutLovers and finding a football match.

Target flow:

```text
Open
 ↓
Location
 ↓
Today's matches
 ↓
Match details
 ↓
Join
```

Avoid unnecessary onboarding steps.

Avoid unnecessary forms.

Avoid asking users for information that is not needed for the current action.

If a user can perform an action in fewer steps without reducing clarity or safety, prefer the shorter flow.

---

# 19. Performance

Optimize for real-world mobile usage.

Prioritize:

* fast initial loading;
* lazy-loaded features;
* efficient Supabase queries;
* avoiding unnecessary requests;
* avoiding unnecessary change detection;
* optimized images;
* pagination when datasets can grow.

Do not perform premature micro-optimizations.

Measure or identify an actual problem before introducing complex optimization.

---

# 20. Accessibility

Accessibility is a requirement.

Follow the accessibility rules defined in `.claude/angular.md`.

Additionally:

* interactive elements must be keyboard accessible;
* loading states must be understandable;
* empty states must provide useful next actions;
* errors must be understandable;
* color must never be the only way to communicate state.

---

# 21. Testing

Prioritize tests around business-critical functionality.

Highest priority:

1. Authentication.
2. Match creation.
3. Joining a match.
4. Leaving a match.
5. Match capacity.
6. Duplicate participation.
7. Permissions/RLS.
8. Reliability/no-show logic.

Do not spend excessive time testing trivial presentational code during the initial MVP.

---

# 22. Future Features

The following are future-stage concepts and should not influence MVP implementation unless required:

* premium membership;
* booking discounts;
* bar benefits;
* football tracking devices;
* AI camera statistics;
* leagues;
* tournaments;
* owned sports complexes;
* advanced player analytics;
* sponsorships;
* expansion across Spain.

The architecture should avoid making these features impossible in the future, but should NOT implement them prematurely.

---

# 23. General Rule

When choosing between:

```text
Fast + simple + maintainable
```

and:

```text
Complex + theoretically scalable + unnecessary now
```

choose the first option for the MVP.

Build for the product that exists today while avoiding decisions that unnecessarily prevent the product from growing tomorrow.

The primary objective is:

> Get FutLovers into the hands of real football players as quickly as possible.
