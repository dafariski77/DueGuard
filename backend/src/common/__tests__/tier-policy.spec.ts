import { describe, it } from 'node:test';
import assert from 'node:assert';
import { TierPolicyService } from '../tier-policy.service.js';
import { ForbiddenException } from '@nestjs/common';

describe('TierPolicyService (Single Responsibility Quotas)', () => {
  const policy = new TierPolicyService();

  it('enforces 7-item active limit for free users and permits unlimited for pro', () => {
    assert.doesNotThrow(() => policy.assertCanCreateItem(6, false));
    assert.throws(
      () => policy.assertCanCreateItem(7, false),
      (err: any) => err instanceof ForbiddenException
    );
    assert.doesNotThrow(() => policy.assertCanCreateItem(100, true));
  });

  it('enforces 2-attachment limit for free users and permits unlimited for pro', () => {
    assert.doesNotThrow(() => policy.assertCanAddAttachment(1, false));
    assert.throws(
      () => policy.assertCanAddAttachment(2, false),
      (err: any) => err instanceof ForbiddenException
    );
    assert.doesNotThrow(() => policy.assertCanAddAttachment(50, true));
  });

  it('restricts notification stages > 3 days for free users', () => {
    assert.strictEqual(policy.isNotificationStageAllowed(1, false), true);
    assert.strictEqual(policy.isNotificationStageAllowed(3, false), true);
    assert.strictEqual(policy.isNotificationStageAllowed(7, false), false);
    assert.strictEqual(policy.isNotificationStageAllowed(30, false), false);

    assert.strictEqual(policy.isNotificationStageAllowed(30, true), true);
  });
});
