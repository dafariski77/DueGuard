import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserRegisterSchema, UserLoginSchema } from '@dueguard/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: unknown) {
    const parsed = UserRegisterSchema.parse(body);
    return this.authService.register(parsed.email, parsed.password, parsed.currencyCode);
  }

  @Post('login')
  async login(@Body() body: unknown) {
    const parsed = UserLoginSchema.parse(body);
    return this.authService.login(parsed.email, parsed.password);
  }

  @Post('social')
  async socialLogin(@Body() body: { provider: 'google' | 'apple'; email: string }) {
    return this.authService.verifySocialToken(body.provider, body.email);
  }
}
