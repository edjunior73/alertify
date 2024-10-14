import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { HealthCheckService, HealthCheck, MongooseHealthIndicator } from '@nestjs/terminus'

@ApiTags('Misc')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: MongooseHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  getHealthInfo() {
    return this.health.check([() => this.db.pingCheck('db', { timeout: 10000 })])
  }
}
