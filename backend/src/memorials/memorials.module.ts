import { Module } from '@nestjs/common';
import { MemorialsController } from './memorials.controller';
import { MemorialPeopleController } from './memorial-people.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { PeopleModule } from '../people/people.module';
import { ContributorsModule } from '../contributors/contributors.module';
import { GuardsModule } from '../common/guards/guards.module';

@Module({
  imports: [ProfilesModule, PeopleModule, ContributorsModule, GuardsModule],
  controllers: [MemorialsController, MemorialPeopleController],
})
export class MemorialsModule {}
