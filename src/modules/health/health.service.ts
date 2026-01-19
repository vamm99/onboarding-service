import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly mongooseConnection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async checkSystemHealth(): Promise<boolean> {
    try {
      const isMongoAlive = Number(this.mongooseConnection.readyState) === 1;

      await this.cacheManager.set('health-check', '1', 1000);
      const redisStatus = await this.cacheManager.get('health-check');

      return isMongoAlive && redisStatus === '1';
    } catch {
      return false;
    }
  }
}
