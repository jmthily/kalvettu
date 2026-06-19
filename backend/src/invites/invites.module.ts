import { Module, forwardRef } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { PeopleModule } from '../people/people.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ContributorsModule } from '../contributors/contributors.module';
import { SesModule } from '../ses/ses.module';
import { GuardsModule } from '../common/guards/guards.module';

@Module({
  imports: [
    ProfilesModule,
    forwardRef(() => PeopleModule),
    ContributorsModule,
    SesModule,
    GuardsModule,
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}
