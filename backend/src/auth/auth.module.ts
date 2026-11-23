import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { SocialAuthVerifierService } from './social-verifier.service.js';

@Global()
@Module({
  providers: [AuthService, JwtAuthGuard, SocialAuthVerifierService],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, SocialAuthVerifierService],
})
export class AuthModule {}
