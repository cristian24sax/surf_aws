import { Inject, Injectable } from '@nestjs/common';

import { FileStoragePort } from '../ports/file-storage.port';
import { FILE_STORAGE } from '../tokens';

@Injectable()
export class DeleteFileUseCase {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStoragePort,
  ) {}

  execute(key: string): Promise<void> {
    return this.fileStorage.delete(key);
  }
}
