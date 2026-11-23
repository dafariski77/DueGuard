import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TierPolicyService } from '../common/tier-policy.service.js';
import { IStorageService } from './storage.interface.js';
import { MockStorageService } from './mock-storage.service.js';

export interface PresignUploadDto {
  fileName: string;
  mimeType: string;
  fileSize?: number;
}

export interface ConfirmUploadDto {
  storageKey: string;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
}

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tierPolicy: TierPolicyService = new TierPolicyService(),
    private readonly storageService: MockStorageService = new MockStorageService()
  ) {}

  private async assertItemOwnership(userId: string, itemId: string) {
    const item = await this.prisma.trackedItem.findFirst({
      where: { id: itemId, userId },
    });
    if (!item) {
      throw new NotFoundException(`Tracked item ${itemId} not found for this user`);
    }
    return item;
  }

  async getPresignedUploadUrl(
    userId: string,
    itemId: string,
    dto: PresignUploadDto
  ) {
    await this.assertItemOwnership(userId, itemId);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const isPro = user?.isPro ?? false;

    const existingCount = await this.prisma.attachment.count({
      where: { itemId },
    });
    this.tierPolicy.assertCanAddAttachment(existingCount, isPro);

    return this.storageService.getPresignedUploadUrl(userId, itemId, dto.fileName);
  }

  async confirmUpload(
    userId: string,
    itemId: string,
    dto: ConfirmUploadDto
  ) {
    await this.assertItemOwnership(userId, itemId);

    return this.prisma.attachment.create({
      data: {
        itemId,
        storageKey: dto.storageKey,
        mimeType: dto.mimeType || 'application/octet-stream',
      },
    });
  }

  async getPresignedViewUrl(
    userId: string,
    itemId: string,
    attachmentId: string
  ) {
    await this.assertItemOwnership(userId, itemId);

    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, itemId },
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment ${attachmentId} not found`);
    }

    return this.storageService.getPresignedViewUrl(attachment.storageKey, attachment.mimeType);
  }

  async delete(userId: string, itemId: string, attachmentId: string) {
    await this.assertItemOwnership(userId, itemId);

    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, itemId },
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment ${attachmentId} not found`);
    }

    await this.storageService.deleteObject(attachment.storageKey);

    return this.prisma.attachment.delete({
      where: { id: attachmentId },
    });
  }
}
