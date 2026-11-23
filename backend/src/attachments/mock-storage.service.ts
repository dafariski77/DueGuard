import { Injectable } from '@nestjs/common';
import { IStorageService, PresignedUploadResult, PresignedViewResult } from './storage.interface.js';

@Injectable()
export class MockStorageService implements IStorageService {
  private readonly storageEndpoint: string;

  constructor() {
    this.storageEndpoint = process.env.STORAGE_ENDPOINT || 'https://r2.dueguard.internal/vault';
  }

  async getPresignedUploadUrl(userId: string, itemId: string, fileName: string): Promise<PresignedUploadResult> {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `vault/${userId}/${itemId}/${Date.now()}-${safeName}`;
    const uploadUrl = `${this.storageEndpoint}/${storageKey}?X-Amz-Signature=mock-sig&expires=300`;

    return {
      uploadUrl,
      storageKey,
      expiresInSeconds: 300,
    };
  }

  async getPresignedViewUrl(storageKey: string, mimeType?: string): Promise<PresignedViewResult> {
    const viewUrl = `${this.storageEndpoint}/${storageKey}?X-Amz-Signature=mock-view-sig&expires=300`;

    return {
      viewUrl,
      mimeType,
      expiresInSeconds: 300,
    };
  }

  async deleteObject(_storageKey: string): Promise<void> {
    // In production, call S3 / R2 DeleteObjectCommand
  }
}
