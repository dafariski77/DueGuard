import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AttachmentsService } from '../attachments.service.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AttachmentsService', () => {
  const createMockPrisma = (options: {
    isPro?: boolean;
    itemOwner?: string;
    existingAttachments?: any[];
  } = {}) => {
    const isPro = options.isPro ?? false;
    const itemOwner = options.itemOwner ?? 'usr_owner';
    const attachments = [...(options.existingAttachments || [])];

    return {
      user: {
        findUnique: async () => ({ id: itemOwner, isPro }),
      },
      trackedItem: {
        findFirst: async ({ where }: any) => {
          if (where.id === 'item_1' && where.userId === itemOwner) {
            return { id: 'item_1', userId: itemOwner, title: 'MacBook Pro' };
          }
          return null;
        },
      },
      attachment: {
        count: async ({ where }: any) => {
          return attachments.filter((a) => a.itemId === where.itemId).length;
        },
        create: async ({ data }: any) => {
          const newAtt = { id: `att_${attachments.length + 1}`, ...data, uploadedAt: new Date() };
          attachments.push(newAtt);
          return newAtt;
        },
        findFirst: async ({ where }: any) => {
          return attachments.find((a) => a.id === where.id && a.itemId === where.itemId) || null;
        },
        delete: async ({ where }: any) => {
          const idx = attachments.findIndex((a) => a.id === where.id);
          if (idx === -1) throw new Error('Not found');
          const [deleted] = attachments.splice(idx, 1);
          return deleted;
        },
      },
    };
  };

  it('enforces max 2 attachments for free tier users on presign-upload', async () => {
    const existing = [
      { id: 'att_1', itemId: 'item_1', storageKey: 'k1', mimeType: 'image/jpeg' },
      { id: 'att_2', itemId: 'item_1', storageKey: 'k2', mimeType: 'image/jpeg' },
    ];

    const prisma = createMockPrisma({ isPro: false, existingAttachments: existing });
    const service = new AttachmentsService(prisma as any);

    await assert.rejects(
      async () => {
        await service.getPresignedUploadUrl('usr_owner', 'item_1', {
          fileName: 'receipt3.jpg',
          mimeType: 'image/jpeg',
        });
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenException);
        assert.match(err.message, /Free tier limit reached/);
        return true;
      }
    );
  });

  it('allows pro tier users to upload beyond 2 attachments', async () => {
    const existing = [
      { id: 'att_1', itemId: 'item_1', storageKey: 'k1', mimeType: 'image/jpeg' },
      { id: 'att_2', itemId: 'item_1', storageKey: 'k2', mimeType: 'image/jpeg' },
    ];

    const prisma = createMockPrisma({ isPro: true, existingAttachments: existing });
    const service = new AttachmentsService(prisma as any);

    const result = await service.getPresignedUploadUrl('usr_owner', 'item_1', {
      fileName: 'receipt3.jpg',
      mimeType: 'image/jpeg',
    });

    assert.ok(result.uploadUrl.includes('http'));
    assert.ok(result.storageKey.includes('receipt3.jpg'));
    assert.strictEqual(result.expiresInSeconds, 300);
  });

  it('prevents unauthorized user from accessing another user attachments', async () => {
    const prisma = createMockPrisma({ isPro: false, itemOwner: 'usr_owner' });
    const service = new AttachmentsService(prisma as any);

    // Other user attempts presign-upload
    await assert.rejects(
      async () => {
        await service.getPresignedUploadUrl('usr_attacker', 'item_1', {
          fileName: 'hack.png',
          mimeType: 'image/png',
        });
      },
      (err: any) => err instanceof NotFoundException
    );

    // Other user attempts presign-view
    await assert.rejects(
      async () => {
        await service.getPresignedViewUrl('usr_attacker', 'item_1', 'att_1');
      },
      (err: any) => err instanceof NotFoundException
    );
  });

  it('confirms attachment and creates database record', async () => {
    const prisma = createMockPrisma({ isPro: false });
    const service = new AttachmentsService(prisma as any);

    const created = await service.confirmUpload('usr_owner', 'item_1', {
      storageKey: 'vault/usr_owner/item_1/stnk.jpg',
      fileName: 'stnk.jpg',
      mimeType: 'image/jpeg',
      fileSize: 204800,
    });

    assert.strictEqual(created.storageKey, 'vault/usr_owner/item_1/stnk.jpg');
    assert.strictEqual(created.mimeType, 'image/jpeg');
  });
});
