# Smaranam × Tamil Marabu — MVP

**Recommended subdomain:** `smaranam.tamilmarabu.com`  
**Tamil:** ஸ்மரணம் (*smaraṇam* — remembrance, memorial honouring the departed)

---

## Why this name?

| Option | Subdomain | Pros | Cons |
|--------|-----------|------|------|
| **Smaranam** ✓ | `smaranam.tamilmarabu.com` | Culturally precise — matches memorial services (ஸ்மரணம்), respectful, clear purpose | Slightly formal |
| Ninaivu | `ninaivu.tamilmarabu.com` | Simple Tamil for “memory” | Overlaps with `memories.tamilmarabu.com` |
| Kalvettu | `kalvettu.tamilmarabu.com` | Already built — “inscribed legacy” | Broader than memorial-only; less obvious to grieving families |
| Tribute | `tribute.tamilmarabu.com` | English-friendly | Loses Tamil Marabu cultural identity |

**Recommendation:** Launch memorial experience as **Smaranam** for user-facing clarity. The current **Kalvettu** codebase already implements ~90% of this MVP (memorial profile type, family tree, invites, tributes). Options:

1. **Alias** — `smaranam.tamilmarabu.com` → same Amplify app, memorial-only landing and routes  
2. **Rebrand route** — `/memorial/[slug]` becomes primary public URL on Smaranam  
3. **Later split** — thin Smaranam Next.js app using shared `@tamilmarabu/*` packages

---

## Product purpose

Help families **remember someone who has died** by creating a lasting digital memorial:

- **Biography** — life story, dates, photos, key milestones  
- **Family tree** — relatives linked with Sri Lankan Tamil relationship labels  
- **Tribute messages** — family and friends share memories, condolences, stories  
- **Admin control** — designated admins curate content and invite others  

This is **not** the same as **Memories** (`memories.tamilmarabu.com`), which records living elders’ wisdom for future generations. Smaranam is specifically about **honouring the deceased**.

---

## URLs

| Service | Production | Local dev |
|---------|------------|-----------|
| Web app | `https://smaranam.tamilmarabu.com` | `http://localhost:3002` (future app) |
| API | `https://api.tamilmarabu.com/v1/smaranam` or shared Kalvettu API | `http://localhost:3001/api` |
| Parent brand | `https://tamilmarabu.com` | — |

**Interim (today):** Use Kalvettu API and set `APP_PUBLIC_URL=https://smaranam.tamilmarabu.com` when Smaranam subdomain goes live.

---

## User roles

| Role | Who | Permissions |
|------|-----|-------------|
| **Memorial owner** | Person who created the page (usually close family) | Full admin, delete memorial, transfer ownership |
| **Admin** | Invited by owner — sibling, spouse, adult child | Edit biography, approve tributes, manage family tree, send invites |
| **Family contributor** | Invited family member | Suggest tree edits, upload photos, submit tributes (may require approval) |
| **Friend** | Invited non-family — colleagues, neighbours, community | Post tribute messages only; cannot edit biography or tree |
| **Public visitor** | Anyone (if memorial is public) | View approved biography, tree (respecting privacy), approved tributes |

---

## Core flows

### 1. Create a memorial

1. Sign up / sign in (shared Tamil Marabu Cognito account)  
2. **Create memorial** — name, dates (birth / passing), photo, short summary  
3. Choose privacy: **private** (invite only) · **family** (contributors + link holders) · **public** (searchable `/memorial/[slug]`)  
4. Creator becomes **owner** + first **admin**

### 2. Build biography

Structured sections (admin-only edit):

- Early life, education, career  
- Marriage and family  
- Community and faith  
- Legacy and values  
- Timeline of key events  

Rich text + photo gallery per section.

### 3. Family tree

- Add people: name, relationship to deceased, birth/death dates, photo  
- Sri Lankan labels: Appa, Amma, Machan, Akka, Murai Maman, etc.  
- **Invite family** by email → accept → linked to their tree node + contributor role  
- Declined or pending invites hidden on public view  

### 4. Invite friends to share messages

1. Admin opens **Contributors & invites**  
2. Choose invite type: **Family** or **Friend (tribute only)**  
3. SES email with link: `https://smaranam.tamilmarabu.com/invite/{token}`  
4. Recipient accepts → can write tribute (friends) or contribute more (family)  
5. Admin **approves** tributes before they appear on public memorial page  

### 5. Public memorial page

URL: `/memorial/[slug]` or `/smaranam/[slug]`

Shows (when public + approved):

