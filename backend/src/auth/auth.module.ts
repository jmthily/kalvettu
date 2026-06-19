import { Global, Module } from '@nestjs/common';
import { AdminAuthGuard } from './admin-auth.guard';
import { OptionalAuthGuard } from './optional-auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SesModule } from '../ses/ses.module';

@Global()
@Module({
  imports: [SesModule],
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard, OptionalAuthGuard],
  exports: [AuthService, AdminAuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
