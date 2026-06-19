# Kalvettu MVP — First Working Version

**URL:** `https://kalvettu.tamilmarabu.com/periamma`  
**API:** `https://api.tamilmarabu.com/api`

## Architecture

```
User → Vercel (Next.js) → api.tamilmarabu.com (NestJS / App Runner)
                              ├── DynamoDB
                              ├── S3
                              └── SES (Phase 2 invites)
```

| Layer | Stack |
|-------|-------|
| Frontend | Next.js, TypeScript, Tailwind, Vercel |
| Backend | NestJS, TypeScript, AWS App Runner |
| Auth Phase 1 | Admin email + password (DynamoDB `KalvettuAdmins`) |
| Auth Phase 2 | Cognito (deferred) |

## Database (DynamoDB)

| Entity | Table | Key |
|--------|-------|-----|
| Memorials | `KalvettuProfiles` | `profileId` (exposed as `memorialId` in API) |
| Family members | `KalvettuPeople` | `profileId` + `personId` |
| Tributes | `KalvettuStories` | `profileId` + `storyId` (`storyType: tribute`) |
| Media | `KalvettuMedia` | `profileId` + `mediaId` |
| Admins | `KalvettuAdmins` | `email` |

## API Endpoints

### Memorials
- `POST /memorials` — create (admin)
- `GET /memorials` — list (admin)
- `GET /memorials/public/:slug` — public page data
- `GET /memorials/:id` — get (admin)
- `PATCH /memorials/:id` — update biography etc. (admin)

### Family
- `POST /memorials/:id/people`
- `GET /memorials/:id/people`
- `GET /memorials/:id/people/public`
- `PATCH /memorials/:id/people/:personId`
- `DELETE /memorials/:id/people/:personId`

### Tributes
- `POST /memorials/:id/tributes` — public, no login
- `GET /memorials/:id/tributes/public` — approved tribute wall
- `GET /memorials/:id/tributes` — admin (all)
- `POST /tributes/:id/approve` — body: `{ memorialId }`
- `POST /tributes/:id/reject` — body: `{ memorialId }`

### Media
- `POST /media/presigned-url` — body includes `memorialId`
- `POST /media/complete-upload` — body includes `memorialId`
- Profile-scoped routes also work: `/profiles/:id/media/presign`

### Auth
- `POST /auth/setup` — first admin
- `POST /auth/login`

### Share links (family upload)
- `POST /profiles/:id/share-links` → `/share/{token}`

## Public page (`/periamma`)

- Biography + life history
- Family tree
- Photos + videos (separate sections)
- Tribute wall (approved only)
- “Share your memory” form → `/periamma/tribute`

## Admin flow

1. `/setup` → create admin
2. `/login` → dashboard
3. Create memorial → set slug (from name, e.g. `periamma`)
4. Edit biography, family tree, upload media
5. Generate share link for overseas relatives
6. Approve tributes on dashboard → Tributes

## Local dev

```bash
cd backend && npm run start:dev   # :3021
npm run dev                     # :3020
```

`.env.local`:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3020
NEXT_PUBLIC_API_URL=http://localhost:3021/api
```

`backend/.env`: `JWT_SECRET`, DynamoDB table names, `AWS_REGION=ap-southeast-2`, `S3_BUCKET_NAME`.

Legacy routes `/heritage/:slug` and `/memorial/:slug` redirect to `/:slug`.
