import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

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
  private readonly storageEndpoint: string;

  constructor(private readonly prisma: PrismaService) {
    this.storageEndpoint =
      process.env.STORAGE_ENDPOINT || 'https://r2.dueguard.internal/vault';
  }

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

    if (!isPro) {
      const existingCount = await this.prisma.attachment.count({
        where: { itemId },
      });
      if (existingCount >= 2) {
        throw new ForbiddenException(
          'Free tier limit reached (max 2 attachments per item). Upgrade to Pro for unlimited attachments.'
        );
      }
    }

    const safeName = dto.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `vault/${userId}/${itemId}/${Date.now()}-${safeName}`;
    const uploadUrl = `${this.storageEndpoint}/${storageKey}?X-Amz-Signature=mock-sig&expires=300`;

    return {
      uploadUrl,
      storageKey,
      expiresInSeconds: 300,
    };
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

    const viewUrl = `${this.storageEndpoint}/${attachment.storageKey}?X-Amz-Signature=mock-view-sig&expires=300`;

    return {
      viewUrl,
      mimeType: attachment.mimeType,
      expiresInSeconds: 300,
    };
  }

  async delete(userId: string, itemId: string, attachmentId: string) {
    await this.assertItemOwnership(userId, itemId);

    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, itemId },
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment ${attachmentId} not found`);
    }

    return this.prisma.attachment.delete({
      where: { id: attachmentId },
    });
  }
}
