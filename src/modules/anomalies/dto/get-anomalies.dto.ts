import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationParamsDto } from '@common/types'

export class GetAnomaliesDto extends PaginationParamsDto {
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
