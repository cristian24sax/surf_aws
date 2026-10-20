import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { VALKEY_CLIENT } from './cache.constants';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: VALKEY_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('VALKEY_HOST', '127.0.0.1');

        const port = Number(configService.get<string>('VALKEY_PORT', '6380'));

        const tlsEnabled = configService.get<string>('VALKEY_TLS', 'false') === 'true';

        return new Redis({
          host,
          port,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
          connectTimeout: 3000,
          retryStrategy: (times) => Math.min(times * 500, 5000),
          ...(tlsEnabled ? { tls: {} } : {}),
        });
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
