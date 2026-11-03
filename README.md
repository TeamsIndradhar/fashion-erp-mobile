# Fashion ERP Mobile

Android + iOS app (React Native / Expo SDK 58) for employees of companies using the Fashion ERP. Release 1: login + attendance.

**Status:** see `docs/14_MOBILE_PROJECT_STATUS.md`.

- Backend: the existing Fashion ERP (`fashion-erp` repo, GitHub `TeamsIndradhar/fashion-erp`), production `https://erp.indradhar.in/`. This repo has no database or backend of its own; mobile API routes live under `fashion-erp/src/app/api/mobile/v1`.
- Start here: `docs/00_PROJECT_OVERVIEW.md`, then `docs/12_DECISION_LOG.md` and `docs/11_IMPLEMENTATION_ROADMAP.md`.
- AI agents: read `docs/13_AI_AGENT_WORKFLOW.md` before any work.

## Run the app (development)

The app uses native modules, so it runs in an Expo **development build**, not Expo Go (docs/10).

```bash
npm ci
cp .env.example .env          # set EXPO_PUBLIC_API_BASE_URL to your PC's LAN address running the ERP
npx expo run:android          # needs Android Studio / SDK; or: npx eas build --profile development
npm start                     # Metro for the dev build
```

Checks: `npm run typecheck`, `npm run lint`, `npm test`.

Layout: `app/` screens (expo-router) · `src/api` client, endpoints, types · `src/auth` session, token store, AuthProvider · `src/components` shared UI · `src/theme` design tokens · `src/features/*` per-module code · `design/` approved designs · `docs/` plan.
