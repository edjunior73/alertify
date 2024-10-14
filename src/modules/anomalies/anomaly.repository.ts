import { Injectable } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { BaseRepositoryMongo } from '@common/classes'
import { PaginatedList } from '@common/models'
import { GetAnomaliesDto } from './dto'
import { Anomaly } from './anomaly.model'

export type CreateAnomalyInput = Omit<Anomaly, '_id' | 'createdAt' | 'updatedAt' | 'id'>

@Injectable()
export class AnomalyRepository extends BaseRepositoryMongo<Anomaly>(Anomaly) {
  getMany({
    before,
    after,
    page = 0,
    pageSize = 10
  }: GetAnomaliesDto): Promise<PaginatedList<Anomaly>> {
    const query: FilterQuery<Anomaly> = {}

    if (before) {
      query.createdAt = { ...query.createdAt, $lt: before }
    }
    if (after) {
      query.createdAt = { ...query.createdAt, $gt: after }
    }

    return this.getPaginatedByQuery(query, { page, pageSize })
  }
}
