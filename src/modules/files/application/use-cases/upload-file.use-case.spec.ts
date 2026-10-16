import { UploadFileUseCase } from './upload-file.use-case';
import { FileStoragePort, UploadFileInput } from '../ports/file-storage.port';

describe('UploadFileUseCase', () => {
  let useCase: UploadFileUseCase;
  let fileStorage: jest.Mocked<FileStoragePort>;

  beforeEach(() => {
    fileStorage = {
      upload: jest.fn(),
      createUploadUrl: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UploadFileUseCase(fileStorage);
  });

  it('should upload a file', async () => {
    fileStorage.upload.mockImplementation(async (input: UploadFileInput) => ({
      key: input.key,
    }));

    const result = await useCase.execute({
      originalName: 'profile.png',
      contentType: 'image/png',
      body: Buffer.from('fake-image'),
    });

    expect(fileStorage.upload).toHaveBeenCalledTimes(1);

    expect(fileStorage.upload).toHaveBeenCalledWith({
      key: expect.stringMatching(/^uploads\/.+\.png$/),
      body: expect.any(Buffer),
      contentType: 'image/png',
    });

    expect(result.key).toMatch(/^uploads\/.+\.png$/);
  });

  it('should preserve the file extension', async () => {
    fileStorage.upload.mockImplementation(async (input) => ({
      key: input.key,
    }));

    const result = await useCase.execute({
      originalName: 'document.PDF',
      contentType: 'application/pdf',
      body: Buffer.from('fake-pdf'),
    });

    expect(result.key).toMatch(/\.pdf$/);
  });

  it('should generate a key without extension when file has no extension', async () => {
    fileStorage.upload.mockImplementation(async (input) => ({
      key: input.key,
    }));

    const result = await useCase.execute({
      originalName: 'README',
      contentType: 'text/plain',
      body: Buffer.from('content'),
    });

    expect(result.key).toMatch(/^uploads\/[^.]+$/);
  });
});
