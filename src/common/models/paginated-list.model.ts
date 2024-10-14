import { ApiProperty } from '@nestjs/swagger'
import { Type as NestType } from '@nestjs/common'
import { Type } from 'class-transformer'
import { PageInfo } from './page-info.model'

export abstract class PaginatedList<T> {
  @ApiProperty({ type: PageInfo })
  @Type(() => PageInfo)
  pageInfo: PageInfo

  @ApiProperty()
  count: number

  abstract items: T[]
}

export function createPaginatedList<T extends NestType>(
  Model: T,
  dataName?: string
): NestType<PaginatedList<T>> {
  class PaginatedListData extends PaginatedList<T> {
    @ApiProperty({ type: Model, isArray: true })
    items: T[]
  }

  Object.defineProperty(PaginatedListData, 'name', {
    value: dataName || `${Model.name}PaginatedData`
  })

  return PaginatedListData
}
