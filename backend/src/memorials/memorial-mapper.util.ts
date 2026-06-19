import { CreateMemorialDto, UpdateMemorialDto } from './dto/memorial.dto';
import { CreateProfileDto, UpdateProfileDto } from '../profiles/dto/profile.dto';

export function memorialToCreateProfile(dto: CreateMemorialDto): CreateProfileDto {
  return {
    profileType: 'memorial',
    fullName: dto.fullName,
    tamilName: dto.tamilName,
    knownAs: dto.knownAs,
    village: dto.village,
    dateOfBirth: dto.dateOfBirth,
    dateOfPassing: dto.dateOfPassing,
    shortBio: dto.biography,
    lifeHistory: dto.lifeHistory,
    profilePhotoUrl: dto.profilePhotoUrl,
    privacyLevel: dto.privacyLevel ?? 'public',
  };
}

export function memorialToUpdateProfile(dto: UpdateMemorialDto): UpdateProfileDto {
  return {
    fullName: dto.fullName,
    tamilName: dto.tamilName,
    knownAs: dto.knownAs,
    village: dto.village,
    dateOfBirth: dto.dateOfBirth,
    dateOfPassing: dto.dateOfPassing,
    shortBio: dto.biography,
    lifeHistory: dto.lifeHistory,
    profilePhotoUrl: dto.profilePhotoUrl,
    privacyLevel: dto.privacyLevel,
  };
}
