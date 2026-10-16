import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { mockClient } from 'aws-sdk-client-mock';

import { S3FileStorageAdapter } from './s3-file-storage.adapter';

const s3Mock = mockClient(S3Client);

describe('S3FileStorageAdapter', () => {
  let adapter: S3FileStorageAdapter;

  beforeEach(() => {
    s3Mock.reset();

    const configService = {
      getOrThrow: jest.fn((key: string) => {
        const config: Record<string, string> = {
          'aws.region': 'sa-east-1',
          'aws.s3.bucketName': 'test-bucket',
        };

        return config[key];
      }),
    } as unknown as ConfigService;

    adapter = new S3FileStorageAdapter(configService);
  });

  describe('upload', () => {
    it('should upload a file to S3', async () => {
      s3Mock.on(PutObjectCommand).resolves({});

      const result = await adapter.upload({
        key: 'uploads/test.txt',
        body: Buffer.from('hello'),
        contentType: 'text/plain',
      });

      expect(result).toEqual({
        key: 'uploads/test.txt',
      });

      expect(s3Mock.commandCalls(PutObjectCommand)).toHaveLength(1);

      expect(s3Mock.commandCalls(PutObjectCommand)[0].args[0].input).toEqual({
        Bucket: 'test-bucket',
        Key: 'uploads/test.txt',
        Body: Buffer.from('hello'),
        ContentType: 'text/plain',
      });
    });
  });

  describe('delete', () => {
    it('should delete a file from S3', async () => {
      s3Mock.on(DeleteObjectCommand).resolves({});

      await adapter.delete('uploads/test.txt');

      expect(s3Mock.commandCalls(DeleteObjectCommand)).toHaveLength(1);

      expect(s3Mock.commandCalls(DeleteObjectCommand)[0].args[0].input).toEqual({
        Bucket: 'test-bucket',
        Key: 'uploads/test.txt',
      });
    });
  });
});
