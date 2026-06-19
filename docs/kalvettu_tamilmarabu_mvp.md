# Kalvettu × Tamil Marabu — MVP

> **Platform context:** [tamilmarabu-platform-architecture.md](./tamilmarabu-platform-architecture.md) · **Memorial product (Smaranam):** [products/smaranam-mvp.md](./products/smaranam-mvp.md)

Kalvettu is the heritage and family legacy product under **Tamil Marabu**, hosted at:

| Service | URL |
|---------|-----|
| **Web app (production)** | `https://kalvettu.tamilmarabu.com` |
| **API (production)** | `https://api.kalvettu.tamilmarabu.com/api` |
| **Parent brand** | `https://tamilmarabu.com` |

Local development continues on `http://localhost:3020` (frontend) and `http://localhost:3021/api` (API).

---

## Product

Kalvettu (கல்வெட்டு) — Sri Lankan digital heritage, family tree, and life story archive for Tamil Marabu families.

**Profile types:** living · memorial · ancestor

**Core flows:**

1. Cognito sign up / sign in  
2. Create & edit heritage profile  
3. Family tree + Sri Lankan relationship labels  
4. Email invites → `/invite/[token]`  
5. Stories / tributes with admin approval  
6. S3 media gallery  
7. Public page → `/heritage/[slug]` (when `privacyLevel=public`)

---

## Architecture

```
kalvettu.tamilmarabu.com     → Amplify Hosting (Next.js)
api.kalvettu.tamilmarabu.com → App Runner (NestJS)
                             → Cognito, DynamoDB, S3, SES
```

---

## Environment (production)

### Amplify / frontend

```bash
NEXT_PUBLIC_SITE_URL=https://kalvettu.tamilmarabu.com
NEXT_PUBLIC_API_URL=https://api.kalvettu.tamilmarabu.com/api
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=...
NEXT_PUBLIC_COGNITO_CLIENT_ID=...
```

### API (`backend/.env`)

```bash
APP_PUBLIC_URL=https://kalvettu.tamilmarabu.com
CORS_ORIGIN=https://kalvettu.tamilmarabu.com,http://localhost:3020
SES_FROM_EMAIL=Kalvettu <noreply@tamilmarabu.com>
# ... DynamoDB, S3, Cognito as before
```

---

## DNS (Route 53 or registrar)

| Record | Type | Target |
|--------|------|--------|
| `kalvettu.tamilmarabu.com` | CNAME | Amplify custom domain |
| `api.kalvettu.tamilmarabu.com` | CNAME | App Runner custom domain |

---

## Cognito

Add to app client **Allowed callback / sign-out URLs** (if using Hosted UI later):

- `https://kalvettu.tamilmarabu.com/`
- `http://localhost:3020/` (dev)

Email/password via `amazon-cognito-identity-js` works without callbacks.

---

## Amplify custom domain

1. Amplify Console → **Domain management** → Add domain `tamilmarabu.com`  
2. Map subdomain **`kalvettu`** → branch `main`  
3. Set environment variables above  
4. Redeploy  

---

## Invite emails

Links must use production site:

```
https://kalvettu.tamilmarabu.com/invite/{token}
```

Set `APP_PUBLIC_URL=https://kalvettu.tamilmarabu.com` on the API.

---

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing (Tamil Marabu branding) |
| `/login`, `/signup` | Cognito auth |
| `/dashboard` | Profile list |
| `/dashboard/profiles/new` | Create profile |
| `/dashboard/profiles/[id]/edit` | Edit profile |
| `/dashboard/profiles/[id]/family-tree` | Family |
| `/dashboard/profiles/[id]/stories` | Approve tributes |
| `/dashboard/profiles/[id]/media` | Gallery upload |
| `/dashboard/profiles/[id]/contributors` | Invites |
| `/heritage/[slug]` | Public heritage book |
| `/heritage/[slug]/tribute` | Public tribute form |
| `/invite/[token]` | Family invite response |

---

## Branding

- Warm cream / maroon / gold UI (heritage memory book)  
- Footer & nav link to [Tamil Marabu](https://tamilmarabu.com)  
- Title: **Kalvettu · Tamil Marabu**
