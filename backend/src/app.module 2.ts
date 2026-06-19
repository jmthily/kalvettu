import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DynamoDbModule } from './dynamodb/dynamodb.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PeopleModule } from './people/people.module';
import { InvitesModule } from './invites/invites.module';
import { ContributorsModule } from './contributors/contributors.module';
import { StoriesModule } from './stories/stories.module';
import { MediaModule } from './media/media.module';
import { S3Module } from './s3/s3.module';
import { SesModule } from './ses/ses.module';
import { MembershipModule } from './membership/membership.module';
import { GuardsModule } from './common/guards/guards.module';
import { MemorialsModule } from './memorials/memorials.module';
import { TributesModule } from './tributes/tributes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DynamoDbModule,
    AuthModule,
    S3Module,
    SesModule,
    ContributorsModule,
    ProfilesModule,
    MemorialsModule,
    TributesModule,
    GuardsModule,
    MembershipModule,
    PeopleModule,
    InvitesModule,
    StoriesModule,
    MediaModule,
  ],
})
export class AppModule {}
