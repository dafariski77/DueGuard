import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PrismaService } from '../prisma.service.js';

describe('PrismaService lifecycle and connection abstraction', () => {
  it('instantiates PrismaService and exposes client delegates', () => {
    const service = new PrismaService();
    assert.ok(service, 'Service should be instantiated');
    assert.strictEqual(typeof service.$connect, 'function');
    assert.strictEqual(typeof service.$disconnect, 'function');
  });

  it('exposes model delegates for User, TrackedItem, Attachment, NotificationLog', () => {
    const service = new PrismaService();
    assert.ok('user' in service, 'Should have user delegate');
    assert.ok('trackedItem' in service, 'Should have trackedItem delegate');
    assert.ok('attachment' in service, 'Should have attachment delegate');
    assert.ok('notificationLog' in service, 'Should have notificationLog delegate');
  });
});
