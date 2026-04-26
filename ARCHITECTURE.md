# Arquitectura del frontend

Este documento describe la organización del código fuente del proyecto, las
reglas de dependencia entre capas y las convenciones que aplicamos. Su
objetivo es servir de guía rápida para nuevos desarrolladores y de referencia
para decisiones arquitectónicas durante la evolución del proyecto.

## Visión general

El proyecto es una aplicación Angular para la gestión de un despacho de
abogados. Está organizada en cuatro capas con responsabilidades claramente
diferenciadas:

```
src/app/
├── core/        Infraestructura transversal específica del proyecto
├── shared/      Utilidades reutilizables SIN lógica de negocio (portables)
├── features/    Funcionalidades de negocio organizadas por dominio
└── app.*        Bootstrap y configuración de rutas
```

## Capas

### `core/` — Infraestructura transversal

Componentes y servicios que sostienen el funcionamiento de la aplicación
completa. Se cargan una vez al arrancar la app y son consumidos desde
cualquier feature.

```
core/
├── api/        Constantes de endpoints (centralizadas)
├── auth/       Autenticación, guards, modelos de roles
├── http/       Builders HTTP de bajo nivel y tipos de error del backend
└── layout/     Layout global (footer, etc.)
```

**No depende de**: ninguna feature, ningún módulo de `shared/`.

**Es específico de este proyecto**, no se transfiere a otros proyectos sin
adaptación.

#### `core/api/endpoints.ts`

Centraliza las URLs de los recursos del backend. Punto único de control
para evitar dispersión de constantes en un equipo grande. Está pensado
para crecer.

#### `core/http/`

Contiene `HttpRequestBuilder` (técnico puro) y `BackendError` (contrato de
errores compartido con el backend). Es la base sobre la que `shared/ui/api/`
añade el comportamiento visual.

### `shared/` (global) — Utilidades portables

Componentes y servicios reutilizables **sin dependencia de negocio**. La
regla práctica: **esta carpeta debe poder copiarse íntegra a otro proyecto**
y seguir funcionando. Es la "biblioteca de UX estándar de la casa".

```
shared/
├── pipes/                          Pipes genéricos
└── ui/
    ├── api/                        HttpService + HttpViewBuilder (HTTP + UX)
    ├── crud/                       Componente CRUD genérico
    ├── dialogs/                    Diálogos reutilizables (warning, confirm…)
    └── inputs/                     Controles de formulario reutilizables
        └── forms/                  Componentes de formulario base
```

**No depende de**: features, dominio del negocio.

**Sí puede depender de**: `core/` (por ejemplo, `shared/ui/api/HttpViewBuilder`
extiende internamente `core/http/HttpRequestBuilder`).

#### `shared/ui/api/`

Aunque internamente usa `MatSnackBar`, `MatDialog` y `Router`, es código
reutilizable porque define **el patrón estándar de la casa** para hacer
peticiones HTTP con feedback visual al usuario. En un proyecto nuevo con la
misma estética, esta carpeta sirve sin cambios.

### `features/` — Lógica de negocio

Funcionalidades de la aplicación organizadas por dominio. Cada subcarpeta
es una feature independiente que conoce y consume `shared/` y `core/`,
pero no debe conocer otras features directamente.

```
features/
├── auth/                       Login (callback OIDC)
├── customer/                   Acceso público sin login (token en URL)
├── home/                       Aplicación interna autenticada
└── shared/                     Utilidades compartidas ENTRE features
```

#### Patrón interno de una feature

Toda feature sigue la misma estructura:

```
<feature>/
├── <feature>.service.ts        Servicio principal de la feature
├── <feature>.routes.ts         Rutas (si aplica)
├── pages/                      Páginas/componentes principales
├── dialogs/                    Diálogos específicos de la feature
└── models/                     Tipos/interfaces del dominio
```

Algunas features añaden subcarpetas auxiliares (`support/`, etc.) cuando
hay utilidades muy específicas que no encajan en el patrón base.

#### `features/auth/`

Gestión del callback de OIDC. La autenticación contra el IdP se delega en
librerías estándar; aquí solo gestionamos el retorno y el establecimiento
de sesión.

#### `features/customer/`

**Filosofía de acceso distinta**. Pensada para el cliente final del
despacho, que no tiene cuenta en la aplicación: recibe un enlace por
WhatsApp con un token en la URL, pincha y realiza una acción simple
contra la app (firmar un documento, completar perfil, etc.).

