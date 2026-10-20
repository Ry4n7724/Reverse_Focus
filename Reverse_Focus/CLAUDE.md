# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Reverse Focus is a Chrome Manifest V3 extension (popup UI = Angular 21 app, plus a background service worker) that blocks websites not on the allowlist of the currently active "study session". UI uses Taiga UI and lucide-angular; storage uses Dexie (IndexedDB).

## Commands

Package manager is pnpm (`packageManager` field; lockfile `pnpm-lock.yaml`, build-script allowlist in `pnpm-workspace.yaml`).

- `pnpm start` — `ng serve` dev server (http://localhost:4200). Note `chrome.*` APIs are unavailable outside the extension context.
- `pnpm run build` — production `ng build` **then** `build:background`. Both steps are required: the Angular build outputs to `dist/Reverse_Focus/` (flat, `browser: ""`), and esbuild bundles `src/background.ts` separately into `dist/Reverse_Focus/background.js` (IIFE). Load `dist/Reverse_Focus/` as an unpacked extension in `chrome://extensions`.
- `pnpm run watch` — `ng build --watch` in development config (does not rebuild `background.js`; run `pnpm run build:background` manually).
- `pnpm test` — `ng test` (Vitest via `@angular/build:unit-test`). Single file: `ng test --include=src/app/dashboard/dashboard.spec.ts`.

Prettier config lives in `package.json` (100 cols, single quotes).

## Architecture

**Two separate entry points sharing code.** The Angular app (`src/main.ts`, popup `index.html`) and the service worker (`src/background.ts`) are built by different toolchains. `background.ts` imports `src/app/session-database/session-db` directly, so that module must stay free of Angular-only dependencies (keep `session-db.ts`/`sessiondb.ts`/`session.ts` plain Dexie).

**Blocking flow:**
1. `background.ts` listens on `chrome.webNavigation.onBeforeNavigate` (main frame only). It skips if `searchModeEnd` in `chrome.storage.local` is in the future; otherwise, for any session with `active: true` whose `urls` don't substring-match the navigated URL (and isn't `chrome://newtab/`), it redirects the tab to `index.html#blocker` and stores the original URL as `blockedUrl`.
2. The `/blocker` route (`WebsiteBlocker`) shows a quote (zenquotes.io via `QuotesService`) and offers a timed "search mode": writes `searchModeEnd` to `chrome.storage.local`, then navigates to `blockedUrl`.
3. State shared between popup and service worker goes through either IndexedDB (sessions) or `chrome.storage.local` (`searchModeEnd`, `blockedUrl`).

**Data layer:** two Dexie DBs, each with a `*-db.ts` (singleton instance), `*db.ts` (Dexie subclass + schema), entity class, and an `@Injectable` service: `session-database/` (`SessionDB`: name, icon, urls, active) and `task-database/` (`TaskDB`: todo items). Schema changes need a new `this.version(n)`.

**Routing (`app.routes.ts`):** `dashboardGuard` redirects based on whether any session is active — `/` (StarterPage) when none, `/dashboard` when one is active. `/create-session` and `/blocker` are unguarded. Unknown paths redirect to `/`.

**Manifest:** `src/manifest.json` is copied as an asset; permissions/host permissions changes go there. Production budgets: component styles warn at 4kB / error at 8kB.
