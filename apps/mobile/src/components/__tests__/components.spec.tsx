import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import {
  theme,
  getUrgencyTokens,
  formatCurrency,
} from '../../theme/theme.js';
import { CountdownBadge } from '../CountdownBadge.js';
import { Button } from '../Button.js';
import { BentoCard } from '../BentoCard.js';
import { Input } from '../Input.js';

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

describe('Design System React Native Primitives', () => {
  it('renders CountdownBadge as a React Native element with urgency props', () => {
    const badge = React.createElement(CountdownBadge, { daysRemaining: 3 });
    assert.ok(React.isValidElement(badge));
    assert.strictEqual(badge.type, CountdownBadge);
    assert.strictEqual(badge.props.daysRemaining, 3);
  });

  it('renders Button as a React Native Pressable with HIG 44pt touch target', () => {
    const btn = React.createElement(Button, { title: 'Add Item', variant: 'primary', size: 'md' });
    assert.ok(React.isValidElement(btn));
    assert.strictEqual(btn.type, Button);
    assert.strictEqual(btn.props.title, 'Add Item');
    assert.strictEqual(btn.props.variant, 'primary');
    assert.strictEqual(btn.props.size, 'md');
  });

  it('renders BentoCard as a React Native View with rounded corners', () => {
    const card = React.createElement(BentoCard, { variant: 'standard' });
    assert.ok(React.isValidElement(card));
    assert.strictEqual(card.type, BentoCard);
    assert.strictEqual(card.props.variant, 'standard');
  });

  it('renders Input with TextInput and optional error label', () => {
    const input = React.createElement(Input, { label: 'Subscription Title', placeholder: 'Netflix', error: 'Required' });
    assert.ok(React.isValidElement(input));
    assert.strictEqual(input.type, Input);
    assert.strictEqual(input.props.label, 'Subscription Title');
    assert.strictEqual(input.props.placeholder, 'Netflix');
  });
});