Optimizado para usuarios sin experiencia técnica, con flujos breves y
autocontenidos. Tiene su propia carpeta `customer/shared/` (placeholder
para futuras utilidades comunes a este flujo público).

#### `features/home/`

Aplicación interna del despacho, accesible tras autenticación. Contiene la
mayor parte de la funcionalidad: cartas de encargo, facturación, usuarios,
plantillas de procedimientos, tareas legales, consentimientos, etc.

#### `features/shared/`

Utilidades reutilizables **entre features**, **con** dependencia del
dominio (despacho de abogados). Ejemplos: modelo de `User`, modelo de
`LegalTask`, componentes `search-by-user`, `search-by-legal-task`, etc.

```
features/shared/
├── models/         Modelos de dominio compartidos (User, LegalTask…)
├── services/       Services agnósticos de feature (shared-user.service…)
└── ui/             Controles UI con vocabulario de dominio
                    (search-by-user, search-by-legal-procedure-template…)
```

**Importante**: a diferencia de `shared/` global, esto NO es portable a otros
proyectos sin adaptación, porque su vocabulario está atado al dominio.

## Reglas de dependencia

Los flechas indican "puede depender de". Las dependencias inversas están
prohibidas.

```
features/<dominio>  →  features/shared
                    →  shared (global)
                    →  core

features/shared     →  shared (global)
                    →  core

shared (global)     →  core

core                →  (nada del proyecto, solo Angular y librerías)
```

Reglas explícitas:

1. **`core/` no conoce a nadie del proyecto**. Solo Angular, RxJS y librerías
   de terceros.
2. **`shared/` global no conoce features ni el dominio**. Si una utilidad
   "huele" a despacho de abogados, va a `features/shared/`, no aquí.
3. **Una feature no importa de otra feature**. Si dos features comparten algo,
   ese algo va a `features/shared/` (si tiene dominio) o a `shared/` global
   (si no lo tiene).
4. **`features/shared/` no es un cajón desastre**. Solo entra lo que
   genuinamente comparten varias features.

## Comunicación con el backend

Toda comunicación HTTP propia de la aplicación pasa por `HttpService` de
`shared/ui/api/`. Las features no usan `HttpClient` directamente.

```
Feature service
      │
      ▼
HttpService.request()        →  HttpViewBuilder
                                  │  (añade snackbar, dialog, router)
                                  ▼
                                HttpRequestBuilder (core/http)
                                  │  (HTTP puro)
                                  ▼
                                HttpClient (Angular)
```

**Excepciones**: las librerías estándar de OIDC/OAuth2 hacen sus propias
peticiones (refresh de tokens, intercambios con el IdP). Eso queda fuera
del builder porque tienen su propia lógica de manejo de errores.

### El builder soporta una API fluida

```typescript
this.httpService.request()
    .param("scope", "engagement-letter")
    .success("Carta firmada correctamente")
    .error("No se pudo firmar la carta")
    .warning()                    // muestra dialog en lugar de snackbar en error
    .post(endpoint, body);
```

Métodos disponibles en `HttpViewBuilder`:

- **Configuración de petición**: `param`, `paramsFrom`.
- **Configuración de feedback**: `success`, `error`, `warning`.
- **Verbos HTTP**: `get`, `post`, `put`, `patch`, `delete`.
- **Especiales**: `openPdf` (descarga blob y lo abre en pestaña nueva).

### Contrato de error con el backend

Todos los microservicios del despacho usan una commons compartida que
define el formato de error en `ErrorMessage.java`:

```typescript
interface BackendError {
    error: string;    // nombre de la clase de excepción
    message: string;  // mensaje corto
    cause: string;    // detalle ampliado (puede ser "")
}
```

El builder valida el formato con un type guard y muestra el snackbar/dialog
apropiado. Si el formato no coincide, muestra "No response from server".

## Convenciones de código

### Nomenclatura de ficheros

**Convención objetivo**: kebab-case para todos los ficheros, siguiendo Angular
Style Guide.

```
✓ engagement-letter.service.ts
✓ signer-document.component.ts
✗ HttpViewBuilder.ts            (debería ser http-view-builder.ts)
✗ SignerDocument.model.ts       (debería ser signer-document.model.ts)
```

Hay inconsistencias históricas en el proyecto. Se irán normalizando
gradualmente cuando se toque cada fichero.

### Sufijos por tipo

```
*.component.ts      Componentes Angular
*.service.ts        Servicios inyectables
*.model.ts          Tipos/interfaces de datos
*.routes.ts         Configuración de rutas de una feature
*.guard.ts          Guards de ruta
*.pipe.ts           Pipes
```

