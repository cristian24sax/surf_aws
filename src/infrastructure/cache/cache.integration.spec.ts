import Redis from 'ioredis';
import { CacheService } from './cache.service';

describe('CacheService - Integración Valkey', () => {
  let client: Redis;
  let cacheService: CacheService;

  const key = 'surf:test:integration';

  beforeAll(async () => {
    client = new Redis({
      host: process.env.VALKEY_HOST ?? '127.0.0.1',
      port: Number(process.env.VALKEY_PORT ?? 6380),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      retryStrategy: () => null,
    });

    await client.connect();

    cacheService = new CacheService(client);
  });

  afterAll(async () => {
    if (client) {
      await client.del(key).catch(() => undefined);
      client.disconnect();
    }
  });

  it('debe conectar con Valkey', async () => {
    expect(await cacheService.ping()).toBe('PONG');
  });

  it('debe guardar y recuperar un valor', async () => {
    await cacheService.set(key, 'hola-valkey', 30);

    const value = await cacheService.get(key);

    expect(value).toBe('hola-valkey');
  });

  it('debe configurar el TTL', async () => {
    await cacheService.set(key, 'hola-valkey', 30);

    const ttl = await client.ttl(key);

    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(30);
  });

  it('debe eliminar una clave', async () => {
    await cacheService.set(key, 'hola-valkey', 30);

    const deleted = await cacheService.del(key);
    const value = await cacheService.get(key);

    expect(deleted).toBe(1);
    expect(value).toBeNull();
  });
});
