import { ApiProperty } from '@nestjs/swagger'

export class PageInfo {
  @ApiProperty()
  currentPage: number

  @ApiProperty()
  perPage: number

  @ApiProperty()
  itemCount: number

  @ApiProperty()
  pageCount: number

  @ApiProperty()
  hasNextPage: boolean

  @ApiProperty()
  hasPreviousPage: boolean
}
