import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AnalyticsService } from '../analytics.service.js';
import { Category, BillingCycle, ItemStatus } from '../../common/index.js';

describe('AnalyticsService', () => {
  const mockPrismaWithItems = (items: any[]) => ({
    trackedItem: {
      findMany: async ({ where }: any) => {
        return items.filter((item) => {
          if (where.userId && item.userId !== where.userId) return false;
          if (where.status && item.status !== where.status) return false;
          return true;
        });
      },
    },
  });

  it('normalizes monthly spend and annualized spend correctly', async () => {
    // 1 monthly of 100,000, 1 yearly of 1,200,000 (adds 100,000/mo), 1 quarterly of 300,000 (adds 100,000/mo)
    const items = [
      {
        id: '1',
        userId: 'usr_1',
        title: 'Netflix',
        category: Category.SUBSCRIPTION,
        billingCycle: BillingCycle.MONTHLY,
        amount: 100000,
        nextDueDate: new Date('2026-03-25T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
      {
        id: '2',
        userId: 'usr_1',
        title: 'STNK Mobil',
        category: Category.BILL_ID,
        billingCycle: BillingCycle.YEARLY,
        amount: 1200000,
        nextDueDate: new Date('2026-05-15T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
      {
        id: '3',
        userId: 'usr_1',
        title: 'Car Service',
        category: Category.WARRANTY,
        billingCycle: BillingCycle.QUARTERLY,
        amount: 300000,
        nextDueDate: new Date('2026-03-30T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
    ];

    const service = new AnalyticsService(mockPrismaWithItems(items) as any);
    const summary = await service.getSummary('usr_1', new Date('2026-03-01T00:00:00Z'));

    // estMonthlySpend: 100,000 + (1,200,000 / 12) + (300,000 / 3) = 300,000
    assert.strictEqual(summary.estMonthlySpend, 300000);
    // annualizedSpend: 300,000 * 12 = 3,600,000
    assert.strictEqual(summary.annualizedSpend, 3600000);
    // dueThisMonth (March 2026): item 1 (100,000) + item 3 (300,000) = 400,000
    assert.strictEqual(summary.dueThisMonth, 400000);
  });

  it('detects 90-day cash spikes when future commitments spike significantly', async () => {
    // Current date is March 2026.
    // In May 2026, an annual tax of Rp 3.500.000 is due.
    const items = [
      {
        id: '1',
        userId: 'usr_1',
        title: 'Spotify',
        category: Category.SUBSCRIPTION,
        billingCycle: BillingCycle.MONTHLY,
        amount: 50000,
        nextDueDate: new Date('2026-03-10T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
      {
        id: '2',
        userId: 'usr_1',
        title: 'STNK Mobil Pajak Tahunan',
        category: Category.BILL_ID,
        billingCycle: BillingCycle.YEARLY,
        amount: 3500000,
        nextDueDate: new Date('2026-05-15T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
    ];

    const service = new AnalyticsService(mockPrismaWithItems(items) as any);
    const summary = await service.getSummary('usr_1', new Date('2026-03-01T00:00:00Z'));

    assert.ok(Array.isArray(summary.upcoming90DaysSpikes));
    assert.strictEqual(summary.upcoming90DaysSpikes.length, 3); // next 3 months: April, May, June

    // May 2026 spike
    const maySpike = summary.upcoming90DaysSpikes.find((s: any) => s.month.endsWith('-05'));
    assert.ok(maySpike, 'Should contain projection for May');
    assert.ok(maySpike.amount >= 3500000);
    assert.ok(maySpike.reasons.length > 0, 'Should include reason for the spike');
    assert.match(maySpike.reasons[0], /STNK Mobil/);
  });

  it('computes category percentage distribution', async () => {
    const items = [
      {
        id: '1',
        userId: 'usr_1',
        title: 'Netflix',
        category: Category.SUBSCRIPTION,
        billingCycle: BillingCycle.MONTHLY,
        amount: 150000,
        nextDueDate: new Date('2026-03-15T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
      {
        id: '2',
        userId: 'usr_1',
        title: 'BPJS Kesehatan',
        category: Category.BILL_ID,
        billingCycle: BillingCycle.MONTHLY,
        amount: 150000,
        nextDueDate: new Date('2026-03-15T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
    ];

    const service = new AnalyticsService(mockPrismaWithItems(items) as any);
    const summary = await service.getSummary('usr_1', new Date('2026-03-01T00:00:00Z'));

    assert.strictEqual(summary.categoryBreakdown.subscriptionPercentage, 50);
    assert.strictEqual(summary.categoryBreakdown.billIdPercentage, 50);
    assert.strictEqual(summary.categoryBreakdown.warrantyPercentage, 0);
  });
});
