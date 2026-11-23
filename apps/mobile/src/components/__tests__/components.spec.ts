import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  theme,
  getUrgencyTokens,
  formatCurrency,
} from '../../theme/theme.js';
import { CountdownBadge } from '../CountdownBadge.js';
import { Button } from '../Button.js';
import { BentoCard } from '../BentoCard.js';

describe('Design System Theme & Tokens', () => {
  it('maps urgency tokens correctly by remaining deadline days', () => {
    // <= 3 days: critical
    const criticalLight = getUrgencyTokens(2, false);
    assert.strictEqual(criticalLight.level, 'critical');
    assert.strictEqual(criticalLight.text, theme.colors.light.status.criticalText);
    assert.strictEqual(criticalLight.bg, theme.colors.light.status.criticalBg);
    assert.strictEqual(criticalLight.label, '2D LEFT');

    const criticalDark = getUrgencyTokens(1, true);
    assert.strictEqual(criticalDark.level, 'critical');
    assert.strictEqual(criticalDark.text, theme.colors.dark.status.criticalText);

    // 0 days: DUE TODAY
    const dueToday = getUrgencyTokens(0, false);
    assert.strictEqual(dueToday.label, 'DUE TODAY');

    // 4-14 days: warning
    const warning = getUrgencyTokens(7, false);
    assert.strictEqual(warning.level, 'warning');
    assert.strictEqual(warning.text, theme.colors.light.status.warningText);
    assert.strictEqual(warning.label, '7D LEFT');

    // 15+ days: subtle
    const subtle = getUrgencyTokens(30, false);
    assert.strictEqual(subtle.level, 'subtle');
    assert.strictEqual(subtle.label, '30D LEFT');
  });

  it('formats Indonesian Rupiah currency with tabular and clean formatting', () => {
    assert.strictEqual(formatCurrency(186000), 'Rp 186.000');
    assert.strictEqual(formatCurrency(3500000), 'Rp 3.500.000');
    assert.strictEqual(formatCurrency(0), 'Rp 0');
  });
});

describe('Design System UI Primitives', () => {
  it('creates CountdownBadge with correct visual hierarchy', () => {
    const badge = CountdownBadge({ daysRemaining: 3 });
    assert.strictEqual(badge.label, '3D LEFT');
    assert.strictEqual(badge.style.backgroundColor, theme.colors.light.status.criticalBg);
    assert.strictEqual(badge.style.textColor, theme.colors.light.status.criticalText);
  });

  it('creates Button with HIG 44pt minimum touch target', () => {
    const btn = Button({ title: 'Add Item', variant: 'primary' });
    assert.strictEqual(btn.title, 'Add Item');
    assert.ok(btn.minHeight >= 44, 'Button minHeight must be >= 44pt for HIG touch target');
    assert.strictEqual(btn.style.borderRadius, theme.radius.md);
    assert.strictEqual(btn.style.backgroundColor, theme.colors.light.brand.primary);
  });

  it('creates BentoCard with 16pt radius and 16pt padding', () => {
    const card = BentoCard({ variant: 'standard' });
    assert.strictEqual(card.style.borderRadius, theme.radius.lg);
    assert.strictEqual(card.style.padding, theme.space[4]);
    assert.strictEqual(card.style.backgroundColor, theme.colors.light.bg.surface);
  });
});
