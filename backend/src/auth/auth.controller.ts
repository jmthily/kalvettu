import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminSetupDto } from './dto/admin-setup.dto';

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
}
