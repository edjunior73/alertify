import { Injectable } from '@nestjs/common'
import { UseCase } from '@common/classes'
import { PaginatedList } from '@common/models'
import { Anomaly } from '../anomaly.model'
import { GetAnomaliesDto } from '../dto'
import { AnomalyRepository } from '../anomaly.repository'

@Injectable()
export class GetAnomaliesUseCase extends UseCase<GetAnomaliesDto, PaginatedList<Anomaly>> {
  constructor(private readonly anomalyRepository: AnomalyRepository) {
    super()
  }

  execute(input: GetAnomaliesDto): Promise<PaginatedList<Anomaly>> {
    return this.anomalyRepository.getMany(input)
  }
}
