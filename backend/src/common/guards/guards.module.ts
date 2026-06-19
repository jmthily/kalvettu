import { Global, Module, forwardRef } from '@nestjs/common';
import { ProfileOwnerGuard } from './profile-owner.guard';
import { ContributorGuard } from './contributor.guard';
import { TributeContributorGuard } from './tribute-contributor.guard';
import { ProfilesModule } from '../../profiles/profiles.module';

@Global()
@Module({
  imports: [forwardRef(() => ProfilesModule)],
  providers: [ProfileOwnerGuard, ContributorGuard, TributeContributorGuard],
  exports: [ProfileOwnerGuard, ContributorGuard, TributeContributorGuard],
})
export class GuardsModule {}
