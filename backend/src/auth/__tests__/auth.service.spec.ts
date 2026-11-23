import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../auth.service.js';

describe('AuthService', () => {
  it('hashes passwords securely and verifies them', async () => {
    const authService = new AuthService({} as any);
    const password = 'SuperSecretPassword123!';
    const hash = await authService.hashPassword(password);

    assert.notStrictEqual(hash, password);
    const isMatch = await authService.verifyPassword(password, hash);
    assert.strictEqual(isMatch, true);

    const isWrongMatch = await authService.verifyPassword('WrongPass', hash);
    assert.strictEqual(isWrongMatch, false);
  });

  it('generates signed JWT tokens with user payload and expiration', () => {
    const authService = new AuthService({} as any);
    const user = {
      id: 'usr_123',
      email: 'raka@example.com',
      isPro: false,
    };

    const token = authService.generateToken(user);
    assert.ok(typeof token === 'string', 'Token should be a string');
    assert.ok(token.split('.').length === 3, 'Token should be valid JWT structure');

    const decoded = authService.verifyToken(token);
    assert.strictEqual(decoded.sub, 'usr_123');
    assert.strictEqual(decoded.email, 'raka@example.com');
  });
});
