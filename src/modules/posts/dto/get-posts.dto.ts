import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationParamsDto } from '@common/types'

export class GetPostsDto extends PaginationParamsDto {
  @ApiPropertyOptional({ isArray: true })
  @IsNotEmpty()
  @IsOptional()
  tags?: string[]

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  before?: Date

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  after?: Date
}
