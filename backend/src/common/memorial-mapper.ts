import type {
  MediaRecord,
  PersonRecord,
  ProfileRecord,
  StoryRecord,
} from './types';

/** API-facing memorial shape (maps from KalvettuProfiles). */
export interface MemorialDto {
  memorialId: string;
  slug: string;
  fullName: string;
  tamilName?: string;
  knownAs?: string;
  village?: string;
  dateOfBirth?: string;
  dateOfPassing?: string;
  biography?: string;
  lifeHistory?: string;
  profilePhotoUrl?: string;
  privacyLevel: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMemberDto {
  personId: string;
  memorialId: string;
  fullName: string;
  relationship: string;
  email?: string;
  isLiving: boolean;
  photoUrl?: string;
}

export interface TributeDto {
  tributeId: string;
  memorialId: string;
  name?: string;
  relationship?: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

export interface MediaDto {
  mediaId: string;
  memorialId: string;
  type: 'photo' | 'video' | 'audio' | 'document';
  fileKey: string;
  caption?: string;
  approved: boolean;
  fileUrl?: string;
  createdAt: string;
}

export function toMemorial(p: ProfileRecord): MemorialDto {
  return {
    memorialId: p.profileId,
    slug: p.slug,
    fullName: p.fullName,
    tamilName: p.tamilName,
    knownAs: p.knownAs,
    village: p.village,
    dateOfBirth: p.dateOfBirth,
    dateOfPassing: p.dateOfPassing,
    biography: p.shortBio,
    lifeHistory: p.lifeHistory,
    profilePhotoUrl: p.profilePhotoUrl,
    privacyLevel: p.privacyLevel,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function toFamilyMember(p: PersonRecord): FamilyMemberDto {
  return {
    personId: p.personId,
    memorialId: p.profileId,
    fullName: p.fullName,
    relationship: p.relationshipLabel,
    email: p.email,
    isLiving: p.isLiving,
    photoUrl: p.photoUrl,
  };
}

export function toTribute(s: StoryRecord): TributeDto {
  return {
    tributeId: s.storyId,
    memorialId: s.profileId,
    name: s.contributorName,
    relationship: s.contributorRelationship,
    message: s.content,
    approved: s.approved,
    createdAt: s.createdAt,
  };
}

export function toMediaDto(m: MediaRecord): MediaDto {
  return {
    mediaId: m.mediaId,
    memorialId: m.profileId,
    type: m.mediaType,
    fileKey: m.fileKey,
    caption: m.caption,
    approved: m.approved,
    fileUrl: m.fileUrl,
    createdAt: m.createdAt,
  };
}
