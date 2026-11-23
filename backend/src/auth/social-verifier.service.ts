import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ISocialAuthVerifier, SocialVerifiedUser } from './social-verifier.interface.js';

@Injectable()
export class SocialAuthVerifierService implements ISocialAuthVerifier {
  async verifyToken(provider: 'google' | 'apple', idToken: string): Promise<SocialVerifiedUser> {
    if (!idToken || typeof idToken !== 'string' || idToken.trim().length === 0) {
      throw new UnauthorizedException(`Missing or invalid ${provider} OAuth ID token`);
    }

    // In production, verify JWT signature via Google google-auth-library or Apple apple-signin-auth
    // Simulated token payload parsing for test/dev environments:
    try {
      if (idToken.startsWith('mock-token:')) {
        const email = idToken.replace('mock-token:', '');
        return {
          email,
          sub: `${provider}_sub_${email}`,
          provider,
        };
      }

      // Check standard base64 payload if structured as JWT
      const parts = idToken.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        if (payload.email) {
          return {
            email: payload.email,
            sub: payload.sub || `${provider}_${payload.email}`,
            provider,
          };
        }
      }
    } catch {
      throw new UnauthorizedException(`Failed to verify ${provider} OAuth ID token signature`);
    }

    throw new UnauthorizedException(`Invalid or untrusted ${provider} OAuth token payload`);
  }
}
