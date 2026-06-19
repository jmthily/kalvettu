# Kalvettu · Tamil Marabu

**A Sri Lankan digital heritage and memorial archive** — part of [Tamil Marabu](https://tamilmarabu.com).

| Environment | URL |
|-------------|-----|
| Frontend (Vercel) | `https://kalvettu.tamilmarabu.com` |
| API (App Runner) | `https://api.tamilmarabu.com/api` |
| Local dev | `http://localhost:3020` + `http://localhost:3021/api` |

**MVP guide:** [docs/mvp-first-version.md](docs/mvp-first-version.md)

## Architecture (Phase 1)

```
Vercel (Next.js /frontend)  →  api.tamilmarabu.com  →  NestJS (App Runner /backend)
                                                          ├── DynamoDB
                                                          ├── S3
                                                          └── SES (later)
```

## Project structure

```
kalvettu/
├── frontend/            # Next.js 15 — deploy to Vercel (Root Directory: frontend)
├── backend/             # NestJS API — deploy to App Runner
├── infrastructure/      # DynamoDB table docs
└── docs/
```

## Local development

**Terminal 1 — API**

```bash
cd backend
cp .env.example .env   # set JWT_SECRET, AWS, DynamoDB table names
npm install
npm run start:dev      # http://localhost:3021/api
```

**Terminal 2 — Frontend**

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev            # http://localhost:3020
```

1. Create DynamoDB tables (see `infrastructure/dynamodb-tables.md`)
2. Open `http://localhost:3020/setup` → create admin
3. Login → create memorial → public page at `/memorial/your-slug`

## Deploy frontend to Vercel

1. Push the repo to GitHub.
2. [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. **Root Directory:** set to **`frontend`** (required — do not use repo root).
4. Framework: Next.js (auto-detected).
5. **Environment variables** (Production):

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://api.tamilmarabu.com/api` |

6. Deploy.
7. **Custom domain:** Settings → Domains → add `kalvettu.tamilmarabu.com`.
8. Add DNS CNAME at your registrar:

   | Name | Type | Target |
   |------|------|--------|
   | `kalvettu` | CNAME | Value from Vercel dashboard |

9. Ensure App Runner `CORS_ORIGIN` includes `https://kalvettu.tamilmarabu.com`.

## Deploy backend to App Runner

See [docs/mvp-first-version.md](docs/mvp-first-version.md) for DynamoDB, S3, IAM, and App Runner env vars.

**App Runner settings:**

- Root directory: `backend`
- Build: `npm install && npm run build`
- Start: `npm run start:prod`
- Port: `8080` (set `PORT=8080` in env)

## Scripts

| Command | Where | Description |
|---------|-------|-------------|
| `npm run dev` | `frontend/` | Next.js on :3020 |
| `npm run start:dev` | `backend/` | NestJS API on :3021 |
| `npm run build` | `frontend/` | Production frontend build |

## Frontend routes

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/setup` | First-time admin |
| `/login` | Admin login |
| `/dashboard` | Admin home |
| `/dashboard/memorials` | List memorials |
| `/dashboard/memorials/new` | Create memorial |
| `/memorial/[slug]` | Public memorial page |
| `/memorial/[slug]/contribute` | Submit tribute (no login) |

## Push to a new GitHub repo

```bash
cd kalvettu
git init
git add .
git commit -m "Initial Kalvettu: Next.js frontend + NestJS API"
# gh repo create kalvettu --private --source=. --push
```
