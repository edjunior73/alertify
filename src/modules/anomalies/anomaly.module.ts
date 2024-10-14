import { Global, Module } from '@nestjs/common'
import { FakeTwitterProvider } from '@common/mechanisms'
import { UseCasesList } from './use-cases'
import { AnomalyService } from './anomaly.service'
import { AnomalyRepository } from './anomaly.repository'
import { AnomalyController } from './anomaly.controller'
import { AnomalyDetectionContext } from './strategies'

@Global()
@Module({
  providers: [
    AnomalyRepository,
    AnomalyService,
    FakeTwitterProvider,
    AnomalyDetectionContext,
    ...UseCasesList
  ],
  controllers: [AnomalyController]
})
export class AnomalyModule {}
