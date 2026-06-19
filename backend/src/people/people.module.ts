import { Module, forwardRef } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { ProfilesModule } from '../profiles/profiles.module';
import { InvitesModule } from '../invites/invites.module';
import { GuardsModule } from '../common/guards/guards.module';
import { ContributorsModule } from '../contributors/contributors.module';

@Module({
  imports: [
    ProfilesModule,
    ContributorsModule,
    GuardsModule,
    forwardRef(() => InvitesModule),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
