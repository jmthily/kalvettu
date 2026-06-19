import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './admin-auth.guard';
import { CurrentUser } from './user.decorator';
import type { AuthUserPayload } from '../common/types';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminSetupDto } from './dto/admin-setup.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** First-time setup — creates the admin account in DynamoDB. */
  @Post('setup')
  setup(@Body() dto: AdminSetupDto) {
    return this.auth.setupAdmin(dto.email, dto.password);
  }

  /** Admin login — email + password from KalvettuAdmins table. */
  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(AdminAuthGuard)
  @Post('change-password')
  changePassword(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.auth.changePassword(
      user,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }
}
