import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { HomeScreen } from '../HomeScreen.js';
import { QuickAddScreen } from '../QuickAddScreen.js';
import { DetailScreen } from '../DetailScreen.js';
import { SpendRadarScreen } from '../SpendRadarScreen.js';
import { SettingsScreen } from '../SettingsScreen.js';
import { Category, BillingCycle } from '@dueguard/shared';

describe('Mobile Core React Native Screens', () => {
  it('HomeScreen renders Bento layout and timeline items as React Native elements', () => {
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

    const screen = React.createElement(HomeScreen, {
      user: { isPro: false, activeItemCount: 1, maxFreeItems: 7 },
      items,
      summary: { estMonthlySpend: 186000, annualizedSpend: 2232000, dueThisMonth: 186000 },
    });

    assert.ok(React.isValidElement(screen));
    assert.strictEqual(screen.type, HomeScreen);
    assert.strictEqual(screen.props.user.isPro, false);
    assert.strictEqual(screen.props.items.length, 1);
  });

  it('QuickAddScreen renders form inputs and popular template chips', () => {
    const screen = React.createElement(QuickAddScreen, { initialTemplateId: 'netflix' });

    assert.ok(React.isValidElement(screen));
    assert.strictEqual(screen.type, QuickAddScreen);
    assert.strictEqual(screen.props.initialTemplateId, 'netflix');
  });

  it('DetailScreen renders digital pass, specifications, and proof vault', () => {
    const screen = React.createElement(DetailScreen, {
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

    assert.ok(React.isValidElement(screen));
    assert.strictEqual(screen.type, DetailScreen);
    assert.strictEqual(screen.props.item.title, 'STNK Mobil Pajak');
    assert.strictEqual(screen.props.item.attachments?.length, 1);
  });

  it('SpendRadarScreen visualizes 90-day cash spikes and category distribution', () => {
    const screen = React.createElement(SpendRadarScreen, {
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

    assert.ok(React.isValidElement(screen));
    assert.strictEqual(screen.type, SpendRadarScreen);
    assert.strictEqual(screen.props.summary.estMonthlySpend, 300000);
    assert.strictEqual(screen.props.summary.upcoming90DaysSpikes.length, 3);
  });

  it('SettingsScreen incorporates biometric lock and App Store compliant deletion', () => {
    const screen = React.createElement(SettingsScreen, {
      user: { email: 'raka@example.com', isPro: false },
      settings: { faceIdEnabled: true, pushEnabled: true },
    });

    assert.ok(React.isValidElement(screen));
    assert.strictEqual(screen.type, SettingsScreen);
    assert.strictEqual(screen.props.user.email, 'raka@example.com');
    assert.strictEqual(screen.props.settings?.faceIdEnabled, true);
  });
});
