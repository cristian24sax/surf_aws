import { Module } from '@nestjs/common';

import { FILE_STORAGE } from './application/tokens';
import { DeleteFileUseCase } from './application/use-cases/delete-file.use-case';
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';
import { S3FileStorageAdapter } from './infrastructure/storage/s3-file-storage.adapter';
import { FilesController } from './presentation/files.controller';
import { CreateUploadUrlUseCase } from './application/use-cases/create-upload-url.use-case';

@Module({
  controllers: [FilesController],
  providers: [
    UploadFileUseCase,
    DeleteFileUseCase,
    S3FileStorageAdapter,
    CreateUploadUrlUseCase,

    {
      provide: FILE_STORAGE,
      useExisting: S3FileStorageAdapter,
    },
  ],
})
export class FilesModule {}
