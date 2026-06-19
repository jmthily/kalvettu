export interface Memorial {
  memorialId: string;
  slug: string;
  fullName: string;
  tamilName?: string | null;
  knownAs?: string | null;
  village?: string | null;
  dateOfBirth?: string | null;
  dateOfPassing?: string | null;
  biography?: string | null;
  lifeHistory?: string | null;
  profilePhotoUrl?: string | null;
  privacyLevel: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  personId: string;
  memorialId: string;
  fullName: string;
  relationship: string;
  email?: string | null;
  isLiving: boolean;
  photoUrl?: string | null;
}

export interface Tribute {
  tributeId: string;
  memorialId: string;
  name?: string | null;
  relationship?: string | null;
  message: string;
  approved: boolean;
  createdAt: string;
}

export interface MediaItem {
  mediaId: string;
  profileId?: string;
  memorialId?: string;
  mediaType: "photo" | "video" | "audio" | "document";
  fileKey: string;
  fileUrl?: string;
  caption?: string | null;
  approved: boolean;
}

export interface Person {
  personId: string;
  fullName: string;
  relationshipLabel: string;
  photoUrl?: string | null;
  isLiving: boolean;
}
