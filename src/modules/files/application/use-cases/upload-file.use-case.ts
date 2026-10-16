import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FileStoragePort, StoredFile } from '../ports/file-storage.port';
import { FILE_STORAGE } from '../tokens';

export interface UploadFileCommand {
  originalName: string;
  contentType: string;
  body: Buffer;
}

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStoragePort,
  ) {}

  async execute(command: UploadFileCommand): Promise<StoredFile> {
    const extension = this.getExtension(command.originalName);

    const key = extension ? `uploads/${randomUUID()}.${extension}` : `uploads/${randomUUID()}`;

    return this.fileStorage.upload({
      key,
      body: command.body,
      contentType: command.contentType,
    });
  }

  private getExtension(fileName: string): string | undefined {
    const parts = fileName.split('.');

    if (parts.length < 2) {
      return undefined;
    }

    return parts.pop()?.toLowerCase();
  }
}
