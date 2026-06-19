import { Module, forwardRef } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { ContributorsModule } from '../contributors/contributors.module';
import { GuardsModule } from '../common/guards/guards.module';

@Module({
  imports: [forwardRef(() => ContributorsModule), GuardsModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
