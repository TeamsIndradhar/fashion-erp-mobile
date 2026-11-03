# Authentication flow

Screens: AUTH-001 … AUTH-011. Backend: thin bearer adapter over the existing `authenticateTenantUser()` and `requireSession()` checks (`docs/03_AUTHENTICATION_DESIGN.md`).

```mermaid
flowchart TD
  S[AUTH-001 Splash] --> V{app-config: version OK?}
  V -- no --> U[AUTH-010 Update required]
  V -- yes --> T{refresh token stored?}
  T -- no --> L[AUTH-002 Login]
  T -- yes --> RF[refresh] -->|ok| ME[GET /me: profile + permission keys]
  RF -->|401| X[AUTH-007 Session expired] --> L
  L -->|wrong / inactive / suspended| E1[AUTH-003 generic error]
  L -->|5 failures| E2[AUTH-004 too many attempts]
  L -->|Forgot password| F[AUTH-005 info sheet]
  L -->|ok| ME
  ME --> MC{mustChangePassword?}
  MC -- yes --> P[AUTH-006 Set your own password] --> RL[silent re-login] --> D
  MC -- no --> NEW{new device?}
  NEW -- yes --> DV[AUTH-009 Verifying this phone] --> D
  NEW -- no --> D{build navigation from permission keys}
  D --> H[role-adaptive Home]
  ME -->|company suspended / user inactive| SUS[AUTH-011]
```

Rules: no company picker (email is unique across companies); the same lockout as web; logout (AUTH-008) revokes the server session; session messages use the server's text.
