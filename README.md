# Kalvettu

**A Sri Lankan digital heritage, family tree, and life story archive** — built on AWS from day one.

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript |
| Auth | Amazon Cognito (email/password + verification) |
| Database | Amazon DynamoDB |
| Media | Amazon S3 (private bucket, pre-signed URLs) |
| Email | Amazon SES (family tree invitations) |
| Hosting (later) | AWS App Runner |

## Project structure

```
kalvettu/
├── src/                 # Next.js frontend
├── backend/             # NestJS API
├── infrastructure/      # DynamoDB table docs
└── README.md
```

## Local development

### Prerequisites

- Node.js 20+
- AWS CLI configured (`aws configure`) with permissions for DynamoDB, S3, SES, Cognito
- Cognito User Pool + App Client (no secret, for SPA)

### 1. AWS setup (one-time)

#### Cognito

1. Create a **User Pool** with email sign-in and email verification.
2. Create an **App client** (no client secret) — enable `USER_PASSWORD_AUTH`.
3. Note `User pool ID` and `Client ID`.

#### DynamoDB

Create tables per [infrastructure/dynamodb-tables.md](infrastructure/dynamodb-tables.md):

- `KalvettuProfiles` — PK `profileId`, GSIs `OwnerIndex` (ownerUserSub), `SlugIndex` (slug)
- `KalvettuPeople` — PK `profileId`, SK `personId`
- `KalvettuInvites` — PK `tokenHash`
- `KalvettuContributors` — PK `profileId`, SK `userSub`
- `KalvettuStories` — PK `profileId`, SK `storyId`
- `KalvettuMedia` — PK `profileId`, SK `mediaId`

#### S3

1. Create bucket `kalvettu-media-dev` (or your name).
2. **Block all public access** — objects stay private.
3. CORS for `http://localhost:3000` PUT/GET.

#### SES

1. Verify sender email or domain in SES.
2. In sandbox, verify recipient emails for testing.

### 2. Environment variables

**Frontend** — copy `.env.local.example` → `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxx
```

**Backend** — copy `backend/.env.example` → `backend/.env` and fill in table names, Cognito IDs, S3 bucket, SES from address.

### 3. Run the API

```bash
cd backend
npm install
npm run start:dev
```

API: [http://localhost:3001/api](http://localhost:3001/api)

### 4. Run the frontend

```bash
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

## MVP features

- Cognito sign up / sign in / email verification
- Heritage profiles (living, memorial, ancestor)
- Family tree with Sri Lankan relationship labels
- Invite workflow: SES email → `/invite/[token]` → accept / decline / correction
- Stories & tributes with admin approval
- S3 media upload via pre-signed URLs
- Public heritage page `/heritage/[slug]` (approved public content only)

## API modules (NestJS)

- `auth` — Cognito JWT validation
- `profiles` — CRUD + public by slug
- `people` — family tree
- `invites` — token (SHA-256 stored), SES, accept flow
- `contributors` — roles: owner, admin, contributor, viewer
- `stories` — tributes with approval
- `media` — S3 presign upload/confirm
- `s3` / `ses` — AWS integrations

## Guards

- `CognitoAuthGuard` — Bearer JWT required
- `ProfileOwnerGuard` — owner or admin
- `ContributorGuard` — owner, admin, or contributor

## Security notes

- S3 bucket is never public; uploads/downloads use pre-signed URLs.
- Invite tokens are random; only **hashed** tokens are stored in DynamoDB.
- Invites expire after 7 days.
- Declined members’ emails are hidden on public pages.
- Only approved + public privacy content appears on `/heritage/[slug]`.

## Deploying to AWS App Runner (later)

1. Build Docker image for `backend/` (NestJS listens on `PORT`).
2. App Runner service with env vars from Secrets Manager.
3. Frontend on Amplify Hosting or second App Runner service.
4. Point `NEXT_PUBLIC_API_URL` to the API service URL.
5. Use CloudFront in front of S3 for media reads when scaling.

## Scripts

| Command | Where | Description |
|---------|-------|-------------|
| `npm run dev` | root | Next.js dev server |
| `npm run build` | root | Production frontend build |
| `npm run start:dev` | backend | NestJS watch mode |
| `npm run build` | backend | Compile API |
