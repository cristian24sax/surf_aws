import { DeleteFileUseCase } from './delete-file.use-case';
import { FileStoragePort } from '../ports/file-storage.port';

describe('DeleteFileUseCase', () => {
  let useCase: DeleteFileUseCase;
  let fileStorage: jest.Mocked<FileStoragePort>;

  beforeEach(() => {
    fileStorage = {
      upload: jest.fn(),
      delete: jest.fn(),
      createUploadUrl: jest.fn(),
    };

    useCase = new DeleteFileUseCase(fileStorage);
  });

  it('should delete the specified file', async () => {
    fileStorage.delete.mockResolvedValue(undefined);

    await useCase.execute('uploads/example.png');

    expect(fileStorage.delete).toHaveBeenCalledTimes(1);
    expect(fileStorage.delete).toHaveBeenCalledWith('uploads/example.png');
  });
});
