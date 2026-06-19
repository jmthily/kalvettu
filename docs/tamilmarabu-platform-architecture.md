# Tamil Marabu — Platform Architecture

Tamil Marabu is a **multi-product cultural platform** for Tamil families worldwide. Each product lives on its own subdomain under `*.tamilmarabu.com`, sharing auth, media, invites, and UI where it makes sense.

**Parent hub:** [tamilmarabu.com](https://tamilmarabu.com)

---

## Product map

| Subdomain | Working name | Tamil | Focus | Status |
|-----------|--------------|-------|-------|--------|
| `kalvettu.tamilmarabu.com` | **Kalvettu** | கல்வெட்டு | Digital heritage archive — living, memorial, and ancestor profiles | **Active (this repo)** |
| `smaranam.tamilmarabu.com` | **Smaranam** | ஸ்மரணம் | Memorial tribute for someone who has passed — biography, family tree, shared messages | Spec ready → see [products/smaranam-mvp.md](./products/smaranam-mvp.md) |
| `memories.tamilmarabu.com` | **Memories** | நினைவுகள் | Recorded wisdom and life lessons from elders for the next generation | Planned |
| `recipes.tamilmarabu.com` | **Recipes** | — | Authentic Tamil recipes, family collections | Planned |
| `rituals.tamilmarabu.com` | **Rituals** | — | Ceremonies and occasions, priest-verified guidance | Planned |
| `bridge.tamilmarabu.com` | **Bridge** | — | Connect older and younger generations (mentorship, conversation) | Planned |
| `matrimony.tamilmarabu.com` | **Matrimony** | — | Matrimonial profiles for younger generations | Planned |

### Kalvettu vs Smaranam

Both overlap on **memorial** use cases. Recommended split:

| | Kalvettu | Smaranam |
|---|--------|----------|
| **Audience** | Families building a long-term heritage archive | Families mourning and honouring one person who died |
| **Scope** | Living + memorial + ancestor profiles | Memorial-only, tribute-first UX |
| **Today** | Implemented in this repo | Spec + shared modules; can alias to Kalvettu initially |

**Pragmatic path:** Ship memorial flows on **Kalvettu** now. When Smaranam launches, either (a) point `smaranam.tamilmarabu.com` at the same app with memorial-only routes, or (b) extract a thin Smaranam frontend that calls the same shared API modules.

---

## Target monorepo layout

```
tamilmarabu/
├── apps/
│   ├── kalvettu-web/          # Next.js — current src/
│   ├── smaranam-web/          # Next.js — memorial-first UX (future)
│   ├── recipes-web/
│   ├── rituals-web/
│   ├── memories-web/
│   ├── bridge-web/
│   └── matrimony-web/
│
├── packages/
│   ├── ui/                    # Tailwind design system, Navbar, SiteFooter, forms
│   ├── auth/                  # Cognito sign-in, AuthGuard, token storage
│   ├── api-client/            # Bearer fetch, error handling
│   ├── config/                # Parent brand, product registry, URL helpers
│   ├── family-tree/           # Tree UI + Sri Lankan relationship labels
│   ├── invites/               # Invite accept/decline flow components
│   ├── contributors/          # Roles: owner, admin, contributor, viewer
│   ├── media/                 # S3 presign upload UI
│   ├── stories/               # Tributes / messages with moderation
│   └── types/                 # Shared TypeScript interfaces
│
├── services/
│   └── platform-api/          # Single NestJS API (current backend/)
│       ├── core/              # auth, dynamodb, s3, ses
│       ├── kalvettu/          # profiles, people, stories (heritage)
│       ├── smaranam/          # memorial pages (may reuse kalvettu tables)
│       ├── recipes/           # future
│       ├── rituals/           # future + priest verification
│       ├── memories/          # future
│       ├── bridge/            # future
│       └── matrimony/         # future
│
├── infrastructure/
│   └── dynamodb-tables.md
│
└── docs/
    ├── tamilmarabu-platform-architecture.md   # this file
    └── products/
        ├── smaranam-mvp.md
        └── ...
```

---

## Shared vs product-specific

### Reuse across all products

| Module | Backend | Frontend package | Used by |
|--------|---------|------------------|---------|
| **Auth** | `CognitoAuthGuard`, JWT validation | `@tamilmarabu/auth` | All |
| **Media** | S3 presign upload/confirm | `@tamilmarabu/media` | Kalvettu, Smaranam, Memories, Recipes, Rituals |
| **Email / SES** | Transactional email | — | Invites, notifications |
| **Invites** | Token hash, expiry, accept flow | `@tamilmarabu/invites` | Kalvettu, Smaranam, Bridge, Matrimony |
| **Contributors** | Roles + permissions | `@tamilmarabu/contributors` | Kalvettu, Smaranam, Memories |
| **UI shell** | — | `@tamilmarabu/ui` | All subdomains |
| **Config** | `APP_PUBLIC_URL`, CORS | `@tamilmarabu/config` | All |

### Product-specific

| Product | Unique domain logic |
|---------|---------------------|
| **Kalvettu / Smaranam** | Profiles, biography, family tree, memorial tributes |
| **Recipes** | Ingredients, steps, regional variants, collections |
| **Rituals** | Occasion catalog, priest verification workflow, scripture refs |
| **Memories** | Elder interview format, lesson tags, generational linking |
| **Bridge** | Matching aged ↔ younger, scheduling, safe messaging |
| **Matrimony** | Profiles, preferences, family intro workflow, privacy tiers |

---

## API strategy

### Phase 1 (now) — Kalvettu API

```
api.kalvettu.tamilmarabu.com/api
  /profiles, /people, /invites, /stories, /media, /contributors
```

One NestJS service. Tables prefixed `Kalvettu*`.

### Phase 2 — Platform API

```
api.tamilmarabu.com
  /v1/kalvettu/...
  /v1/smaranam/...     # may delegate to same profile/people modules
  /v1/recipes/...
  /v1/rituals/...
```

- **Single Cognito User Pool** — one account across all Tamil Marabu products
- **CORS** — comma-separated list of all product subdomains
- **DynamoDB** — table per product (`TamilMarabuRecipes`, etc.) or shared `Profiles` with `productId` GSI
- **S3** — one bucket with prefix per product: `kalvettu/`, `smaranam/`, `recipes/`

### Phase 3 — Scale

- CloudFront for media
- EventBridge for cross-product notifications (e.g. Smaranam tribute → notify Bridge mentors)
- Optional: split high-traffic products to dedicated App Runner services

---

## Frontend strategy

Each subdomain = **separate Amplify app** (or one Amplify monorepo with per-app `amplify.yml`).

Shared packages published via **npm workspaces** (`packages/*`).

```json
{
  "workspaces": ["apps/*", "packages/*", "services/*"]
}
```

Local dev:

```bash
npm run dev --workspace=apps/kalvettu-web    # localhost:3000
npm run dev --workspace=apps/smaranam-web     # localhost:3001
npm run start:dev --workspace=services/platform-api  # localhost:4000
```

---

## Current repo → future monorepo migration

| Today | Future |
|-------|--------|
| `/src` | `apps/kalvettu-web/src` |
| `/backend` | `services/platform-api` |
| `/src/lib/config/site.ts` | `packages/config` + app-specific overrides |
| `/src/lib/cognito/*` | `packages/auth` |
| `/src/lib/api/*` | `packages/api-client` |
| `/src/components/Navbar.tsx` | `packages/ui` |

**Do not migrate until a second app (Smaranam or Recipes) is started.** Until then, keep building in place and extract packages when duplication appears.

---

## AWS (shared account)

| Service | Shared? | Notes |
|---------|---------|-------|
| Cognito User Pool | Yes | One pool, optional custom attribute `preferredProducts` |
| DynamoDB | Per product tables | GSIs designed per domain |
| S3 | One bucket, prefixes | CORS: all `*.tamilmarabu.com` |
| SES | Yes | `noreply@tamilmarabu.com`, product name in From display |
| Amplify | Per app | Custom subdomain each |
| App Runner | One API initially | Custom domain `api.tamilmarabu.com` later |

---

## DNS pattern

| Record | Points to |
|--------|-----------|
| `kalvettu.tamilmarabu.com` | Amplify (Kalvettu app) |
| `smaranam.tamilmarabu.com` | Amplify (Smaranam app or Kalvettu alias) |
| `api.tamilmarabu.com` | App Runner (platform API) |
| `api.kalvettu.tamilmarabu.com` | App Runner (interim, Kalvettu-only API) |

---

## Security & roles (shared pattern)

All invite-based products use the same contributor model:

| Role | Can do |
|------|--------|
| **owner** | Full control, delete, transfer ownership |
| **admin** | Edit content, invite, approve messages, manage tree |
| **contributor** | Add stories/media, suggest tree changes |
| **viewer** | Read private family content |

Smaranam adds **friend** invite type — can post tribute messages only, not edit biography or tree.

---

## Next steps

1. **Now:** Continue Kalvettu on `kalvettu.tamilmarabu.com` (memorial profile type = Smaranam MVP)
2. **Next doc:** [Smaranam MVP](./products/smaranam-mvp.md) — memorial subdomain spec
3. **When second product starts:** Enable npm workspaces and extract `@tamilmarabu/auth`, `@tamilmarabu/ui`
4. **When API grows:** Namespace routes under `/v1/{product}`
