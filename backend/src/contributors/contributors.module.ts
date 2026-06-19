import { Module, forwardRef } from '@nestjs/common';
import { ContributorsService } from './contributors.service';
import { ContributorsController } from './contributors.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { GuardsModule } from '../common/guards/guards.module';

@Module({
  imports: [forwardRef(() => ProfilesModule), GuardsModule],
  controllers: [ContributorsController],
  providers: [ContributorsService],
  exports: [ContributorsService],
})
export class ContributorsModule {}
