import { Module } from '@nestjs/common';
import {
  MemorialTributesController,
  TributesActionController,
} from './tributes.controller';
import { StoriesModule } from '../stories/stories.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { GuardsModule } from '../common/guards/guards.module';

@Module({
  imports: [StoriesModule, ProfilesModule, GuardsModule],
  controllers: [MemorialTributesController, TributesActionController],
})
export class TributesModule {}
