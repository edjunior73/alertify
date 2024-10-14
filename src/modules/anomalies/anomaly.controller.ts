import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GeneralApiResponse, RequiresAuth } from '@common/decorators'
import { createPaginatedList } from '@common/models'
import { AnomalyService } from './anomaly.service'
import { Anomaly } from './anomaly.model'
import { GetAnomaliesDto } from './dto'

@ApiTags('Anomalies')
@Controller('Anomalies')
@RequiresAuth()
export class AnomalyController {
  constructor(private readonly anomaliesService: AnomalyService) {}

  @Get()
  @GeneralApiResponse({
    data: createPaginatedList(Anomaly),
    summary: 'Get filtered Anomalies for user'
  })
  getAnomalies(@Query() input: GetAnomaliesDto) {
    return this.anomaliesService.getAnomalies(input)
  }
}
