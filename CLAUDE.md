# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start          # Dev server at http://localhost:4200
npm run build-prod     # Production build
npm run test-ci        # Run tests headless with coverage (Karma + Jasmine)
ng test                # Run tests interactively
```

No lint script is defined; Angular compiler checks enforce type safety.

## Architecture

**goa-front** is an Angular 19 SPA for a legal/business services platform. It serves multiple roles: ADMIN, MANAGER, OPERATOR, and CUSTOMER.

### Key conventions

- **Standalone components only** — no NgModules anywhere in the project.
- **Lazy-loaded routes** — every feature module is loaded via `loadComponent` / `loadChildren`.
- **Signals for state** — Angular 19 native signals, not NgRx or BehaviorSubjects.
- **Locale**: Spanish (`es`) is set as the default Angular locale.

### Route structure

```
/                        → redirects to /home
/callback                → OAuth 2.0/OIDC callback (angular-auth-oidc-client)
/home/*                  → protected, role-gated; lazy-loaded sub-routes:
    users/               → user management (ADMIN)
    consents/            → consent management
    access-links/        → access link creation/management
    legal-tasks/         → legal task tracking
    legal-procedure-templates/
    engagement-letters/  → create, edit, list
    billing/             → invoices, income, expenses
    chatbot/             → AI chatbot
    customer-file-download/
/customer/*              → public customer-facing routes (sign/read engagement letters, edit profile)
```

### Module map

| Path | Responsibility |
|------|---------------|
| `src/app/core/auth/` | OIDC authentication, `AuthService`, route guards |
| `src/app/core/api/` | API endpoint constants, environment-driven base URLs |
| `src/app/features/home/` | Protected back-office features |
| `src/app/features/customer/` | Public customer flows |
| `src/app/features/auth/` | Login callback component |
| `src/app/shared/ui/` | Reusable dialogs, CRUD components, form inputs, filter components |
| `src/app/shared/pipes/` | `capitalize`, `uppercase-words` pipes |

### Authentication

Uses `angular-auth-oidc-client` (v19). The HTTP auth interceptor is registered functionally at bootstrap. Secure route paths are listed in the environment config. `AuthService` exposes auth state via signals.

### Environment config

Two environments (`environment.ts` for dev, `environment.prod.ts` for prod). Config includes:
- REST base URLs for microservices: `goa-user`, `goa-engagement`, `goa-billing`, `goa-support`, `goa-document`, `goa-chatbot`
- Dev: hardcoded `localhost:8080` (API) and `localhost:8086` (chatbot)
- Prod: derived from `window.location.origin`

### UI

Angular Material 19 + CDK. Material theme and animations are configured at bootstrap in `main.ts`, not via NgModules.
