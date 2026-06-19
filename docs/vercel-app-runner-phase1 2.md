# Phase 1 — Vercel + App Runner (no Cognito, no Amplify)

Weekend MVP architecture for Kalvettu / Tamil Marabu.

```
tamilmarabu.com / kalvettu.tamilmarabu.com
        │
        ▼
     Vercel (Next.js)
        │
        ▼
api.tamilmarabu.com
        │
        ▼
  NestJS (App Runner)
        │
        ├── DynamoDB (profiles, media, admins, invites)
        ├── S3 (photos/, videos/, audio/, documents/)
        └── SES (optional later — share via WhatsApp copy/paste for now)
```

---

## Phase 1 features

| Feature | How |
|---------|-----|
| Admin login | Email + password in **DynamoDB** (`KalvettuAdmins`) |
| Create memorial | Dashboard → Create profile |
| Share with family | **Generate share link** → WhatsApp/email |
| Family upload | Opens `/share/{token}` → no account → upload to S3 |
| Admin approve | Media page → Approve |
| Public page | `/heritage/[slug]` when privacy = public |

**Deferred:** Cognito, Amplify, SES invite emails, full family tree invites.

---

## Local development

**Terminal 1 — API**

```bash
cd backend
cp .env.example .env   # or use existing backend/.env
npm install
npm run start:dev
```

**Terminal 2 — Frontend**

```bash
npm install
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3020
NEXT_PUBLIC_API_URL=http://localhost:3021/api

npm run dev
```

**First-time admin**

1. Open `http://localhost:3020/setup`
2. Create admin email + password (stored in DynamoDB)
3. Sign in at `/login`

---

## DynamoDB tables

Existing tables plus:

### KalvettuAdmins

| Key | Type |
|-----|------|
| PK: `email` | String |

```bash
aws dynamodb create-table \
  --table-name KalvettuAdmins \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-2
```

See [infrastructure/dynamodb-tables.md](../infrastructure/dynamodb-tables.md) for other tables.

---

## Backend env (`backend/.env`)

```bash
AWS_REGION=ap-southeast-2
JWT_SECRET=your-long-random-secret
APP_PUBLIC_URL=http://localhost:3020
CORS_ORIGIN=http://localhost:3020,https://kalvettu.tamilmarabu.com,https://*.vercel.app

DYNAMODB_ADMINS_TABLE=KalvettuAdmins
DYNAMODB_PROFILES_TABLE=KalvettuProfiles
# ... other tables
S3_BUCKET_NAME=kalvettu-media-dev
```

Remove Cognito vars for Phase 1 (optional to keep for later).

---

## Frontend env (Vercel)

```bash
NEXT_PUBLIC_SITE_URL=https://kalvettu.tamilmarabu.com
NEXT_PUBLIC_API_URL=https://api.tamilmarabu.com/api
```

---

## Deploy

### Vercel (frontend)

1. Import GitHub repo in [Vercel](https://vercel.com)
2. Framework: **Next.js**
3. Set env vars above
4. Deploy — automatic previews on PRs

### App Runner (backend)

1. Dockerize `backend/` or use source deploy
2. Env from `backend/.env`
3. Custom domain: **`api.tamilmarabu.com`**
4. `CORS_ORIGIN` must include your Vercel URL(s)

---

## Upload flow

```
Browser → POST /api/profiles/:id/media/presign
       → PUT file to S3 presigned URL
       → POST /api/profiles/:id/media/confirm
```

S3 keys: `profiles/{profileId}/photos|videos|audio|documents/{mediaId}.ext`

---

## Share link flow

```
Admin → Generate share link (Contributors page)
     → Copy link: https://yoursite.com/share/{token}
Family → Opens link → Continue → upload media (share JWT, no login)
Admin → Approve media → public heritage page
```

---

## Later (Phase 2)

- Cognito for multi-admin / family accounts
- SES for automated invite emails
- Remove simple admin table or migrate to Cognito
