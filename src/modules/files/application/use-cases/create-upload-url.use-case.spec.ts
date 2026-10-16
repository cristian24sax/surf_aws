import { FileStoragePort } from '../ports/file-storage.port';
import { CreateUploadUrlUseCase } from './create-upload-url.use-case';

describe('CreateUploadUrlUseCase', () => {
  let useCase: CreateUploadUrlUseCase;
  let fileStorage: jest.Mocked<FileStoragePort>;

  beforeEach(() => {
    fileStorage = {
      upload: jest.fn(),
      createUploadUrl: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUploadUrlUseCase(fileStorage);
  });

  it('should create a presigned upload URL', async () => {
    fileStorage.createUploadUrl.mockResolvedValue({
      key: 'uploads/test-id.jpg',
      uploadUrl: 'https://example.com/presigned-url',
      expiresInSeconds: 300,
    });

    const result = await useCase.execute({
      fileName: 'profile.JPG',
      contentType: 'image/jpeg',
    });

    expect(fileStorage.createUploadUrl).toHaveBeenCalledWith({
      key: expect.stringMatching(/^uploads\/.+\.jpg$/),
      contentType: 'image/jpeg',
      expiresInSeconds: 300,
    });

    expect(result).toEqual({
      key: 'uploads/test-id.jpg',
      uploadUrl: 'https://example.com/presigned-url',
      expiresInSeconds: 300,
    });
  });
});
