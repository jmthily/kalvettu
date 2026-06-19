# DynamoDB Tables for Kalvettu MVP

Create these tables in `us-east-1` (or your chosen region).

## KalvettuAdmins

| Key | Type |
|-----|------|
| PK: `email` | String |

Phase 1 admin login (email + bcrypt password hash).

## KalvettuProfiles

| Key | Type |
|-----|------|
| PK: `profileId` | String |

**GSI OwnerIndex:** HASH `ownerUserSub`  
**GSI SlugIndex:** HASH `slug`

## KalvettuPeople

| Key | Type |
|-----|------|
| PK: `profileId` | String |
| SK: `personId` | String |

## KalvettuInvites

| Key | Type |
|-----|------|
| PK: `tokenHash` | String (SHA-256 of invite token) |

## KalvettuContributors

| Key | Type |
|-----|------|
| PK: `profileId` | String |
| SK: `userSub` | String |

## KalvettuStories

| Key | Type |
|-----|------|
| PK: `profileId` | String |
| SK: `storyId` | String |

## KalvettuMedia

| Key | Type |
|-----|------|
| PK: `profileId` | String |
| SK: `mediaId` | String |

## AWS CLI example (Profiles)

```bash
aws dynamodb create-table \
  --table-name KalvettuProfiles \
  --attribute-definitions \
    AttributeName=profileId,AttributeType=S \
    AttributeName=ownerUserSub,AttributeType=S \
    AttributeName=slug,AttributeType=S \
  --key-schema AttributeName=profileId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[
    {"IndexName":"OwnerIndex","KeySchema":[{"AttributeName":"ownerUserSub","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}},
    {"IndexName":"SlugIndex","KeySchema":[{"AttributeName":"slug","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}
  ]'
```

Repeat similarly for composite-key tables using `profileId` + sort key.
