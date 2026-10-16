export interface UploadFileInput {
  key: string;
  body: Buffer;
  contentType: string;
}

export interface StoredFile {
  key: string;
}

export interface FileStoragePort {
  upload(input: UploadFileInput): Promise<StoredFile>;

  delete(key: string): Promise<void>;
}
export interface CreateUploadUrlInput {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}

export interface PresignedUpload {
  key: string;
  uploadUrl: string;
  expiresInSeconds: number;
}

export interface FileStoragePort {
  upload(input: UploadFileInput): Promise<StoredFile>;

  createUploadUrl(input: CreateUploadUrlInput): Promise<PresignedUpload>;

  delete(key: string): Promise<void>;
}
