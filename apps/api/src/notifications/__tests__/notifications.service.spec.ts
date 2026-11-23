import { describe, it } from 'node:test';
import assert from 'node:assert';
import { NotificationsService } from '../notifications.service.js';
import { ItemStatus } from '@dueguard/shared';

describe('NotificationsService', () => {
  const createMockPrisma = (itemsWithUsers: any[] = [], existingLogs: any[] = []) => {
    const logs = [...existingLogs];

    return {
      trackedItem: {
        findMany: async ({ where, include }: any) => {
          return itemsWithUsers.filter((item) => {
            if (where.status && item.status !== where.status) return false;
            if (where.user?.expoPushToken?.not && !item.user?.expoPushToken) return false;
            return true;
          });
        },
      },
      notificationLog: {
        findFirst: async ({ where }: any) => {
          return logs.find((l) => {
            if (l.itemId !== where.itemId) return false;
            if (l.daysBefore !== where.daysBefore) return false;
            if (where.scheduledFor) {
              const d1 = new Date(l.scheduledFor).toISOString().slice(0, 10);
              const d2 = new Date(where.scheduledFor).toISOString().slice(0, 10);
              if (d1 !== d2) return false;
            }
            return true;
          }) || null;
        },
        create: async ({ data }: any) => {
          const newLog = { id: `log_${logs.length + 1}`, ...data };
          logs.push(newLog);
          return newLog;
        },
      },
    };
  };

  it('dispatches reminder when item due date matches configured reminder days', async () => {
    // Today: 2026-04-10
    // Item due in 3 days: 2026-04-13
    const today = new Date('2026-04-10T09:00:00Z');
    const items = [
      {
        id: 'item_netflix',
        title: 'Netflix',
        amount: 186000,
        nextDueDate: new Date('2026-04-13T09:00:00Z'),
        reminderDaysBefore: [7, 3, 1],
        status: ItemStatus.ACTIVE,
        user: {
          id: 'user_1',
          isPro: true,
          expoPushToken: 'ExponentPushToken[mock_token_1]',
        },
      },
    ];

    const dispatched: any[] = [];
    const pushClient = {
      send: async (msg: any) => {
        dispatched.push(msg);
        return { status: 'ok' };
      },
    };

    const prisma = createMockPrisma(items);
    const service = new NotificationsService(prisma as any, pushClient as any);

    const result = await service.processDailyReminders(today);

    assert.strictEqual(result.sentCount, 1);
    assert.strictEqual(dispatched.length, 1);
    assert.strictEqual(dispatched[0].to, 'ExponentPushToken[mock_token_1]');
    assert.match(dispatched[0].title, /Due in 3 days: Netflix/);
  });

  it('prevents duplicate notification sends on the same day', async () => {
    const today = new Date('2026-04-10T09:00:00Z');
    const items = [
      {
        id: 'item_netflix',
        title: 'Netflix',
        amount: 186000,
        nextDueDate: new Date('2026-04-13T09:00:00Z'),
        reminderDaysBefore: [7, 3, 1],
        status: ItemStatus.ACTIVE,
        user: {
          id: 'user_1',
          isPro: true,
          expoPushToken: 'ExponentPushToken[mock_token_1]',
        },
      },
    ];

    const existingLogs = [
      {
        id: 'log_1',
        itemId: 'item_netflix',
        daysBefore: 3,
        scheduledFor: new Date('2026-04-10T00:00:00Z'),
        status: 'SENT',
      },
    ];

    const dispatched: any[] = [];
    const pushClient = {
      send: async (msg: any) => {
        dispatched.push(msg);
        return { status: 'ok' };
      },
    };

    const prisma = createMockPrisma(items, existingLogs);
    const service = new NotificationsService(prisma as any, pushClient as any);

    const result = await service.processDailyReminders(today);

    assert.strictEqual(result.sentCount, 0);
    assert.strictEqual(result.skippedCount, 1);
    assert.strictEqual(dispatched.length, 0);
  });

  it('restricts free tier users to 1-stage alerts while pro users get multi-stage', async () => {
    // Today: 2026-04-10. Item due in 7 days (2026-04-17).
    // Free tier user only receives 1 alert (at <= 1 or 3 days). A 7-day alert is ignored for free user.
    const today = new Date('2026-04-10T09:00:00Z');
    const items = [
      {
        id: 'item_free',
        title: 'Free User Sub',
        amount: 50000,
        nextDueDate: new Date('2026-04-17T09:00:00Z'),
        reminderDaysBefore: [7, 1],
        status: ItemStatus.ACTIVE,
        user: {
          id: 'user_free',
          isPro: false,
          expoPushToken: 'ExponentPushToken[free_user]',
        },
      },
    ];

    const dispatched: any[] = [];
    const pushClient = {
      send: async (msg: any) => dispatched.push(msg),
    };

    const prisma = createMockPrisma(items);
    const service = new NotificationsService(prisma as any, pushClient as any);

    const result = await service.processDailyReminders(today);

    // Free user should not get 7-day advance notice (reserved for Pro)
    assert.strictEqual(result.sentCount, 0);
    assert.strictEqual(dispatched.length, 0);
  });
});
