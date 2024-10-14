import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { PaginatedList } from '@common/models'
import { CheckAnomaliesUseCase, GetAnomaliesUseCase } from './use-cases'
import { GetAnomaliesDto } from './dto'
import { Anomaly } from './anomaly.model'

@Injectable()
export class AnomalyService {
  constructor(
    private readonly getAnomaliesUseCase: GetAnomaliesUseCase,
    private readonly checkAnomaliesUseCase: CheckAnomaliesUseCase
  ) {}

  getAnomalies(input: GetAnomaliesDto): Promise<PaginatedList<Anomaly>> {
    return this.getAnomaliesUseCase.execute(input)
  }

  @Cron('*/30 * * * *')
  async checkAnomalies() {
    Logger.log('Checking anomalies...')
    const last10Minutes = 10 * 60 * 1000
    this.checkAnomaliesUseCase.setStrategy()
    await this.checkAnomaliesUseCase.execute({ timeWindow: last10Minutes, comparatorNumber: 10 })
  }
}
