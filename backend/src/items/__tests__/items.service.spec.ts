import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ItemsService } from '../items.service.js';
import { Category, BillingCycle, ItemStatus } from '../../common/index.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ItemsService', () => {
  const createMockPrisma = (initialItems: any[] = [], isProUser = false) => {
    let items = [...initialItems];

    return {
      user: {
        findUnique: async ({ where }: any) => {
          if (where.id === 'user_free') return { id: 'user_free', isPro: false };
          if (where.id === 'user_pro') return { id: 'user_pro', isPro: true };
          return { id: where.id, isPro: isProUser };
        },
      },
      trackedItem: {
        count: async ({ where }: any) => {
          return items.filter((item) => {
            if (where.userId && item.userId !== where.userId) return false;
            if (where.status && item.status !== where.status) return false;
            return true;
          }).length;
        },
        create: async ({ data }: any) => {
          const newItem = {
            id: `item_${items.length + 1}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
          };
          items.push(newItem);
          return newItem;
        },
        findMany: async ({ where, orderBy }: any) => {
          let filtered = items.filter((item) => {
            if (where.userId && item.userId !== where.userId) return false;
            if (where.status && item.status !== where.status) return false;
            if (where.category && item.category !== where.category) return false;
            return true;
          });
          if (orderBy?.nextDueDate === 'asc') {
            filtered.sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());
          }
          return filtered;
        },
        findFirst: async ({ where }: any) => {
          return items.find((item) => {
            if (where.id && item.id !== where.id) return false;
            if (where.userId && item.userId !== where.userId) return false;
            return true;
          }) || null;
        },
        update: async ({ where, data }: any) => {
          const index = items.findIndex((i) => i.id === where.id);
          if (index === -1) throw new Error('Not found');
          items[index] = { ...items[index], ...data, updatedAt: new Date() };
          return items[index];
        },
        delete: async ({ where }: any) => {
          const index = items.findIndex((i) => i.id === where.id);
          if (index === -1) throw new Error('Not found');
          const [deleted] = items.splice(index, 1);
          return deleted;
        },
      },
    };
  };

  it('enforces 7-item limit for free tier users', async () => {
    // 7 existing active items
    const existing = Array.from({ length: 7 }, (_, i) => ({
      id: `item_${i + 1}`,
      userId: 'user_free',
      title: `Item ${i + 1}`,
      category: Category.SUBSCRIPTION,
      billingCycle: BillingCycle.MONTHLY,
      nextDueDate: new Date('2026-04-01'),
      status: ItemStatus.ACTIVE,
    }));

    const prisma = createMockPrisma(existing);
    const service = new ItemsService(prisma as any);

    await assert.rejects(
      async () => {
        await service.create('user_free', {
          title: '8th Item',
          category: Category.SUBSCRIPTION,
          billingCycle: BillingCycle.MONTHLY,
          nextDueDate: new Date('2026-05-01'),
          amount: 50000,
          reminderDaysBefore: [3, 1],
        });
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenException);
        assert.match(err.message, /Free tier limit reached/);
        return true;
      }
    );
  });

  it('allows pro tier users to exceed 7 items', async () => {
    const existing = Array.from({ length: 7 }, (_, i) => ({
      id: `item_${i + 1}`,
      userId: 'user_pro',
      title: `Item ${i + 1}`,
      category: Category.SUBSCRIPTION,
      billingCycle: BillingCycle.MONTHLY,
      nextDueDate: new Date('2026-04-01'),
      status: ItemStatus.ACTIVE,
    }));

    const prisma = createMockPrisma(existing);
    const service = new ItemsService(prisma as any);

    const created = await service.create('user_pro', {
      title: '8th Item Pro',
      category: Category.SUBSCRIPTION,
      billingCycle: BillingCycle.MONTHLY,
      nextDueDate: new Date('2026-05-01'),
      amount: 150000,
      reminderDaysBefore: [3, 1],
    });

    assert.strictEqual(created.title, '8th Item Pro');
    assert.strictEqual(created.id, 'item_8');
  });

  it('prevents user A from accessing or mutating user B items', async () => {
    const initial = [
      {
        id: 'item_target',
        userId: 'user_b',
        title: 'Secret Subscription',
        category: Category.SUBSCRIPTION,
        billingCycle: BillingCycle.MONTHLY,
        nextDueDate: new Date('2026-04-10'),
        status: ItemStatus.ACTIVE,
      },
    ];

    const prisma = createMockPrisma(initial);
    const service = new ItemsService(prisma as any);

    // User A attempts to findOne
    await assert.rejects(
      async () => service.findOne('user_a', 'item_target'),
      (err: any) => err instanceof NotFoundException
    );

    // User A attempts to update
    await assert.rejects(
      async () => service.update('user_a', 'item_target', { title: 'Hacked' }),
      (err: any) => err instanceof NotFoundException
    );

    // User A attempts to delete
    await assert.rejects(
      async () => service.delete('user_a', 'item_target'),
      (err: any) => err instanceof NotFoundException
    );

    // User A attempts to renew
    await assert.rejects(
      async () => service.renew('user_a', 'item_target'),
      (err: any) => err instanceof NotFoundException
    );
  });

  it('renews MONTHLY item by rolling forward exactly 1 month', async () => {
    const initial = [
      {
        id: 'item_netflix',
        userId: 'user_1',
        title: 'Netflix',
        category: Category.SUBSCRIPTION,
        billingCycle: BillingCycle.MONTHLY,
        nextDueDate: new Date('2026-03-15T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
    ];

    const prisma = createMockPrisma(initial);
    const service = new ItemsService(prisma as any);

    const renewed = await service.renew('user_1', 'item_netflix');
    const newDueDate = new Date(renewed.nextDueDate);

    assert.strictEqual(newDueDate.getUTCFullYear(), 2026);
    assert.strictEqual(newDueDate.getUTCMonth(), 3); // April is index 3
    assert.strictEqual(newDueDate.getUTCDate(), 15);
  });

  it('renews YEARLY item by rolling forward 1 year', async () => {
    const initial = [
      {
        id: 'item_stnk',
        userId: 'user_1',
        title: 'STNK Pajak Mobil',
        category: Category.BILL_ID,
        billingCycle: BillingCycle.YEARLY,
        nextDueDate: new Date('2026-08-20T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
    ];

    const prisma = createMockPrisma(initial);
    const service = new ItemsService(prisma as any);

    const renewed = await service.renew('user_1', 'item_stnk');
    const newDueDate = new Date(renewed.nextDueDate);

    assert.strictEqual(newDueDate.getUTCFullYear(), 2027);
    assert.strictEqual(newDueDate.getUTCMonth(), 7); // August is index 7
    assert.strictEqual(newDueDate.getUTCDate(), 20);
  });

  it('archives ONE_TIME item on renewal', async () => {
    const initial = [
      {
        id: 'item_sim',
        userId: 'user_1',
        title: 'Perpanjang SIM',
        category: Category.BILL_ID,
        billingCycle: BillingCycle.ONE_TIME,
        nextDueDate: new Date('2026-09-01T00:00:00Z'),
        status: ItemStatus.ACTIVE,
      },
    ];

    const prisma = createMockPrisma(initial);
    const service = new ItemsService(prisma as any);

    const renewed = await service.renew('user_1', 'item_sim');
    assert.strictEqual(renewed.status, ItemStatus.ARCHIVED);
  });
});
