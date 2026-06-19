import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb/dynamodb.service';
import { PersonRecord } from '../common/types';
import { isoNow, newId } from '../common/utils';
import { CreatePersonDto, UpdatePersonDto } from './dto/person.dto';

@Injectable()
export class PeopleService {
  constructor(private readonly db: DynamoDbService) {}

  private table() {
    return this.db.table('people');
  }

  async create(profileId: string, dto: CreatePersonDto): Promise<PersonRecord> {
    const personId = newId();
    const record: PersonRecord = {
      profileId,
      personId,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      relationshipLabel: dto.relationshipLabel,
      relationshipType: dto.relationshipType,
      parentPersonId: dto.parentPersonId,
      spousePersonId: dto.spousePersonId,
      dateOfBirth: dto.dateOfBirth,
      isLiving: dto.isLiving ?? true,
      notes: dto.notes,
      photoUrl: dto.photoUrl,
      inviteStatus: 'not_invited',
      canContribute: false,
      createdAt: isoNow(),
    };
    await this.db.put(this.table(), record);
    return record;
  }

  async list(profileId: string, publicView = false): Promise<PersonRecord[]> {
    const people = await this.db.query<PersonRecord>(this.table(), {
      KeyConditionExpression: 'profileId = :pid',
      ExpressionAttributeValues: { ':pid': profileId },
    });
    if (!publicView) return people;
    return people.map((p) => ({
      ...p,
      email: p.inviteStatus === 'declined' ? undefined : p.email,
      phone: p.inviteStatus === 'declined' ? undefined : p.phone,
    }));
  }

  async findOne(profileId: string, personId: string): Promise<PersonRecord | null> {
    return this.db.get<PersonRecord>(this.table(), { profileId, personId });
  }

  async update(
    profileId: string,
    personId: string,
    dto: UpdatePersonDto,
  ): Promise<PersonRecord> {
    const existing = await this.findOne(profileId, personId);
    if (!existing) throw new NotFoundException('Person not found');
    const updated = { ...existing, ...dto };
    await this.db.put(this.table(), updated);
    return updated;
  }

  async delete(profileId: string, personId: string): Promise<void> {
    await this.db.delete(this.table(), { profileId, personId });
  }

  async findByEmail(profileId: string, email: string): Promise<PersonRecord | null> {
    const normalized = email.trim().toLowerCase();
    const people = await this.list(profileId);
    return people.find((p) => p.email?.trim().toLowerCase() === normalized) ?? null;
  }

  async findByUserSub(profileId: string, userSub: string): Promise<PersonRecord | null> {
    const people = await this.list(profileId);
    return people.find((p) => p.userSub === userSub) ?? null;
  }

  async updateInviteFields(
    profileId: string,
    personId: string,
    fields: Partial<PersonRecord>,
  ): Promise<PersonRecord> {
    const existing = await this.findOne(profileId, personId);
    if (!existing) throw new NotFoundException('Person not found');
    const updated = { ...existing, ...fields };
    await this.db.put(this.table(), updated);
    return updated;
  }
}
