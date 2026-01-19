import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check() {
    const isHealthy = await this.healthService.checkSystemHealth();
    if (!isHealthy) {
      throw new ServiceUnavailableException({
        ok: false,
        message: 'Services not available',
      });
    }
    return { ok: true };
  }
}
