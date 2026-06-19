import { LOCAL_DEV_SITE_URL } from './dev-ports';

/** Centralized environment configuration for Kalvettu API */
export default () => ({
  port: parseInt(process.env.PORT ?? '3021', 10),
  aws: {
    region: process.env.AWS_REGION ?? 'ap-southeast-2',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production',
  },
  dynamodb: {
    profiles: process.env.DYNAMODB_PROFILES_TABLE ?? 'KalvettuProfiles',
    people: process.env.DYNAMODB_PEOPLE_TABLE ?? 'KalvettuPeople',
    invites: process.env.DYNAMODB_INVITES_TABLE ?? 'KalvettuInvites',
    contributors: process.env.DYNAMODB_CONTRIBUTORS_TABLE ?? 'KalvettuContributors',
    stories: process.env.DYNAMODB_STORIES_TABLE ?? 'KalvettuStories',
    media: process.env.DYNAMODB_MEDIA_TABLE ?? 'KalvettuMedia',
    admins: process.env.DYNAMODB_ADMINS_TABLE ?? 'KalvettuAdmins',
  },
  s3: {
    bucket: process.env.S3_BUCKET_NAME ?? 'kalvettu-media',
    maxUploadBytes: 50 * 1024 * 1024, // 50 MB
  },
  ses: {
    fromEmail: process.env.SES_FROM_EMAIL ?? 'noreply@example.com',
  },
  app: {
    publicUrl: process.env.APP_PUBLIC_URL ?? LOCAL_DEV_SITE_URL,
    inviteExpiryDays: 7,
  },
});
