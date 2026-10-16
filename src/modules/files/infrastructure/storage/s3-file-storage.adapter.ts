import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  CreateUploadUrlInput,
  FileStoragePort,
  PresignedUpload,
  StoredFile,
  UploadFileInput,
} from '../../application/ports/file-storage.port';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3FileStorageAdapter implements FileStoragePort {
  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.getOrThrow<string>('aws.region');

    this.bucketName = this.configService.getOrThrow<string>('aws.s3.bucketName');

    this.client = new S3Client({
      region,
    });
  }

  async upload(input: UploadFileInput): Promise<StoredFile> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
      }),
    );

    return {
      key: input.key,
    };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  async createUploadUrl(input: CreateUploadUrlInput): Promise<PresignedUpload> {
    const expiresInSeconds = input.expiresInSeconds ?? 300;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: input.key,
      ContentType: input.contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    });

    return {
      key: input.key,
      uploadUrl,
      expiresInSeconds,
    };
  }
}
