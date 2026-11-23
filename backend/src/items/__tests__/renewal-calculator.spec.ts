import { describe, it } from 'node:test';
import assert from 'node:assert';
import { RenewalCalculator, MonthlyRenewalStrategy, getDaysInMonth } from '../renewal-calculator.js';
import { BillingCycle } from '../../common/index.js';

describe('RenewalCalculator (Strategy & Month Clamping)', () => {
  it('correctly calculates days in month including leap years', () => {
    assert.strictEqual(getDaysInMonth(2024, 2), 29); // 2024 is leap
    assert.strictEqual(getDaysInMonth(2025, 2), 28); // 2025 is non-leap
    assert.strictEqual(getDaysInMonth(2026, 1), 31);
    assert.strictEqual(getDaysInMonth(2026, 4), 30);
  });

  it('prevents end-of-month drift by clamping Jan 31st to Feb 28th (non-leap)', () => {
    const jan31 = new Date(Date.UTC(2025, 0, 31, 10, 0, 0)); // Jan 31, 2025
    const nextDue = RenewalCalculator.calculateNextDueDate(BillingCycle.MONTHLY, jan31);

    assert.strictEqual(nextDue.getUTCFullYear(), 2025);
    assert.strictEqual(nextDue.getUTCMonth(), 1); // February (0-based)
    assert.strictEqual(nextDue.getUTCDate(), 28, 'Should clamp to Feb 28 instead of drifting to March');
  });

  it('clamps Jan 31st to Feb 29th on leap years', () => {
    const jan31 = new Date(Date.UTC(2024, 0, 31, 10, 0, 0)); // Jan 31, 2024
    const nextDue = RenewalCalculator.calculateNextDueDate(BillingCycle.MONTHLY, jan31);

    assert.strictEqual(nextDue.getUTCFullYear(), 2024);
    assert.strictEqual(nextDue.getUTCMonth(), 1);
    assert.strictEqual(nextDue.getUTCDate(), 29, 'Should clamp to Feb 29 on leap years');
  });

  it('rolls quarterly renewals with month clamping', () => {
    const nov30 = new Date(Date.UTC(2025, 10, 30, 0, 0, 0)); // Nov 30, 2025
    const nextDue = RenewalCalculator.calculateNextDueDate(BillingCycle.QUARTERLY, nov30);

    assert.strictEqual(nextDue.getUTCFullYear(), 2026);
    assert.strictEqual(nextDue.getUTCMonth(), 1); // Feb 2026
    assert.strictEqual(nextDue.getUTCDate(), 28);
  });

  it('rolls yearly renewals preserving day except leap year clamp', () => {
    const leapDay = new Date(Date.UTC(2024, 1, 29, 0, 0, 0)); // Feb 29, 2024
    const nextDue = RenewalCalculator.calculateNextDueDate(BillingCycle.YEARLY, leapDay);

    assert.strictEqual(nextDue.getUTCFullYear(), 2025);
    assert.strictEqual(nextDue.getUTCMonth(), 1);
    assert.strictEqual(nextDue.getUTCDate(), 28, 'Should clamp Feb 29 to Feb 28 next year');
  });
});
