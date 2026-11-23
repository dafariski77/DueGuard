export interface PresignedUploadResult {
  uploadUrl: string;
  storageKey: string;
  expiresInSeconds: number;
}

export interface PresignedViewResult {
  viewUrl: string;
  mimeType?: string;
  expiresInSeconds: number;
}

export interface IStorageService {
  getPresignedUploadUrl(userId: string, itemId: string, fileName: string): Promise<PresignedUploadResult>;
  getPresignedViewUrl(storageKey: string, mimeType?: string): Promise<PresignedViewResult>;
  deleteObject(storageKey: string): Promise<void>;
}
