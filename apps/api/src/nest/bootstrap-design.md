# Nest 11 bootstrap spike

Status: passed as a bootstrap proof only. This is not production Nest hosting code.

## Decision summary

| Question | Decision |
| --- | --- |
| `http.Server` creation | Keep `createSocketServer()` as the server factory. It wraps the Nest host Express instance, attaches the existing Socket.IO configuration, and returns the only server that listens. |
| Deferred Express import | Load dotenv first, then dynamically import `../core/app`. The import completes before `LocaleService.validateAndLoad()`, directory and credential setup, database validation, and Nest creation. |
| Module route loading | Keep `loadAndRegisterModuleRoutes()` unchanged. Its top-level `await` completes during the deferred Express import, before Nest DI starts. No `OnModuleInit` conversion is needed for this hosting arrangement. |
| `req.io` | Preserve the existing request-property contract. `createSocketServer(hostExpress)` sets `hostExpress.request.io`; the legacy app is mounted on that same host, so its route handlers receive the same request object. The existing `apps/api/src/express.d.ts` declaration remains sufficient. No `APP_INTERCEPTOR` is needed. |
| Server lifecycle | Nest is initialized with `app.init()` only. The existing Socket.IO-wrapped server is listened on port `13636` and closed explicitly. `nestApp.close()` only closes Nest's unused adapter server and Nest resources. |

## Hosting order

The spike uses a separate Express host created by `ExpressAdapter`. Nest routes are registered on that host first. The legacy Express app is then mounted at `/api` for the requested proof URLs and at `/` to retain its existing route paths. The adapter suppresses Nest's default not-found handler because the legacy app already owns its catch-all response. Neither the legacy app source nor its route or middleware registration is changed.

Nest's default body parser is disabled. The legacy app therefore remains the owner of raw and JSON body parsing and middleware order.

The `AppModule` health controller is registered by Nest and runs before the mounted legacy app. The legacy module manifest and probe route run through the unchanged Express route loader. Socket.IO is attached after Nest initialization and before the shared server starts listening.

## Top-level await and DI

`core/routes/index.ts` still evaluates `const appRoutes = await loadAndRegisterModuleRoutes()` at import time. The bootstrap deliberately keeps this outside Nest's module graph: dotenv is loaded, then the dynamic import of `core/app` awaits the complete Express route graph. Only after that promise resolves does the bootstrap create and initialize Nest. This proves the existing top-level await survives the host arrangement without changing it. A future migration that moves module loading into Nest providers would need a separate lifecycle design; this spike does not make that change.

## Verification

The run used the isolated PocketBase fixture and synthetic credentials, with real HTTP and Socket.IO clients:

- `GET http://127.0.0.1:13636/api/health` returned `200` and `{"status":"ok","ioAvailable":true}`.
- Authenticated `GET http://127.0.0.1:13636/api/modules/manifest` returned `200` with module list `Nest Bootstrap Probe`, `Notes`, `Squad Backlog`, and `Todo List`.
- Socket.IO connected to `/qr-login` on `http://127.0.0.1:13636` using the existing namespace and configuration.
- The temporary module route returned `200` with `{"state":"success","data":true}`, proving the existing Forge controller callback received `io` from `req.io`.
- The temporary module emitted `[nest-bootstrap-probe] module-imported`. The observed log order was `env-loaded`, module-loader detection, probe import, module-loader completion, `express-imported`, locale loading, and `listening 13636`. This proves module import-time work completed during the deferred Express import, before the Nest host started.

Nest dependencies were installed only as temporary development dependencies in `apps/api/package.json` for the run and removed afterward. Existing module-level dependencies were not changed. The temporary probe module and runtime artifacts were removed after verification.

## Dispatchability boundary

The bootstrap prerequisite is proven: a Nest 11 application can host the current Express route graph and Socket.IO on one listening server while preserving the deferred import and `req.io` coupling. Plans T-NEST-HOST through T-NEST-PILOT may proceed to their separately scoped work; this spike does not claim that any route or module has been migrated to Nest. The Unified Kanban decorator-transform warning is pre-existing: it was observed during this spike because the unchanged development loader evaluated the existing module, but this spike did not alter the loader, module, or transform configuration. It is unrelated to this change, and Unified Kanban remains skipped by the current loader.
