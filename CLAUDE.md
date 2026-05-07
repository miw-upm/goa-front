# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con el código de este repositorio.

## Comandos

```bash
npm run start          # Servidor de desarrollo en http://localhost:4200
npm run build-prod     # Build de producción
npm run test-ci        # Ejecutar tests headless con cobertura (Karma + Jasmine)
ng test                # Ejecutar tests de forma interactiva
```

No hay script de lint definido; las verificaciones del compilador de Angular garantizan la seguridad de tipos.

## Arquitectura

**goa-front** es una SPA Angular 19 para una plataforma de servicios legales/empresariales. Sirve múltiples roles: ADMIN, MANAGER, OPERATOR y CUSTOMER.

### Convenciones clave

- **Solo componentes standalone** — no hay NgModules en ninguna parte del proyecto.
- **Rutas con carga diferida (lazy-loaded)** — cada módulo de funcionalidad se carga mediante `loadComponent` / `loadChildren`.
- **Signals para el estado** — signals nativos de Angular 19, no NgRx ni BehaviorSubjects.
- **Idioma**: Español (`es`) está configurado como el locale por defecto de Angular.

### Estructura de rutas

```
/                        → redirige a /home
/callback                → callback OAuth 2.0/OIDC (angular-auth-oidc-client)
/home/*                  → protegido, restringido por rol; sub-rutas con carga diferida:
    users/               → gestión de usuarios (ADMIN)
    consents/            → gestión de consentimientos
    access-links/        → creación/gestión de enlaces de acceso
    legal-tasks/         → seguimiento de tareas legales
    legal-procedure-templates/
    engagement-letters/  → crear, editar, listar
    billing/             → facturas, ingresos, gastos
    chatbot/             → chatbot de IA
    customer-file-download/
/customer/*              → rutas públicas para el cliente (firmar/leer cartas de encargo, editar perfil)
```

### Mapa de módulos

| Ruta | Responsabilidad |
|------|----------------|
| `src/app/core/auth/` | Autenticación OIDC, `AuthService`, guards de rutas |
| `src/app/core/api/` | Constantes de endpoints API, URLs base según entorno |
| `src/app/features/home/` | Funcionalidades protegidas del back-office |
| `src/app/features/customer/` | Flujos públicos del cliente |
| `src/app/features/auth/` | Componente de callback de login |
| `src/app/shared/ui/` | Diálogos reutilizables, componentes CRUD, inputs de formulario, componentes de filtro |
| `src/app/shared/pipes/` | Pipes `capitalize`, `uppercase-words` |

### Autenticación

Usa `angular-auth-oidc-client` (v19). El interceptor HTTP de autenticación se registra de forma funcional en el bootstrap. Las rutas seguras están listadas en la configuración del entorno. `AuthService` expone el estado de autenticación mediante signals.

### Configuración de entorno

Dos entornos (`environment.ts` para dev, `environment.prod.ts` para prod). La configuración incluye:
- URLs base REST para microservicios: `goa-user`, `goa-engagement`, `goa-billing`, `goa-support`, `goa-document`, `goa-chatbot`
- Dev: `localhost:8080` (API) y `localhost:8086` (chatbot) hardcodeados
- Prod: derivados de `window.location.origin`

### UI

Angular Material 19 + CDK. El tema de Material y las animaciones se configuran en el bootstrap en `main.ts`, no mediante NgModules.
