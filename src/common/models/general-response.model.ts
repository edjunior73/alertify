import { ApiProperty } from '@nestjs/swagger'

export class GeneralResponse {
  @ApiProperty()
  status: boolean

  @ApiProperty()
  message: string
}

export class GeneralBadResponse {
  @ApiProperty({ default: false })
  status: boolean

  @ApiProperty()
  message: string
}

export abstract class ApiResponse<T> {
  @ApiProperty()
  status: boolean

  abstract data: T
}
