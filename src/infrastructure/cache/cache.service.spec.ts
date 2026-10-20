import Redis from 'ioredis';
import { CacheService } from './cache.service';
// import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;
  let redis: jest.Mocked<Pick<Redis, 'get' | 'set' | 'del' | 'ping'>>;

  beforeEach(() => {
    redis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      ping: jest.fn(),
    } as unknown as typeof redis;
    Object.defineProperty(redis, 'status', {
      value: 'ready',
      configurable: true,
    });
    cacheService = new CacheService(redis as unknown as Redis);
  });

  it('debe guardar un valor con TTL', async () => {
    redis.set.mockResolvedValue('OK');

    await cacheService.set('surf:class:1', 'disponible', 60);

    expect(redis.set).toHaveBeenCalledWith('surf:class:1', 'disponible', 'EX', 60);
  });

  it('debe recuperar un valor', async () => {
    redis.get.mockResolvedValue('disponible');

    const result = await cacheService.get('surf:class:1');

    expect(result).toBe('disponible');
  });

  it('debe eliminar una clave', async () => {
    redis.del.mockResolvedValue(1);

    const result = await cacheService.del('surf:class:1');

    expect(result).toBe(1);
  });

  it('debe responder al ping', async () => {
    redis.ping.mockResolvedValue('PONG');

    const result = await cacheService.ping();

    expect(result).toBe('PONG');
  });

  describe('CacheService - Tolerancia a fallos', () => {
    let cacheService: CacheService;
    let redis: jest.Mocked<Redis>;

    beforeEach(() => {
      redis = {
        status: 'ready',
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
      } as unknown as jest.Mocked<Redis>;

      cacheService = new CacheService(redis);
    });

    it('GET devuelve null cuando Valkey está desconectado', async () => {
      Object.defineProperty(redis, 'status', {
        value: 'reconnecting',
        configurable: true,
      });

      const result = await cacheService.get('surf:test');

      expect(result).toBeNull();
      expect(redis.get).not.toHaveBeenCalled();
    });

    it('SET no falla cuando Valkey está desconectado', async () => {
      Object.defineProperty(redis, 'status', {
        value: 'reconnecting',
        configurable: true,
      });

      await expect(cacheService.set('surf:test', 'valor', 60)).resolves.toBeUndefined();

      expect(redis.set).not.toHaveBeenCalled();
    });

    it('DEL devuelve 0 cuando Valkey está desconectado', async () => {
      Object.defineProperty(redis, 'status', {
        value: 'reconnecting',
        configurable: true,
      });

      const result = await cacheService.del('surf:test');

      expect(result).toBe(0);
      expect(redis.del).not.toHaveBeenCalled();
    });

    it('GET controla errores durante una operación', async () => {
      redis.get.mockRejectedValue(new Error('Connection lost'));

      const result = await cacheService.get('surf:test');

      expect(result).toBeNull();
    });

    it('SET controla errores durante una operación', async () => {
      redis.set.mockRejectedValue(new Error('Connection lost'));

      await expect(cacheService.set('surf:test', 'valor', 60)).resolves.toBeUndefined();
    });

    it('DEL controla errores durante una operación', async () => {
      redis.del.mockRejectedValue(new Error('Connection lost'));

      const result = await cacheService.del('surf:test');

      expect(result).toBe(0);
    });
  });
});
