import { Injectable, mixin, Type } from '@nestjs/common'
import { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose'
import { createClient } from '@clickhouse/client'
import { CustomInjectModel } from '@common/decorators/custom-inject-model.decorator'
import { generateId, transformToJson } from '@common/utils'
import { PaginatedList } from '@common/models'
import { CLICK_HOUSE_URL } from '@common/constants'
import { BaseRepository } from './base-repository.class'

export interface UpdateManyOutput {
  modifiedCount: number
  matchedCount: number
  acknowledged: boolean
}

export interface DeleteManyOutput {
  deletedCount: number
  acknowledged: boolean
}

type BaseRepositoryModel<T> = Pick<
  Model<T>,
  'updateOne' | 'updateMany' | 'countDocuments' | 'aggregate' | 'distinct'
> & {
  /**
   * @deprecated
   * Please use `this.getManyByQuery` instead
   */
  find: never
  /**
   * @deprecated
   * Please use `this.getByQuery` or `this.getById` instead
   */
  findOne: never
  /**
   * @deprecated
   * Please use `this.updateByQuery` or `this.update` instead
   */
  findOneAndUpdate: never
  /**
   * @deprecated
   * Please use `this.update` instead
   */
  findByIdAndUpdate: never
  /**
   * @deprecated
   * Please use `this.exists` instead
   */
  exists: never
}

@Injectable()
export class MongoRepository<
  T,
  U = Omit<T, '_id' | 'createdAt' | 'updatedAt' | 'id'>
> extends BaseRepository<T> {
  protected readonly model: BaseRepositoryModel<T>

  protected readonly clickHouseClient = createClient({ url: CLICK_HOUSE_URL })

  constructor(private readonly baseModel: Model<T>) {
    super()
    this.model = baseModel as unknown as BaseRepositoryModel<T>
  }

  create(input: U): Promise<T> {
    return this.baseModel.create(this.format(input)).then(transformToJson) as Promise<T>
  }

  createMany(input: U[]): Promise<T[]> {
    return this.baseModel
      .insertMany(input.map(item => this.format(item)))
      .then(items => items.map(transformToJson)) as Promise<T[]>
  }

  getById(id: string): Promise<T | null> {
    return this.baseModel.findById(id).lean().exec().then(transformToJson) as Promise<T | null>
  }

  protected getByQuery(query: FilterQuery<T>, options?: QueryOptions<T>): Promise<T | null> {
    const args = options ? [undefined, options] : []

    return this.baseModel
      .findOne(query, ...args)
      .lean()
      .exec()
      .then(transformToJson) as Promise<T | null>
  }

  protected getManyByQuery(
    query: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T[]> {
    return this.baseModel
      .find(query, projection, options)
      .lean()
      .exec()
      .then(items => items.map(transformToJson)) as Promise<T[]>
  }

  async getPaginatedByQuery(
    query: FilterQuery<T>,
    options: {
      page: number
      pageSize: number
      sort?: Record<string, 'asc' | 'desc'>
      projection?: ProjectionType<T>
    }
  ): Promise<PaginatedList<T>> {
    const { page: _page, pageSize: _pageSize, sort, projection } = options
    const page = this.getPage(_page)
    const pageSize = this.getPageSize(_pageSize)
    const skip = page * pageSize

    const [total, data] = await Promise.all([
      this.count(query),
      this.baseModel
        .find(query, projection, { skip, limit: pageSize, sort })
        .lean()
        .exec()
        .then(items => items.map(transformToJson)) as Promise<T[]>
    ])

    return this.createPaginationPayload({
      count: total,
      data,
      page,
      pageSize
    })
  }

  getByIds(ids: string[]): Promise<T[]> {
    return this.getManyByQuery({ _id: { $in: ids } })
  }

  update(id: string, item: UpdateQuery<T>): Promise<T> {
    return this.baseModel
      .findByIdAndUpdate(id, item, { new: true })
      .lean()
      .exec()
      .then(transformToJson) as Promise<T>
  }

  protected updateByQuery(
    query: FilterQuery<T>,
    item: UpdateQuery<T>,
    options?: QueryOptions<T>
  ): Promise<T> {
    return this.baseModel
      .findOneAndUpdate(query, item, { new: true, ...options })
      .lean()
      .exec()
      .then(transformToJson) as Promise<T>
  }

  protected async updateMany(ids: string[], item: UpdateQuery<T>): Promise<void> {
    await this.baseModel.updateMany({ _id: { $in: ids } }, item).exec()
  }

  protected updateManyByQuery(
    query: FilterQuery<T>,
    item: UpdateQuery<T>
  ): Promise<UpdateManyOutput> {
    return this.baseModel
      .updateMany(query, item)
      .exec()
      .then(({ modifiedCount, matchedCount, acknowledged }) => ({
        modifiedCount,
        matchedCount,
        acknowledged
      }))
  }

  delete(id: string): Promise<T> {
    return this.baseModel.findByIdAndDelete(id).lean().exec().then(transformToJson) as Promise<T>
  }

  async deleteById(id: string): Promise<boolean> {
    const docDeleted = await this.baseModel.deleteOne({ _id: id }).exec()
    return docDeleted?.deletedCount === 1
  }

  protected deleteMany(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>
  ): Promise<DeleteManyOutput> {
    return this.baseModel
      .deleteMany(filter, options)
      .exec()
      .then(({ deletedCount, acknowledged }) => ({
        deletedCount,
        acknowledged
      }))
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const exists = await this.baseModel.exists(filter)
    if (typeof exists === 'boolean') return exists
    return !!exists?._id
  }

  existsById(id: string): Promise<boolean> {
    return this.exists({ _id: id })
  }

  async existsIds(ids: string[]): Promise<boolean> {
    const count = await this.baseModel.countDocuments({ _id: { $in: ids } }).exec()
    return count === ids.length
  }

  count(filter: Partial<T> = {}): Promise<number> {
    return this.baseModel.countDocuments(filter).exec()
  }

  protected format(input: Partial<T> | U) {
    return {
      _id: generateId(),
      ...input
    }
  }
}

export function BaseRepositoryMongo<T, U = Omit<T, '_id' | 'createdAt' | 'updatedAt' | 'id'>>(
  modelClass: Type<T>
): Type<MongoRepository<T, U>> {
  @Injectable()
  class BaseRepositoryMongoClass extends MongoRepository<T, U> {
    constructor(
      @CustomInjectModel(modelClass)
      readonly model: BaseRepositoryModel<T>
    ) {
      super(model as unknown as Model<T>)
    }
  }

  return mixin(BaseRepositoryMongoClass)
}
