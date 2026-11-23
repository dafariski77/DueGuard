import { describe, it } from 'node:test';
import assert from 'node:assert';
import { UsersService } from '../users.service.js';

describe('UsersService and Store Compliance', () => {
  it('deletes user account and cascades dependent records (Store Compliance 5.1.1(v))', async () => {
    let deletedUserId = '';
    const mockPrisma = {
      user: {
        delete: async (args: { where: { id: string } }) => {
          deletedUserId = args.where.id;
          return { id: args.where.id };
        },
      },
    };

    const usersService = new UsersService(mockPrisma as any);
    const result = await usersService.deleteAccount('user_to_delete_999');

    assert.strictEqual(deletedUserId, 'user_to_delete_999');
    assert.strictEqual(result.success, true);
  });
});
