import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateTrackedItemSchema, Category, BillingCycle, ItemStatus } from '../index.js';

describe('Shared Schemas & Enums', () => {
  it('validates a valid tracked item payload', () => {
    const validData = {
      title: 'Netflix Premium',
      category: Category.SUBSCRIPTION,
      templateKey: 'netflix',
      amount: 186000,
      billingCycle: BillingCycle.MONTHLY,
      nextDueDate: new Date('2026-12-01T00:00:00.000Z'),
      reminderDaysBefore: [7, 1],
      notes: 'Family 4K plan',
      cancelUrl: 'https://netflix.com/cancel',
    };

    const parsed = CreateTrackedItemSchema.safeParse(validData);
    assert.strictEqual(parsed.success, true);
    if (parsed.success) {
      assert.strictEqual(parsed.data.title, 'Netflix Premium');
      assert.strictEqual(parsed.data.category, Category.SUBSCRIPTION);
      assert.strictEqual(parsed.data.amount, 186000);
    }
  });

  it('rejects an empty title and negative amount', () => {
    const invalidData = {
      title: '',
      category: Category.SUBSCRIPTION,
      amount: -50000,
      billingCycle: BillingCycle.MONTHLY,
      nextDueDate: new Date(),
    };

    const parsed = CreateTrackedItemSchema.safeParse(invalidData);
    assert.strictEqual(parsed.success, false);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i: { path: (string | number)[] }) => i.path[0]);
      assert.ok(issues.includes('title'), 'Should flag empty title');
      assert.ok(issues.includes('amount'), 'Should flag negative amount');
    }
  });

  it('rejects invalid category enum value', () => {
    const invalidCategory = {
      title: 'Gym Membership',
      category: 'INVALID_CATEGORY',
      billingCycle: BillingCycle.MONTHLY,
      nextDueDate: new Date(),
    };

    const parsed = CreateTrackedItemSchema.safeParse(invalidCategory);
    assert.strictEqual(parsed.success, false);
  });
});
