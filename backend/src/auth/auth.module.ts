import { Global, Module } from '@nestjs/common';
import { AdminAuthGuard } from './admin-auth.guard';
import { OptionalAuthGuard } from './optional-auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard, OptionalAuthGuard],
  exports: [AuthService, AdminAuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
