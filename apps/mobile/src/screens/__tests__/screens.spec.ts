import { describe, it } from 'node:test';
import assert from 'node:assert';
import { HomeScreen } from '../HomeScreen.js';
import { QuickAddScreen } from '../QuickAddScreen.js';
import { DetailScreen } from '../DetailScreen.js';
import { SpendRadarScreen } from '../SpendRadarScreen.js';
import { SettingsScreen } from '../SettingsScreen.js';
import { Category, BillingCycle } from '@dueguard/shared';

describe('Mobile Core Screens', () => {
  it('HomeScreen creates Bento layout with hero urgency and timeline items', () => {
    const items = [
      {
        id: '1',
        title: 'Netflix',
        category: Category.SUBSCRIPTION,
        amount: 186000,
        billingCycle: BillingCycle.MONTHLY,
        nextDueDate: new Date('2026-04-03'),
        daysRemaining: 3,
      },
    ];

    const screen = HomeScreen({
      user: { isPro: false, activeItemCount: 1, maxFreeItems: 7 },
      items,
      summary: { estMonthlySpend: 186000, annualizedSpend: 2232000, dueThisMonth: 186000 },
    });

    assert.strictEqual(screen.type, 'HomeScreen');
    assert.strictEqual(screen.heroItem?.title, 'Netflix');
    assert.strictEqual(screen.heroItem?.urgencyLevel, 'critical');
    assert.strictEqual(screen.tierStatus.label, '1 / 7 Free Items');
    assert.strictEqual(screen.timeline.length, 1);
    assert.ok(screen.fab.title.includes('Add'));
  });

  it('QuickAddScreen auto-populates from template registry and validates', () => {
    const screen = QuickAddScreen({ selectedTemplateId: 'netflix' });

    assert.strictEqual(screen.form.title, 'Netflix');
    assert.strictEqual(screen.form.category, Category.SUBSCRIPTION);
    assert.strictEqual(screen.form.billingCycle, BillingCycle.MONTHLY);
    assert.strictEqual(screen.form.amount, 186000);

    const validation = screen.validate();
    assert.strictEqual(validation.isValid, true);
  });

  it('DetailScreen structures digital pass, specifications, and proof vault', () => {
    const screen = DetailScreen({
      item: {
        id: 'item_stnk',
        title: 'STNK Mobil Pajak',
        category: Category.BILL_ID,
        amount: 3500000,
        billingCycle: BillingCycle.YEARLY,
        nextDueDate: new Date('2026-08-20'),
        daysRemaining: 130,
        notes: 'Pajak tahunan Honda HR-V',
        attachments: [{ id: 'att_1', fileName: 'stnk.jpg' }],
      },
      isPro: false,
    });

    assert.strictEqual(screen.pass.title, 'STNK Mobil Pajak');
    assert.strictEqual(screen.specs.billingCycle, 'YEARLY');
    assert.strictEqual(screen.proofVault.count, 1);
    assert.strictEqual(screen.proofVault.canAddMore, true); // 1 < 2 free limit
    assert.ok(screen.actions.some((a: any) => a.id === 'mark_renewed'));
    assert.ok(screen.actions.some((a: any) => a.id === 'delete_item'));
  });

  it('SpendRadarScreen visualizes 90-day cash spikes and category distribution', () => {
    const screen = SpendRadarScreen({
      summary: {
        estMonthlySpend: 300000,
        annualizedSpend: 3600000,
        dueThisMonth: 300000,
        upcoming90DaysSpikes: [
          { month: '2026-04', amount: 300000, diffFromAverage: 0, reasons: [] },
          { month: '2026-05', amount: 3800000, diffFromAverage: 3500000, reasons: ['STNK Mobil'] },
          { month: '2026-06', amount: 300000, diffFromAverage: 0, reasons: [] },
        ],
        categoryBreakdown: {
          subscriptionPercentage: 30,
          warrantyPercentage: 10,
          billIdPercentage: 60,
        },
      },
    });

    assert.strictEqual(screen.hero.monthlyRunRate, 'Rp 300.000');
    assert.strictEqual(screen.spikeRadar.hasSpike, true);
    assert.strictEqual(screen.spikeRadar.highestMonth, '2026-05');
    assert.strictEqual(screen.breakdown.billIdPercentage, 60);
  });

  it('SettingsScreen incorporates biometric lock and App Store compliant deletion', () => {
    const screen = SettingsScreen({
      user: { email: 'raka@example.com', isPro: false },
      settings: { faceIdEnabled: true, pushEnabled: true },
    });

    assert.strictEqual(screen.profile.email, 'raka@example.com');
    assert.strictEqual(screen.security.faceIdEnabled, true);
    assert.strictEqual(screen.notifications.pushEnabled, true);
    assert.ok(screen.compliance.hasDeleteAccountButton, 'Must have delete account button for Apple compliance');
  });
});
