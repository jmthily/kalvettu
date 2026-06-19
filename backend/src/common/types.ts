/** Shared domain types for Kalvettu backend */

export type ProfileType = 'living' | 'memorial' | 'ancestor';
export type PrivacyLevel = 'private' | 'family' | 'invited' | 'public';
export type PersonInviteStatus =
  | 'not_invited'
  | 'invited'
  | 'accepted'
  | 'declined'
  | 'needs_correction';
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type InviteType = 'family' | 'friend' | 'share';
export type ContributorRole = 'owner' | 'admin' | 'contributor' | 'viewer' | 'friend';
export type MembershipKind = 'owner' | 'family' | 'friend';
export type StoryType =
  | 'tribute'
  | 'memory'
  | 'recipe'
  | 'lesson'
  | 'funny_story'
  | 'blessing'
  | 'migration_story';
export type MediaType = 'photo' | 'video' | 'audio' | 'document';

export interface ProfileRecord {
  profileId: string;
  ownerUserSub: string;
  slug: string;
  profileType: ProfileType;
  fullName: string;
  tamilName?: string;
  sinhalaName?: string;
  knownAs?: string;
  village?: string;
  district?: string;
  countryOfBirth?: string;
  dateOfBirth?: string;
  dateOfPassing?: string;
  shortBio?: string;
  lifeHistory?: string;
  migrationStory?: string;
  education?: string;
  career?: string;
  marriageFamilyLife?: string;
  communityContribution?: string;
  favouriteSayings?: string;
  lifeLessons?: string;
  blessings?: string;
  profilePhotoUrl?: string;
  privacyLevel: PrivacyLevel;
  createdAt: string;
  updatedAt: string;
}

export interface PersonRecord {
  profileId: string;
  personId: string;
  fullName: string;
  email?: string;
  phone?: string;
  relationshipLabel: string;
  relationshipType?: string;
  parentPersonId?: string;
  spousePersonId?: string;
  dateOfBirth?: string;
  isLiving: boolean;
  notes?: string;
  photoUrl?: string;
  inviteStatus: PersonInviteStatus;
  userSub?: string;
  canContribute: boolean;
  correctionMessage?: string;
  createdAt: string;
}

export interface InviteRecord {
  tokenHash: string;
  profileId: string;
  inviteType: InviteType;
  /** Set for family invites — links to an existing family tree person */
  personId?: string;
  email: string;
  /** Display name for friend invites */
  inviteeName?: string;
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface ContributorRecord {
  profileId: string;
  userSub: string;
  email: string;
  name?: string;
  role: ContributorRole;
  createdAt: string;
}

export interface StoryRecord {
  profileId: string;
  storyId: string;
  contributorUserSub?: string;
  personId?: string;
  storyType: StoryType;
  title?: string;
  content: string;
  mediaUrl?: string;
  contributorName?: string;
  contributorRelationship?: string;
  privacyLevel: PrivacyLevel;
  approved: boolean;
  createdAt: string;
}

export interface MediaRecord {
  profileId: string;
  mediaId: string;
  uploadedByUserSub: string;
  mediaType: MediaType;
  fileKey: string;
  fileUrl?: string;
  caption?: string;
  privacyLevel: PrivacyLevel;
  approved: boolean;
  createdAt: string;
}

/** JWT identity — admin (dashboard) or share (family contributor link). */
export type AuthRole = 'admin' | 'share';

export interface AuthUserPayload {
  sub: string;
  email?: string;
  role: AuthRole;
  profileId?: string;
  tokenHash?: string;
}

export interface AdminRecord {
  email: string;
  passwordHash: string;
  createdAt: string;
}
