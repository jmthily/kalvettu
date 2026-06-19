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
import { PeopleService } from './people.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';
import { CreatePersonDto, UpdatePersonDto } from './dto/person.dto';

@Controller('profiles/:profileId/people')
export class PeopleController {
  constructor(private readonly people: PeopleService) {}

  @Get('public')
  listPublic(@Param('profileId') profileId: string) {
    return this.people.list(profileId, true);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Get()
  list(@Param('profileId') profileId: string) {
    return this.people.list(profileId);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Post()
  create(@Param('profileId') profileId: string, @Body() dto: CreatePersonDto) {
    return this.people.create(profileId, dto);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Patch(':personId')
  update(
    @Param('profileId') profileId: string,
    @Param('personId') personId: string,
    @Body() dto: UpdatePersonDto,
  ) {
    return this.people.update(profileId, personId, dto);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Delete(':personId')
  async remove(
    @Param('profileId') profileId: string,
    @Param('personId') personId: string,
  ) {
    await this.people.delete(profileId, personId);
    return { success: true };
  }
}
