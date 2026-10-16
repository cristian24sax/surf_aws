import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';

import { DeleteFileUseCase } from '../application/use-cases/delete-file.use-case';
import { UploadFileUseCase } from '../application/use-cases/upload-file.use-case';
import { CreateUploadUrlUseCase } from '../application/use-cases/create-upload-url.use-case';

@Controller('files')
export class FilesController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly createUploadUrlUseCase: CreateUploadUrlUseCase,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.uploadFileUseCase.execute({
      originalName: file.originalname,
      contentType: file.mimetype,
      body: file.buffer,
    });
  }

  @Delete()
  async delete(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('Key is required');
    }

    await this.deleteFileUseCase.execute(key);

    return {
      deleted: true,
    };
  }
  @Post('presigned-upload')
  createPresignedUpload(
    @Body()
    body: {
      fileName: string;
      contentType: string;
    },
  ) {
    return this.createUploadUrlUseCase.execute(body);
  }
}
