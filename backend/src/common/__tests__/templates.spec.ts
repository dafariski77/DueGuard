import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PREBUILT_TEMPLATES } from '../templates.js';
import { Category, BillingCycle } from '../enums.js';

describe('Templates Registry', () => {
  it('should contain at least 30 pre-built templates', () => {
    assert.ok(PREBUILT_TEMPLATES.length >= 30, `Expected >= 30 templates, got ${PREBUILT_TEMPLATES.length}`);
  });

  it('should have valid fields and categories for each template', () => {
    for (const t of PREBUILT_TEMPLATES) {
      assert.ok(t.id, 'Template must have id');
      assert.ok(t.name, 'Template must have name');
      assert.ok(Object.values(Category).includes(t.category), `Invalid category: ${t.category}`);
      assert.ok(Object.values(BillingCycle).includes(t.defaultBillingCycle), `Invalid cycle: ${t.defaultBillingCycle}`);
      assert.ok(Array.isArray(t.defaultRemindDaysBefore), 'Reminder stages must be array');
      assert.ok(t.defaultRemindDaysBefore.length > 0, 'Must have at least one reminder stage');
      assert.ok(t.icon, 'Template must have icon');
    }
  });
});
