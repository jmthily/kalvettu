import { Module } from '@nestjs/common';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import { ProfilesModule } from '../profiles/profiles.module';
import { ContributorsModule } from '../contributors/contributors.module';
import { PeopleModule } from '../people/people.module';

@Module({
  imports: [ProfilesModule, ContributorsModule, PeopleModule],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
