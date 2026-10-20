import { Inject, Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

import { VALKEY_CLIENT } from './cache.constants';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(VALKEY_CLIENT)
    private readonly client: Redis,
  ) {}

  async onModuleInit(): Promise<void> {
    this.client.on('error', (error: Error) => {
      this.logger.warn(`Valkey: ${error.message}`);
    });

    this.client.on('ready', () => {
      this.logger.log('Valkey disponible');
    });

    this.client.on('end', () => {
      this.logger.warn('Conexión con Valkey finalizada');
    });

    try {
      await this.client.connect();
    } catch (error) {
      this.logger.warn(`No se pudo conectar inicialmente a Valkey: ${this.errorMessage(error)}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    if (this.client.status !== 'ready') {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.warn(`Cache GET falló: ${this.errorMessage(error)}`);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (this.client.status !== 'ready') {
      return;
    }

    if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds <= 0) {
      throw new Error('El TTL debe ser un entero positivo');
    }

    try {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`Cache SET falló: ${this.errorMessage(error)}`);
    }
  }

  async del(key: string): Promise<number> {
    if (this.client.status !== 'ready') {
      return 0;
    }

    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.warn(`Cache DEL falló: ${this.errorMessage(error)}`);
      return 0;
    }
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