- Photo, name, dates, epitaph  
- Biography sections  
- Family tree (privacy-filtered)  
- Approved tribute messages  
- “Share a memory” button → tribute form (auth or invite required)

---

## Pages

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Smaranam landing — create or find a memorial |
| `/login`, `/signup` | Public | Shared Cognito auth |
| `/dashboard` | Auth | List memorials you own or contribute to |
| `/dashboard/memorials/new` | Auth | Create memorial |
| `/dashboard/memorials/[id]/edit` | Admin | Edit biography |
| `/dashboard/memorials/[id]/family-tree` | Admin / family | Tree + family invites |
| `/dashboard/memorials/[id]/tributes` | Admin | Approve / hide messages |
| `/dashboard/memorials/[id]/media` | Admin / contributor | Photos & videos |
| `/dashboard/memorials/[id]/invites` | Admin | Invite family & friends |
| `/memorial/[slug]` | Public* | Memorial book |
| `/memorial/[slug]/tribute` | Auth / invited | Submit a message |
| `/invite/[token]` | Token | Accept family or friend invite |

\*Public only when memorial privacy = public and content is approved.

---

## Mapping to current Kalvettu code

| Smaranam concept | Kalvettu implementation today |
|------------------|-------------------------------|
| Memorial | `profileType: 'memorial'` |
| Biography | Profile edit fields + stories |
| Family tree | `/dashboard/profiles/[id]/family-tree` |
| Tribute messages | Stories module with approval |
| Admin invites | Contributors + invites modules |
| Friend (tribute only) | New invite role `friend` (future) — today use `contributor` with limited UI |
| Public page | `/heritage/[slug]` or `/memorial/[slug]` redirect |

---

## Data model (DynamoDB)

Reuse Kalvettu tables with `productId: 'smaranam'` or dedicated tables when splitting:

| Entity | Key fields |
|--------|------------|
| **Memorial** | `memorialId`, `slug`, `deceasedName`, `birthDate`, `deathDate`, `privacyLevel`, `ownerUserSub` |
| **Person** | `memorialId`, `personId`, `relationship`, `inviteStatus` |
| **Invite** | `tokenHash`, `memorialId`, `email`, `inviteType`: `family` \| `friend`, `role`, `expiresAt` |
| **Tribute** | `memorialId`, `tributeId`, `authorName`, `body`, `status`: `pending` \| `approved` |
| **Media** | `memorialId`, `mediaId`, `s3Key`, `caption` |

---

## Environment (production)

### Smaranam web (Amplify)

```bash
NEXT_PUBLIC_PRODUCT=smaranam
NEXT_PUBLIC_SITE_URL=https://smaranam.tamilmarabu.com
NEXT_PUBLIC_API_URL=https://api.tamilmarabu.com/v1/smaranam
# or interim: https://api.kalvettu.tamilmarabu.com/api
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=...
NEXT_PUBLIC_COGNITO_CLIENT_ID=...
```

### API

```bash
APP_PUBLIC_URL=https://smaranam.tamilmarabu.com
CORS_ORIGIN=https://smaranam.tamilmarabu.com,https://kalvettu.tamilmarabu.com,http://localhost:3000
SES_FROM_EMAIL=Smaranam <noreply@tamilmarabu.com>
```

---

## Invite email copy (example)

> **Subject:** You’re invited to honour [Name] on Smaranam  
>  
> [Admin name] has invited you to share memories and be part of [Deceased name]’s memorial on Tamil Marabu.  
>  
> [Accept invitation →](https://smaranam.tamilmarabu.com/invite/{token})  
>  
> Smaranam · Tamil Marabu — remembering those we love.

---

## MVP scope (phase 1)

- [ ] Create memorial (deceased person only)  
- [ ] Biography editor (admin)  
- [ ] Family tree with Sri Lankan relationship labels  
- [ ] Email invite: family (tree + tributes) and friend (tributes only)  
- [ ] Tribute submission + admin approval  
- [ ] Public memorial page with privacy controls  
- [ ] Photo upload via S3 presigned URLs  

## Out of scope (later)

- Virtual candle / flowers  
- Anniversary reminder emails  
- Print memorial booklet PDF  
- Integration with Rituals product for funeral ceremony guidance  
- Cross-link to Kalvettu ancestor archive  

---

## Branding

- Same warm cream / maroon / gold as Tamil Marabu design system  
- Tone: respectful, calm, not social-media flashy  
- Title: **Smaranam · Tamil Marabu**  
- Tagline: *Remember. Honour. Share.*
