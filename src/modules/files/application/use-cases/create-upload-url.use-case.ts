import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FileStoragePort, PresignedUpload } from '../ports/file-storage.port';
import { FILE_STORAGE } from '../tokens';

export interface CreateUploadUrlCommand {
  fileName: string;
  contentType: string;
}

@Injectable()
export class CreateUploadUrlUseCase {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStoragePort,
  ) {}

  execute(command: CreateUploadUrlCommand): Promise<PresignedUpload> {
    const extension = command.fileName.split('.').pop()?.toLowerCase();

    const key =
      extension && command.fileName.includes('.')
        ? `uploads/${randomUUID()}.${extension}`
        : `uploads/${randomUUID()}`;

    return this.fileStorage.createUploadUrl({
      key,
      contentType: command.contentType,
      expiresInSeconds: 300,
    });
  }
}
