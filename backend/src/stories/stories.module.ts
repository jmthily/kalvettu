import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { GuardsModule } from '../common/guards/guards.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ContributorsModule } from '../contributors/contributors.module';

@Module({
  imports: [GuardsModule, ProfilesModule, ContributorsModule],
  controllers: [StoriesController],
  providers: [StoriesService],
  exports: [StoriesService],
})
export class StoriesModule {}
