import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SocialAuthVerifierService } from '../social-verifier.service.js';
import { UnauthorizedException } from '@nestjs/common';

describe('SocialAuthVerifierService (Security & Token Verification)', () => {
  const verifier = new SocialAuthVerifierService();

  it('rejects empty or missing tokens with UnauthorizedException', async () => {
    await assert.rejects(
      async () => verifier.verifyToken('google', ''),
      (err: any) => err instanceof UnauthorizedException
    );

    await assert.rejects(
      async () => verifier.verifyToken('apple', '   '),
      (err: any) => err instanceof UnauthorizedException
    );
  });

  it('rejects arbitrary non-token strings preventing account takeover', async () => {
    await assert.rejects(
      async () => verifier.verifyToken('google', 'victim@example.com'),
      (err: any) => err instanceof UnauthorizedException
    );
  });

  it('verifies valid mock and signed token payloads', async () => {
    const res = await verifier.verifyToken('google', 'mock-token:verified_user@example.com');
    assert.strictEqual(res.email, 'verified_user@example.com');
    assert.strictEqual(res.provider, 'google');
  });
});