### Naming dentro de features

Cada feature tiene un servicio principal con el nombre de la feature
(`engagement-letter.service.ts`). Si se necesitan más, se añaden con un
prefijo descriptivo.

### Indicadores en `features/shared/services`

Los servicios de `features/shared/services/` se prefijan con `shared-` para
hacer visible que son utilidades compartidas, no servicios principales:

```
shared-user.service.ts
shared-legal-task.service.ts
shared-access-link.service.ts
shared-legal-procedure.service.ts
```

## Decisiones arquitectónicas relevantes

### Por qué dos `shared/`

- `shared/` (global) es un **bloque autocontenido y portable** entre
  proyectos. Ahí va la "biblioteca UX de la casa": dialogs estándar,
  builder HTTP+UI, controles genéricos.
- `features/shared/` contiene utilidades **con vocabulario del dominio**
  (usuarios del despacho, tareas legales, etc.). No es portable, pero
  evita duplicación entre features.

Separarlos físicamente hace evidente la diferencia y previene que código
de dominio acabe contaminando lo portable.

### Por qué el builder HTTP vive en `shared/ui/api/`

Aunque conceptualmente es un servicio técnico (lo que lo acercaría a
`core/`), su responsabilidad principal **integra UI** (snackbar, dialogs,
router). Vive con el resto del estándar visual de la casa porque:

1. **Evoluciona con la UX**, no con el HTTP. Si cambias `WarningDialog`,
   probablemente toques también el builder.
2. **Es portable como bloque** junto al resto de `shared/ui/`.

Si en el futuro un proyecto requiere un builder técnico puro sin UI,
`core/http/HttpRequestBuilder` ya está listo para usarse directamente.

### Por qué `customer/` está separado de `home/`

Son dos aplicaciones con **filosofías de acceso distintas**:

- `home/`: usuarios autenticados (abogados, administrativos del despacho)
  con experiencia y formación.
- `customer/`: clientes finales sin cuenta, que llegan por enlace de
  WhatsApp con token, hacen una acción única y se van. UX optimizada
  para no técnicos.

Mezclar ambas filosofías en un mismo módulo confundiría al desarrollador y
contaminaría el diseño visual. Se mantienen separadas a propósito.

### Por qué `core/api/endpoints.ts` está centralizado

Con varias personas trabajando en el proyecto, dispersar las URLs de
recursos en cada servicio genera incoherencias rápidamente (rutas
duplicadas, typos, formatos distintos). Centralizar las constantes en un
único punto facilita la auditoría y los cambios coordinados.

## Estructura completa de referencia

```
src/app/
├── app.component.{ts,html,css}
├── app.routes.ts
│
├── core/
│   ├── api/
│   │   └── endpoints.ts
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── role-guard.service.ts
│   │   └── models/role.model.ts
│   ├── http/
│   │   ├── backend-error.ts
│   │   └── http-request-builder.ts
│   └── layout/
│       └── footer/
│
├── shared/
│   ├── pipes/
│   └── ui/
│       ├── api/                    HttpService + HttpViewBuilder
│       ├── crud/                   CRUD genérico
│       ├── dialogs/                warning, confirm, info, etc.
│       └── inputs/                 filter-*, search, forms/*
│
└── features/
    ├── auth/                       Login/callback
    ├── customer/                   Acceso público con token
    │   ├── accept-engagement-letter/
    │   ├── edit-profile/
    │   └── shared/                 (placeholder para utilidades comunes)
    ├── home/                       App interna autenticada
    │   ├── access-links/
    │   ├── billing/
    │   ├── chatbot/
    │   ├── consents/
    │   ├── engagement-letter/
    │   ├── issues/
    │   ├── legal-procedure-templates/
    │   ├── legal-tasks/
    │   ├── users/
    │   └── pages/                  Home page
    └── shared/
        ├── models/                 Tipos de dominio compartidos
        ├── services/               shared-*.service.ts
        └── ui/                     Controles con vocabulario de dominio
```

## Mantenimiento de este documento

Este documento debe actualizarse cuando:

1. Se añade una nueva carpeta de primer o segundo nivel.
2. Cambia una regla de dependencia entre capas.
3. Se incorpora un patrón nuevo que merece documentación (p. ej. cambio en
   el manejo de errores HTTP, nueva convención de naming).

Cambios menores (añadir un nuevo `feature/`, un nuevo dialog en
`shared/ui/dialogs/`, etc.) no requieren actualizar el documento.
