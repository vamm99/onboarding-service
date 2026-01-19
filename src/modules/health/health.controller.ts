import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check system health' })
  @ApiResponse({
    status: 200,
    description: 'System is healthy',
    schema: { example: { ok: true } },
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable',
    schema: { example: { ok: false, message: 'Services not available' } },
  })
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
