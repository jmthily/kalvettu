import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PeopleService } from '../people/people.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';
import { toFamilyMember } from '../common/memorial-mapper';
import { CreatePersonDto, UpdatePersonDto } from '../people/dto/person.dto';

@Controller('memorials/:memorialId/people')
export class MemorialPeopleController {
  constructor(private readonly people: PeopleService) {}

  @Get('public')
  async listPublic(@Param('memorialId') memorialId: string) {
    const people = await this.people.list(memorialId, true);
    return people.map(toFamilyMember);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Get()
  async list(@Param('memorialId') memorialId: string) {
    const people = await this.people.list(memorialId);
    return people.map(toFamilyMember);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Post()
  async create(
    @Param('memorialId') memorialId: string,
    @Body() dto: CreatePersonDto,
  ) {
    const person = await this.people.create(memorialId, dto);
    return toFamilyMember(person);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Patch(':personId')
  async update(
    @Param('memorialId') memorialId: string,
    @Param('personId') personId: string,
    @Body() dto: UpdatePersonDto,
  ) {
    const person = await this.people.update(memorialId, personId, dto);
    return toFamilyMember(person);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Delete(':personId')
  async remove(
    @Param('memorialId') memorialId: string,
    @Param('personId') personId: string,
  ) {
    await this.people.delete(memorialId, personId);
    return { success: true };
  }
}
